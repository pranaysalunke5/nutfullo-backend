import express from 'express';
const router = express.Router();
import { createEnquiry } from '../controllers/enquiryController.js';

router.post('/create', createEnquiry);


export default router;