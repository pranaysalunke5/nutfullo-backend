import express from 'express';
import { 
    createProduct, 
    updateProduct, 
    deleteProduct,
    getProducts,
    generateSku, 
    
} from '../controllers/productController.js';

const router = express.Router();

import upload from '../middleware/upload.js';

router.route('/add')
    .post(upload.array("images"), createProduct);

router.route('/:id')
    .put(upload.array("images", 5), updateProduct)
    .delete(deleteProduct);

// 2. GET /api/products - To see all products
router.route('/allProducts').get(getProducts);


router.get("/generate-sku", generateSku);

router.route("/:id").delete(deleteProduct);

export default router;