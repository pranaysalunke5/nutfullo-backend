import express from 'express';
const router = express.Router();
import { createEnquiry, getAllEnquiries, updateEnquiryStatus } from '../controllers/enquiryController.js';

router.post('/create', createEnquiry);

// routes/enquiryRoutes.js
router.get('/all', getAllEnquiries); // Add middleware for admin check here
router.patch('/status/:id', updateEnquiryStatus);


export default router;