import express from 'express';
import { 
    createProduct, 
    updateProduct, 
    deleteProduct,
    getProducts 
} from '../controllers/productController.js';

const router = express.Router();

import upload from '../middleware/upload.js';

router.route('/add')
    .post(upload.array("images", 5), createProduct);

router.route('/:id')
    .put(upload.array("images", 5), updateProduct)
    .delete(deleteProduct);

// 2. GET /api/products - To see all products
router.route('/').get(getProducts);



export default router;