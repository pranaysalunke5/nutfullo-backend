import express from 'express';
import { onboardGym } from '../controllers/onboardController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// ✅ FINAL ROUTE
// router.route('/').post(upload.single('document'), onboardGym);


router.post('/', upload.single('document'), onboardGym);



export default router;