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

    // ✅ Save in DB
    await Enquiry.create({
      name: fullName,
      phone,
      businessType: finalBusinessType,
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