import React, { useState, useEffect } from 'react';
import { Eye, Heart, ArrowLeftRight, ShoppingCart, Search, X } from 'lucide-react';
import { TRENDING_PRODUCTS } from '../../data/products';
import { Currency, Language, Product } from '../../types/marketplace';
import { ProductImageRenderer } from '../Images/ProductImageRenderer';
import { getCategoryName, getProductName, t } from '../../i18n/translations';

interface TrendingItemsSectionProps {
  currency: Currency;
  language?: Language;
  products?: Product[];
  onSelectProduct: (product: Product) => void;
  onOpenProductPage?: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  onAddToCompare: (product: Product) => void;
  selectedCategory?: string;
  searchQuery?: string;
  onClearFilters?: () => void;
}

export const TrendingItemsSection: React.FC<TrendingItemsSectionProps> = ({
  currency,
  language = 'en',
  products,
  onSelectProduct,
  onOpenProductPage,
  onAddToCart,
  onAddToWishlist,
  onAddToCompare,
  selectedCategory = 'All',
  searchQuery = '',
  onClearFilters,
}) => {
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Furniture', 'Textiles', 'Electronics', 'Fashion', 'Beauty'];

  // Sync activeTab if selectedCategory changes externally
  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'All') {
      const match = tabs.find((t) => selectedCategory.toLowerCase().includes(t.toLowerCase()));
      if (match) {
        setActiveTab(match);
      }
    }
  }, [selectedCategory]);

  const sourceProducts = products && products.length > 0 ? products : TRENDING_PRODUCTS;

  const filteredProducts = sourceProducts.filter((p) => {
    // 1. Tab filter
    const matchesTab =
      activeTab === 'All' || p.category.toLowerCase().includes(activeTab.toLowerCase());

    // 2. Search query filter
    const matchesSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.nameSi && p.nameSi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';
  const currencyRate = currency === 'USD' ? 1 : currency === 'EUR' ? 0.92 : 0.79;

  return (
    <div className="mt-8">
      {/* Section Header with Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#0c1524] pb-2 mb-4 gap-2">
        <div className="flex items-center gap-2">
          <div className="bg-[#0c1524] text-white px-3 py-1 text-xs font-black uppercase tracking-wider rounded-xs inline-block font-display">
            {t('trendingTitle', language)}
          </div>
          {(searchQuery || (selectedCategory && selectedCategory !== 'All')) && (
            <div className="flex items-center gap-1.5 bg-orange-100 text-orange-900 px-2 py-0.5 rounded text-[11px] font-semibold">
              <Search className="w-3 h-3 text-[#ea580c]" />
              <span>
                {searchQuery ? `"${searchQuery}"` : getCategoryName(selectedCategory, language)} ({filteredProducts.length})
              </span>
              {onClearFilters && (
                <button
                  onClick={onClearFilters}
                  className="hover:text-red-700 cursor-pointer ml-1"
                  title="Clear filter"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-4 text-xs font-semibold overflow-x-auto pb-1 sm:pb-0 font-display">
          {tabs.map((tab) => {
            const tabDisplay = tab === 'All'
              ? (language === 'si' ? 'සියල්ල' : 'All')
              : getCategoryName(tab, language);

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`transition-colors whitespace-nowrap cursor-pointer pb-0.5 ${
                  activeTab === tab
                    ? 'text-[#ea580c] border-b-2 border-[#ea580c]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tabDisplay}
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="py-12 bg-white border border-slate-200 rounded text-center p-6 text-slate-400">
          <Search className="w-12 h-12 stroke-1 mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-700 font-display">
            {language === 'si' ? 'ගැලපෙන නිෂ්පාදන කිසිවක් හමු නොවීය' : 'No matching products found'}
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto font-sans">
            {language === 'si' ? 'ඔබගේ සෙවුම් වචන වෙනස් කර හෝ වෙනත් අංශයක් තෝරා නැවත උත්සාහ කරන්න.' : 'Try adjusting your search keyword or switching category tabs.'}
          </p>
          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="mt-4 px-4 py-1.5 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded text-xs font-bold font-display cursor-pointer"
            >
              {language === 'si' ? 'පෙරහන් යළි සකසන්න' : 'Reset Filters'}
            </button>
          )}
        </div>
      ) : (
        /* Grid of Products */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
          {filteredProducts.map((product) => {
            const formattedPrice = (product.price * currencyRate).toFixed(2);
            const formattedOriginal = product.originalPrice
              ? (product.originalPrice * currencyRate).toFixed(2)
              : null;
            const productName = getProductName(product, language);

            return (
              <div
                key={product.id}
                className="bg-white border border-slate-200/90 rounded-sm p-3 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group relative"
              >
                {/* Product Visual & Badges */}
                <div
                  onClick={() => (onOpenProductPage || onSelectProduct)(product)}
                  className="relative w-full h-44 bg-slate-50/60 rounded flex items-center justify-center overflow-hidden mb-2.5 cursor-pointer"
                >
                  <div className="w-36 h-36 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <ProductImageRenderer name={product.imageUrl} className="w-full h-full object-contain" />
                  </div>

                  {/* Red Discount Badge */}
                  {product.discountPercent && (
                    <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[#ef4444] text-white flex items-center justify-center font-bold text-[10px] shadow font-mono-numbers">
                      {product.discountPercent}%
                    </div>
                  )}

                  {/* Left Floating Quick Action Icons */}
                  <div
                    className="absolute left-2 top-2 flex flex-col gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 z-20"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => onAddToWishlist(product)}
                      className="w-7 h-7 rounded bg-white hover:bg-[#ea580c] hover:text-white text-slate-700 shadow-md flex items-center justify-center transition-colors cursor-pointer"
                      title={t('saveToWishlist', language)}
                    >
                      <Heart className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="hidden sm:flex w-7 h-7 rounded bg-white hover:bg-[#ea580c] hover:text-white text-slate-700 shadow-md items-center justify-center transition-colors cursor-pointer"
                      title={t('quickView', language)}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onAddToCompare(product)}
                      className="hidden sm:flex w-7 h-7 rounded bg-white hover:bg-[#ea580c] hover:text-white text-slate-700 shadow-md items-center justify-center transition-colors cursor-pointer"
                      title={t('compare', language)}
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add to Cart button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    className="absolute bottom-1 inset-x-2 bg-[#ea580c] hover:bg-[#c2410c] text-white py-1.5 rounded text-[10px] sm:text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 cursor-pointer z-20 active:scale-95 font-display"
                  >
                    <ShoppingCart className="w-3 h-3" />
                    <span>{t('addToCart', language)}</span>
                  </button>
                </div>

                {/* Product Info */}
                <div className="text-center pt-1">
                  {/* Price */}
                  <div className="flex items-center justify-center gap-1.5 mb-1 font-mono-numbers">
                    {formattedOriginal && (
                      <span className="text-slate-400 line-through text-[11px]">
                        {currencySymbol}{formattedOriginal}
                      </span>
                    )}
                    <span className="text-[#ea580c] font-black text-xs">
                      {currencySymbol}{formattedPrice}
                    </span>
                  </div>

                  {/* Title */}
                  <h4
                    onClick={() => (onOpenProductPage || onSelectProduct)(product)}
                    className="text-[11px] text-slate-700 hover:text-[#ea580c] font-medium line-clamp-2 leading-tight cursor-pointer transition-colors"
                    title={productName}
                  >
                    {productName}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
