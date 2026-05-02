import express from 'express';
import { onboardGym  ,getOnboards, updateOnboard, deleteOnboard} from '../controllers/onboardController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/add', upload.single('document'), onboardGym);

router.get('/', getOnboards);

router.put('/:id', upload.single('document'), updateOnboard);

router.delete('/:id', deleteOnboard);     


export default router;