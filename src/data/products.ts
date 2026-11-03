import { CategoryItem, Product } from '../types/marketplace';

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'parts-tools',
    name: 'Industrial Parts & Tools',
    nameSi: 'කාර්මික අමතර කොටස් සහ මෙවලම්',
    iconName: 'Wrench',
    itemCount: 1420,
    subcategories: ['Power Drills', 'Hand Tools', 'Hardware Fittings', 'Lathes & CNC', 'Pneumatics'],
    subcategoriesSi: ['විදුලි ඩ්‍රිල්', 'අත් මෙවලම්', 'දෘඩාංග උපාංග', 'CNC ලේත් යන්ත්‍ර', 'නියුමැටික් මෙවලම්']
  },
  {
    id: 'health-beauty',
    name: 'Health & Beauty',
    nameSi: 'සෞඛ්‍ය සහ රූපලාවන්‍ය',
    iconName: 'Sparkles',
    itemCount: 950,
    subcategories: ['Skincare Serums', 'Hair Dryers', 'Aromatherapy', 'Massage Chairs', 'Cosmetic Brushes'],
    subcategoriesSi: ['සම පෝෂක සීරම්', 'කොණ්ඩය වියළන යන්ත්‍ර', 'සුවඳ විලවුන් සත්කාර', 'සම්බාහන පුටු', 'රූපලාවන්‍ය බුරුසු']
  },
  {
    id: 'gifts-sports-toys',
    name: 'Gifts, Sports & Toys',
    nameSi: 'තෑගි, ක්‍රීඩා සහ සෙල්ලම් බඩු',
    iconName: 'Gift',
    itemCount: 820,
    subcategories: ['Handmade Crafts', 'Board Games', 'Fitness Gear', 'Drones', 'Camping Gear'],
    subcategoriesSi: ['අත්කම් නිර්මාණ', 'පුවරු ක්‍රීඩා', 'ශාරීරික සුවතා ආම්පන්න', 'ඩ්‍රෝන යානා', 'කඳවුරු ආම්පන්න']
  },
  {
    id: 'textiles-accessories',
    name: 'Textiles & Accessories',
    nameSi: 'රෙදිපිළි සහ විලාසිතා උපාංග',
    iconName: 'Shirt',
    itemCount: 2300,
    subcategories: ['Linen Sheets', 'Microfiber Towels', 'Woven Rugs', 'Cashmere Scarves', 'Curtains'],
    subcategoriesSi: ['ලිනන් ඇතිරිලි', 'මයික්‍රෝෆයිබර් තුවා', 'වියන ලද පාපිසි', 'කැෂ්මියර් ස්කාෆ්', 'තිර රෙදි']
  },
  {
    id: 'packaging-office',
    name: 'Packaging & Office',
    nameSi: 'ඇසුරුම්කරණය සහ කාර්යාල උපකරණ',
    iconName: 'Briefcase',
    itemCount: 680,
    subcategories: ['Cardboard Boxes', 'Ergonomic Chairs', 'Desk Organizers', 'Label Printers', 'Paper Shredders'],
    subcategoriesSi: ['කාඩ්බෝඩ් පෙට්ටි', 'කාර්යාල පුටු', 'මේස සංවිධායක', 'ලේබල් මුද්‍රණ යන්ත්‍ර', 'කඩදාසි විනාශ යන්ත්‍ර']
  },
  {
    id: 'metallurgy-chemicals',
    name: 'Metallurgy, Chemicals',
    nameSi: 'ලෝහ විද්‍යාව සහ රසායනික ද්‍රව්‍ය',
    iconName: 'FlaskConical',
    itemCount: 540,
    subcategories: ['Alloy Sheets', 'Industrial Resins', 'Polymers', 'Welding Wire', 'Coatings'],
    subcategoriesSi: ['මිශ්‍ර ලෝහ තහඩු', 'කාර්මික රෙසින්', 'පොලිමර් ද්‍රව්‍ය', 'වෙල්ඩින් වයර්', 'ආලේපන']
  },
  {
    id: 'optoelectronics',
    name: 'Opto-electronics',
    nameSi: 'ප්‍රකාශ ඉලෙක්ට්‍රොනික තාක්ෂණය',
    iconName: 'Eye',
    itemCount: 410,
    subcategories: ['Fiber Optics', 'Laser Diodes', 'LED Modules', 'Optical Sensors', 'Lenses'],
    subcategoriesSi: ['ෆයිබර් ඔප්ටික්ස්', 'ලේසර් ඩයෝඩ', 'LED මොඩියුල', 'ප්‍රකාශ සංවේදක', 'කාච වර්ග']
  },
  {
    id: 'home-lights-construction',
    name: 'Home, Lights & Construction',
    nameSi: 'නිවාස, ආලෝකකරණය සහ ඉදිකිරීම්',
    iconName: 'Home',
    itemCount: 3120,
    subcategories: ['Pendant Lights', 'Floor Lamps', 'Ceramic Tiles', 'Wall Paneling', 'Door Hardware'],
    subcategoriesSi: ['එල්ලෙන ලාම්පු', 'බිම් ලාම්පු', 'සෙරමික් ටයිල්', 'බිත්ති පැනල්', 'දොර උපාංග']
  },
  {
    id: 'components-telecom',
    name: 'Components & Telecom',
    nameSi: 'ඉලෙක්ට්‍රොනික උපාංග සහ විදුලි සංදේශ',
    iconName: 'Radio',
    itemCount: 1190,
    subcategories: ['Microcontrollers', 'Antennas', '5G Routers', 'Circuit Boards', 'Coaxial Cables'],
    subcategoriesSi: ['මයික්‍රොකොන්ට්‍රෝලර්', 'ඇන්ටනා වර්ග', '5G රවුටර්', 'පරිපථ පුවරු', 'කොක්සියල් කේබල්']
  },
  {
    id: 'jewelry-bags-shoes',
    name: 'Jewelry, Bags & Shoes',
    nameSi: 'ස්වර්ණාභරණ, බෑග් සහ පාවහන්',
    iconName: 'Gem',
    itemCount: 1850,
    subcategories: ['Leather Handbags', 'Sterling Silver', 'Canvas Sneakers', 'Watches', 'Backpacks'],
    subcategoriesSi: ['සම් අත්බෑග්', 'රිදී ස්වර්ණාභරණ', 'කැන්වස් සපත්තු', 'අත් ඔරලෝසු', 'බැක්පැක්']
  },
  {
    id: 'more-categories',
    name: 'More Categories',
    nameSi: 'තවත් අංශ සහ කාණ්ඩ',
    iconName: 'MoreHorizontal',
    itemCount: 4200,
    subcategories: ['Automotive Parts', 'Pet Supplies', 'Agricultural Machinery', 'Renewable Energy'],
    subcategoriesSi: ['වාහන අමතර කොටස්', 'සුරතල් සතුන්ගේ සැපයුම්', 'කෘෂිකාර්මික යන්ත්‍රෝපකරණ', 'පුනර්ජනනීය බලශක්තිය']
  }
];

export const DAILY_DEALS: Product[] = [
  {
    id: 'deal-pink-armchair',
    name: 'Sweetheart Homecoming Dresses - Nordic Pink Accent Lounge Chair',
    category: 'Furniture',
    price: 15.98,
    originalPrice: 19.99,
    discountPercent: 75,
    rating: 5,
    reviewsCount: 42,
    imageUrl: 'PinkArmchair',
    imageAlt: 'Nordic Pink Accent Lounge Chair with Wood Legs',
    stock: 20,
    sold: 28,
    vendor: 'Nordic Living Studio',
    description: "They key is to have every day, the key to open every door. We don't see them, we will never see them, to be successful you've got to work hard.",
    isDailyDeal: true,
    colors: ['Pink', 'Cream', 'Slate'],
    specs: {
      Material: 'High-density Molded Foam & Oak',
      Dimensions: '78 x 72 x 84 cm',
      Weight: '8.4 kg',
      Warranty: '2-Year Manufacturer'
    }
  },
  {
    id: 'deal-ceramic-vase',
    name: 'Sweetheart Homecoming Dresses - Minimalist Ceramic Bloom Vase',
    category: 'Home & Decor',
    price: 15.98,
    originalPrice: 19.99,
    discountPercent: 75,
    rating: 5,
    reviewsCount: 38,
    imageUrl: 'CeramicVase',
    imageAlt: 'Minimalist Ceramic Bloom Vase with Blossom Sprigs',
    stock: 20,
    sold: 28,
    vendor: 'Artisan Ceramics Co.',
    description: "They key is to have every day, the key to open every door. We don't see them, we will never see them, to be successful you've got to work hard.",
    isDailyDeal: true,
    colors: ['Off-White', 'Blush', 'Sand'],
    specs: {
      Material: 'Handcrafted Glazed Porcelain',
      Height: '26 cm',
      Diameter: '14 cm',
      Finish: 'Matte Eggshell'
    }
  },
  {
    id: 'deal-yellow-swivel',
    name: 'Flash Deal - Mustard Yellow Molded Shell Swivel Chair',
    category: 'Furniture',
    price: 18.50,
    originalPrice: 24.99,
    discountPercent: 70,
    rating: 5,
    reviewsCount: 56,
    imageUrl: 'YellowSwivelChair',
    imageAlt: 'Modern yellow sculpted swivel shell chair',
    stock: 15,
    sold: 35,
    vendor: 'Vitra Design Atelier',
    description: "Contemporary 360-degree swivel accent seating with premium molded shell and chrome metal base.",
    isDailyDeal: true,
    colors: ['Mustard', 'Charcoal', 'Ivory'],
    specs: {
      Material: 'Molded Resin & Chrome Steel',
      Dimensions: '72 x 70 x 78 cm',
      Weight: '7.8 kg'
    }
  },
  {
    id: 'deal-ottoman-bench',
    name: 'Flash Deal - Scandinavian Grey Linen Padded Ottoman Stool',
    category: 'Furniture',
    price: 22.00,
    originalPrice: 29.99,
    discountPercent: 65,
    rating: 5,
    reviewsCount: 63,
    imageUrl: 'Ottoman',
    imageAlt: 'Grey upholstered ottoman with solid oak legs',
    stock: 12,
    sold: 40,
    vendor: 'Craft & Wood Furniture',
    description: "Multi-functional padded ottoman bench with solid blonde oak dowel legs and durable textured linen fabric.",
    isDailyDeal: true,
    colors: ['Heather Grey', 'Charcoal', 'Oatmeal'],
    specs: {
      Material: 'Belgian Linen & European Oak',
      Dimensions: '60 x 40 x 42 cm',
      Weight: '6.2 kg'
    }
  }
];

export const TRENDING_PRODUCTS: Product[] = [
  {
    id: 'trend-ottoman',
    name: 'Medieval Tracery Floral Rug & Grey Ottoman Stool',
    category: 'Furniture',
    price: 498.00,
    originalPrice: 599.00,
    discountPercent: 75,
    rating: 5,
    reviewsCount: 29,
    imageUrl: 'Ottoman',
    imageAlt: 'Grey upholstered ottoman with solid oak legs',
    vendor: 'Craft & Wood Furniture',
    stock: 14,
    description: 'Minimalist grey linen padded footstool bench with solid warm oak legs, perfect for living room and bedroom accents.',
    specs: { Material: 'Belgian Linen & Oak', Dimensions: '60 x 40 x 42 cm' }
  },
  {
    id: 'trend-red-pillow',
    name: 'Safavieh Hand-woven Indoor/Outdoor Reversible Multicolor Cushion',
    category: 'Textiles',
    price: 498.00,
    originalPrice: 599.00,
    discountPercent: 75,
    rating: 5,
    reviewsCount: 34,
    imageUrl: 'RedPillow',
    imageAlt: 'Safavieh Hand-woven red decorative throw pillow',
    vendor: 'Safavieh Home',
    stock: 32,
    description: 'High-density embroidered crimson red throw pillow with geometric Moroccan motifs and plush hypoallergenic insert.',
    specs: { Dimensions: '45 x 45 cm', Fill: 'Microfiber Down Alternative' }
  },
  {
    id: 'trend-yellow-chair',
    name: 'Medieval Tracery Floral Rug, Dark Blue, White Yellow Swivel Chair',
    category: 'Furniture',
    price: 498.00,
    originalPrice: 599.00,
    discountPercent: 75,
    rating: 5,
    reviewsCount: 19,
    imageUrl: 'YellowSwivelChair',
    imageAlt: 'Modern yellow sculpted swivel shell chair',
    vendor: 'Vitra Design Atelier',
    stock: 8,
    description: 'Ergonomic mustard yellow molded shell chair on a heavy-duty chrome 360-degree swivel base.',
    specs: { Rotation: '360° Smooth Swivel', MaxWeight: '150 kg' }
  },
  {
    id: 'trend-robes',
    name: 'Medieval Tracery Floral Rug, Dark Blue, White Turkish Cotton Robes',
    category: 'Fashion',
    price: 498.00,
    originalPrice: 599.00,
    discountPercent: 75,
    rating: 5,
    reviewsCount: 52,
    imageUrl: 'HangingRobes',
    imageAlt: 'Turkish cotton waffle weave hanging bathrobes',
    vendor: 'Anatolian Textiles',
    stock: 45,
    description: 'Pack of three ultra-absorbent waffle knit 100% organic Turkish combed cotton bathrobes with matching wooden peg rack.',
    specs: { GSM: '450 GSM', Certification: 'OEKO-TEX Standard 100' }
  },
  {
    id: 'trend-wardrobe',
    name: 'Bella Fitted Wardrobe Storage Cabinet System',
    category: 'Furniture',
    price: 498.00,
    originalPrice: 599.00,
    discountPercent: 75,
    rating: 5,
    reviewsCount: 15,
    imageUrl: 'Wardrobe',
    imageAlt: 'Bella Fitted natural oak 3-door wooden wardrobe closet',
    vendor: 'Bella Modular Interiors',
    stock: 5,
    description: 'Multi-compartment blonde oak bedroom wardrobe closet featuring center full-length vanity mirror and sliding organizers.',
    specs: { Dimensions: '180 x 200 x 58 cm', Wood: 'Solid Engineered Oak' }
  },
  {
    id: 'trend-duck',
    name: 'Ceramic Art Figurine Duck Trio Decorative Set',
    category: 'Beauty',
    price: 498.00,
    originalPrice: 599.00,
    discountPercent: 75,
    rating: 5,
    reviewsCount: 48,
    imageUrl: 'YellowDuck',
    imageAlt: 'Whimsical ceramic ducks in teal, coral, and canary yellow',
    vendor: 'Studio Glaze Kyoto',
    stock: 60,
    description: 'Charming three-piece ceramic duck desk sculptures in aqua, coral red, and canary yellow with glossy handcrafted glaze.',
    specs: { Craft: 'Hand-thrown Ceramic', Set: '3 Pieces' }
  },
  {
    id: 'trend-nightstand',
    name: 'Scandinavian Oak Nightstand Bedside Table with Open Shelf',
    category: 'Furniture',
    price: 498.00,
    originalPrice: 599.00,
    discountPercent: 75,
    rating: 5,
    reviewsCount: 22,
    imageUrl: 'Nightstand',
    imageAlt: 'Scandinavian blonde oak nightstand with open cubby and drawer',
    vendor: 'Craft & Wood Furniture',
    stock: 12,
    description: 'Solid Nordic white oak nightstand table with an open display cubby, soft-close lower drawer, and tapered round dowel legs.',
    specs: { Assembly: 'Tool-free 5 mins', Finish: 'Clear Matte Polyurethane' }
  },
  {
    id: 'trend-bedding',
    name: 'Dual-Tone Sky Blue & White Folded Microfiber Duvet Bedset',
    category: 'Textiles',
    price: 498.00,
    originalPrice: 599.00,
    discountPercent: 75,
    rating: 5,
    reviewsCount: 67,
    imageUrl: 'Bedding',
    imageAlt: 'Folded dual tone sky blue and cloud white duvet bedset',
    vendor: 'Slumber & Dream Textiles',
    stock: 25,
    description: 'Reversible cooling microfiber duvet cover set including two oxford pillow shams with concealed zipper closures.',
    specs: { ThreadCount: '800 TC Equivalent', Hypoallergenic: 'Yes' }
  },
  {
    id: 'trend-plant-stand',
    name: 'Minimalist Cylinder Ceramic Planter Pot on Blonde Wood Stand',
    category: 'Home & Decor',
    price: 498.00,
    originalPrice: 599.00,
    discountPercent: 75,
    rating: 5,
    reviewsCount: 31,
    imageUrl: 'PlantStand',
    imageAlt: 'White cylindrical planter pot on wooden cross stand',
    vendor: 'Botanical Home Elements',
    stock: 18,
    description: 'Glazed porcelain floor planter with built-in drainage hole and saucer, supported by an interlocking solid beechwood stand.',
    specs: { PotDiameter: '25 cm', TotalHeight: '45 cm' }
  },
  {
    id: 'trend-pink-armchair',
    name: 'Victorian Button-Tufted Dusty Pink Velvet Wingback Armchair',
    category: 'Furniture',
    price: 498.00,
    originalPrice: 599.00,
    discountPercent: 75,
    rating: 5,
    reviewsCount: 14,
    imageUrl: 'PinkTuftedArmchair',
    imageAlt: 'Dusty rose pink tufted velvet wingback armchair',
    vendor: 'Heritage Luxury Furniture',
    stock: 6,
    description: 'Timeless vintage wingback club chair in plush dusty rose velvet with hand-applied diamond button tufting and walnut legs.',
    specs: { Fabric: 'Performance Stain-Resistant Velvet', Frame: 'Kiln-Dried Hardwood' }
  }
];

export const LATEST_PRODUCTS: Product[] = [
  {
    id: 'latest-laptop',
    name: 'Notebook Black Specs V Nitro VN7-591G Gaming Edition',
    category: 'Electronics',
    price: 34.99,
    originalPrice: 40.69,
    rating: 5,
    reviewsCount: 88,
    imageUrl: 'Laptop',
    imageAlt: 'Black high-performance notebook laptop',
    vendor: 'Acer Official Store',
    stock: 15,
    description: 'High-performance laptop with Intel Core processor, discrete graphics, IPS matte display, and backlit keyboard.'
  },
  {
    id: 'latest-headphones',
    name: 'The FEED Menu The Globally Conscious Red Studio Headphones',
    category: 'Electronics',
    price: 50.85,
    originalPrice: 65.00,
    rating: 5,
    reviewsCount: 120,
    imageUrl: 'Headphones',
    imageAlt: 'Crimson red over-ear studio DJ headphones',
    vendor: 'Acoustic Sound Labs',
    stock: 30,
    description: 'Over-ear studio monitoring headphones with 50mm neodymium drivers, active ambient isolation, and plush leather pads.'
  },
  {
    id: 'latest-smartwatch',
    name: 'Smartwatch 2.0 LTE Wifi Waterproof Sport Tracker',
    category: 'Electronics',
    price: 34.99,
    originalPrice: 40.69,
    rating: 5,
    reviewsCount: 94,
    imageUrl: 'Smartwatch',
    imageAlt: 'Smartwatch 2.0 with circular AMOLED screen and silicon band',
    vendor: 'Chronos Digital Gear',
    stock: 40,
    description: 'Waterproof multi-sport smartwatch with heart-rate sensor, GPS tracking, sleep monitor, and 7-day battery life.'
  },
  {
    id: 'latest-oppo',
    name: 'OPPO R15 Teaser Poster Smartphone 128GB Gradient',
    category: 'Electronics',
    price: 34.99,
    originalPrice: 40.69,
    rating: 5,
    reviewsCount: 150,
    imageUrl: 'Phone',
    imageAlt: 'OPPO R15 bezel-less smartphone',
    vendor: 'OPPO Direct',
    stock: 22,
    description: 'Full-screen smartphone featuring dual AI cameras, VOOC flash charging, and stunning holographic gradient glass back.'
  }
];

export const TRUST_BADGES = [
  {
    id: 'delivery',
    title: 'FREE DELIVERY',
    titleSi: 'නොමිලේ බෙදාහැරීම',
    subtitle: 'On Order Over $49.89',
    subtitleSi: '$49.89 ට වැඩි ඇණවුම් සඳහා',
    iconName: 'Truck'
  },
  {
    id: 'protection',
    title: 'ORDER PROTECTION',
    titleSi: 'ගැනුම්කරු ආරක්ෂාව',
    subtitle: 'Secured Information',
    subtitleSi: 'සුරක්ෂිත ඇපකර ක්‍රමය',
    iconName: 'ShieldCheck'
  },
  {
    id: 'gift',
    title: 'PROMOTION GIFT',
    titleSi: 'ප්‍රවර්ධන තෑගි',
    subtitle: 'Special Offers!',
    subtitleSi: 'සුවිශේෂී දීමනා!',
    iconName: 'Gift'
  },
  {
    id: 'money-back',
    title: 'MONEY BACK',
    titleSi: 'මුදල් ආපසු ගෙවීම',
    subtitle: 'Return over 30 Days',
    subtitleSi: 'දින 30ක ආපසු භාරගැනීම',
    iconName: 'RotateCcw'
  }
];

export const ALL_PRODUCTS: Product[] = [
  ...DAILY_DEALS,
  ...TRENDING_PRODUCTS,
  ...LATEST_PRODUCTS,
];

export const getProductById = (id: string): Product | undefined => {
  return ALL_PRODUCTS.find((p) => p.id === id);
};

