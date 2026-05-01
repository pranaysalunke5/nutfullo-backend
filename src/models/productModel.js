import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    name: String, // e.g. "500g", "1kg"

    price: { type: Number, required: true },
    basePrice: { type: Number, default: 0 },
    mrp: { type: Number, default: 0 },

    stock: { type: Number, default: 0 },
    sku: String,

    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["Dry Fruits", "Nuts", "Seeds", "Combos"],
    },

    brand: {
      type: String,
      default: "Nutfullo",
    },

    // 🔥 MAIN PRICE (fallback if no variants)
    price: {
      type: Number,
      default: 0,
    },

    basePrice: {
      type: Number,
      default: 0,
    },

    mrp: {
      type: Number,
      default: 0,
    },

    // 🔥 VARIANTS (IMPORTANT FOR SCALE)
    variants: [variantSchema],

    // 🔥 INVENTORY (fallback if no variants)
    stock: {
      type: Number,
      default: 0,
    },

    sku: String,

    weight: String, // "500g", "1kg"

    images: [
      {
        url: String,
        public_id: String,
      },
    ],

    // 🔥 FLAGS
    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // 🔥 SEARCH & FILTER
    tags: [String],

    // 🔥 RATINGS SYSTEM (future ready)
    rating: {
      type: Number,
      default: 0,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    // 🔥 SALES TRACKING
    sold: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;