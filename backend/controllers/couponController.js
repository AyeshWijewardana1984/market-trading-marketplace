import { Coupon } from '../models/Coupon.js';

/**
 * @desc    Validate and verify coupon code (Public / Customer)
 * @route   POST /api/coupons/validate
 * @access  Public
 */
export const validateCoupon = async (req, res, next) => {
  try {
    const { code, orderAmount = 0 } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Please provide a coupon code' });
    }

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      isActive: true,
    });

    if (!coupon || !coupon.isValid()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid, inactive, or expired coupon code. Try "Happy2017".',
      });
    }

    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Order minimum of $${coupon.minOrderAmount} required for this coupon code.`,
      });
    }

    res.json({
      success: true,
      message: `Coupon ${coupon.code} applied: ${coupon.discountPercentage}% discount!`,
      data: {
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all coupons (Admin Only)
 * @route   GET /api/coupons
 * @access  Private/Admin
 */
export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, count: coupons.length, data: coupons });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create promotional coupon (Admin Only)
 * @route   POST /api/coupons
 * @access  Private/Admin
 */
export const createCoupon = async (req, res, next) => {
  try {
    const { code, discountPercentage, expiryDate, minOrderAmount, isActive } = req.body;

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Coupon code already exists' });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountPercentage,
      expiryDate,
      minOrderAmount: minOrderAmount || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({ success: true, message: 'Coupon created', data: coupon });
  } catch (error) {
    next(error);
  }
};
