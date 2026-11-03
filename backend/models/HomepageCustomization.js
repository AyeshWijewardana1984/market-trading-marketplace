import mongoose from 'mongoose';

const homepageCustomizationSchema = new mongoose.Schema(
  {
    // Hero Slider / Main Banner Customization
    heroBannerImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    },
    heroBannerText: {
      type: String,
      default: 'OFFICE & LIVING FURNITURE - SALE UP TO 50% OFF',
    },
    heroBannerSubtitle: {
      type: String,
      default: 'Architectural beech wood frame with premium high-density velvet cushioning for modern spaces.',
    },
    heroBannerButtonLink: {
      type: String,
      default: '/products?category=furniture',
    },
    heroBannerBadge: {
      type: String,
      default: 'HOT DEAL',
    },

    // Middle Promotional Banner
    promoBannerImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=80',
    },
    promoBannerText: {
      type: String,
      default: 'Jacquard Warp Knitted Microfiber Towel - Special 75% OFF',
    },
    promoBannerButtonLink: {
      type: String,
      default: '/products?category=textiles',
    },

    // Top Promotional Coupon Bar announcement
    couponBannerText: {
      type: String,
      default: 'Flash weekend trade bonus - Instant 20% discount voucher with code Happy2017',
    },
    activeCouponCode: {
      type: String,
      default: 'Happy2017',
    },

    // Footer Guarantees / Service Promises shown in trust badges and footer
    footerPromises: {
      type: [String],
      default: [
        'Free Worldwide Delivery on qualifying orders over $49.89',
        'Buyer Protection Escrow: Funds secured until verified inspection',
        '30-Day Hassle-Free Money Back Guarantee on all marketplace items',
        '24/7 Dedicated Priority Customer Care and Live Trade Desk',
      ],
    },
  },
  {
    timestamps: true,
  }
);

export const HomepageCustomization = mongoose.model(
  'HomepageCustomization',
  homepageCustomizationSchema
);
