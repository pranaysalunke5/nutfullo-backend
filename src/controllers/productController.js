import Product from '../models/productModel.js';

// @desc    Create new product
// @route   POST /api/products
// @access  Public (or Private if you add Auth later)
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock, images } = req.body;

        const product = await Product.create({
            name,
            description,
            price,
            category,
            stock,
            images,
        });

        res.status(201).json({
            success: true,
            data: product,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};


// @desc    Update a product
// @route   PUT /api/products/:id
export const updateProduct = async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, data: product });
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, message: "Product removed" });
};

// @desc    Get all products
// @route   GET /api/products
export const getProducts = async (req, res) => {
    const products = await Product.find();
    res.status(200).json({ success: true, data: products });
};