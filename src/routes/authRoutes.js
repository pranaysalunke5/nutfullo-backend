import express from 'express';
import { getMe, sendOtp, verifyOtp } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/auth/send-otp
router.post('/auth/send-otp', sendOtp);
router.post("/auth/verify-otp", verifyOtp); 
router.get('/auth/me', protect, getMe);

export default router;