import { Router } from 'express';
import { uploadImage } from '../controllers/upload.controller';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// POST /api/upload - single image upload buffered in RAM
router.post('/', upload.single('image'), uploadImage);

export default router;
