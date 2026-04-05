import express from 'express';
import { updateCart, getCart } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, updateCart); // Add/update cart item
router.get('/', protect, getCart);     // Get current cart

export default router;