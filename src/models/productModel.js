import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a product name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
      default: 0,
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      enum: ["Dry Fruits", "Nuts", "Seeds", "Combos"], // Example categories
    },
    stock: {
      type: Number,
      required: [true, "Please add stock count"],
      default: 0,
    },
    images: [
      {
        url: { type: String },
        public_id: { type: String }, // 👈 add this
      },
    ],
    mrp: { type: Number, default: 0 },
    salePrice: { type: Number, default: 0 },
    basePrice: { type: Number, default: 0 },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
