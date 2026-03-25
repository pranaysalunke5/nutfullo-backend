import express from 'express';
const router = express.Router();
import { createEnquiry } from '../controllers/enquiryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

// Public Route: Anyone can send an enquiry
router.post('/', createEnquiry);

// Protected Route: Only logged-in Admins can see all enquiries
// router.get('/', protect, authorize('admin'), getEnquiries);

export default router;