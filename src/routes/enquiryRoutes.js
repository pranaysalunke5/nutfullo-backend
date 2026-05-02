import express from 'express';
const router = express.Router();
import { createEnquiry, getAllEnquiries, updateEnquiryStatus } from '../controllers/enquiryController.js';

router.post('/create', createEnquiry);

// routes/enquiryRoutes.js
router.get('/all', getAllEnquiries); 
router.patch('/status/:id', updateEnquiryStatus);

export default router;