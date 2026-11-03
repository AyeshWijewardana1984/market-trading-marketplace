import React, { useState } from 'react';
import { X, Star, Heart, ArrowLeftRight, ShoppingCart, Check, Truck, Shield, Pencil } from 'lucide-react';
import { Currency, Language, Product } from '../../types/marketplace';
import { ProductImageRenderer } from '../Images/ProductImageRenderer';
import { getCategoryName, getProductDescription, getProductName, getVendorName, t } from '../../i18n/translations';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, color?: string) => void;
  onAddToWishlist: (product: Product) => void;
  onAddToCompare: (product: Product) => void;
  currency: Currency;
  language?: Language;
  onViewProductPage?: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onAddToWishlist,
  onAddToCompare,
  currency,
  language = 'si',
  onViewProductPage,
  onEditProduct,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || 'Default');

  if (!product) return null;

  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';
  const currencyRate = currency === 'USD' ? 1 : currency === 'EUR' ? 0.92 : 0.79;

  const formattedPrice = (product.price * currencyRate).toFixed(2);
  const formattedOriginal = product.originalPrice
    ? (product.originalPrice * currencyRate).toFixed(2)
    : null;

  const displayName = getProductName(product, language);
  const displayCategory = getCategoryName(product.category, language);
  const displayDesc = getProductDescription(product, language);
  const displayVendor = getVendorName(product.vendor, language);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-md shadow-2xl max-w-2xl w-full overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-800 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Visual */}
          <div className="bg-slate-50 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200 relative">
            <div className="w-56 h-56 flex items-center justify-center">
              <ProductImageRenderer name={product.imageUrl} className="w-full h-full object-contain" />
            </div>

            {product.discountPercent && (
              <span className="absolute top-4 left-4 bg-[#ea580c] text-white text-xs font-bold px-2 py-1 rounded font-mono-numbers">
                -{product.discountPercent}% OFF
              </span>
            )}

            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>{language === 'si' ? 'තහවුරු කළ සැපයුම්කරු' : 'Authentic Verified Supplier'}</span>
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              {/* Category & Vendor */}
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="uppercase font-semibold tracking-wider text-[#ea580c] font-display">
                  {displayCategory}
                </span>
                <span className="text-slate-600 font-medium">{displayVendor}</span>
              </div>

              {/* Title */}
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug font-display tracking-tight">
                {displayName}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < product.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  ({product.reviewsCount} {t('customerReviews', language)})
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2.5 mt-3">
                <span className="text-2xl font-black text-[#ea580c] font-mono-numbers">
                  {currencySymbol}{formattedPrice}
                </span>
                {formattedOriginal && (
                  <span className="text-slate-400 line-through text-sm font-mono-numbers">
                    {currencySymbol}{formattedOriginal}
                  </span>
                )}
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-mono-numbers">
                  {language === 'si' ? `තොග ඇත (${product.stock || 25})` : `In Stock (${product.stock || 25} available)`}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                {displayDesc}
              </p>

              {/* Colors (if available) */}
              {product.colors && (
                <div className="mt-4">
                  <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">
                    {language === 'si' ? 'වර්ණය:' : 'Color Variant:'}
                  </label>
                  <div className="flex gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`px-2.5 py-1 text-xs rounded border transition-colors cursor-pointer ${
                          selectedColor === c
                            ? 'border-[#ea580c] bg-orange-50 text-[#ea580c] font-bold'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-slate-200 rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold font-mono-numbers text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={() => {
                    onAddToCart(product, quantity, selectedColor);
                    onClose();
                  }}
                  className="flex-1 bg-[#ea580c] hover:bg-[#c2410c] text-white py-2 px-4 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer font-display"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{t('addToCart', language)}</span>
                </button>
              </div>

              {/* Secondary links: Wishlist, Compare, and Full Details */}
              <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                <button
                  onClick={() => onAddToWishlist(product)}
                  className="flex items-center gap-1 hover:text-[#ea580c] transition-colors cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>{t('wishlist', language)}</span>
                </button>
                <button
                  onClick={() => onAddToCompare(product)}
                  className="flex items-center gap-1 hover:text-[#ea580c] transition-colors cursor-pointer"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>{t('compare', language)}</span>
                </button>
                {onEditProduct && (
                  <button
                    onClick={() => {
                      onEditProduct(product);
                      onClose();
                    }}
                    className="flex items-center gap-1 text-orange-600 hover:text-white hover:bg-[#ea580c] bg-orange-50 px-2 py-0.5 rounded border border-orange-200 transition-colors cursor-pointer font-bold text-[11px] font-display ml-auto mr-2"
                    title="Edit Product"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>{language === 'si' ? 'සංස්කරණය' : 'Edit'}</span>
                  </button>
                )}
                {onViewProductPage && (
                  <button
                    onClick={() => {
                      onViewProductPage(product);
                      onClose();
                    }}
                    className={`font-bold text-[#ea580c] hover:underline flex items-center gap-0.5 cursor-pointer font-display ${!onEditProduct ? 'ml-auto' : ''}`}
                  >
                    <span>{language === 'si' ? 'සම්පූර්ණ විස්තර බලන්න →' : 'Full Details & Specs →'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
