import dotenv from 'dotenv';
import { User } from './models/User.js';
import { Category } from './models/Category.js';
import { Product } from './models/Product.js';
import { HomepageCustomization } from './models/HomepageCustomization.js';
import { Coupon } from './models/Coupon.js';
import { connectDB } from './config/db.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seeder] Cleaning existing records...');
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await HomepageCustomization.deleteMany();
    await Coupon.deleteMany();

    console.log('[Seeder] Creating Admin and Customer users...');
    await User.create([
      {
        name: 'Market Super Admin',
        email: 'admin@market.com',
        password: 'AdminPassword123!',
        role: 'admin',
        phone: '+1 234 567 8900',
      },
      {
        name: 'Alex Johnson',
        email: 'alex.buyer@market.com',
        password: 'BuyerPassword123!',
        role: 'customer',
        phone: '+1 555 019 2831',
        address: {
          street: '742 Evergreen Terrace',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94103',
          country: 'USA',
        },
      },
    ]);

    console.log('[Seeder] Creating Categories & Sub-categories...');
    const furnitureCat = await Category.create({
      name: 'Furniture & Living',
      slug: 'furniture',
      iconName: 'Home',
      itemCount: 3120,
    });

    const textilesCat = await Category.create({
      name: 'Textiles & Accessories',
      slug: 'textiles',
      iconName: 'Shirt',
      itemCount: 2300,
    });

    const industrialCat = await Category.create({
      name: 'Industrial Parts & Tools',
      slug: 'industrial-parts',
      iconName: 'Wrench',
      itemCount: 1420,
    });

    const healthCat = await Category.create({
      name: 'Health & Beauty',
      slug: 'health-beauty',
      iconName: 'Sparkles',
      itemCount: 950,
    });

    // Create subcategories
    await Category.create([
      { name: 'Power Drills', slug: 'power-drills', parentCategory: industrialCat._id },
      { name: 'Ergonomic Chairs', slug: 'ergonomic-chairs', parentCategory: furnitureCat._id },
      { name: 'Linen Sheets & Towels', slug: 'linens-towels', parentCategory: textilesCat._id },
      { name: 'Skincare Serums', slug: 'skincare-serums', parentCategory: healthCat._id },
    ]);

    console.log('[Seeder] Creating Daily Deals & Trending Products...');
    const now = new Date();
    const dealEnd = new Date(now.getTime() + 48 * 60 * 60 * 1000); // 48 hours countdown

    await Product.create([
      {
        name: 'Sweetheart Nordic Pink Accent Lounge Chair',
        description: 'Architectural beech wood frame with premium high-density velvet cushioning.',
        price: 19.99,
        discountPrice: 15.98,
        category: furnitureCat._id,
        images: ['https://images.unsplash.com/photo-1580481077194-c2415c0d3791?auto=format&fit=crop&w=800&q=80'],
        stock: 24,
        sold: 28,
        isDailyDeal: true,
        dealEndTime: dealEnd,
        isFeatured: true,
        vendor: 'Nordic Living Studio',
      },
      {
        name: 'Minimalist Ceramic Bloom Vase with Blossom Sprigs',
        description: 'Handcrafted glazed porcelain vase with matte eggshell finish.',
        price: 19.99,
        discountPrice: 15.98,
        category: furnitureCat._id,
        images: ['https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80'],
        stock: 20,
        sold: 38,
        isDailyDeal: true,
        dealEndTime: dealEnd,
        isFeatured: true,
        vendor: 'Artisan Ceramics Co.',
      },
      {
        name: 'Scandinavian Grey Linen Padded Ottoman Bench',
        description: 'Multi-functional padded ottoman bench with solid blonde oak dowel legs.',
        price: 599.00,
        discountPrice: 498.00,
        category: furnitureCat._id,
        images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80'],
        stock: 14,
        sold: 29,
        isFeatured: true,
        vendor: 'Craft & Wood Furniture',
      },
      {
        name: 'Jacquard Warp Knitted Microfiber Towels',
        description: 'High-density luxury commercial microfiber weave for hospitality.',
        price: 65.00,
        discountPrice: 29.99,
        category: textilesCat._id,
        images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80'],
        stock: 45,
        sold: 120,
        isFeatured: true,
        vendor: 'Anatolian Textiles',
      },
    ]);

    console.log('[Seeder] Creating Homepage Customization...');
    await HomepageCustomization.create({});

    console.log('[Seeder] Creating Discount Coupon...');
    await Coupon.create({
      code: 'HAPPY2017',
      discountPercentage: 20,
      minOrderAmount: 0,
      expiryDate: new Date('2028-12-31'),
    });

    console.log('[Seeder] Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

seedData();
