import React, { useState } from 'react';
import { X, CheckCircle2, CreditCard, DollarSign, ShieldCheck, Phone } from 'lucide-react';
import { CartItem, Currency, Language, OrderRecord } from '../../types/marketplace';
import { placeOrder } from '../../services/orderService';
import { t } from '../../i18n/translations';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  appliedCoupon: string | null;
  onOrderCompleted?: (order: OrderRecord) => void;
  onTrackOrder?: (orderId: string) => void;
  language?: Language;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  appliedCoupon,
  onOrderCompleted,
  onTrackOrder,
  language = 'si',
}) => {
  const [formData, setFormData] = useState({
    name: language === 'si' ? 'සුනිල් පෙරේරා' : 'Alex Johnson',
    email: 'buyer@market.com',
    phone: '+94 77 123 4567',
    address: language === 'si' ? 'නො. 45, ගාලු පාර' : '742 Evergreen Terrace',
    city: language === 'si' ? 'කොළඹ' : 'San Francisco',
    postalCode: '00300',
    paymentMethod: 'card', // 'card' | 'cod' | 'paypal'
  });

  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState('');

  if (!isOpen) return null;

  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';
  const currencyRate = currency === 'USD' ? 1 : currency === 'EUR' ? 0.92 : 0.79;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountRate = appliedCoupon ? 0.2 : 0;
  const discountAmount = subtotal * discountRate;
  const isFreeDelivery = subtotal >= 49.89 || items.length === 0;
  const shipping = isFreeDelivery ? 0 : 9.99;
  const baseTotal = subtotal - discountAmount + shipping;
  const total = baseTotal * currencyRate;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `MKT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const paymentMethodName =
      formData.paymentMethod === 'cod'
        ? (language === 'si' ? 'Cash on Delivery (COD)' : 'Cash on Delivery (COD)')
        : formData.paymentMethod === 'paypal'
        ? 'PayPal Express / Escrow'
        : 'Credit Card (Stripe)';

    const shippingAddressFull = `${formData.address}, ${formData.city}${formData.postalCode ? ' ' + formData.postalCode : ''}`;
    const orderItemsCount = items.reduce((acc, item) => acc + item.quantity, 0) || 1;

    // Dispatches and saves order immediately to shared orderService/localStorage
    const placed = placeOrder({
      customId: id,
      customer: formData.name,
      email: formData.email,
      phone: formData.phone,
      shippingAddress: shippingAddressFull,
      itemsCount: orderItemsCount,
      total: baseTotal,
      paymentMethod: paymentMethodName,
      status: 'Pending',
    });

    setGeneratedOrderId(placed.id);
    setOrderConfirmed(true);
    if (onOrderCompleted) {
      onOrderCompleted(placed);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />

      <div className="relative bg-white rounded-md shadow-2xl max-w-xl w-full overflow-hidden z-10 p-6 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {orderConfirmed ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-slate-900 font-display">
              {language === 'si' ? 'ඇණවුම සාර්ථකව තහවුරු විය!' : 'Order Confirmed!'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-sans">
              {language === 'si'
                ? 'Market බහු-විකුණුම්කාර වෙළඳපොළෙන් සාප්පු සවාරි කිරීම පිළිබඳව ඔබට ස්තූතියි.'
                : 'Thank you for shopping at Market Multi-Vendor Marketplace.'}
            </p>
            <div className="my-5 p-4 bg-slate-50 border border-slate-200 rounded text-left text-xs space-y-1.5 font-sans">
              <div className="flex justify-between">
                <span className="text-slate-500">{language === 'si' ? 'ඇණවුම් අංකය:' : 'Order ID:'}</span>
                <span className="font-mono-numbers font-bold text-[#ea580c]">{generatedOrderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{language === 'si' ? 'ලබන්නා:' : 'Recipient:'}</span>
                <span className="font-semibold">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{language === 'si' ? 'දුරකථන අංකය:' : 'Phone Number:'}</span>
                <span className="font-mono font-semibold text-emerald-600">{formData.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{language === 'si' ? 'බෙදාහැරීමේ ලිපිනය:' : 'Shipping Address:'}</span>
                <span>{formData.address}, {formData.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{language === 'si' ? 'ගෙවීම් ක්‍රමය:' : 'Payment Mode:'}</span>
                <span className="uppercase font-semibold">
                  {formData.paymentMethod === 'cod'
                    ? (language === 'si' ? 'භාණ්ඩ ලැබුණු පසු මුදල් ගෙවීම (COD)' : 'Cash on Delivery (COD)')
                    : formData.paymentMethod === 'paypal'
                    ? 'PayPal / Escrow'
                    : (language === 'si' ? 'කාඩ්පත් ගෙවීම' : 'Credit Card')}
                </span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>{language === 'si' ? 'මුළු මුදල:' : 'Total Paid / Due:'}</span>
                <span className="font-mono-numbers text-[#ea580c] text-sm">{currencySymbol}{total.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center mt-5 font-display">
              {onTrackOrder && (
                <button
                  onClick={() => {
                    onClose();
                    onTrackOrder(generatedOrderId);
                  }}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded cursor-pointer"
                >
                  {language === 'si' ? 'මෙම ඇණවුම ලුහුබඳින්න' : 'Track This Order'}
                </button>
              )}
              <button
                onClick={onClose}
                className="px-6 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider rounded cursor-pointer"
              >
                {language === 'si' ? 'නැවත වෙළඳපොළට' : 'Back to Marketplace'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider font-display">
                {language === 'si' ? 'ක්ෂණික ඇණවුම් පිටවීම (Express Checkout)' : 'Marketplace Express Checkout'}
              </h3>
              <p className="text-xs text-slate-500 font-sans">
                {language === 'si' ? 'ඔබගේ බෙදාහැරීමේ සහ ගෙවීම් විස්තර සම්පූර්ණ කරන්න' : 'Complete your shipping & payment details'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 font-sans">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    {language === 'si' ? 'සම්පූර්ණ නම' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#ea580c]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    {language === 'si' ? 'දුරකථන අංකය' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#ea580c]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  {language === 'si' ? 'බෙදාහැරීමේ ලිපිනය' : 'Delivery Address'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#ea580c]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    {language === 'si' ? 'නගරය' : 'City'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#ea580c]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    {language === 'si' ? 'තැපැල් කේතය' : 'Postal Code'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#ea580c]"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1.5 font-display">
                  {language === 'si' ? 'ගෙවීම් ක්‍රමය' : 'Payment Method'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                    className={`p-2.5 border rounded text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                      formData.paymentMethod === 'card'
                        ? 'border-[#ea580c] bg-orange-50 text-[#ea580c] font-bold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{language === 'si' ? 'කාඩ්පත් ගෙවීම' : 'Credit Card'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                    className={`p-2.5 border rounded text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                      formData.paymentMethod === 'cod'
                        ? 'border-[#ea580c] bg-orange-50 text-[#ea580c] font-bold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>{language === 'si' ? 'ලැබුණු පසු ගෙවීම (COD)' : 'Cash on Delivery'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'paypal' })}
                    className={`p-2.5 border rounded text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                      formData.paymentMethod === 'paypal'
                        ? 'border-[#ea580c] bg-orange-50 text-[#ea580c] font-bold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>PayPal / Escrow</span>
                  </button>
                </div>
              </div>

              {/* Order Breakdown */}
              <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>{t('subtotal', language)} ({items.length} {language === 'si' ? 'භාණ්ඩ' : 'items'})</span>
                  <span className="font-mono-numbers">{currencySymbol}{(subtotal * currencyRate).toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>{language === 'si' ? 'වට්ටම් කූපනය' : 'Discount Coupon'} ({appliedCoupon})</span>
                    <span className="font-mono-numbers">-{currencySymbol}{(discountAmount * currencyRate).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>{language === 'si' ? 'ප්‍රවාහන ගාස්තු' : 'Shipping'}</span>
                  <span className="font-mono-numbers">
                    {isFreeDelivery
                      ? (language === 'si' ? 'නොමිලේ' : 'FREE')
                      : `${currencySymbol}${(shipping * currencyRate).toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1.5 text-sm font-display">
                  <span>{language === 'si' ? 'මුළු මුදල' : 'Total Amount'}</span>
                  <span className="font-mono-numbers text-[#ea580c]">{currencySymbol}{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white py-3 rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md font-display"
              >
                {language === 'si' ? 'දැන් ඇණවුම් කරන්න' : 'Place Order Now'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
