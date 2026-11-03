import { Language, Product } from '../types/marketplace';

export interface Translations {
  [key: string]: {
    en: string;
    si: string;
  };
}

export const TRANSLATIONS: Translations = {
  // TopBar
  customerService: {
    en: 'Customer Support: (+123) 4 567 890',
    si: 'පාරිභෝගික සහාය: (+123) 4 567 890'
  },
  couponCode: {
    en: 'TRADE COUPON: Happy2017 (20% OFF)',
    si: 'වෙළඳ කූපනය: Happy2017 (20% වට්ටමක්)'
  },
  trackOrder: {
    en: 'Track Order',
    si: 'ඇණවුම පරීක්ෂා කරන්න'
  },
  becomeVendor: {
    en: 'Become a Vendor',
    si: 'වෙළෙන්දෙකු වන්න'
  },
  helpFaq: {
    en: 'Help & FAQ',
    si: 'උදවු සහ නිතර අසන ප්‍රශ්න'
  },
  signIn: {
    en: 'Sign In',
    si: 'පිවිසෙන්න'
  },
  register: {
    en: 'Register',
    si: 'ලියාපදිංචි වන්න'
  },
  myAccount: {
    en: 'My Account',
    si: 'මගේ ගිණුම'
  },
  logout: {
    en: 'Sign Out',
    si: 'ඉවත් වන්න'
  },

  // Main Header
  allDepartments: {
    en: 'All Departments',
    si: 'සියලු අංශ'
  },
  searchPlaceholder: {
    en: 'Search from 50,000+ wholesale products, manufacturers, brands...',
    si: 'තොග භාණ්ඩ සහ නිෂ්පාදකයින් 50,000+ කට වැඩි ප්‍රමාණයකින් සොයන්න...'
  },
  searchBtn: {
    en: 'Search',
    si: 'සොයන්න'
  },
  wishlist: {
    en: 'Wishlist',
    si: 'පැතුම් ලැයිස්තුව'
  },
  compare: {
    en: 'Compare',
    si: 'සංසන්දනය'
  },
  cart: {
    en: 'Cart',
    si: 'කරත්තය'
  },
  items: {
    en: 'items',
    si: 'අයිතම'
  },

  // Navigation Bar
  allDepartmentsBtn: {
    en: 'ALL DEPARTMENTS',
    si: 'සියලු අංශ'
  },
  navHome: {
    en: 'HOME',
    si: 'මුල් පිටුව'
  },
  navDailyDeals: {
    en: 'DAILY DEALS',
    si: 'දවසේ දීමනා'
  },
  navTrending: {
    en: 'TRENDING ITEMS',
    si: 'ජනප්‍රිය අයිතම'
  },
  navWholesale: {
    en: 'WHOLESALE B2B',
    si: 'තොග B2B මිල ගණන්'
  },
  navVendors: {
    en: 'VERIFIED VENDORS',
    si: 'සත්‍යාපිත වෙළෙන්දන්'
  },
  navBlog: {
    en: 'TRADE BLOG',
    si: 'වෙළඳ බ්ලොග් අඩවිය'
  },
  navHelp: {
    en: 'HELP & FAQ',
    si: 'උදවු & විමසීම්'
  },
  vendorCallout: {
    en: 'Sell on Market',
    si: 'වෙළඳපොළේ විකුණන්න'
  },
  vendorCalloutSub: {
    en: '0% fees first 90 days',
    si: 'පළමු දින 90 තුළ 0% ගාස්තු'
  },

  // Language selector
  language: {
    en: 'Language',
    si: 'භාෂාව'
  },
  langEnglish: {
    en: 'English',
    si: 'English (ඉංග්‍රීසි)'
  },
  langSinhala: {
    en: 'සිංහල (Sinhala)',
    si: 'සිංහල'
  },

  // Hero Slider
  hero1Tag: {
    en: 'OFFICE & EXECUTIVE FURNITURE',
    si: 'කාර්යාලීය සහ විධායක ගෘහ භාණ්ඩ'
  },
  hero1Title: {
    en: 'Scandinavian Minimalist Armchair',
    si: 'ස්කැන්ඩිනේවියානු අවම විලාසිතාවේ විවේක පුටුව'
  },
  hero1Subtitle: {
    en: 'Architectural beech wood frame with premium high-density velvet cushioning.',
    si: 'උසස් ඝනත්වයකින් යුත් වෙල්වට් කුෂන් සහ ශක්තිමත් බීච් ලී සැකිල්ලෙන් නිමවා ඇත.'
  },
  hero2Tag: {
    en: 'HOSPITALITY & EXPORT TEXTILES',
    si: 'හෝටල් සහ අපනයන රෙදිපිළි'
  },
  hero2Title: {
    en: 'Jacquard Microfiber Luxury Linens',
    si: 'සුඛෝපභෝගී ජැකාර්ඩ් මයික්‍රෝෆයිබර් රෙදිපිළි'
  },
  hero2Subtitle: {
    en: 'Export-grade warp knitted ultra-absorbent weave for commercial luxury suites.',
    si: 'සුඛෝපභෝගී හෝටල් කාමර සඳහා වන අපනයන තත්ත්වයේ අතිශය තෙතමනය උරාගන්නා රෙදිපිළි.'
  },
  hero3Tag: {
    en: 'PRECISION CNC & FABRICATION',
    si: 'නිරවද්‍ය CNC සහ කාර්මික මෙවලම්'
  },
  hero3Title: {
    en: 'Industrial Cordless High-Torque Drill',
    si: 'කාර්මික රැහැන් රහිත අධි-බලැති විදුලි විදුම් යන්ත්‍රය'
  },
  hero3Subtitle: {
    en: '20V brushless motor with dual battery dock, safety clutch, and 24 accessories.',
    si: 'ද්විත්ව බැටරි ඩොක් එකක්, ආරක්ෂිත ක්ලච් එකක් සහ උපාංග 24ක් සහිත 20V බුරුසු රහිත මෝටරය.'
  },
  shopNow: {
    en: 'Shop Now',
    si: 'දැන් මිලදී ගන්න'
  },
  requestBulkQuote: {
    en: 'Request Bulk Quote',
    si: 'තොග මිල ගණන් ඉල්ලන්න'
  },
  exploreCatalog: {
    en: 'Explore Catalog',
    si: 'නාමාවලිය බලන්න'
  },
  instantDispatch: {
    en: 'Instant Dispatch',
    si: 'ක්ෂණිකව පිටත් කිරීම'
  },
  verifiedSupplier: {
    en: 'Verified Supplier',
    si: 'සත්‍යාපිත සැපයුම්කරු'
  },
  wholesaleTiers: {
    en: 'Wholesale Tiers',
    si: 'තොග මිල මට්ටම්'
  },
  buyerEscrow: {
    en: 'Buyer Escrow',
    si: 'ගැනුම්කරුගේ ඇපකරය'
  },

  // Daily Deals
  dailyDealsTitle: {
    en: 'DAILY DEALS',
    si: 'දවසේ විශේෂ දීමනා'
  },
  dealEndsIn: {
    en: 'Hurry Up! Offer ends in:',
    si: 'ඉක්මන් කරන්න! දීමනාව අවසන් වන්නේ:'
  },
  viewAllDeals: {
    en: 'View All Deals →',
    si: 'සියලු දීමනා බලන්න →'
  },
  days: {
    en: 'Days',
    si: 'දින'
  },
  hours: {
    en: 'Hours',
    si: 'පැය'
  },
  mins: {
    en: 'Mins',
    si: 'මිනි'
  },
  secs: {
    en: 'Secs',
    si: 'තත්'
  },
  availableStock: {
    en: 'Available:',
    si: 'ඉතිරිව ඇත:'
  },
  soldUnits: {
    en: 'Sold:',
    si: 'විකිණී ඇත:'
  },
  units: {
    en: 'units',
    si: 'ඒකක'
  },
  orders: {
    en: 'orders',
    si: 'ඇණවුම්'
  },
  quickView: {
    en: 'Quick View',
    si: 'ක්ෂණික දැක්ම'
  },
  addToCart: {
    en: 'Add to Cart',
    si: 'කරත්තයට එක් කරන්න'
  },

  // Trending Items
  trendingTitle: {
    en: 'TRENDING ITEMS',
    si: 'ජනප්‍රිය අයිතම'
  },
  tabAll: {
    en: 'All Items',
    si: 'සියල්ල'
  },
  tabFurniture: {
    en: 'Furniture',
    si: 'ගෘහ භාණ්ඩ'
  },
  tabTextiles: {
    en: 'Textiles',
    si: 'රෙදිපිළි'
  },
  tabElectronics: {
    en: 'Electronics',
    si: 'ඉලෙක්ට්‍රොනික'
  },
  tabIndustrial: {
    en: 'Industrial',
    si: 'කාර්මික'
  },

  // Latest Products & Banners
  latestProducts: {
    en: 'LATEST PRODUCTS',
    si: 'අලුත්ම නිෂ්පාදන'
  },
  specialOffer: {
    en: 'SPECIAL OFFER',
    si: 'විශේෂ දීමනාව'
  },
  off: {
    en: 'OFF',
    si: 'වට්ටමක්'
  },
  interiorDesign: {
    en: 'INTERIOR DESIGN',
    si: 'අභ්‍යන්තර නිර්මාණ'
  },
  armchairFurniture: {
    en: 'ARMCHAIR FURNITURE',
    si: 'විවේක පුටු ගෘහ භාණ්ඩ'
  },
  upTo50Off: {
    en: 'up to 50% OFF',
    si: '50% දක්වා වට්ටම්'
  },

  // Coupon Bar
  exclusiveTradeCoupon: {
    en: 'EXCLUSIVE WHOLESALE TRADE COUPON',
    si: 'සුවිශේෂී තොග වෙළඳ කූපනය'
  },
  couponSub: {
    en: 'Use code Happy2017 for an extra 20% discount on orders over $50.00 across all verified vendors.',
    si: 'සත්‍යාපිත වෙළෙන්දන්ගෙන් $50.00 ට වැඩි ඇණවුම් සඳහා අමතර 20% ක වට්ටමක් ලබා ගැනීමට Happy2017 කේතය භාවිතා කරන්න.'
  },
  copyCode: {
    en: 'Copy Code',
    si: 'කේතය පිටපත් කරන්න'
  },
  copied: {
    en: 'Copied!',
    si: 'පිටපත් විය!'
  },

  // Trust Badges
  freeShippingTitle: {
    en: 'Free Worldwide Shipping',
    si: 'ලොව පුරා නොමිලේ බෙදාහැරීම'
  },
  freeShippingDesc: {
    en: 'On all wholesale orders over $49.89',
    si: '$49.89 ට වැඩි සියලුම තොග ඇණවුම් සඳහා'
  },
  genuineTitle: {
    en: '100% Genuine Products',
    si: '100% අව්‍යාජ නිෂ්පාදන'
  },
  genuineDesc: {
    en: 'Factory-direct inspected quality',
    si: 'කර්මාන්තශාලාවෙන්ම පරීක්ෂා කළ උසස් තත්ත්වය'
  },
  escrowTitle: {
    en: 'Buyer Protection Escrow',
    si: 'ගැනුම්කරු ආරක්ෂණ ඇපකරය'
  },
  escrowDesc: {
    en: 'Funds held securely until inspection',
    si: 'භාණ්ඩ ලැබී පරීක්ෂා කරන තෙක් මුදල් සුරක්ෂිතව තබා ගනී'
  },
  supportTitle: {
    en: '24/7 Priority Support',
    si: '24/7 පාරිභෝගික සහාය'
  },
  supportDesc: {
    en: 'Dedicated international trade specialists',
    si: 'ජාත්‍යන්තර වෙළඳ විශේෂඥයින්ගේ ක්ෂණික සහාය'
  },

  // Product Details Page
  backToMarketplace: {
    en: 'Back to Marketplace',
    si: 'නැවත වෙළඳපොළට'
  },
  home: {
    en: 'Home',
    si: 'මුල් පිටුව'
  },
  share: {
    en: 'Share',
    si: 'බෙදාගන්න'
  },
  verifiedStock: {
    en: 'Verified Stock',
    si: 'සත්‍යාපිත තොග'
  },
  dailyDealBadge: {
    en: 'Daily Deal',
    si: 'දවසේ දීමනාව'
  },
  clickToZoom: {
    en: 'Click to Zoom',
    si: 'විශාල කර බලන්න'
  },
  zoomOut: {
    en: 'Zoom Out',
    si: 'කුඩා කරන්න'
  },
  customerReviews: {
    en: 'customer reviews',
    si: 'පාරිභෝගික සමාලෝචන'
  },
  ordersSold: {
    en: 'orders sold',
    si: 'ඇණවුම් අලෙවි විය'
  },
  wholesaleTierPricing: {
    en: 'Wholesale B2B Tier Pricing (Click to select)',
    si: 'තොග B2B මිල ගණන් පරාසය (තෝරා ගැනීමට ක්ලික් කරන්න)'
  },
  minOrder: {
    en: 'Min. Order: 1 pc',
    si: 'අවම ඇණවුම: 1 කෑල්ලක්'
  },
  selectedFinishColor: {
    en: 'Selected Finish / Color:',
    si: 'තෝරාගත් නිමාව / වර්ණය:'
  },
  purchaseQuantity: {
    en: 'Purchase Quantity:',
    si: 'මිලදී ගැනීමේ ප්‍රමාණය:'
  },
  subtotal: {
    en: 'Subtotal:',
    si: 'උප එකතුව:'
  },
  availableInWarehouse: {
    en: 'units in warehouse',
    si: 'ගබඩාවේ පවතින ඒකක'
  },
  dispatchTime: {
    en: 'Ready to dispatch in 24 hours',
    si: 'පැය 24ක් ඇතුළත නැව්ගත කිරීමට සූදානම්'
  },
  buyNow: {
    en: 'Buy Now',
    si: 'දැන් මිලදී ගන්න'
  },
  requestB2BQuote: {
    en: 'Request B2B Quote',
    si: 'B2B තොග මිල ගණන් ඉල්ලන්න'
  },
  saveToWishlist: {
    en: 'Save to wishlist',
    si: 'පැතුම් ලැයිස්තුවට එක් කරන්න'
  },
  inWishlist: {
    en: 'In your wishlist',
    si: 'පැතුම් ලැයිස්තුවේ ඇත'
  },
  supplierProfile: {
    en: 'Supplier Profile',
    si: 'සැපයුම්කරු තොරතුරු'
  },
  goldSupplier: {
    en: 'Gold Supplier 5Y',
    si: 'රන් සැපයුම්කරු වසර 5ක්'
  },
  verifiedManufacturer: {
    en: 'Verified Global Manufacturer & Exporter',
    si: 'සත්‍යාපිත ගෝලීය නිෂ්පාදක සහ අපනයනකරු'
  },
  responseRate: {
    en: 'Response Rate',
    si: 'ප්‍රතිචාර දැක්වීමේ වේගය'
  },
  onTimeDelivery: {
    en: 'On-Time Delivery',
    si: 'නියමිත වේලාවට භාරදීම'
  },
  chatWithSupplier: {
    en: 'Chat with Supplier',
    si: 'සැපයුම්කරු සමඟ කතා කරන්න'
  },
  visitSupplierStore: {
    en: 'Visit Supplier Storefront',
    si: 'සැපයුම්කරුගේ වෙළඳසැලට යන්න'
  },
  tradeAssurance: {
    en: 'Trade Assurance Guarantee',
    si: 'වෙළඳ සහතික ඇපකරය'
  },
  escrowPayment: {
    en: 'Escrow Payment Protection',
    si: 'ඇපකර ගෙවීම් ආරක්ෂාව'
  },
  escrowPaymentSub: {
    en: 'Funds released only after confirmed receipt & inspection.',
    si: 'භාණ්ඩ ලැබී පරීක්ෂා කර තහවුරු කළ පසුව පමණක් මුදල් මුදා හැරේ.'
  },
  freeShippingDetail: {
    en: 'Free Shipping Over $49.89',
    si: '$49.89 ට වැඩි ඇණවුම් සඳහා නොමිලේ බෙදාහැරීම'
  },
  returnsDetail: {
    en: '30-Day Hassle-Free Returns',
    si: 'දින 30ක පහසු ආපසු භාරගැනීම'
  },
  tabSpecs: {
    en: 'Specifications & Details',
    si: 'පිරිවිතර සහ විස්තර'
  },
  tabVendor: {
    en: 'Supplier & Factory Profile',
    si: 'සැපයුම්කරු සහ කර්මාන්තශාලා තොරතුරු'
  },
  tabReviews: {
    en: 'Buyer Reviews',
    si: 'ගැනුම්කරු සමාලෝචන'
  },
  tabShipping: {
    en: 'Shipping & Escrow Terms',
    si: 'නැව්ගත කිරීම් සහ ඇපකර නියමයන්'
  },
  writeReview: {
    en: 'Write a Customer Review',
    si: 'පාරිභෝගික සමාලෝචනයක් ලියන්න'
  },
  cancelReview: {
    en: 'Cancel Review',
    si: 'අවලංගු කරන්න'
  },
  postReview: {
    en: 'Post Customer Review',
    si: 'සමාලෝචනය පළ කරන්න'
  },
  relatedItems: {
    en: 'RELATED ITEMS',
    si: 'අදාළ අයිතම'
  },
  relatedItemsSub: {
    en: 'Customers who viewed this also considered',
    si: 'මෙය බැලූ පාරිභෝගිකයින් සලකා බැලූ අනෙකුත් අයිතම'
  },

  // Cart Drawer
  shoppingCart: {
    en: 'Shopping Cart',
    si: 'සාප්පු සවාරි කරත්තය'
  },
  cartEmpty: {
    en: 'Your cart is currently empty',
    si: 'ඔබගේ කරත්තය දැනට හිස්ව පවතී'
  },
  cartEmptySub: {
    en: 'Discover daily deals and trending items to add to your order.',
    si: 'ඔබගේ ඇණවුමට එක් කිරීමට දවසේ විශේෂ දීමනා සහ ජනප්‍රිය භාණ්ඩ සොයා බලන්න.'
  },
  startShopping: {
    en: 'Start Shopping',
    si: 'සාප්පු සවාරි ආරම්භ කරන්න'
  },
  proceedToCheckout: {
    en: 'Proceed to Checkout',
    si: 'ගෙවීමට ඉදිරියට යන්න'
  },
  clearAllItems: {
    en: 'Clear All Items',
    si: 'සියලු අයිතම ඉවත් කරන්න'
  },
  apply: {
    en: 'Apply',
    si: 'යොදන්න'
  },
  totalAmount: {
    en: 'Total Amount',
    si: 'මුළු මුදල'
  },
  shipping: {
    en: 'Shipping',
    si: 'නැව්ගත කිරීමේ ගාස්තු'
  },
  free: {
    en: 'FREE',
    si: 'නොමිලේ'
  },
  discount: {
    en: 'Discount',
    si: 'වට්ටම'
  },

  // Footer
  newsletterTitle: {
    en: 'SUBSCRIBE TO OUR NEWSLETTER',
    si: 'අපගේ පුවත් පත්‍රිකාවට දායක වන්න'
  },
  newsletterSub: {
    en: 'Get $10 coupon voucher off your first multi-vendor marketplace order.',
    si: 'ඔබගේ පළමු වෙළඳපොළ ඇණවුමෙන් $10 ක කූපන් වට්ටමක් ලබා ගන්න.'
  },
  newsletterPlaceholder: {
    en: 'Enter your work email address...',
    si: 'ඔබගේ විද්‍යුත් තැපැල් ලිපිනය ඇතුළත් කරන්න...'
  },
  subscribe: {
    en: 'Subscribe',
    si: 'දායක වන්න'
  },
  subscribed: {
    en: 'Subscribed!',
    si: 'දායක විය!'
  },
  footerAbout: {
    en: 'Market is an international multi-vendor trading marketplace connecting thousands of verified manufacturers, direct importers, artisans, and wholesale suppliers to global consumers.',
    si: 'Market යනු ලොව පුරා සිටින දහස් ගණන් සත්‍යාපිත නිෂ්පාදකයින්, සෘජු ආනයනකරුවන් සහ තොග සැපයුම්කරුවන් ගෝලීය ගැනුම්කරුවන් සමඟ සම්බන්ධ කරන ජාත්‍යන්තර බහු-වෙළෙන්දන්ගේ වෙළඳ පරිශ්‍රයකි.'
  },
  customerCare: {
    en: 'Customer Care',
    si: 'පාරිභෝගික සත්කාරය'
  },
  departments: {
    en: 'Departments',
    si: 'අංශ'
  },
  multiVendorHub: {
    en: 'Multi-Vendor Hub',
    si: 'බහු-වෙළෙන්දන්ගේ මධ්‍යස්ථානය'
  },
  verifiedVendorLink: {
    en: 'Become a Verified Vendor',
    si: 'සත්‍යාපිත වෙළෙන්දෙකු වන්න'
  },
  vendorDashboard: {
    en: 'Vendor Merchant Dashboard',
    si: 'වෙළෙන්දාගේ පාලක පුවරුව'
  },
  b2bQuotesLink: {
    en: 'B2B Wholesale Quotations',
    si: 'B2B තොග මිල ගණන් ඉල්ලීම්'
  },
  tradeCompliance: {
    en: 'Trade Compliance Standards',
    si: 'වෙළඳ අනුකූලතා ප්‍රමිතීන්'
  },
  partnerNetwork: {
    en: 'Affiliate Partner Network',
    si: 'අනුබද්ධ හවුල්කාර ජාලය'
  },
  allRightsReserved: {
    en: '© 2026 Market - Multi Trading Marketplace. All Rights Reserved.',
    si: '© 2026 Market - බහු-වෙළෙන්දන්ගේ වෙළඳ පරිශ්‍රය. සියලුම හිමිකම් ඇවිරිණි.'
  },
  acceptedPayments: {
    en: 'Accepted Payments:',
    si: 'පිළිගන්නා ගෙවීම් ක්‍රම:'
  }
};

export const CATEGORY_NAMES_SI: { [key: string]: string } = {
  'All': 'සියලු අංශ',
  'All Departments': 'සියලු අංශ',
  'Furniture': 'ගෘහ භාණ්ඩ',
  'Office & Home Furniture': 'කාර්යාල සහ නිවාස ගෘහ භාණ්ඩ',
  'Textiles': 'රෙදිපිළි',
  'Textiles & Accessories': 'රෙදිපිළි සහ උපාංග',
  'Textiles & Cushions': 'රෙදිපිළි සහ කුෂන්',
  'Electronics': 'ඉලෙක්ට්‍රොනික',
  'Electronics & Smart Gadgets': 'ඉලෙක්ට්‍රොනික සහ ස්මාර්ට් උපාංග',
  'Industrial': 'කාර්මික කොටස්',
  'Industrial Parts & Tools': 'කාර්මික අමතර කොටස් සහ මෙවලම්',
  'Health & Beauty': 'සෞඛ්‍ය සහ රූපලාවන්‍ය',
  'Beauty': 'රූපලාවන්‍ය සහ අලංකරණය',
  'Gifts, Sports & Toys': 'තෑගි, ක්‍රීඩා සහ සෙල්ලම් බඩු',
  'Packaging & Office': 'ඇසුරුම්කරණය සහ කාර්යාල උපකරණ',
  'Metallurgy, Chemicals': 'ලෝහ විද්‍යාව සහ රසායනික ද්‍රව්‍ය',
  'Opto-electronics': 'ප්‍රකාශ ඉලෙක්ට්‍රොනික',
  'Home, Lights & Construction': 'නිවාස, ආලෝකකරණය සහ ඉදිකිරීම්',
  'Components & Telecom': 'උපාංග සහ විදුලි සංදේශ',
  'Jewelry, Bags & Shoes': 'ස්වර්ණාභරණ, බෑග් සහ පාවහන්',
  'More Categories': 'වෙනත් අංශ'
};

export const PRODUCT_TRANSLATIONS_SI: {
  [id: string]: {
    name: string;
    description?: string;
    vendor?: string;
  };
} = {
  'deal-pink-armchair': {
    name: 'ස්කැන්ඩිනේවියානු රෝස පැහැති විවේක ලවුන්ජ් පුටුව (ස්වභාවික ලී පාද සහිත)',
    description: 'සුවපහසු ඉරියව්වක් සහතික කරන උසස් තත්ත්වයේ මෘදු වෙල්වට් කුෂන් සහ ඝන ඕක් ලීයෙන් නිමවූ පාද සහිත ආකර්ෂණීය විවේක පුටුවකි. නවීන විසිත්ත කාමර සහ කාර්යාල සඳහා පරිපූර්ණයි.',
    vendor: 'නෝර්ඩික් ලිවින් ස්ටූඩියෝ'
  },
  'deal-ceramic-vase': {
    name: 'අවමවාදී සෙරමික් මල් බඳුන (බ්ලූම් වාස්)',
    description: 'අතින් නිමවන ලද සිනිඳු පිඟන් මැටි බඳුනකි. විසිත්ත කාමරය සහ භෝජනාගාරය සඳහා ස්වභාවික නැවුම් බවක් එක් කරයි.',
    vendor: 'ආර්ටිසන් සෙරමික්ස් සමාගම'
  },
  'deal-yellow-swivel': {
    name: 'අබ කහ පැහැති හැඩකාර කැරකෙන ෂෙල් පුටුව (Swivel Chair)',
    description: 'අංශක 360ක් සුමටව කරකැවිය හැකි, උසස් ක්‍රෝම් ලෝහමය පාදමක් සහ ergonomic හැඩයක් සහිත නවීන පුටුවකි.',
    vendor: 'විට්‍රා ඩිසයින් ඇටලියර්'
  },
  'deal-ottoman-bench': {
    name: 'ස්කැන්ඩිනේවියානු අළු පැහැති ලිනන් ඔටෝමන් ස්ටූලය',
    description: 'ඝන ස්වභාවික ඕක් ලීයෙන් නිමවූ පාද සහිත, මෘදු ලිනන් ඇතිරිල්ලෙන් සකසන ලද බහුකාර්ය විවේක පාදමේ ස්ටූලය.',
    vendor: 'ක්‍රාෆ්ට් සහ වුඩ් ෆර්නිචර්'
  },
  'trend-ottoman': {
    name: 'මධ්‍යතන මල් මෝස්තර පාපිසි සහ අළු පැහැති ඔටෝමන් ස්ටූලය',
    description: 'විසිත්ත කාමරයට මෙන්ම නිදන කාමරයටත් උචිත ඝන ඕක් ලීයෙන් තැනූ අවමවාදී අළු ලිනන් කුෂන් සහිත පාදමේ ස්ටූලය.',
    vendor: 'ක්‍රාෆ්ට් සහ වුඩ් ෆර්නිචර්'
  },
  'trend-red-pillow': {
    name: 'සෆාවියා අතින් වියන ලද බහු-වර්ණ විසිතුරු කුෂන් කොට්ටය',
    description: 'මොරොක්කෝ ජ්‍යාමිතික මෝස්තර සහිත, අසාත්මිකතා-විරෝධී පිරවුමකින් යුත් උසස් ගුණාත්මක තද රතු කුෂන් කොට්ටය.',
    vendor: 'සෆාවියා හෝම්'
  },
  'trend-yellow-chair': {
    name: 'මධ්‍යතන මෝස්තර කහ පැහැති කැරකෙන පුටුව (Swivel Chair)',
    description: 'ශක්තිමත් ක්‍රෝම් පාදමක් සහ අංශක 360 කරකැවීමේ හැකියාව සහිත කහ පැහැති සුවපහසු විවේක පුටුව.',
    vendor: 'විට්‍රා ඩිසයින් ඇටලියර්'
  },
  'trend-robes': {
    name: 'තුර්කි 100% කාබනික කපු නාන ඇඳුම් කට්ටලය (කෑලි 3)',
    description: 'සුපිරි තෙතමනය උරා ගැනීමේ හැකියාව සහිත, ලී එල්ලුම් රඳවනයක්ද ඇතුළත් තුර්කි කපු නාන ඇඳුම් කට්ටලය.',
    vendor: 'ඇනටෝලියන් ටෙක්ස්ටයිල්ස්'
  },
  'trend-wardrobe': {
    name: 'බෙලා ස්වභාවික ඕක් ලී දොර 3ක ඇඳුම් කබඩ් පද්ධතිය',
    description: 'මධ්‍යයේ දිගු කැඩපතක් සහ ලිස්සන ලාච්චු සංවිධායකයන් සහිත ඝන ඕක් ලීයෙන් තැනූ සුඛෝපභෝගී නිදන කාමර අල්මාරිය.',
    vendor: 'බෙලා මොඩියුලර් ඉන්ටීරියර්ස්'
  },
  'trend-duck': {
    name: 'සෙරමික් තාරා කලා රූප ත්‍රිත්ව අලංකරණ කට්ටලය',
    description: 'දීප්තිමත් සෙරමික් ආලේපනයක් සහිත, වර්ණ තුනකින් යුත් සුන්දර මේස අලංකරණ අත්කම් පිළිම කට්ටලය.',
    vendor: 'ස්ටූඩියෝ ග්ලේස් කියෝතෝ'
  },
  'trend-nightstand': {
    name: 'ස්කැන්ඩිනේවියානු ඕක් ලී ඇඳ අසල මේසය (Nightstand Table)',
    description: 'විවෘත තට්ටුවක් සහ සුමටව වැහෙන ලාච්චුවක් සහිත ස්වභාවික නෝර්ඩික් ඕක් ලීයෙන් නිමවූ ඇඳ අසල තබන අලංකාර මේසය.',
    vendor: 'ක්‍රාෆ්ට් සහ වුඩ් ෆර්නිචර්'
  },
  'trend-bedding': {
    name: 'ද්විත්ව වර්ණ නිල් සහ සුදු මයික්‍රෝෆයිබර් ඩුවට් ඇඳ ඇතිරිලි කට්ටලය',
    description: 'සීතල බව සහ සුවපහසුව දනවන, කොට්ට උර 2ක් ඇතුළත් උසස් මයික්‍රෝෆයිබර් ද්විත්ව මුහුණත් ඩුවට් ආවරණ කට්ටලය.',
    vendor: 'ස්ලම්බර් ඇන්ඩ් ඩ්‍රීම් ටෙක්ස්ටයිල්ස්'
  },
  'trend-plant-stand': {
    name: 'ස්වභාවික දැව ආධාරකයක් සහිත සුදු සෙරමික් මල් පෝච්චිය',
    description: 'ජලය බැසයාමේ සිදුරක් සහිත ඔපදැමූ පිඟන් මැටි බඳුන සහ ශක්තිමත් බීච්වුඩ් ලී පාදම.',
    vendor: 'බොටැනිකල් හෝම් එලිමන්ට්ස්'
  },
  'trend-pink-armchair': {
    name: 'වික්ටෝරියානු පන්නයේ රෝස වෙල්වට් වින්ග්බැක් විවේක ආසනය',
    description: 'දියමන්ති රටාවට බොත්තම් ඇල්ලූ සුඛෝපභෝගී රෝස වෙල්වට් සහ වෝල්නට් ලී පාද සහිත සම්භාව්‍ය වික්ටෝරියානු පුටුව.',
    vendor: 'හෙරිටේජ් සුඛෝපභෝගී ගෘහ භාණ්ඩ'
  },
  'latest-laptop': {
    name: 'ඉන්ටෙල් ප්‍රොසෙසර් සහිත කළු පැහැති ප්‍රබල ක්‍රීඩා ලැප්ටොප් පරිගණකය',
    description: 'ඉන්ටෙල් කෝර් ප්‍රොසෙසරයක්, IPS මැට් තිරයක් සහ පසුබිම් ආලෝක යතුරුපුවරුවක් සහිත අධි-ක්‍රියාකාරී ලැප්ටොප් පරිගණකය.',
    vendor: 'ඒසර් නිල වෙළඳසැල'
  },
  'latest-headphones': {
    name: 'ගෝලීය ස්ටුඩියෝ රතු පැහැති වාරික DJ හෙඩ්ෆෝන්',
    description: 'මිලිමීටර් 50 ශබ්ද ධාවක, පරිසර ශබ්ද අවලංගු කිරීම සහ සුවපහසු සම් ආවරණ සහිත ස්ටුඩියෝ හෙඩ්ෆෝන්.',
    vendor: 'ඇකූස්ටික් සවුන්ඩ් ලැබ්ස්'
  },
  'latest-smartwatch': {
    name: 'ස්මාර්ට්වොච් 2.0 LTE Wifi ජලයට ඔරොත්තු දෙන ක්‍රීඩා ඔරලෝසුව',
    description: 'හෘද ස්පන්දන සංවේදකය, GPS ලුහුබැඳීම සහ දින 7ක බැටරි ආයු කාලයක් සහිත AMOLED ස්මාර්ට් ඔරලෝසුව.',
    vendor: 'ක්‍රෝනොස් ඩිජිටල් ගියර්'
  },
  'latest-oppo': {
    name: 'OPPO R15 AI ද්විත්ව කැමරා සහිත ස්මාර්ට් ජංගම දුරකථනය (128GB)',
    description: 'සම්පූර්ණ තිරය, VOOC ක්ෂණික ආරෝපණය සහ ආකර්ෂණීය හෝලෝග්‍රැෆික් වීදුරු පසුපස ආවරණයක් සහිත ස්මාර්ට් ජංගම දුරකථනය.',
    vendor: 'ඔපෝ ඩිරෙක්ට්'
  },
  'deal-yellow-sofa': {
    name: 'නවීන කහ පැහැති තුන්දෙනෙකුට හිඳගත හැකි වෙල්වට් සෝෆාව',
    description: 'සුඛෝපභෝගී මෝස්තරයකින් සහ ඉහළ කල්පැවැත්මකින් යුත් රන්වන් කහ පැහැති සෝෆාවකි. පවුලේ කාමරයට මෙන්ම ආගන්තුක සත්කාර ශාලා සඳහාද කදිමයි.',
    vendor: 'ස්කැන්ඩියා ක්‍රාෆ්ට් ලයින්'
  },
  'deal-fabric-sofa': {
    name: 'කාර්යාලීය සහ නිවාස අංශ සෝෆා කට්ටලය',
    description: 'උසස් තත්ත්වයේ හුස්ම ගත හැකි රෙදිපිළි වලින් සාදන ලද මෙම සෝෆාව දිගුකාලීන භාවිතය සඳහා ප්‍රතිරෝධී පෙන සහිතව නිෂ්පාදනය කර ඇත.',
    vendor: 'ප්‍රයිම් හෝම් ඩිසයින්'
  },
  'deal-dining-set': {
    name: 'පුටු 6ක් සහිත ඝන ඕක් ලී කෑම මේස කට්ටලය',
    description: 'සාම්ප්‍රදායික ශිල්පීයත්වයෙන් යුත් ස්වභාවික දැව රටා කැපී පෙනෙන ශක්තිමත් කෑම මේසය සහ පුටු කට්ටලය.',
    vendor: 'ආර්ටිසන් වුඩ්වර්ක්ස්'
  },
  'prod-drill': {
    name: 'කාර්මික 20V රැහැන් රහිත ඉම්පැක්ට් ඩ්‍රිල් මෙවලම් කට්ටලය',
    description: 'අධි-වේගී කාර්මික කටයුතු සහ ගෘහස්ථ අලුත්වැඩියා සඳහා සුදුසු ද්විත්ව ලිතියම් බැටරි සහ උපාංග 24ක් සහිත වෘත්තීය මෙවලම් කට්ටලය.',
    vendor: 'ඩිරෙක්ට් ටෙක් ඉන්ඩස්ට්‍රීස්'
  },
  'prod-towels': {
    name: 'ජැකාර්ඩ් සුඛෝපභෝගී මයික්‍රෝෆයිබර් හෝටල් තුවා කට්ටලය',
    description: 'සුපිරි තෙතමනය උරා ගැනීමේ හැකියාව සහිත කල්පවතින මෘදු මයික්‍රෝෆයිබර් තුවා. හෝටල් සහ නිවාස සඳහා සුදුසුය.',
    vendor: 'පැසිෆික් ලිනන් ටෙක්ස්ටයිල්ස්'
  },
  'prod-pillow': {
    name: 'අලංකාර ජ්‍යාමිතික මුද්‍රිත විසිතුරු කුෂන් කොට්ට',
    description: 'කාමරයේ අලංකාරය දෙගුණ කරන මෘදු කපු සහ ලිනන් මිශ්‍රණයෙන් නිර්මාණය කළ වාරික කුෂන් ආවරණ.',
    vendor: 'පැසිෆික් ලිනන් ටෙක්ස්ටයිල්ස්'
  },
  'prod-grey-armchair': {
    name: 'අළු පැහැති අවමවාදී විධායක කාර්යාල ආසනය',
    description: 'කොන්දේ වේදනාව වළක්වන පරිදි නිපදවා ඇති අලංකාර ergonomic විධායක ආසනය.',
    vendor: 'නෝර්ඩික් ලිවින් ස්ටූඩියෝ'
  },
  'prod-headphones': {
    name: 'හඬ අවලංගු කිරීමේ (ANC) රැහැන් රහිත ප්‍රෝ හෙඩ්ෆෝන්',
    description: 'පැය 40ක දිගු බැටරි ආයු කාලයක් සහ ස්ටුඩියෝ මට්ටමේ හඬ ගුණාත්මක බවක් ලබාදෙන වාරික හෙඩ්ෆෝන්.',
    vendor: 'ඕඩියෝෆිල් ලැබ්ස්'
  },
  'prod-pendant-light': {
    name: 'නෝර්ඩික් මැට් කළු ඇලුමිනියම් එල්ලෙන ලාම්පුව',
    description: 'නවීන කෑම කාමර සහ ආපනශාලා කවුන්ටර සඳහා මනරම් ආලෝකයක් එක්කරන අලංකාර ලාම්පුව.',
    vendor: 'ලුමිනෙයාර් ලයිටින්ග්'
  },
  'prod-skincare': {
    name: 'ස්වභාවික හයුලූරොනික් අම්ල සම පෝෂක සීරම් (50ml)',
    description: 'සමෙහි දීප්තිය සහ තෙතමනය ආරක්ෂා කරන 100% කාබනික අමුද්‍රව්‍ය වලින් නිපදවූ සත්කාරක සීරම්.',
    vendor: 'පියෝර් ඕගැනික්ස්'
  },
  'prod-backpack': {
    name: 'ජලයට ඔරොත්තු දෙන ව්‍යාපාරික ලැප්ටොප් බෑගය',
    description: 'USB ආරෝපණ පෝට් එකක් සහ සොරකම් වැළැක්වීමේ රහස් සාක්කු සහිත ශක්තිමත් සංචාරක බෑගය.',
    vendor: 'අර්බන් ගියර් කෝ'
  }
};

export function t(key: string, lang: Language): string {
  if (TRANSLATIONS[key] && TRANSLATIONS[key][lang]) {
    return TRANSLATIONS[key][lang];
  }
  return TRANSLATIONS[key]?.en || key;
}

export function getProductName(product: Product, lang: Language): string {
  if (lang === 'si') {
    if (product.nameSi) return product.nameSi;
    const trans = PRODUCT_TRANSLATIONS_SI[product.id]?.name;
    if (trans) return trans;
  }
  return product.name;
}

export function getProductDescription(product: Product, lang: Language): string {
  if (lang === 'si') {
    if (product.descriptionSi) return product.descriptionSi;
    const trans = PRODUCT_TRANSLATIONS_SI[product.id]?.description;
    if (trans) return trans;
  }
  return product.description;
}

export function getCategoryName(category: string, lang: Language): string {
  if (lang === 'si') {
    return CATEGORY_NAMES_SI[category] || category;
  }
  return category;
}

export function getVendorName(vendor: string, lang: Language): string {
  if (lang === 'si') {
    if (PRODUCT_TRANSLATIONS_SI[vendor]?.vendor) {
      return PRODUCT_TRANSLATIONS_SI[vendor].vendor;
    }
    const map: { [key: string]: string } = {
      'Nordic Living Studio': 'නෝර්ඩික් ලිවින් ස්ටූඩියෝ',
      'Scandia Craft Line': 'ස්කැන්ඩියා ක්‍රාෆ්ට් ලයින්',
      'Prime Home Design': 'ප්‍රයිම් හෝම් ඩිසයින්',
      'Artisan Woodworks': 'ආර්ටිසන් වුඩ්වර්ක්ස්',
      'Direct Tech Industries': 'ඩිරෙක්ට් ටෙක් ඉන්ඩස්ට්‍රීස්',
      'Direct Tech Co.': 'ඩිරෙක්ට් ටෙක් සමාගම',
      'Pacific Linen Textiles': 'පැසිෆික් ලිනන් ටෙක්ස්ටයිල්ස්',
      'Audiophile Labs': 'ඕඩියෝෆිල් ලැබ්ස්',
      'Luminaire Lighting': 'ලුමිනෙයාර් ලයිටින්ග්',
      'Pure Organics': 'පියෝර් ඕගැනික්ස්',
      'Urban Gear Co': 'අර්බන් ගියර් කෝ',
      'Artisan Ceramics Co.': 'ආර්ටිසන් සෙරමික්ස් සමාගම',
      'Vitra Design Atelier': 'විට්‍රා ඩිසයින් ඇටලියර්',
      'Craft & Wood Furniture': 'ක්‍රාෆ්ට් සහ වුඩ් ෆර්නිචර්',
      'Safavieh Home': 'සෆාවියා හෝම්',
      'Anatolian Textiles': 'ඇනටෝලියන් ටෙක්ස්ටයිල්ස්',
      'Bella Modular Interiors': 'බෙලා මොඩියුලර් ඉන්ටීරියර්ස්',
      'Studio Glaze Kyoto': 'ස්ටූඩියෝ ග්ලේස් කියෝතෝ',
      'Slumber & Dream Textiles': 'ස්ලම්බර් ඇන්ඩ් ඩ්‍රීම් ටෙක්ස්ටයිල්ස්',
      'Botanical Home Elements': 'බොටැනිකල් හෝම් එලිමන්ට්ස්',
      'Heritage Luxury Furniture': 'හෙරිටේජ් සුඛෝපභෝගී ගෘහ භාණ්ඩ',
      'Acer Official Store': 'ඒසර් නිල වෙළඳසැල',
      'Acoustic Sound Labs': 'ඇකූස්ටික් සවුන්ඩ් ලැබ්ස්',
      'Chronos Digital Gear': 'ක්‍රෝනොස් ඩිජිටල් ගියර්',
      'OPPO Direct': 'ඔපෝ ඩිරෙක්ට්'
    };
    return map[vendor] || vendor;
  }
  return vendor;
}
