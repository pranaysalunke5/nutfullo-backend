import Vendor from "../models/vendorModel.js";

// ➕ CREATE VENDOR
export const createVendor = async (req, res) => {
  try {
    const { vendorName, mobile, city, segment, gstNo, address } = req.body;

    if (!vendorName || !mobile || !city || !address) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const vendor = await Vendor.create({
      vendorName,
      mobile,
      city,
      segment,
      gstNo,
      address,
      addedBy: req.user?._id, // optional (if auth middleware used)
    });

    res.status(201).json({
      success: true,
      message: "Vendor created successfully",
      data: vendor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create vendor",
    });
  }
};

// 📄 GET ALL VENDORS
export const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find()
      .sort({ createdAt: -1 })
      .populate("addedBy", "name mobile");

    res.status(200).json({
      success: true,
      count: vendors.length,
      data: vendors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch vendors",
    });
  }
};

// ✏️ UPDATE VENDOR
export const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    const updatedVendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Vendor updated successfully",
      data: updatedVendor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update vendor",
    });
  }
};

// ❌ DELETE VENDOR
export const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    await vendor.deleteOne();

    res.status(200).json({
      success: true,
      message: "Vendor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete vendor",
    });
  }
};