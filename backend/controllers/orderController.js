import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Coupon } from '../models/Coupon.js';

/**
 * @desc    Create new order (Customer)
 * @route   POST /api/orders
 * @access  Private (Customer or Admin)
 */
export const createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, couponCode } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items provided' });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode) {
      return res.status(400).json({ success: false, message: 'Complete shipping address is required' });
    }

    // 1. Verify products, availability, and calculate server-side pricing to prevent client tampering
    let itemsPrice = 0;
    const verifiedOrderItems = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.product} not found.`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient inventory for "${product.name}". Only ${product.stock} units available.`,
        });
      }

      // Check if product is on daily deal with active discount
      const isDealActive = product.isDailyDeal && product.dealEndTime && new Date() <= new Date(product.dealEndTime);
      const unitPrice = (isDealActive && product.discountPrice) ? product.discountPrice : (product.discountPrice || product.price);

      itemsPrice += unitPrice * item.quantity;

      verifiedOrderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: unitPrice,
        image: product.images[0] || '',
        selectedColor: item.selectedColor || '',
      });
    }

    // 2. Validate coupon discount if code supplied
    let discountAmount = 0;
    let appliedCoupon = '';

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.trim().toUpperCase(),
        isActive: true,
      });

      if (coupon && coupon.isValid() && itemsPrice >= coupon.minOrderAmount) {
        discountAmount = (itemsPrice * coupon.discountPercentage) / 100;
        appliedCoupon = coupon.code;
      }
    }

    // 3. Shipping logic: Free shipping over $49.89
    const shippingPrice = (itemsPrice - discountAmount) >= 49.89 ? 0 : 9.99;
    const totalPrice = Number((itemsPrice - discountAmount + shippingPrice).toFixed(2));

    // 4. Create Order document
    const order = await Order.create({
      user: req.user._id,
      orderItems: verifiedOrderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      discountAmount,
      shippingPrice,
      totalPrice,
      appliedCouponCode: appliedCoupon,
      status: paymentMethod === 'cod' ? 'Processing' : 'Pending',
    });

    // 5. Decrement inventory stock count & increment sold metrics
    for (const item of verifiedOrderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, sold: item.quantity },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get order details by ID
 * @route   GET /api/orders/:id
 * @access  Private (Owner or Admin)
 */
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('orderItems.product', 'name vendor');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Allow only order owner or an admin to access
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged in customer's orders
 * @route   GET /api/orders/myorders
 * @access  Private
 */
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all orders across marketplace (Admin Only)
 * @route   GET /api/orders
 * @access  Private/Admin
 */
export const getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: orders.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order status (Admin Only)
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, isPaid } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (status) {
      order.status = status;
      if (status === 'Delivered') {
        order.deliveredAt = new Date();
      }
    }

    if (isPaid !== undefined) {
      order.isPaid = Boolean(isPaid);
      if (order.isPaid && !order.paidAt) {
        order.paidAt = new Date();
      }
    }

    const updatedOrder = await order.save();

    res.json({
      success: true,
      message: `Order status updated to ${updatedOrder.status}`,
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};
