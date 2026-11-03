import { Category } from '../models/Category.js';

// Helper to generate URL-friendly slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -
};

/**
 * @desc    Get all categories (hierarchical with nested sub-categories)
 * @route   GET /api/categories
 * @access  Public
 */
export const getCategories = async (req, res, next) => {
  try {
    // Fetch top-level categories and populate their child subcategories
    const categories = await Category.find({ parentCategory: null, isActive: true })
      .populate({
        path: 'subcategories',
        match: { isActive: true },
        select: 'name slug image itemCount iconName',
      })
      .sort({ name: 1 });

    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single category by ID or slug
 * @route   GET /api/categories/:identifier
 * @access  Public
 */
export const getCategoryByIdOrSlug = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    const query = identifier.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: identifier }
      : { slug: identifier };

    const category = await Category.findOne(query).populate('subcategories');
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a category or sub-category (Admin Only)
 * @route   POST /api/categories
 * @access  Private/Admin
 */
export const createCategory = async (req, res, next) => {
  try {
    const { name, parentCategory, image, iconName } = req.body;

    const slug = req.body.slug ? slugify(req.body.slug) : slugify(name);

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'A category with this name or slug already exists.',
      });
    }

    const category = await Category.create({
      name,
      slug,
      parentCategory: parentCategory || null,
      image: image || '',
      iconName: iconName || 'Folder',
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update category (Admin Only)
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
export const updateCategory = async (req, res, next) => {
  try {
    const { name, parentCategory, image, iconName, isActive } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (name) {
      category.name = name;
      category.slug = slugify(name);
    }
    if (parentCategory !== undefined) category.parentCategory = parentCategory || null;
    if (image !== undefined) category.image = image;
    if (iconName !== undefined) category.iconName = iconName;
    if (isActive !== undefined) category.isActive = isActive;

    const updatedCategory = await category.save();

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete category (Admin Only)
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Check if category has child subcategories before deletion
    const subCount = await Category.countDocuments({ parentCategory: category._id });
    if (subCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category that contains active subcategories. Delete or reassign subcategories first.',
      });
    }

    await category.deleteOne();

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
