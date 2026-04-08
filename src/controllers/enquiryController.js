import Enquiry from '../models/Enquiry.js';
import colors from 'colors';

export const createEnquiry = async (req, res) => {
  try {
    const { name, phone, businessType, message } = req.body;

    // 1. Validation check
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone are required fields."
      });
    }

    // 2. Create the enquiry in the database
    const enquiry = await Enquiry.create({
      name,
      phone,
      businessType,
      message
    });

    // 3. Success Response
    return res.status(201).json({
      success: true,
      data: enquiry
    });

  } catch (error) {
    // Using modern template literals with colors
    console.error(colors.red(`[Backend Error]: ${error.message}`));

    // 4. Error Response
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

