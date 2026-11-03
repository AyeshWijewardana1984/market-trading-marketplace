import React from 'react';
import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Currency, Language, Product } from '../../types/marketplace';
import { ProductImageRenderer } from '../Images/ProductImageRenderer';
import { getProductName, t } from '../../i18n/translations';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  currency: Currency;
  language?: Language;
  onSelectProduct?: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveFromWishlist,
  onAddToCart,
  currency,
  language = 'si',
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';
  const currencyRate = currency === 'USD' ? 1 : currency === 'EUR' ? 0.92 : 0.79;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          <div className="p-4 bg-[#0c1524] text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#ea580c] fill-[#ea580c]" />
              <h2 className="font-bold text-sm uppercase tracking-wider font-display">
                {t('wishlist', language)} ({items.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <Heart className="w-16 h-16 stroke-1 text-slate-300 mb-3" />
                <p className="text-sm font-semibold text-slate-600 font-display">
                  {language === 'si' ? 'ඔබේ පැතුම් ලැයිස්තුව හිස්ව පවතී' : 'Your wishlist is empty'}
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs font-sans">
                  {language === 'si'
                    ? 'ඔබ කැමති භාණ්ඩ මෙහි සුරැකීමට නිෂ්පාදනවල ඇති හදවත අයිකනය ක්ලික් කරන්න.'
                    : 'Tap the heart icon on any product to save items you want to keep track of.'}
                </p>
              </div>
            ) : (
              items.map((product) => {
                const formattedPrice = (product.price * currencyRate).toFixed(2);
                const itemName = getProductName(product, language);
                return (
                  <div key={product.id} className="py-3.5 flex gap-3 items-center">
                    <div
                      onClick={() => {
                        if (onSelectProduct) {
                          onSelectProduct(product);
                          onClose();
                        }
                      }}
                      className="w-16 h-16 bg-slate-50 border border-slate-200 rounded p-1 shrink-0 flex items-center justify-center cursor-pointer hover:border-[#ea580c] transition-colors"
                    >
                      <ProductImageRenderer name={product.imageUrl} className="w-14 h-14 object-contain" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4
                        onClick={() => {
                          if (onSelectProduct) {
                            onSelectProduct(product);
                            onClose();
                          }
                        }}
                        className="text-xs font-semibold text-slate-800 line-clamp-1 hover:text-[#ea580c] cursor-pointer transition-colors font-display"
                      >
                        {itemName}
                      </h4>
                      <div className="text-[11px] font-bold text-[#ea580c] font-mono-numbers mt-0.5">
                        {currencySymbol}{formattedPrice}
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => {
                            onAddToCart(product);
                            onRemoveFromWishlist(product.id);
                          }}
                          className="px-2.5 py-1 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer font-display"
                        >
                          <ShoppingCart className="w-3 h-3" />
                          <span>{language === 'si' ? 'කරත්තයට එක් කරන්න' : 'Move to Cart'}</span>
                        </button>
                        <button
                          onClick={() => onRemoveFromWishlist(product.id)}
                          className="text-slate-400 hover:text-red-500 p-1 text-xs cursor-pointer"
                          title={language === 'si' ? 'ඉවත් කරන්න' : 'Remove'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 text-center font-display">
            <button
              onClick={onClose}
              className="text-xs font-semibold text-slate-600 hover:text-[#ea580c] cursor-pointer"
            >
              {language === 'si' ? 'සාප්පු සවාරි දිගටම කරගෙන යන්න' : 'Continue Browsing'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
