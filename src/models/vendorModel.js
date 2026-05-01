import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    vendorName: {
      type: String,
      required: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    segment: {
      type: String,
      enum: ["Retail", "Wholesale", "Distributor", "Manufacturer"],
      default: "Retail",
    },

    gstNo: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      required: true,
    },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, // ✅ gives createdAt (Add Date)
  }
);

const Vendor = mongoose.model("Vendor", vendorSchema);

export default Vendor;