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

// export const updateOnboard = async (req, res) => {
//   try {
//     const updated = await Onboard.findByIdAndUpdate(
//       req.params.id,
//       { $set: req.body },
//       { new: true, runValidators: true }
//     );
//     if (!updated) return res.status(404).json({ message: "Not found" });
//     res.status(200).json({ success: true, data: updated });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// controllers/onboardController.js
export const updateOnboard = async (req, res) => {
  try {
    let updateData = { ...req.body };

    // If a new file is uploaded, update the document object
    if (req.file) {
      updateData.document = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    const updated = await Onboard.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOnboard = async (req, res) => {
  try {
    const deleted = await Onboard.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};