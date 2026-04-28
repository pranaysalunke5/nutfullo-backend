import Onboard from "../models/onboard.js";
import User from "../models/userModel.js";

export const onboardGym = async (req, res) => {
  try {
    const mobile = req.body.onboardedBy;

    // 🔍 find user by mobile
    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Sales user not found",
      });
    }

    const newEntry = await Onboard.create({
      ...req.body,

      onboardedBy: {
        mobile: user.mobile,
        name: user.name,       // ✅ SAVE NAME
        userId: user._id,      // ✅ SAVE ID
      },

      document: {
        url: req.file?.path || null,
        public_id: req.file?.filename || null,
      },
    });

    res.status(201).json({
      success: true,
      data: newEntry,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOnboards = async (req, res) => {
  try {
    const data = await Onboard.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};