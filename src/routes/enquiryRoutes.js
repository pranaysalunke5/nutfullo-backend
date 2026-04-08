import express from 'express';
const router = express.Router();
import { createEnquiry } from '../controllers/enquiryController.js';

router.post('/', createEnquiry);


export default router;