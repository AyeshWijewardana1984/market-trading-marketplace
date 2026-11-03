import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
} from '../controllers/productController.js';
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import {
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { updateHomepageCustomization } from '../controllers/homepageController.js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';

const router = express.Router();

// Apply protect and adminOnly middleware across all /api/admin routes
router.use(protect, adminOnly);

/**
 * @desc    Get Admin Dashboard Overview Metrics
 * @route   GET /api/admin/dashboard-stats
 * @access  Private/Admin
 */
router.get('/dashboard-stats', async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const dailyDealsCount = await Product.countDocuments({
      isDailyDeal: true,
      dealEndTime: { $gt: new Date() },
    });

    const revenueResult = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        dailyDealsCount,
        totalRevenue: Number(totalRevenue.toFixed(2)),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Admin Product Management Routes
router.route('/products')
  .get(getProducts)
  .post(createProduct);

router.route('/products/:id')
  .put(updateProduct)
  .delete(deleteProduct);

// Admin Category Management Routes
router.post('/categories', createCategory);
router.route('/categories/:id')
  .put(updateCategory)
  .delete(deleteCategory);

// Admin Order Management Routes
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Admin Homepage Customization Routes
router.put('/homepage-customization', updateHomepageCustomization);

export default router;
