import Enquiry from '../models/Enquiry.js';
import sendEnquiryEmail from '../utils/sendEnquiryEmail.js'; // Import the new one

export const createEnquiry = async (req, res) => {
  try {
    const { fullName, phone, email, city, businessType, otherBusinessType, message } = req.body;

    // 1. Create in DB
    const enquiry = await Enquiry.create({
      fullName,
      phone,
      email,
      city,
      businessType,
      otherBusinessType,
      message,
    });

    // 2. Send the confirmation email
    if (email) {
      try {
        await sendEnquiryEmail({
          email,
          fullName,
          phone,
          city,
          businessType: businessType === "Other" ? otherBusinessType : businessType
        });
      } catch (err) {
        console.error("Confirmation email failed:", err.message);
        // Silently fail so the user still sees their enquiry went through
      }
    }

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