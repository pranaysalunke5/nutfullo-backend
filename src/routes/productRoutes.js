// import express from 'express';
// import { 
//     createProduct, 
//     updateProduct, 
//     deleteProduct,
//     getProducts,
//     generateSku, 
    
// } from '../controllers/productController.js';

// const router = express.Router();

// import upload from '../middleware/upload.js';

// router.route('/add')
//     .post(upload.array("images"), createProduct);

// router.route('/:id')
//     .put(upload.array("images", 5), updateProduct)
//     .delete(deleteProduct);

// // 2. GET /api/products - To see all products
// router.route('/allProducts').get(getProducts);


// router.get("/generate-sku", generateSku);


// export default router;

import express from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  generateSku,
} from '../controllers/productController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// ✅ FIX: Static routes MUST come before dynamic /:id routes.
//    Before this fix, GET /allProducts was matched by /:id with id="allProducts",
//    causing a CastError (invalid ObjectId) and the route never working.
router.route('/allProducts').get(getProducts);
router.get('/generate-sku', generateSku);

// Dynamic routes go last
router.route('/add').post(upload.array('images'), createProduct);
router.route('/:id')
  .put(upload.array('images', 5), updateProduct)
  .delete(deleteProduct);

export default router;