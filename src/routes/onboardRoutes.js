import express from 'express';
import { onboardGym } from '../controllers/onboardController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/add', upload.single('document'), onboardGym);

export default router;