import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Heart,
  ArrowLeftRight,
  ShoppingCart,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Award,
  CheckCircle2,
  Building2,
  MessageSquare,
  Share2,
  Check,
  FileText,
  BadgePercent,
  Clock,
  Sparkles,
  Search,
  ThumbsUp,
  Pencil
} from 'lucide-react';
import { Currency, Language, Product } from '../../types/marketplace';
import { ProductImageRenderer } from '../Images/ProductImageRenderer';
import { ALL_PRODUCTS } from '../../data/products';
import { getCategoryName, getProductDescription, getProductName, getVendorName, t } from '../../i18n/translations';

interface ProductDetailsPageProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number, color?: string) => void;
  onBuyNow: (product: Product, quantity: number, color?: string) => void;
  onAddToWishlist: (product: Product) => void;
  onAddToCompare: (product: Product) => void;
  isInWishlist: boolean;
  isInCompare: boolean;
  currency: Currency;
  language?: Language;
  onSelectProduct: (product: Product) => void;
  onOpenB2BQuote: (product?: Product) => void;
  onOpenVendorModal: (vendorName?: string) => void;
  onOpenSupplierChat: (vendorName: string, productName?: string) => void;
  onOpenVendorStorefront: (vendorName: string) => void;
  onSelectCategory: (category: string) => void;
  onShare: (productName: string) => void;
  onEditProduct?: (product: Product) => void;
}

interface UserReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  likes: number;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  product,
  onBack,
  onAddToCart,
  onBuyNow,
  onAddToWishlist,
  onAddToCompare,
  isInWishlist,
  isInCompare,
  currency,
  language = 'en',
  onSelectProduct,
  onOpenB2BQuote,
  onOpenVendorModal,
  onOpenSupplierChat,
  onOpenVendorStorefront,
  onSelectCategory,
  onShare,
  onEditProduct
}) => {
  const [selectedAngle, setSelectedAngle] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || 'Default');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'vendor' | 'reviews' | 'shipping'>('specs');
  const [isZoomed, setIsZoomed] = useState(false);

  const displayName = getProductName(product, language);
  const displayDesc = getProductDescription(product, language);
  const displayCategory = getCategoryName(product.category, language);
  const displayVendor = getVendorName(product.vendor, language);

  // Reviews state with real-time add review form
  const [reviews, setReviews] = useState<UserReview[]>([
    {
      id: 'r1',
      author: 'Marcus Vance',
      location: 'Stockholm, Sweden',
      rating: 5,
      date: 'October 18, 2026',
      title: 'Exceptional craftsmanship & super fast freight!',
      comment: 'The build quality exceeded our commercial expectations. We ordered a sample of 2 units before placing a bulk procurement order of 25. The wood finishing is velvety smooth and packaging had zero defects.',
      verified: true,
      likes: 14
    },
    {
      id: 'r2',
      author: 'Elena Rostova',
      location: 'Milan, Italy',
      rating: 5,
      date: 'October 04, 2026',
      title: 'True Scandinavian aesthetic - matches photos 100%',
      comment: 'Ordered for our boutique design hotel lounge. Colors and fabric weave match the catalog photos perfectly. The supplier was responsive via B2B trade chat when clarifying export documentation.',
      verified: true,
      likes: 9
    },
    {
      id: 'r3',
      author: 'David Chen',
      location: 'Toronto, Canada',
      rating: 4,
      date: 'September 22, 2026',
      title: 'Solid value for money, assembly was straightforward',
      comment: 'Arrived within 5 business days via DHL Express. Very sturdy hardware, clear instructions. Would definitely order again from this verified vendor.',
      verified: true,
      likes: 6
    }
  ]);

  // New review form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const newRev: UserReview = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor.trim(),
      location: 'Verified Global Buyer',
      rating: newReviewRating,
      date: 'Just now',
      title: newReviewTitle.trim() || 'Great purchase!',
      comment: newReviewComment.trim(),
      verified: true,
      likes: 0
    };

    setReviews([newRev, ...reviews]);
    setNewReviewAuthor('');
    setNewReviewTitle('');
    setNewReviewComment('');
    setShowReviewForm(false);
  };

  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';
  const currencyRate = currency === 'USD' ? 1 : currency === 'EUR' ? 0.92 : 0.79;

  const currentPrice = product.price * currencyRate;
  const originalPrice = product.originalPrice ? product.originalPrice * currencyRate : null;
  const savingsAmount = originalPrice ? (originalPrice - currentPrice) : null;
  const savingsPercent = originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : product.discountPercent;

  // B2B Wholesale Tier Pricing Calculation
  const tier1Price = currentPrice;
  const tier2Price = currentPrice * 0.90; // 10% discount for 5-19 units
  const tier3Price = currentPrice * 0.80; // 20% discount for 20+ units

  // Active pricing based on selected quantity
  const activeUnitRate = quantity >= 20 ? tier3Price : quantity >= 5 ? tier2Price : tier1Price;
  const lineSubtotal = activeUnitRate * quantity;

  // Related products from the same or other categories
  const relatedProducts = ALL_PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.vendor === product.vendor)
  ).slice(0, 4);

  const fallbackRelated = relatedProducts.length < 4
    ? [...relatedProducts, ...ALL_PRODUCTS.filter(p => p.id !== product.id && !relatedProducts.some(r => r.id === p.id)).slice(0, 4 - relatedProducts.length)]
    : relatedProducts;

  // Image angle labels
  const angleThumbnails = [
    { label: 'Primary Angle', subtitle: 'Studio Full Shot' },
    { label: 'Ambient View', subtitle: 'Room Setup' },
    { label: 'Macro Texture', subtitle: 'Material Detail' },
    { label: 'Technical Spec', subtitle: 'Dimensions & Scale' }
  ];

  return (
    <div className="w-full pb-16 animate-in fade-in duration-200">
      {/* 1. Breadcrumbs & Back Bar */}
      <div className="bg-white border-b border-slate-200 mb-6 py-3 px-4 sm:px-6 rounded-sm shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-500 flex-wrap">
          <button
            onClick={onBack}
            className="flex items-center gap-1 font-bold text-slate-700 hover:text-[#ea580c] transition-colors cursor-pointer group font-display"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>{t('backToMarketplace', language)}</span>
          </button>
          <span className="text-slate-300">/</span>
          <span className="hover:text-slate-800 cursor-pointer" onClick={onBack}>{t('home', language)}</span>
          <span className="text-slate-300">/</span>
          <span
            className="hover:text-[#ea580c] cursor-pointer font-medium"
            onClick={() => onSelectCategory(product.category)}
            title={`View all products in ${displayCategory}`}
          >
            {displayCategory}
          </span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-semibold truncate max-w-xs sm:max-w-md font-sans">{displayName}</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-slate-400 font-mono-numbers text-[11px] hidden md:inline">SKU: MKT-{product.id.slice(0, 8).toUpperCase()}</span>
          {onEditProduct && (
            <button
              onClick={() => onEditProduct(product)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-orange-600 hover:text-white hover:bg-[#ea580c] border border-orange-200 bg-orange-50 rounded transition-colors cursor-pointer shadow-xs font-semibold text-[11px] font-display"
              title="Edit product details, taxonomy, specs, or pricing"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>{language === 'si' ? 'නිෂ්පාදනය සංස්කරණය' : 'Edit Product'}</span>
            </button>
          )}
          <button
            onClick={() => onShare(displayName)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-slate-600 hover:text-[#ea580c] hover:bg-orange-50 border border-slate-200 rounded transition-colors cursor-pointer"
            title="Share this product"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="font-semibold text-[11px] font-display">{t('share', language)}</span>
          </button>
        </div>
      </div>

      {/* 2. Main Product Grid: Gallery (Left), Product Buy Box (Center), Vendor & Trust Box (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visual Gallery (5 cols) */}
        <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-sm border border-slate-200 shadow-xs">
          {/* Main Visual Display */}
          <div className="relative w-full h-80 sm:h-96 bg-slate-50 rounded flex items-center justify-center overflow-hidden border border-slate-100 group">
            {/* Badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
              {savingsPercent && (
                <div className="bg-[#ea580c] text-white text-[11px] font-black px-2.5 py-1 rounded-sm shadow-xs uppercase tracking-wide flex items-center gap-1 font-mono-numbers">
                  <BadgePercent className="w-3.5 h-3.5" />
                  <span>{savingsPercent}% {t('off', language)}</span>
                </div>
              )}
              {product.isDailyDeal && (
                <div className="bg-[#0c1524] text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider flex items-center gap-1 shadow-xs font-display">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>{t('dailyDealBadge', language)}</span>
                </div>
              )}
            </div>

            {/* Main Image with Zoom Trigger */}
            <div
              onClick={() => setIsZoomed(!isZoomed)}
              className={`w-full h-full p-4 flex items-center justify-center cursor-zoom-in transition-transform duration-300 ${
                isZoomed ? 'scale-125' : 'group-hover:scale-105'
              }`}
            >
              <ProductImageRenderer name={product.imageUrl} className="max-w-full max-h-full object-contain" />
            </div>

            {/* Quick Zoom Hint Pill */}
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-slate-700 px-2.5 py-1 rounded text-[11px] font-medium shadow-sm flex items-center gap-1 cursor-pointer transition-colors font-display"
            >
              <Search className="w-3 h-3 text-slate-500" />
              <span>{isZoomed ? t('zoomOut', language) : t('clickToZoom', language)}</span>
            </button>
          </div>

          {/* Angle & Thumbnail strip */}
          <div className="grid grid-cols-4 gap-2 mt-3.5">
            {angleThumbnails.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedAngle(idx);
                  setIsZoomed(false);
                }}
                className={`p-1.5 rounded border transition-all text-left cursor-pointer flex flex-col items-center justify-center ${
                  selectedAngle === idx
                    ? 'border-[#ea580c] bg-orange-50/50 ring-1 ring-[#ea580c]'
                    : 'border-slate-200 bg-white hover:border-slate-400'
                }`}
              >
                <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
                  <ProductImageRenderer name={product.imageUrl} className="w-full h-full object-contain opacity-90" />
                </div>
                <span className="text-[10px] font-bold text-slate-700 mt-1 truncate w-full text-center font-display">
                  {item.label}
                </span>
                <span className="text-[8px] text-slate-400 truncate w-full text-center">
                  {item.subtitle}
                </span>
              </button>
            ))}
          </div>

          {/* Quick Assurance Strip below image */}
          <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-around text-slate-600 text-[11px]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{language === 'si' ? '100% අව්‍යාජයි' : '100% Genuine'}</span>
            </div>
            <div className="h-3 w-px bg-slate-200" />
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>{language === 'si' ? 'නැව්ගත කිරීම' : 'Tracked Delivery'}</span>
            </div>
            <div className="h-3 w-px bg-slate-200" />
            <div className="flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-[#ea580c]" />
              <span>{t('returnsDetail', language)}</span>
            </div>
          </div>
        </div>

        {/* Center Column: Product Buy Box & Trading Terms (4 cols) */}
        <div className="lg:col-span-4 bg-white p-4 sm:p-5 rounded-sm border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            {/* Category & Verified Vendor Tag */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-bold text-[#ea580c] uppercase tracking-wider font-display">
                {displayCategory}
              </span>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{t('verifiedStock', language)}</span>
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug font-display tracking-tight">
              {displayName}
            </h1>

            {/* Star Rating & Sold Stats */}
            <div className="flex items-center gap-2 mt-2 pb-3 border-b border-slate-100 text-xs">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating || 5)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-slate-700 font-mono-numbers">{product.rating.toFixed(1)}</span>
              <span className="text-slate-400">({product.reviewsCount || reviews.length} {t('customerReviews', language)})</span>
              <span className="text-slate-300">|</span>
              <span className="text-emerald-600 font-semibold font-mono-numbers">{product.sold || 48}+ {t('ordersSold', language)}</span>
            </div>

            {/* Pricing Section */}
            <div className="bg-slate-50/80 p-3 rounded mt-3 border border-slate-100">
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl sm:text-3xl font-black text-[#ea580c] font-mono-numbers">
                  {currencySymbol}{activeUnitRate.toFixed(2)}
                </span>
                {originalPrice && (
                  <span className="text-slate-400 line-through text-sm font-mono-numbers">
                    {currencySymbol}{originalPrice.toFixed(2)}
                  </span>
                )}
                {savingsAmount && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded font-mono-numbers">
                    {language === 'si' ? 'ඉතිරිය' : 'Save'} {currencySymbol}{savingsAmount.toFixed(2)} ({savingsPercent}%)
                  </span>
                )}
              </div>

              {/* B2B Wholesale Quantity Tier Price Table */}
              <div className="mt-3 pt-2.5 border-t border-slate-200 text-xs">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5 flex items-center justify-between font-display">
                  <span>{language === 'si' ? 'තොග B2B මිල ගණන් (තෝරාගැනීමට ක්ලික් කරන්න)' : 'Wholesale B2B Tier Pricing (Click to select)'}</span>
                  <span className="text-[#ea580c] font-semibold">{language === 'si' ? 'අවම ඇණවුම: කෑලි 1' : 'Min. Order: 1 pc'}</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center font-mono-numbers">
                  <button
                    type="button"
                    onClick={() => setQuantity(1)}
                    className={`p-1.5 rounded border transition-all cursor-pointer ${
                      quantity < 5
                        ? 'bg-orange-50 border-[#ea580c] font-bold text-[#ea580c] ring-1 ring-[#ea580c]'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-[10px] text-slate-400 font-sans">{language === 'si' ? 'කෑලි 1 - 4' : '1 - 4 pcs'}</div>
                    <div className="text-xs font-bold">{currencySymbol}{tier1Price.toFixed(2)}</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuantity(5)}
                    className={`p-1.5 rounded border transition-all cursor-pointer ${
                      quantity >= 5 && quantity < 20
                        ? 'bg-orange-50 border-[#ea580c] font-bold text-[#ea580c] ring-1 ring-[#ea580c]'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-[10px] text-slate-400 font-sans">{language === 'si' ? 'කෑලි 5 - 19 (-10%)' : '5 - 19 pcs (-10%)'}</div>
                    <div className="text-xs font-bold">{currencySymbol}{tier2Price.toFixed(2)}</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuantity(20)}
                    className={`p-1.5 rounded border transition-all cursor-pointer ${
                      quantity >= 20
                        ? 'bg-orange-50 border-[#ea580c] font-bold text-[#ea580c] ring-1 ring-[#ea580c]'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-[10px] text-slate-400 font-sans">{language === 'si' ? 'කෑලි 20+ (-20%)' : '20+ pcs (-20%)'}</div>
                    <div className="text-xs font-bold">{currencySymbol}{tier3Price.toFixed(2)}</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Color Swatch Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-500 font-semibold">{language === 'si' ? 'තෝරාගත් නිමාව / වර්ණය:' : 'Selected Finish / Color:'}</span>
                  <span className="font-bold text-slate-800">{selectedColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'border-[#ea580c] bg-orange-50 text-[#ea580c] font-bold shadow-xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-[#ea580c]" />}
                        <span>{color}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Subtotal */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-500 font-semibold">{language === 'si' ? 'මිලදී ගැනීමේ ප්‍රමාණය:' : 'Purchase Quantity:'}</span>
                <span className="text-slate-700 font-mono-numbers text-xs">
                  {t('subtotal', language)}: <strong className="text-slate-900 font-bold">{currencySymbol}{lineSubtotal.toFixed(2)}</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-300 rounded overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-9 h-9 flex items-center justify-center bg-slate-50 hover:bg-slate-100 disabled:opacity-40 text-slate-700 font-bold transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock || 99}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-14 h-9 text-center font-bold font-mono-numbers text-sm border-x border-slate-300 focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <div className="text-[11px] text-slate-500 flex flex-col">
                  <span className="font-medium text-emerald-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {language === 'si' ? `ලබා ගත හැක: ගබඩාවේ ඒකක ${product.stock || 20} ක් ඇත` : `Available: ${product.stock || 20} units in warehouse`}
                  </span>
                  <span className="text-slate-400">{language === 'si' ? 'පැය 24ක් තුළ බෙදා හැරීමට සූදානම්' : 'Ready to dispatch in 24 hours'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons: Add to Cart, Buy Now, B2B Quote */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onAddToCart(product, quantity, selectedColor)}
                className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white py-3 px-3 rounded font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98 font-display"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{t('addToCart', language)}</span>
              </button>
              <button
                onClick={() => onBuyNow(product, quantity, selectedColor)}
                className="w-full bg-[#0c1524] hover:bg-[#111d2e] text-white py-3 px-3 rounded font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98 font-display"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>{t('buyNow', language)}</span>
              </button>
            </div>

            {/* B2B Quote & Secondary Action bar */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenB2BQuote(product)}
                className="flex-1 border border-[#ea580c] text-[#ea580c] hover:bg-orange-50 py-2 px-3 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer font-display"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{language === 'si' ? 'B2B මිල ගණන් ඉල්ලන්න' : 'Request B2B Quote'}</span>
              </button>
              <button
                onClick={() => onAddToWishlist(product)}
                className={`p-2 border rounded transition-colors cursor-pointer flex items-center justify-center ${
                  isInWishlist
                    ? 'border-red-400 bg-red-50 text-red-500'
                    : 'border-slate-200 hover:border-slate-400 text-slate-600'
                }`}
                title={isInWishlist ? (language === 'si' ? 'පැතුම් ලැයිස්තුවේ ඇත' : 'In your wishlist') : (language === 'si' ? 'පැතුම් ලැයිස්තුවට එක් කරන්න' : 'Save to wishlist')}
              >
                <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-red-500' : ''}`} />
              </button>
              <button
                onClick={() => onAddToCompare(product)}
                className={`p-2 border rounded transition-colors cursor-pointer flex items-center justify-center ${
                  isInCompare
                    ? 'border-[#ea580c] bg-orange-50 text-[#ea580c]'
                    : 'border-slate-200 hover:border-slate-400 text-slate-600'
                }`}
                title={isInCompare ? (language === 'si' ? 'සංසන්දන ලැයිස්තුවේ ඇත' : 'In compare list') : (language === 'si' ? 'සංසන්දනයට එක් කරන්න' : 'Add to compare')}
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Vendor Supplier Card & Buyer Assurance (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Supplier Profile Card */}
          <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-display">
                {language === 'si' ? 'සැපයුම්කරු විස්තරය' : 'Supplier Profile'}
              </span>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 font-display">
                <Award className="w-3 h-3 text-amber-600" />
                <span>{language === 'si' ? 'රන් සැපයුම්කරු (වසර 5)' : 'Gold Supplier 5Y'}</span>
              </span>
            </div>

            <div className="mt-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5 font-display">
                <Building2 className="w-4 h-4 text-[#ea580c]" />
                <span>{displayVendor}</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                {language === 'si' ? 'තහවුරු කළ ගෝලීය නිෂ්පාදක සහ අපනයනකරු' : 'Verified Global Manufacturer & Exporter'}
              </p>

              {/* Vendor Performance Metrics */}
              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
                <div className="bg-slate-50 p-2 rounded">
                  <div className="text-[10px] text-slate-400 font-display">{language === 'si' ? 'ප්‍රතිචාර අනුපාතය' : 'Response Rate'}</div>
                  <div className="font-bold text-emerald-600 font-mono-numbers">98.6%</div>
                </div>
                <div className="bg-slate-50 p-2 rounded">
                  <div className="text-[10px] text-slate-400 font-display">{language === 'si' ? 'නියමිත වේලාවට බෙදාහැරීම' : 'On-Time Delivery'}</div>
                  <div className="font-bold text-emerald-600 font-mono-numbers">99.2%</div>
                </div>
              </div>

              {/* Vendor Actions */}
              <div className="flex flex-col gap-2 mt-3">
                <button
                  onClick={() => onOpenSupplierChat(product.vendor || 'Nordic Living Studio', product.name)}
                  className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white py-2 px-3 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95 font-display"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-white" />
                  <span>{language === 'si' ? 'සැපයුම්කරු සමඟ කතාබස්' : 'Chat with Supplier'}</span>
                </button>
                <button
                  onClick={() => onOpenVendorStorefront(product.vendor || 'Nordic Living Studio')}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-1.5 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200 font-display"
                >
                  <span>{language === 'si' ? 'සැපයුම්කරුගේ සාප්පුව බලන්න' : 'Visit Supplier Storefront'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Trade Assurance & Buyer Guarantees */}
          <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 pb-2 border-b border-slate-100 font-display">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{language === 'si' ? 'වෙළඳ සහතික ඇපකරය' : 'Trade Assurance Guarantee'}</span>
            </h4>
            <div className="flex flex-col gap-3 mt-3 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block text-[11px] font-display">{language === 'si' ? 'Escrow ගෙවීම් ආරක්ෂණය' : 'Escrow Payment Protection'}</strong>
                  <span className="text-[11px] text-slate-500">{language === 'si' ? 'භාණ්ඩ ලැබීම සහ පරීක්ෂාව තහවුරු කළ පසු පමණක් මුදල් ලබා දේ.' : 'Funds released only after confirmed receipt & inspection.'}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block text-[11px] font-display">{language === 'si' ? 'නොමිලේ බෙදාහැරීම ($49.89 ට වැඩි)' : 'Free Shipping Over $49.89'}</strong>
                  <span className="text-[11px] text-slate-500">{language === 'si' ? 'ගෝලීය ගුවන් හා ගොඩබිම් ලුහුබැඳිය හැකි ප්‍රවාහන සේවා.' : 'Global tracked air & ground shipping options.'}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <RotateCcw className="w-4 h-4 text-[#ea580c] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block text-[11px] font-display">{language === 'si' ? 'දින 30ක පහසු ආපසු ලබාදීම' : '30-Day Hassle-Free Returns'}</strong>
                  <span className="text-[11px] text-slate-500">{language === 'si' ? 'විස්තරයට අනුකූල නොවේ නම් හෝ හානි වී ඇත්නම් සම්පූර්ණ මුදල් ආපසු ගෙවීම.' : 'Full refund if item is not as described or damaged.'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Tabbed Information Section (Specifications, Vendor Profile, Reviews, Shipping) */}
      <div className="mt-8 bg-white border border-slate-200 rounded-sm shadow-xs overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 overflow-x-auto text-xs font-bold uppercase tracking-wider font-display">
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-5 py-3.5 transition-colors cursor-pointer border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'specs'
                ? 'border-[#ea580c] bg-white text-[#ea580c]'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{language === 'si' ? 'තාක්ෂණික විස්තර සහ දත්ත' : 'Specifications & Details'}</span>
          </button>
          <button
            onClick={() => setActiveTab('vendor')}
            className={`px-5 py-3.5 transition-colors cursor-pointer border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'vendor'
                ? 'border-[#ea580c] bg-white text-[#ea580c]'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>{language === 'si' ? 'සැපයුම්කරු සහ කර්මාන්තශාලා තොරතුරු' : 'Supplier & Factory Profile'}</span>
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-5 py-3.5 transition-colors cursor-pointer border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'border-[#ea580c] bg-white text-[#ea580c]'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>{language === 'si' ? `පාරිභෝගික සමාලෝචන (${reviews.length})` : `Buyer Reviews (${reviews.length})`}</span>
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-5 py-3.5 transition-colors cursor-pointer border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'shipping'
                ? 'border-[#ea580c] bg-white text-[#ea580c]'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>{language === 'si' ? 'නැව්ගත කිරීම සහ ගෙවීම් කොන්දේසි' : 'Shipping & Escrow Terms'}</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="p-6">
          {/* Tab 1: Specifications & Details */}
          {activeTab === 'specs' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2 font-display">
                  {language === 'si' ? 'නිෂ්පාදන සමාලෝචනය' : 'Product Overview'}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed max-w-4xl">
                  {displayDesc} {language === 'si'
                    ? 'දැඩි නේවාසික සහ වාණිජ වෙළඳ අවශ්‍යතා සඳහාම විශේෂයෙන් සකසා ඇති මෙම උසස් නිෂ්පාදනය නවීන ergonomics සහ සදාකාලික නිර්මාණ සෞන්දර්යය විදහා දක්වයි. තිරසාර ලෙස ලබාගත් උසස් අමුද්‍රව්‍ය වලින් නිපදවා ඇති අතර ගෝලීය පාරිසරික හා ආරක්ෂක ප්‍රමිතීන්ට අනුකූල වේ.'
                    : 'Engineered specifically for rigorous residential and commercial trading requirements, this premium item exemplifies contemporary ergonomics and timeless design aesthetics. Fabricated with sustainably sourced components and compliant with global environmental and safety standards.'}
                </p>
              </div>

              {/* Key Highlights Checklist */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 font-display">
                  {language === 'si' ? 'ප්‍රධාන විශේෂාංග සහ ගුණාත්මකභාවය' : 'Key Highlights & Quality Points'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{language === 'si' ? 'වාණිජ මට්ටමේ කල්පැවැත්ම සහතික කර ඇත' : 'Commercial Grade Durability Certified'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{language === 'si' ? 'නිරවද්‍ය CNC ඉංජිනේරු නිමාව' : 'Precision CNC Engineered Tolerances'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{language === 'si' ? 'හානිකර VOCs නොමැති පරිසර හිතකාමී නිමාව' : 'Zero Harmful VOCs / Eco-Friendly Finish'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{language === 'si' ? 'සීරීම් ප්‍රතිරෝධී බහු ස්ථර ආරක්ෂිත ආලේපනය' : 'Multi-Layer Anti-Scratch Protective Coat'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{language === 'si' ? 'ජාත්‍යන්තර අපනයනයට සුදුසු ඇසුරුම්' : 'International Export Ready Packaging'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{language === 'si' ? 'අභිරුචි OEM / පෞද්ගලික ලේබල් පහසුකම' : 'Custom OEM / Private Label Available'}</span>
                  </div>
                </div>
              </div>

              {/* Detailed Technical Specifications Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 font-display">
                  {language === 'si' ? 'තාක්ෂණික පිරිවිතර' : 'Technical Specifications'}
                </h4>
                <div className="border border-slate-200 rounded overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <tbody>
                      <tr className="border-b border-slate-100 bg-slate-50/50">
                        <td className="py-2.5 px-4 font-semibold text-slate-600 w-1/3">{language === 'si' ? 'කාණ්ඩය' : 'Category'}</td>
                        <td className="py-2.5 px-4 text-slate-800">{displayCategory}</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-2.5 px-4 font-semibold text-slate-600">{language === 'si' ? 'ආකෘතිය / SKU' : 'Model / SKU'}</td>
                        <td className="py-2.5 px-4 text-slate-800 font-mono">MKT-{product.id.toUpperCase()}</td>
                      </tr>
                      <tr className="border-b border-slate-100 bg-slate-50/50">
                        <td className="py-2.5 px-4 font-semibold text-slate-600">{language === 'si' ? 'බලයලත් සැපයුම්කරු' : 'Authorized Supplier'}</td>
                        <td className="py-2.5 px-4 text-slate-800">{displayVendor}</td>
                      </tr>
                      {product.specs &&
                        Object.entries(product.specs).map(([k, v], idx) => (
                          <tr key={k} className={`border-b border-slate-100 ${idx % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                            <td className="py-2.5 px-4 font-semibold text-slate-600">{k}</td>
                            <td className="py-2.5 px-4 text-slate-800">{v}</td>
                          </tr>
                        ))}
                      <tr className="border-b border-slate-100 bg-slate-50/50">
                        <td className="py-2.5 px-4 font-semibold text-slate-600">{language === 'si' ? 'ප්‍රමිති සහ සහතික' : 'Compliance & Certifications'}</td>
                        <td className="py-2.5 px-4 text-slate-800">ISO 9001, CE Mark, RoHS Compliant, FSC Certified</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-slate-600">{language === 'si' ? 'සම්මත වගකීම' : 'Standard Warranty'}</td>
                        <td className="py-2.5 px-4 text-slate-800">{language === 'si' ? 'වසර 2ක සම්පූර්ණ නිෂ්පාදක ප්‍රතිස්ථාපන වගකීම' : '2-Year Comprehensive Manufacturer Replacement Warranty'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Supplier & Factory Profile */}
          {activeTab === 'vendor' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-orange-100 text-[#ea580c] flex items-center justify-center font-black text-xl">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 font-display">{displayVendor}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>{language === 'si' ? 'රන් සැපයුම්කරු (වසර 5)' : 'Gold Supplier (5 Years)'}</span>
                      <span>•</span>
                      <span className="text-emerald-600 font-semibold">{language === 'si' ? 'ස්ථානීය විගණනය කළ කර්මාන්ත ශාලාව' : 'On-site Audited Factory'}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onOpenSupplierChat(product.vendor || 'Nordic Living Studio', product.name)}
                  className="px-4 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer font-display"
                >
                  {language === 'si' ? 'විමසීම් සඳහා සැපයුම්කරු අමතන්න' : 'Contact Supplier for Inquiry'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-400 block mb-1">{language === 'si' ? 'ව්‍යාපාර වර්ගය' : 'Business Type'}</span>
                  <span className="font-bold text-slate-800 text-sm">{language === 'si' ? 'නිෂ්පාදක, වෙළඳ සමාගම' : 'Manufacturer, Trading Company'}</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-400 block mb-1">{language === 'si' ? 'වාර්ෂික සමස්ත ආදායම' : 'Total Annual Revenue'}</span>
                  <span className="font-bold text-slate-800 text-sm">US $25 Million - $50 Million</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-400 block mb-1">{language === 'si' ? 'ප්‍රධාන අපනයන වෙළඳපොලවල්' : 'Main Export Markets'}</span>
                  <span className="font-bold text-slate-800 text-sm">{language === 'si' ? 'උතුරු ඇමරිකාව, යුරෝපය, ඕස්ට්‍රේලියාව' : 'North America, Europe, Australia'}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'si'
                  ? `නවීන වර්ග මීටර් 18,000 ක ස්වයංක්‍රීය නිෂ්පාදන පහසුකමක් පවත්වාගෙන යන ${displayVendor}, නිරවද්‍ය නිෂ්පාදනය, B2B තොග සැපයුම සහ අභිරුචිකරණය කළ OEM/ODM ඇණවුම් සඳහා විශේෂඥ වේ. සියලුම නැව්ගත කිරීම් 100% පූර්ව-නැව්ගත කිරීමේ තත්ත්ව පරීක්ෂාවකට භාජනය වන අතර Trade Assurance Escrow ගෙවීම් ආරක්ෂණය මගින් ආවරණය කර ඇත.`
                  : `Operating a modern 18,000 m² automated production facility, ${displayVendor} specializes in precision manufacture, B2B wholesale supply, and turnkey OEM/ODM customized orders. All consignments undergo 100% pre-shipment quality inspection and are backed by Trade Assurance Escrow payment protection.`}
              </p>
            </div>
          )}

          {/* Tab 3: Buyer Reviews & Interactive Add Review Form */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Rating Summary Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-4 bg-slate-50 rounded border border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-4xl font-black text-slate-900 font-mono">
                      {product.rating.toFixed(1)}
                    </div>
                    <div className="flex text-amber-400 justify-center my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 font-sans">
                      {language === 'si' ? `සමාලෝචන ${reviews.length} ක් මත පදනම්ව` : `Based on ${reviews.length} reviews`}
                    </span>
                  </div>
                  <div className="h-14 w-px bg-slate-200 hidden sm:block" />
                  <div className="text-xs text-slate-600">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-12 text-slate-500 font-sans">{language === 'si' ? 'තරු 5' : '5 Stars'}</span>
                      <div className="w-32 bg-slate-200 rounded-full h-2">
                        <div className="bg-amber-400 h-2 rounded-full w-[85%]" />
                      </div>
                      <span className="text-slate-400 text-[11px] font-mono-numbers">85%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-12 text-slate-500 font-sans">{language === 'si' ? 'තරු 4' : '4 Stars'}</span>
                      <div className="w-32 bg-slate-200 rounded-full h-2">
                        <div className="bg-amber-400 h-2 rounded-full w-[15%]" />
                      </div>
                      <span className="text-slate-400 text-[11px] font-mono-numbers">15%</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-4 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer font-display"
                >
                  {showReviewForm
                    ? (language === 'si' ? 'අවලංගු කරන්න' : 'Cancel Review')
                    : (language === 'si' ? 'සමාලෝචනයක් ලියන්න' : 'Write a Customer Review')}
                </button>
              </div>

              {/* Review Submission Form */}
              {showReviewForm && (
                <form onSubmit={handleAddReview} className="p-4 bg-orange-50/50 border border-orange-200 rounded space-y-3 animate-in fade-in duration-150">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 font-display">
                    {language === 'si' ? 'මෙම භාණ්ඩය පිළිබඳ ඔබේ අත්දැකීම බෙදාගන්න' : 'Share your experience with this item'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1 font-sans">
                        {language === 'si' ? 'ඔබේ සම්පූර්ණ නම' : 'Your Full Name'}
                      </label>
                      <input
                        type="text"
                        required
                        value={newReviewAuthor}
                        onChange={(e) => setNewReviewAuthor(e.target.value)}
                        placeholder={language === 'si' ? 'උදා: සුනිල් ප්‍රනාන්දු' : 'e.g. Sarah Jenkins'}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:border-[#ea580c]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1 font-sans">
                        {language === 'si' ? 'තරු අගය කිරීම' : 'Star Rating'}
                      </label>
                      <div className="flex items-center gap-1.5 py-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setNewReviewRating(s)}
                            className="cursor-pointer"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                s <= newReviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-bold text-slate-700 ml-2 font-mono-numbers">
                          {newReviewRating} / 5 {language === 'si' ? 'තරු' : 'Stars'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1 font-sans">
                      {language === 'si' ? 'සමාලෝචන මාතෘකාව' : 'Review Headline'}
                    </label>
                    <input
                      type="text"
                      value={newReviewTitle}
                      onChange={(e) => setNewReviewTitle(e.target.value)}
                      placeholder={language === 'si' ? 'උදා: විශිෂ්ට තත්ත්වයේ නිෂ්පාදනයක්' : 'e.g. Outstanding quality, perfect for our project'}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:border-[#ea580c]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1 font-sans">
                      {language === 'si' ? 'ඔබේ අදහස්' : 'Your Review'}
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder={language === 'si' ? 'බෙදාහැරීම, ඇසුරුම් සහ ගුණාත්මකභාවය පිළිබඳ ඔබේ අදහස් ලියන්න...' : 'Write your feedback regarding delivery, packaging, material authenticity...'}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:border-[#ea580c]"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer font-display"
                    >
                      {language === 'si' ? 'සමාලෝචනය පළ කරන්න' : 'Post Customer Review'}
                    </button>
                  </div>
                </form>
              )}

              {/* Review Cards */}
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 border border-slate-100 rounded bg-white shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 font-display">{rev.author}</span>
                        {rev.verified && (
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>{language === 'si' ? 'තහවුරු කළ ගැනුම්කරු' : 'Verified Buyer'}</span>
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">{rev.location}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono-numbers">{rev.date}</span>
                    </div>

                    <div className="flex text-amber-400 my-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>

                    <h5 className="font-bold text-xs text-slate-800 mb-1">{rev.title}</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>

                    <div className="mt-3 pt-2 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400">
                      <button
                        onClick={() => {
                          setReviews(reviews.map(r => r.id === rev.id ? { ...r, likes: r.likes + 1 } : r));
                        }}
                        className="flex items-center gap-1 hover:text-slate-700 cursor-pointer font-mono-numbers"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{language === 'si' ? `ප්‍රයෝජනවත් (${rev.likes})` : `Helpful (${rev.likes})`}</span>
                      </button>
                      <span>{language === 'si' ? 'Escrow මගින් තහවුරු කළ ගනුදෙනුවක්' : 'Trading Escrow Verified Transaction'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Shipping & Escrow Terms */}
          {activeTab === 'shipping' && (
            <div className="space-y-4 text-xs text-slate-600">
              <h3 className="text-base font-bold text-slate-900 font-display">
                {language === 'si' ? 'ප්‍රවාහන, රේගු සහ Escrow ආරක්ෂණ ප්‍රතිපත්තිය' : 'Logistics, Customs & Escrow Protection Policy'}
              </h3>
              <p className="leading-relaxed">
                {language === 'si'
                  ? 'Market Multi Trading Marketplace අපගේ අනුමත ජාත්‍යන්තර ප්‍රවාහකයන් හරහා ආරක්ෂිත ගෝලීය බෙදාහැරීම සහතික කරයි. ඇණවුම සූදානම් කළ පැය 24ක් ඇතුළත සියලුම ඇණවුම් සඳහා සජීවී ලුහුබැඳීමේ අංක (Tracking Number) ලබා දෙනු ඇත.'
                  : 'Market Multi Trading Marketplace guarantees safe global delivery through our network of vetted freight forwarders and regional couriers. All orders are assigned real-time tracking numbers within 24 hours of fulfillment.'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-3">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <strong className="block text-slate-800 font-bold mb-1 font-display">
                    {language === 'si' ? 'වේගවත් ගුවන් කුරියර් (Express Air)' : 'Express Air Courier'}
                  </strong>
                  <p className="text-slate-500">
                    {language === 'si' ? 'DHL / FedEx Express: ලොව පුරා වැඩ කරන දින 3 - 5 තුළ නිවසටම.' : 'DHL / FedEx Express: 3 - 5 business days door-to-door worldwide.'}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <strong className="block text-slate-800 font-bold mb-1 font-display">
                    {language === 'si' ? 'සම්මත ගුවන් භාණ්ඩ ප්‍රවාහනය' : 'Standard Air Cargo'}
                  </strong>
                  <p className="text-slate-500">
                    {language === 'si' ? 'වාණිජ ගුවන් භාණ්ඩ: රේගු නිෂ්කාශන සහාය සමඟ වැඩ කරන දින 7 - 10.' : 'Commercial air freight: 7 - 10 business days with customs clearance assistance.'}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <strong className="block text-slate-800 font-bold mb-1 font-display">
                    {language === 'si' ? 'මුහුදු භාණ්ඩ කන්ටේනර් (FCL/LCL)' : 'Sea Freight Container (FCL/LCL)'}
                  </strong>
                  <p className="text-slate-500">
                    {language === 'si' ? 'ආර්ථික තොග නැව්ගත කිරීම: තොග ඇණවුම් සඳහා වැඩ කරන දින 18 - 28.' : 'Economical wholesale shipping: 18 - 28 business days for bulk orders.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Related Products / Frequently Bought Together Section */}
      <div className="mt-10">
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-[#0c1524] text-white px-3 py-1 text-xs font-black uppercase tracking-wider rounded-xs font-display">
              {language === 'si' ? 'සම්බන්ධිත භාණ්ඩ' : 'RELATED ITEMS'}
            </div>
            <span className="text-xs text-slate-500 font-semibold font-sans">
              {language === 'si' ? 'මෙය නැරඹූ පාරිභෝගිකයින් මේවාද සලකා බලා ඇත' : 'Customers who viewed this also considered'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {fallbackRelated.map((relProduct) => {
            const relPrice = (relProduct.price * currencyRate).toFixed(2);
            const relOriginal = relProduct.originalPrice
              ? (relProduct.originalPrice * currencyRate).toFixed(2)
              : null;
            const relName = getProductName(relProduct, language);
            const relVendor = getVendorName(relProduct.vendor, language);

            return (
              <div
                key={relProduct.id}
                className="bg-white border border-slate-200 rounded-sm p-3 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group cursor-pointer"
                onClick={() => {
                  onSelectProduct(relProduct);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <div className="relative w-full h-44 bg-slate-50 rounded flex items-center justify-center overflow-hidden mb-2">
                  <div className="w-32 h-32 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <ProductImageRenderer name={relProduct.imageUrl} className="w-full h-full object-contain" />
                  </div>
                  {relProduct.discountPercent && (
                    <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[#ea580c] text-white flex items-center justify-center font-bold text-[10px] shadow font-mono-numbers">
                      {relProduct.discountPercent}%
                    </div>
                  )}
                </div>

                <div className="text-center pt-1">
                  <div className="flex items-center justify-center gap-1.5 mb-1 font-mono-numbers">
                    {relOriginal && (
                      <span className="text-slate-400 line-through text-[11px]">
                        {currencySymbol}{relOriginal}
                      </span>
                    )}
                    <span className="text-[#ea580c] font-black text-xs">
                      {currencySymbol}{relPrice}
                    </span>
                  </div>
                  <h4 className="text-[11px] text-slate-700 group-hover:text-[#ea580c] font-medium line-clamp-2 leading-tight transition-colors">
                    {relName}
                  </h4>
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-center gap-1 text-[10px] text-slate-400 font-sans">
                    <span>{relVendor}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
