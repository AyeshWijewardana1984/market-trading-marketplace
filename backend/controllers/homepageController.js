import { HomepageCustomization } from '../models/HomepageCustomization.js';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';

/**
 * @desc    Get aggregated homepage data in a single optimized response
 *          Returns Hero Banner, Daily Deals (with active countdowns), Trending Items,
 *          Top Categories, and Service Guarantees.
 * @route   GET /api/homepage
 * @access  Public
 */
export const getHomepageData = async (req, res, next) => {
  try {
    const now = new Date();

    // 1. Fetch homepage banner and customization settings (or create default if empty)
    let customization = await HomepageCustomization.findOne();
    if (!customization) {
      customization = await HomepageCustomization.create({});
    }

    // 2. Fetch active Daily Deals: must be flagged isDailyDeal and dealEndTime > current time
    const dailyDeals = await Product.find({
      isDailyDeal: true,
      dealEndTime: { $gt: now },
    })
      .populate('category', 'name slug')
      .sort({ dealEndTime: 1 })
      .limit(6);

    // 3. Fetch Trending Items (Flagged isFeatured or top rated/ordered products)
    const trendingItems = await Product.find({
      $or: [{ isFeatured: true }, { 'ratings.average': { $gte: 4.5 } }],
    })
      .populate('category', 'name slug')
      .sort({ sold: -1, createdAt: -1 })
      .limit(10);

    // 4. Fetch top department categories with subcategories
    const departments = await Category.find({ parentCategory: null, isActive: true })
      .populate({
        path: 'subcategories',
        select: 'name slug image itemCount',
      })
      .sort({ itemCount: -1 })
      .limit(11);

    // 5. Latest newly listed products
    const latestProducts = await Product.find({})
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      data: {
        customization: {
          heroBannerImage: customization.heroBannerImage,
          heroBannerText: customization.heroBannerText,
          heroBannerSubtitle: customization.heroBannerSubtitle,
          heroBannerButtonLink: customization.heroBannerButtonLink,
          heroBannerBadge: customization.heroBannerBadge,
          promoBannerImage: customization.promoBannerImage,
          promoBannerText: customization.promoBannerText,
          promoBannerButtonLink: customization.promoBannerButtonLink,
          couponBannerText: customization.couponBannerText,
          activeCouponCode: customization.activeCouponCode,
          footerPromises: customization.footerPromises,
        },
        dailyDeals: {
          title: 'DAILY DEALS',
          items: dailyDeals,
        },
        trendingItems: {
          title: 'TRENDING ITEMS',
          items: trendingItems,
        },
        departments,
        latestProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update homepage customization (Hero banner, promo banners, footer promises)
 * @route   PUT /api/homepage/customization
 * @access  Private/Admin
 */
export const updateHomepageCustomization = async (req, res, next) => {
  try {
    const {
      heroBannerImage,
      heroBannerText,
      heroBannerSubtitle,
      heroBannerButtonLink,
      heroBannerBadge,
      promoBannerImage,
      promoBannerText,
      promoBannerButtonLink,
      couponBannerText,
      activeCouponCode,
      footerPromises,
    } = req.body;

    let customization = await HomepageCustomization.findOne();

    if (!customization) {
      customization = new HomepageCustomization();
    }

    if (heroBannerImage !== undefined) customization.heroBannerImage = heroBannerImage;
    if (heroBannerText !== undefined) customization.heroBannerText = heroBannerText;
    if (heroBannerSubtitle !== undefined) customization.heroBannerSubtitle = heroBannerSubtitle;
    if (heroBannerButtonLink !== undefined) customization.heroBannerButtonLink = heroBannerButtonLink;
    if (heroBannerBadge !== undefined) customization.heroBannerBadge = heroBannerBadge;

    if (promoBannerImage !== undefined) customization.promoBannerImage = promoBannerImage;
    if (promoBannerText !== undefined) customization.promoBannerText = promoBannerText;
    if (promoBannerButtonLink !== undefined) customization.promoBannerButtonLink = promoBannerButtonLink;

    if (couponBannerText !== undefined) customization.couponBannerText = couponBannerText;
    if (activeCouponCode !== undefined) customization.activeCouponCode = activeCouponCode;

    if (footerPromises !== undefined && Array.isArray(footerPromises)) {
      customization.footerPromises = footerPromises;
    }

    const saved = await customization.save();

    res.json({
      success: true,
      message: 'Homepage customization updated successfully',
      data: saved,
    });
  } catch (error) {
    next(error);
  }
};
