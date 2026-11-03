import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { CartItem, Currency, Language } from '../../types/marketplace';
import { ProductImageRenderer } from '../Images/ProductImageRenderer';
import { getProductName, getVendorName, t } from '../../i18n/translations';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOpenCheckout: () => void;
  currency: Currency;
  language?: Language;
  appliedCoupon: string | null;
  onApplyCoupon: (code: string) => boolean;
  onSelectProduct?: (product: any) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenCheckout,
  currency,
  language = 'si',
  appliedCoupon,
  onApplyCoupon,
  onSelectProduct,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';
  const currencyRate = currency === 'USD' ? 1 : currency === 'EUR' ? 0.92 : 0.79;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountRate = appliedCoupon ? 0.2 : 0;
  const discountAmount = subtotal * discountRate;
  const isFreeDelivery = subtotal >= 49.89 || items.length === 0;
  const shipping = isFreeDelivery ? 0 : 9.99;
  const finalTotal = (subtotal - discountAmount + shipping) * currencyRate;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = onApplyCoupon(couponInput.trim());
    if (success) {
      setCouponMessage(language === 'si' ? 'කූපනය සාර්ථකව යොදන ලදී! 20% වට්ටමක්' : 'Coupon applied successfully! 20% Discount');
    } else {
      setCouponMessage(language === 'si' ? 'වලංගු නොවන කූපන් කේතයකි. "Happy2017" උත්සාහ කරන්න' : 'Invalid coupon code. Try "Happy2017"');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 bg-[#0c1524] text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#ea580c]" />
              <h2 className="font-bold text-sm uppercase tracking-wider font-display">
                {t('cart', language)} ({items.reduce((sum, item) => sum + item.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <ShoppingBag className="w-16 h-16 stroke-1 text-slate-300 mb-3" />
                <p className="text-sm font-semibold text-slate-600 font-display">
                  {language === 'si' ? 'ඔබේ කරත්තය දැනට හිස්ව පවතී' : 'Your cart is currently empty'}
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs font-sans">
                  {language === 'si'
                    ? 'ඔබේ ඇණවුමට එකතු කර ගැනීමට දවසේ විශේෂ දීමනා සහ ප්‍රවණතා භාණ්ඩ ගවේෂණය කරන්න.'
                    : 'Discover daily deals and trending items to add to your order.'}
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-5 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded text-xs font-bold uppercase tracking-wider font-display cursor-pointer"
                >
                  {language === 'si' ? 'සාප්පු සවාරි ආරම්භ කරන්න' : 'Start Shopping'}
                </button>
              </div>
            ) : (
              items.map((item) => {
                const itemTotal = (item.product.price * item.quantity * currencyRate).toFixed(2);
                const itemName = getProductName(item.product, language);
                const itemVendor = getVendorName(item.product.vendor, language);

                return (
                  <div key={item.product.id} className="py-3.5 flex gap-3 group">
                    <div
                      onClick={() => {
                        if (onSelectProduct) {
                          onSelectProduct(item.product);
                          onClose();
                        }
                      }}
                      className="w-16 h-16 bg-slate-50 border border-slate-200 rounded p-1 shrink-0 flex items-center justify-center cursor-pointer hover:border-[#ea580c] transition-colors"
                    >
                      <ProductImageRenderer name={item.product.imageUrl} className="w-14 h-14 object-contain" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4
                          onClick={() => {
                            if (onSelectProduct) {
                              onSelectProduct(item.product);
                              onClose();
                            }
                          }}
                          className="text-xs font-semibold text-slate-800 line-clamp-1 leading-snug cursor-pointer hover:text-[#ea580c] transition-colors font-display"
                        >
                          {itemName}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-slate-400 hover:text-red-500 p-0.5 transition-colors cursor-pointer"
                          title={language === 'si' ? 'භාණ්ඩය ඉවත් කරන්න' : 'Remove item'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[10px] text-slate-400 mt-0.5 font-sans">
                        {language === 'si' ? 'වෙළෙන්දා' : 'Vendor'}: <span className="text-slate-600 font-medium">{itemVendor}</span>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-slate-200 rounded overflow-hidden">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold font-mono-numbers text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="text-xs font-bold font-mono-numbers text-[#ea580c]">
                            {currencySymbol}{itemTotal}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {items.length > 0 && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder={language === 'si' ? 'කූපන්: Happy2017' : 'Coupon: Happy2017'}
                    className="w-full pl-8 pr-2 py-1.5 text-xs bg-white border border-slate-200 rounded focus:outline-none uppercase font-mono-numbers"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#0c1524] hover:bg-[#111d2e] text-white rounded text-xs font-semibold cursor-pointer font-display"
                >
                  {language === 'si' ? 'යොදන්න' : 'Apply'}
                </button>
              </form>

              {couponMessage && (
                <p className={`text-[11px] ${couponMessage.includes('successfully') || couponMessage.includes('සාර්ථකව') ? 'text-green-600' : 'text-red-600'}`}>
                  {couponMessage}
                </p>
              )}

              {/* Subtotal Calculations */}
              <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200 pt-2 font-mono-numbers">
                <div className="flex justify-between font-sans">
                  <span>{t('subtotal', language)}</span>
                  <span className="font-mono-numbers">{currencySymbol}{(subtotal * currencyRate).toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600 font-sans">
                    <span>{language === 'si' ? 'වට්ටම (20% Happy2017)' : 'Discount (20% Happy2017)'}</span>
                    <span className="font-mono-numbers">-{currencySymbol}{(discountAmount * currencyRate).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-sans">
                  <span>{language === 'si' ? 'ප්‍රවාහන ගාස්තු' : 'Shipping'}</span>
                  <span className="font-mono-numbers">
                    {isFreeDelivery ? (
                      <span className="text-green-600 font-semibold font-sans">{language === 'si' ? 'නොමිලේ' : 'FREE'}</span>
                    ) : (
                      `${currencySymbol}${(shipping * currencyRate).toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-2 font-display">
                  <span>{language === 'si' ? 'මුළු මුදල' : 'Total Amount'}</span>
                  <span className="font-mono-numbers text-[#ea580c] text-base font-bold">{currencySymbol}{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    onClose();
                    onOpenCheckout();
                  }}
                  className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white py-2.5 rounded font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer font-display"
                >
                  <span>{t('checkout', language)}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="flex justify-between items-center text-[11px] text-slate-400">
                  <button
                    onClick={onClearCart}
                    className="hover:text-red-500 underline cursor-pointer"
                  >
                    {language === 'si' ? 'සියල්ල ඉවත් කරන්න' : 'Clear All Items'}
                  </button>
                  <span>{language === 'si' ? '256-bit SSL මගින් සුරක්ෂිතයි' : 'Secured by 256-bit SSL'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
