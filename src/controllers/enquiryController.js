import Enquiry from '../models/Enquiry.js';
import sendEnquiryEmail from '../utils/sendEnquiryEmail.js';

export const createEnquiry = async (req, res) => {
  try {
    const { fullName, phone, email, city, businessType, otherBusinessType, message } = req.body;

    const finalBusinessType =
      businessType === "Other" ? otherBusinessType : businessType;

    // ✅ 1. SAVE TO DB
    const enquiry = await Enquiry.create({
      fullName,
      phone,
      email,
      city,
      businessType,
      otherBusinessType,
      message,
    });

    // ✅ 2. SEND EMAIL TO USER (THANK YOU MAIL)
    if (email) {
      try {
        await sendEnquiryEmail({
          email,
          subject: "Thank you for contacting Nutfullo 🚀",
          html: `
          <div style="font-family:sans-serif;max-width:500px;margin:auto;border:1px solid #eee;border-radius:10px;overflow:hidden">
            
            <div style="background:#065f46;padding:20px;text-align:center;color:white">
              <h2>Nutfullo</h2>
            </div>

            <div style="padding:25px">
              <h3>Hello ${fullName} 👋</h3>

              <p>Thank you for contacting us.</p>
              <p>Our <b>sales team will contact you as soon as possible.</b></p>

              <br/>

              <div style="background:#f0fdf4;padding:15px;border-radius:8px">
                <p><b>Your Details:</b></p>
                <p>📞 ${phone}</p>
                <p>🏙 ${city || "-"}</p>
                <p>💼 ${finalBusinessType || "-"}</p>
              </div>

              <br/>

              <p>Need urgent help?</p>
              <a href="https://wa.me/918767334312" 
                 style="display:inline-block;background:#10b981;color:white;padding:10px 15px;border-radius:6px;text-decoration:none">
                 Chat on WhatsApp
              </a>

              <br/><br/>

              <p style="font-size:12px;color:#666">– Team Nutfullo</p>
            </div>
          </div>
          `,
        });
      } catch (err) {
        console.error("User email failed:", err.message);
      }
    }

    // ✅ 3. SEND EMAIL TO ADMIN (VERY IMPORTANT)
    try {
      console.log("EMAIL_HOST:", process.env.EMAIL_HOST);
      await sendEnquiryEmail({
        email: process.env.EMAIL_INFO, // your company email
        subject: "🚀 New Enquiry Received",
        html: `
        <div style="font-family:sans-serif;padding:20px">
          <h2>New Enquiry Received</h2>

          <p><b>Name:</b> ${fullName}</p>
          <p><b>Phone:</b> ${phone}</p>
          <p><b>Email:</b> ${email || "-"}</p>
          <p><b>City:</b> ${city || "-"}</p>
          <p><b>Business:</b> ${finalBusinessType || "-"}</p>
          <p><b>Message:</b> ${message || "-"}</p>
        </div>
        `,
      });
    } catch (err) {
      console.error("Admin email failed:", err.message);
    }

    // ✅ FINAL RESPONSE
    res.status(201).json({
      success: true,
      message: 'Enquiry Sent Successfully 🚀',
      data: enquiry,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};


// @desc Get all enquiries for Admin
export const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update Enquiry Status (Pending -> Resolved)
export const updateEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }

    res.status(200).json({ success: true, data: enquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const enquiry = await Enquiry.findByIdAndDelete(id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};