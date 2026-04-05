// import express from 'express';
// import { sendOtp } from '../controllers/authController.js';

// const router = express.Router();

// // POST /api/send-otp
// router.post('/send-otp', sendOtp);

// export default router;

import express from 'express';
import { sendOtp, verifyOtp } from '../controllers/authController.js';

const router = express.Router();

// POST /api/auth/send-otp
router.post('/auth/send-otp', sendOtp);
router.post("/auth/verify-otp", verifyOtp); 

export default router;