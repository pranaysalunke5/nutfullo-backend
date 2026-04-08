// import Enquiry from '../models/Enquiry.js';
// import colors from 'colors';

// export const createEnquiry = async (req, res) => {
//   try {
//     const { name, phone, businessType, message } = req.body;

//     // 1. Validation check
//     if (!name || !phone) {
//       return res.status(400).json({
//         success: false,
//         message: "Name and phone are required fields."
//       });
//     }

//     // 2. Create the enquiry in the database
//     const enquiry = await Enquiry.create({
//       name,
//       phone,
//       businessType,
//       message
//     });

//     // 3. Success Response
//     return res.status(201).json({
//       success: true,
//       data: enquiry
//     });

//   } catch (error) {
//     // Using modern template literals with colors
//     console.error(colors.red(`[Backend Error]: ${error.message}`));

//     // 4. Error Response
//     return res.status(500).json({
//       success: false,
//       message: 'Internal Server Error'
//     });
//   }
// };


import Enquiry from '../models/Enquiry.js';
import sendEmail from '../utils/sendEmail.js';
import colors from 'colors';

export const createEnquiry = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      city,
      businessType,
      otherBusinessType,
      message,
    } = req.body;

    if (!fullName || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone are required",
      });
    }

    const finalBusinessType =
      businessType === "Other" ? otherBusinessType : businessType;

    // ✅ Save in DB
    await Enquiry.create({
      name: fullName,
      phone,
      businessType: finalBusinessType,
      message,
    });

    // =========================
    // 📩 1. ADMIN EMAIL (YOU)
    // =========================
    await sendEmail({
      email: "info@nutfullo.com",
      subject: "🚀 New Business Enquiry - Nutfullo",
      html: `
        <h2>New Enquiry Received</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email || "N/A"}</p>
        <p><strong>City:</strong> ${city || "N/A"}</p>
        <p><strong>Business Type:</strong> ${finalBusinessType}</p>
        <p><strong>Message:</strong> ${message || "N/A"}</p>
      `,
    });

    // =========================
    // 📩 2. USER EMAIL (THANK YOU)
    // =========================
    if (email) {
      await sendEmail({
        email: email,
        subject: "Thank You for Contacting Nutfullo 🙌",
        html: `
          <div style="font-family:sans-serif;max-width:500px;margin:auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
            
            <div style="background:#10b981;padding:20px;text-align:center">
              <h2 style="color:white;margin:0;">Nutfullo</h2>
            </div>

            <div style="padding:30px;text-align:center">
              <h3 style="color:#1e293b;">Thank You, ${fullName}! 🙌</h3>

              <p style="color:#475569;font-size:14px;">
                Thank you for connecting with us. Our sales team will contact you as soon as possible.
              </p>

              <p style="margin-top:20px;font-size:13px;color:#64748b;">
                📞 Phone: ${phone}
              </p>

              <p style="margin-top:10px;font-size:13px;color:#64748b;">
                We’re excited to help you grow with Nutfullo 🚀
              </p>

              <div style="margin-top:25px;">
                <a href="https://nutfullo.com" 
                   style="background:#10b981;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;">
                   Visit Website
                </a>
              </div>
            </div>

          </div>
        `,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
    });

  } catch (error) {
    console.error(colors.red(`[Enquiry Error]: ${error.message}`));

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};