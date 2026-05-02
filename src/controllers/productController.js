// import Product from "../models/productModel.js";
// import cloudinary from "../config/cloudinary.js";



// export const createProduct = async (req, res) => {
//   try {
//     const { name, description, price, category, stock } = req.body;

//     // 1. Handle Multiple Images
//     let images = [];
//     if (req.files && req.files.length > 0) {
//       images = req.files.map((file) => ({
//         url: file.path,
//         public_id: file.filename,
//       }));
//     }

//     // 2. Create Product with the 'images' array
//     const product = await Product.create({
//       name,
//       description,
//       price,
//       category,
//       stock,
//       images, // Matches the schema key
//     });

//     res.status(201).json({
//       success: true,
//       data: product,
//     });
//   } catch (error) {
//     // This will now catch validation errors or missing fields
//     res.status(400).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };

// export const updateProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Product not found" });
//     }

//     // If new images uploaded
//     if (req.files && req.files.length > 0) {
//       product.images = req.files.map((file) => ({
//         url: file.path,
//         public_id: file.filename,
//       }));
//     }

//     // Update other fields
//     product.name = req.body.name || product.name;
//     product.description = req.body.description || product.description;
//     product.price = req.body.price || product.price;
//     product.category = req.body.category || product.category;
//     product.stock = req.body.stock || product.stock;

//     const updatedProduct = await product.save();

//     res.status(200).json({ success: true, data: updatedProduct });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// export const deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     // 🔥 DELETE IMAGES FROM CLOUDINARY
//     if (product.images && product.images.length > 0) {
//       for (const img of product.images) {
//         if (img.public_id) {
//           try {
//             await cloudinary.uploader.destroy(img.public_id);
//           } catch (err) {
//             console.log("Cloudinary delete failed:", err.message);
//           }
//         }
//       }
//     }

//     // 🔥 DELETE PRODUCT FROM DB
//     await product.deleteOne();

//     res.json({
//       success: true,
//       message: "Product and images deleted successfully",
//     });

//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// };

// export const getProducts = async (req, res) => {
//   try {
//     // Adding .sort() helps show the newest products at the top
//     const products = await Product.find().sort({ createdAt: -1 });

//     res.status(200).json({ 
//       success: true, 
//       count: products.length,
//       data: products 
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       success: false, 
//       error: "Server Error: Could not fetch products" 
//     });
//   }
// };

// // GET /api/products/check-sku?sku=ABC-123
// export const generateSku = async (req, res) => {
//   try {
//     const { name, category } = req.query;

//     if (!name || !category) {
//       return res.status(400).json({ error: "Missing fields" });
//     }

//     // 🔹 BASE SKU
//     const base =
//       category.substring(0, 3).toUpperCase() +
//       "-" +
//       name.replace(/\s+/g, "").substring(0, 5).toUpperCase();

//     // 🔹 FIND ALL MATCHING SKU
//     const existing = await Product.find({
//       sku: { $regex: `^${base}` },
//     }).select("sku");

//     // 🔹 COUNT TOTAL PRODUCTS
//     const total = existing.length;

//     // 🔥 GROUP LOGIC (100 per block)
//     const groupNumber = Math.floor(total / 100) + 1;

//     // 🔹 FORMAT 001, 002...
//     const formatted = String(groupNumber).padStart(3, "0");

//     const finalSku = `${base}-${formatted}`;

//     res.json({ sku: finalSku });
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// };


import Product from "../models/productModel.js";
import cloudinary from "../config/cloudinary.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      images,
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // If new images uploaded, replace existing ones
    if (req.files && req.files.length > 0) {
      product.images = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

    // ✅ FIX: Use nullish coalescing (??) instead of || so that legitimate
    //    falsy values like price=0 or stock=0 are saved correctly.
    //    With `||`, `product.stock = 0 || product.stock` kept the old value.
    if (req.body.name        !== undefined) product.name        = req.body.name;
    if (req.body.description !== undefined) product.description = req.body.description;
    if (req.body.price       !== undefined) product.price       = Number(req.body.price);
    if (req.body.category    !== undefined) product.category    = req.body.category;
    if (req.body.stock       !== undefined) product.stock       = Number(req.body.stock);

    const updatedProduct = await product.save();

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        if (img.public_id) {
          try {
            await cloudinary.uploader.destroy(img.public_id);
          } catch (err) {
            console.log("Cloudinary delete failed:", err.message);
          }
        }
      }
    }

    await product.deleteOne();

    res.json({ success: true, message: "Product and images deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error: Could not fetch products" });
  }
};

export const generateSku = async (req, res) => {
  try {
    const { name, category } = req.query;

    if (!name || !category) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const base =
      category.substring(0, 3).toUpperCase() +
      "-" +
      name.replace(/\s+/g, "").substring(0, 5).toUpperCase();

    const existing = await Product.find({ sku: { $regex: `^${base}` } }).select("sku");
    const total = existing.length;
    const groupNumber = Math.floor(total / 100) + 1;
    const formatted = String(groupNumber).padStart(3, "0");
    const finalSku = `${base}-${formatted}`;

    res.json({ sku: finalSku });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};