import express from 'express';
import {
  getHomepageData,
  updateHomepageCustomization,
} from '../controllers/homepageController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public: Fetch aggregated home page data (Hero banner, Daily Deals with countdown, Trending Items, Guarantees)
router.get('/', getHomepageData);

// Admin: Update Hero banner text, URLs, promo banners, and footer guarantees
router.put('/customization', protect, adminOnly, updateHomepageCustomization);

export default router;
