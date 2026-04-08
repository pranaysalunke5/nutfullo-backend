import Enquiry from '../models/Enquiry.js';
import colors from 'colors';
import {
  sendAdminEnquiryEmail,
  sendUserEnquiryEmail,
} from '../utils/sendEnquiryEmail.js';

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

    await Enquiry.create({
      fullName,
      phone,
      email,
      city,
      businessType,
      otherBusinessType: businessType === "Other" ? otherBusinessType : null,
      message,
    });

    // ✅ ADMIN EMAIL (safe)
    try {
      await sendAdminEnquiryEmail({
        fullName,
        phone,
        email,
        city,
        businessType: finalBusinessType,
        message,
      });
    } catch (err) {
      console.error("Admin Email Failed:", err.message);
    }

    // ✅ USER EMAIL (safe)
    if (email) {
      try {
        await sendUserEnquiryEmail({
          fullName,
          phone,
          email,
        });
      } catch (err) {
        console.error("User Email Failed:", err.message);
      }
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