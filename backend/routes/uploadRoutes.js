import express from 'express';
import { upload } from '../config/cloudinary.js';
import { uploadImage } from '../controllers/uploadController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin-only image upload endpoint (Supports single 'image' or multiple 'images')
router.post(
  '/',
  protect,
  adminOnly,
  upload.single('image'),
  uploadImage
);

router.post(
  '/multiple',
  protect,
  adminOnly,
  upload.array('images', 8),
  uploadImage
);

export default router;
