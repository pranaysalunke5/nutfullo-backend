import express from 'express';
const router = express.Router();
import { createEnquiry, deleteEnquiry, getAllEnquiries, updateEnquiryStatus } from '../controllers/enquiryController.js';

router.post('/create', createEnquiry);

// routes/enquiryRoutes.js
router.get('/all', getAllEnquiries); 
router.patch('/status/:id', updateEnquiryStatus);
router.delete('/:id', deleteEnquiry);

export default router;