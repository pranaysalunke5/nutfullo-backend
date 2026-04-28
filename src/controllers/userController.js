import mongoose from "mongoose";
import Onboard from "../models/onboard.js";
import User from "../models/userModel.js";

// ✅ CREATE USER
export const createUser = async (req, res) => {
  try {
    const { name, email, mobile, role } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      mobile,
      role,
    });

    res.status(201).json({
      success: true,
      data: user,
      token: user.getSignedJwtToken(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET USERS WITH ONBOARD COUNT (FIXED ✅)
export const getAllUsersWithStats = async (req, res) => {
  try {
    const users = await User.find();

    const onboardCounts = await Onboard.aggregate([
      {
        $match: {
          "onboardedBy.userId": { $ne: null },
        },
      },
      {
        $group: {
          _id: "$onboardedBy.userId", // ✅ FIX
          count: { $sum: 1 },
        },
      },
    ]);

    const countMap = {};

    onboardCounts.forEach((item) => {
      countMap[item._id.toString()] = item.count;
    });

    const usersWithStats = users.map((user) => ({
      ...user.toObject(),
      onboardCount: countMap[user._id.toString()] || 0,
    }));

    res.status(200).json({
      success: true,
      data: usersWithStats,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching users",
      error: error.message,
    });
  }
};

// ✅ DELETE USER (UPDATED FOR NEW STRUCTURE)
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    await Onboard.deleteMany({
      "onboardedBy.userId": userId, // ✅ FIX
    });

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User and onboard data deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting user",
      error: error.message,
    });
  }
};

// ✅ UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const { name, email, mobile, role } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.mobile = mobile || user.mobile;
    user.role = role || user.role;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update user",
      error: error.message,
    });
  }
};


// ✅ GET SALES USERS WITH COUNT
export const getSalesUsersWithOnboards = async (req, res) => {
  try {
    // 👉 only sales users
    const users = await User.find({ role: "sales" });

    const onboardCounts = await Onboard.aggregate([
      {
        $match: {
          "onboardedBy.userId": { $ne: null },
        },
      },
      {
        $group: {
          _id: "$onboardedBy.userId",
          count: { $sum: 1 },
        },
      },
    ]);

    const countMap = {};
    onboardCounts.forEach((item) => {
      countMap[item._id.toString()] = item.count;
    });

    const result = users.map((user) => ({
      _id: user._id,
      name: user.name,
      mobile: user.mobile,
      role: user.role,
      onboardCount: countMap[user._id.toString()] || 0,
    }));

    res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET ONBOARDS BY USER
export const getOnboardsByUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const onboards = await Onboard.find({
      "onboardedBy.userId": userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: onboards.length,
      data: onboards,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
