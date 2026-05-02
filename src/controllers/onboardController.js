import Onboard from "../models/onboard.js";
import User from "../models/userModel.js";


// export const onboardGym = async (req, res) => {
//   try {
//     const { ownerMobile, onboardedBy: salesMobile } = req.body;

//     // 1. 🔍 Check if this partner (Gym/Retailer) is already onboarded
//     const existingOnboard = await Onboard.findOne({ ownerMobile });
//     if (existingOnboard) {
//       return res.status(400).json({
//         success: false,
//         message: "This mobile number is already onboarded.",
//       });
//     }

//     // 2. 🔍 find sales user by mobile
//     const user = await User.findOne({ mobile: salesMobile });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "Sales user not found",
//       });
//     }

//     // 3. Create new entry
//     const newEntry = await Onboard.create({
//       ...req.body,
//       onboardedBy: {
//         mobile: user.mobile,
//         name: user.name,
//         userId: user._id,
//       },
//       document: {
//         url: req.file?.path || null,
//         public_id: req.file?.filename || null,
//       },
//     });

//     res.status(201).json({
//       success: true,
//       data: newEntry,
//     });

//   } catch (error) {
//     res.status(500).json({ 
//       success: false, 
//       message: error.message 
//     });
//   }
// };

export const onboardGym = async (req, res) => {
  try {
    const {
      ownerMobile,
      onboardedBy: salesMobile,
      businessDocType,
      businessDocNumber,
      role,
      segment,
      ...rest
    } = req.body;

    // 1. 🔍 Check duplicate onboarding
    const existingOnboard = await Onboard.findOne({ ownerMobile });
    if (existingOnboard) {
      return res.status(400).json({
        success: false,
        message: "This mobile number is already onboarded.",
      });
    }

    // 2. 🔍 Validate sales user
    const user = await User.findOne({ mobile: salesMobile });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Sales user not found",
      });
    }

    // 3. ✅ Backend validation (IMPORTANT)
    const segmentRequiredRoles = ["Retail Partner", "Wholesaler"];

    if (segmentRequiredRoles.includes(role) && !segment) {
      return res.status(400).json({
        success: false,
        message: "Segment is required for selected role",
      });
    }

    // 4. 📝 Create entry
    const newEntry = await Onboard.create({
      ...rest,

      role,
      segment: segment || "",

      ownerMobile,

      // ✅ FIXED mapping
      docType: businessDocType || "NA",
      docNumber: businessDocNumber || "",

      onboardedBy: {
        mobile: user.mobile,
        name: user.name,
        userId: user._id,
      },

      document: {
        url: req.file?.path || null,
        public_id: req.file?.filename || null,
      },
    });

    // 5. ✅ Response
    res.status(201).json({
      success: true,
      data: newEntry,
    });

  } catch (error) {
    console.error("Onboard Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
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