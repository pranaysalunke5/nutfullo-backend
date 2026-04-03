import express from 'express';
import { 
    createProduct, 
    updateProduct, 
    deleteProduct,
    getProducts 
} from '../controllers/productController.js';

const router = express.Router();

// 1. POST /api/products/add - To create a product
router.route('/add').post(createProduct);

// 2. GET /api/products - To see all products
router.route('/').get(getProducts);

// 3. PUT & DELETE - Using the product ID
// URL: /api/products/65f123...
router.route('/:id')
    .put(updateProduct)    // Update
    .delete(deleteProduct); // Delete

export default router;