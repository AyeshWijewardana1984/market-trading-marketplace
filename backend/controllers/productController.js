import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';

/**
 * @desc    Get all products with filtering, searching, and pagination
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req, res, next) => {
  try {
    const {
      keyword,
      category,
      isFeatured,
      isDailyDeal,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // 1. Text Search across name and description
    if (keyword && keyword.trim()) {
      query.$text = { $search: keyword.trim() };
    }

    // 2. Category filtering by ObjectId or slug
    if (category) {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const foundCategory = await Category.findOne({ slug: category.toLowerCase() });
        if (foundCategory) {
          // If category has subcategories, match products in parent or any child category
          const childCategories = await Category.find({ parentCategory: foundCategory._id });
          const categoryIds = [foundCategory._id, ...childCategories.map((c) => c._id)];
          query.category = { $in: categoryIds };
        }
      }
    }

    // 3. Daily Deal filter: Must be marked isDailyDeal and dealEndTime must be in the future
    if (isDailyDeal === 'true') {
      query.isDailyDeal = true;
      query.dealEndTime = { $gt: new Date() };
    }

    // 4. Featured / Trending Items filter
    if (isFeatured === 'true') {
      query.isFeatured = true;
    }

    // 5. Price Range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 6. Sorting options
    let sortOption = { createdAt: -1 }; // Default newest
    if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { 'ratings.average': -1 };
    else if (sort === 'popular' || sort === 'sold') sortOption = { sold: -1 };

    // 7. Pagination calculations
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug parentCategory')
      .populate('reviews.user', 'name');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new product (Admin Only)
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      category,
      images,
      stock,
      isFeatured,
      isDailyDeal,
      dealEndTime,
      vendor,
      colors,
      specifications,
    } = req.body;

    // Validate that category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ success: false, message: 'Invalid category specified' });
    }

    // Validate dealEndTime if product is marked as a Daily Deal
    let parsedEndTime = null;
    if (isDailyDeal) {
      if (!dealEndTime) {
        // Default to 48 hours from now if not explicitly passed
        parsedEndTime = new Date(Date.now() + 48 * 60 * 60 * 1000);
      } else {
        parsedEndTime = new Date(dealEndTime);
        if (parsedEndTime <= new Date()) {
          return res.status(400).json({
            success: false,
            message: 'dealEndTime must be a future timestamp',
          });
        }
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      discountPrice: discountPrice || null,
      category,
      images: Array.isArray(images) ? images : [images],
      stock: Number(stock) || 0,
      isFeatured: Boolean(isFeatured),
      isDailyDeal: Boolean(isDailyDeal),
      dealEndTime: parsedEndTime,
      vendor: vendor || 'Market Direct Tech Co.',
      colors: colors || [],
      specifications: specifications || {},
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a product (Admin Only)
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updates = req.body;

    // Handle Daily Deal countdown toggle
    if (updates.isDailyDeal === true && updates.dealEndTime) {
      const parsedEndTime = new Date(updates.dealEndTime);
      if (parsedEndTime <= new Date()) {
        return res.status(400).json({
          success: false,
          message: 'dealEndTime for Daily Deal must be a future date and time',
        });
      }
      updates.dealEndTime = parsedEndTime;
    } else if (updates.isDailyDeal === false) {
      updates.dealEndTime = null;
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a product (Admin Only)
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
