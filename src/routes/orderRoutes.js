import express from 'express';
import { addOrderItems } from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Only logged-in users can create an order
router.route('/').post(protect, addOrderItems);

// Example: Only admins can view all orders (for your dashboard)
// router.route('/').get(protect, authorize('admin'), getAllOrders);

export default router;