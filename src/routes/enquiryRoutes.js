import express from 'express';
const router = express.Router();
import { createEnquiry } from '../controllers/enquiryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

router.post('/', createEnquiry);


export default router;