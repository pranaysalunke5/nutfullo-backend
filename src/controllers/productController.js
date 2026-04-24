import Product from "../models/productModel.js";


export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    // 1. Handle Multiple Images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

    // 2. Create Product with the 'images' array
    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      images, // Matches the schema key
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    // This will now catch validation errors or missing fields
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // If new images uploaded
    if (req.files && req.files.length > 0) {
      product.images = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

    // Update other fields
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.category = req.body.category || product.category;
    product.stock = req.body.stock || product.stock;

    const updatedProduct = await product.save();

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
// @desc    Delete a product
// @route   DELETE /api/products/:id

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // 👇 Delete images from Cloudinary
    for (let img of product.images) {
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product removed",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
// @desc    Get all products
// @route   GET /api/products



export const getProducts = async (req, res) => {
  try {
    // Adding .sort() helps show the newest products at the top
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      count: products.length,
      data: products 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: "Server Error: Could not fetch products" 
    });
  }
};