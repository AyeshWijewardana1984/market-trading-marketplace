import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Eye, Heart, ArrowLeftRight, ShoppingCart } from 'lucide-react';
import { DAILY_DEALS } from '../../data/products';
import { Currency, Language, Product } from '../../types/marketplace';
import { ProductImageRenderer } from '../Images/ProductImageRenderer';
import { getProductName, t } from '../../i18n/translations';

interface DailyDealsSectionProps {
  currency: Currency;
  language?: Language;
  products?: Product[];
  onSelectProduct: (product: Product) => void;
  onOpenProductPage?: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  onAddToCompare: (product: Product) => void;
}

export const DailyDealsSection: React.FC<DailyDealsSectionProps> = ({
  currency,
  language = 'en',
  products,
  onSelectProduct,
  onOpenProductPage,
  onAddToCart,
  onAddToWishlist,
  onAddToCompare,
}) => {
  // Live ticking countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 12,
    hours: 48,
    minutes: 59,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';
  const currencyRate = currency === 'USD' ? 1 : currency === 'EUR' ? 0.92 : 0.79;

  const [dealPage, setDealPage] = useState(0);

  // Compute daily deals from dynamic products if available
  const activeDailyDeals = React.useMemo(() => {
    if (products && products.length > 0) {
      const markedDeals = products.filter((p) => p.isDailyDeal);
      if (markedDeals.length > 0) return markedDeals;
    }
    return DAILY_DEALS;
  }, [products]);

  const dealsPerPage = 2;
  const totalPages = Math.max(1, Math.ceil(activeDailyDeals.length / dealsPerPage));
  const currentDeals = activeDailyDeals.slice(dealPage * dealsPerPage, (dealPage + 1) * dealsPerPage);

  const handlePrevDeals = () => {
    setDealPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleNextDeals = () => {
    setDealPage((prev) => (prev + 1) % totalPages);
  };

  return (
    <div className="mt-7">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b-2 border-[#0c1524] pb-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-[#0c1524] text-white px-3 py-1 text-xs font-black uppercase tracking-wider rounded-xs font-display">
            {t('dailyDealsTitle', language)}
          </div>
          <span className="text-[10px] font-mono-numbers text-slate-500 font-bold hidden sm:inline">
            {language === 'si' ? `පිටුව ${dealPage + 1} / ${totalPages}` : `Page ${dealPage + 1} of ${totalPages}`}
          </span>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrevDeals}
            className="w-7 h-7 rounded-full border border-slate-300 text-slate-700 hover:border-[#ea580c] hover:text-[#ea580c] hover:bg-orange-50 flex items-center justify-center transition-colors cursor-pointer"
            title="Previous deal pair"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextDeals}
            className="w-7 h-7 rounded-full border border-slate-300 text-slate-700 hover:border-[#ea580c] hover:text-[#ea580c] hover:bg-orange-50 flex items-center justify-center transition-colors cursor-pointer"
            title="Next deal pair"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2 Deal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentDeals.map((deal) => {
          const formattedPrice = (deal.price * currencyRate).toFixed(2);
          const formattedOriginal = deal.originalPrice
            ? (deal.originalPrice * currencyRate).toFixed(2)
            : null;

          const totalStock = (deal.stock || 20) + (deal.sold || 28);
          const soldPercent = Math.round(((deal.sold || 28) / totalStock) * 100);
          const productName = getProductName(deal, language);

          return (
            <div
              key={deal.id}
              className="bg-white border border-slate-200/90 rounded-sm p-4 hover:shadow-md transition-shadow relative group flex flex-col justify-between"
            >
              {/* Product Visual Container */}
              <div
                onClick={() => (onOpenProductPage || onSelectProduct)(deal)}
                className="relative w-full h-56 bg-slate-50/70 rounded flex items-center justify-center overflow-hidden mb-3 cursor-pointer group/img"
              >
                <div className="w-48 h-48 flex items-center justify-center group-hover/img:scale-105 transition-transform duration-300">
                  <ProductImageRenderer name={deal.imageUrl} className="w-full h-full object-contain" />
                </div>

                {/* Discount Badge */}
                {deal.discountPercent && (
                  <div className="absolute top-2.5 right-2.5 w-10 h-10 rounded-full bg-[#ef4444] text-white flex items-center justify-center font-extrabold text-[11px] shadow font-mono-numbers">
                    {deal.discountPercent}%
                  </div>
                )}

                {/* Hover Action Overlay Toolbar */}
                <div
                  className="absolute bottom-2 inset-x-0 flex items-center justify-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 z-20"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onSelectProduct(deal)}
                    className="w-8 h-8 rounded bg-white hover:bg-[#ea580c] hover:text-white text-slate-700 shadow-md flex items-center justify-center transition-colors cursor-pointer"
                    title={t('quickView', language)}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onAddToWishlist(deal)}
                    className="w-8 h-8 rounded bg-white hover:bg-[#ea580c] hover:text-white text-slate-700 shadow-md flex items-center justify-center transition-colors cursor-pointer"
                    title={t('saveToWishlist', language)}
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onAddToCompare(deal)}
                    className="w-8 h-8 rounded bg-white hover:bg-[#ea580c] hover:text-white text-slate-700 shadow-md flex items-center justify-center transition-colors cursor-pointer"
                    title={t('compare', language)}
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Deal Details & Countdown */}
              <div>
                <div className="text-center mb-3">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1 font-display">
                    {t('dealEndsIn', language)}
                  </span>
                  {/* Countdown Blocks */}
                  <div className="flex items-center justify-center gap-1.5 font-mono-numbers text-xs">
                    <div className="bg-[#0c1524] text-white px-2 py-1 rounded shadow-xs text-center min-w-[34px]">
                      <span className="font-extrabold block text-sm leading-none">{timeLeft.days}</span>
                      <span className="text-[8px] text-slate-300 uppercase block mt-0.5 leading-none">{t('days', language)}</span>
                    </div>
                    <span className="text-slate-400 font-bold">:</span>
                    <div className="bg-[#0c1524] text-white px-2 py-1 rounded shadow-xs text-center min-w-[34px]">
                      <span className="font-extrabold block text-sm leading-none">{timeLeft.hours}</span>
                      <span className="text-[8px] text-slate-300 uppercase block mt-0.5 leading-none">{t('hours', language)}</span>
                    </div>
                    <span className="text-slate-400 font-bold">:</span>
                    <div className="bg-[#0c1524] text-white px-2 py-1 rounded shadow-xs text-center min-w-[34px]">
                      <span className="font-extrabold block text-sm leading-none">{timeLeft.minutes}</span>
                      <span className="text-[8px] text-slate-300 uppercase block mt-0.5 leading-none">{t('mins', language)}</span>
                    </div>
                    <span className="text-slate-400 font-bold">:</span>
                    <div className="bg-[#0c1524] text-white px-2 py-1 rounded shadow-xs text-center min-w-[34px]">
                      <span className="font-extrabold block text-sm leading-none text-amber-400">{timeLeft.seconds}</span>
                      <span className="text-[8px] text-slate-300 uppercase block mt-0.5 leading-none">{t('secs', language)}</span>
                    </div>
                  </div>
                </div>

                {/* Title & Price */}
                <div className="text-center">
                  <h4
                    onClick={() => (onOpenProductPage || onSelectProduct)(deal)}
                    className="text-xs font-semibold text-slate-800 hover:text-[#ea580c] transition-colors line-clamp-1 cursor-pointer leading-snug"
                    title={productName}
                  >
                    {productName}
                  </h4>
                  <div className="flex items-center justify-center gap-2 mt-1.5 font-mono-numbers">
                    {formattedOriginal && (
                      <span className="text-slate-400 line-through text-xs">
                        {currencySymbol}{formattedOriginal}
                      </span>
                    )}
                    <span className="text-[#ea580c] font-black text-sm">
                      {currencySymbol}{formattedPrice}
                    </span>
                  </div>
                </div>

                {/* Stock Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-slate-500 font-semibold mb-1 font-mono-numbers">
                    <span>{t('availableStock', language)} <strong className="text-slate-800">{deal.stock || 20}</strong></span>
                    <span>{t('soldUnits', language)} <strong className="text-[#ea580c]">{deal.sold || 28}</strong></span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-[#ea580c] h-full rounded-full transition-all duration-500"
                      style={{ width: `${soldPercent}%` }}
                    />
                  </div>
                </div>

                {/* Quick Add To Cart Button */}
                <button
                  onClick={() => onAddToCart(deal)}
                  className="w-full mt-3.5 bg-slate-100 hover:bg-[#ea580c] text-slate-700 hover:text-white py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer group/btn font-display"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{t('addToCart', language)}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
