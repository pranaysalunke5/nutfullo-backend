import express from 'express';
import { onboardGym } from '../controllers/onboardController.js';

const router = express.Router();

router.post('/', onboardGym); // No 'upload.single' needed here now

export default router;