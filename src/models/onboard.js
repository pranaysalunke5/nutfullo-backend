import mongoose from "mongoose";

const onboardSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      enum: ["Gym Partner", "Retail Partner", "Wholesaler", "Distributor"],
    },

    segment: {
      type: String,
      enum: [
        "Retail Shop",
        "Dry Fruit Shop",
        "Modern Trade",
        "Hotels",
        "Sweet Mart",
        "",
      ],
      default: "",
    },

    ownerName: { type: String, required: true },

    ownerEmail: {
      type: String,
      validate: {
        validator: (v) => !v || /^\S+@\S+\.\S+$/.test(v),
        message: (props) => `${props.value} is not a valid email!`,
      },
    },

    ownerMobile: { type: String, required: true },

    trainerName: String,
    trainerMobile: String,

    gymName: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: String, required: true },

    docType: { type: String, default: "NA" },
    docNumber: String,

    // ✅ IMPORTANT STRUCTURE
    onboardedBy: {
      mobile: { type: String, required: true }, // already stored
      name: { type: String, default: "" },      // NEW
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
    },

    document: {
      url: { type: String, default: null },
      public_id: { type: String, default: null },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Onboard", onboardSchema);