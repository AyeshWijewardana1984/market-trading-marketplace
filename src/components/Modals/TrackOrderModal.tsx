import React, { useState, useEffect } from 'react';
import { X, Truck, Package, CheckCircle2, MapPin, Search, Phone, Clock, AlertCircle } from 'lucide-react';
import { Language, Currency, OrderRecord } from '../../types/marketplace';
import { findOrderById, getStoredOrders } from '../../services/orderService';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: Language;
  currency?: Currency;
  initialOrderId?: string;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  isOpen,
  onClose,
  language = 'si',
  currency = 'USD',
  initialOrderId,
}) => {
  const [orderNumber, setOrderNumber] = useState('MKT-2026-8941');
  const [matchedOrder, setMatchedOrder] = useState<OrderRecord | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';
  const currencyRate = currency === 'USD' ? 1 : currency === 'EUR' ? 0.92 : 0.79;

  // Whenever modal opens or initialOrderId changes, track that order
  useEffect(() => {
    if (isOpen) {
      const targetId = initialOrderId && initialOrderId.trim() ? initialOrderId.trim() : orderNumber;
      setOrderNumber(targetId);
      lookupOrder(targetId);
    }
  }, [isOpen, initialOrderId]);

  if (!isOpen) return null;

  const lookupOrder = (idToSearch: string) => {
    const clean = idToSearch.trim();
    if (!clean) return;

    setHasSearched(true);
    const found = findOrderById(clean);
    if (found) {
      setMatchedOrder(found);
      setNotFound(false);
    } else {
      // If exact ID not found, check if there's any order in storage to show as fallback
      const all = getStoredOrders();
      const partial = all.find(
        (o) => o.id.toLowerCase().includes(clean.toLowerCase()) || clean.toLowerCase().includes(o.id.toLowerCase())
      );
      if (partial) {
        setMatchedOrder(partial);
        setNotFound(false);
      } else {
        setMatchedOrder(null);
        setNotFound(true);
      }
    }
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    lookupOrder(orderNumber);
  };

  // Determine stage progression from status
  const currentStatus = matchedOrder?.status || 'Shipped';
  const isPending = currentStatus === 'Pending';
  const isProcessing = currentStatus === 'Processing';
  const isShipped = currentStatus === 'Shipped';
  const isDelivered = currentStatus === 'Delivered';

  const steps = [
    {
      label: language === 'si' ? 'ඇණවුම ලැබී තහවුරු විය' : 'Order Placed & Confirmed',
      date: matchedOrder ? matchedOrder.date : (language === 'si' ? 'නොවැ 01, පෙ.ව. 08:30' : 'Nov 01, 08:30 AM'),
      completed: true,
      active: isPending,
      icon: CheckCircle2,
    },
    {
      label: language === 'si' ? 'ඇසුරුම් කර ගබඩාවෙන් පිටත් කරන ලදී' : 'Packed & Dispatched from Hub',
      date: isPending
        ? (language === 'si' ? 'සූදානම් වෙමින් පවතී' : 'In Preparation')
        : (language === 'si' ? 'නොවැ 01, ප.ව. 01:15' : 'Nov 01, 01:15 PM'),
      completed: isProcessing || isShipped || isDelivered,
      active: isProcessing,
      icon: Package,
    },
    {
      label: language === 'si' ? 'ප්‍රවාහනයේ පවතී (කලාපීය මධ්‍යස්ථානය)' : 'In Transit (Regional Logistics Center)',
      date: isDelivered || isShipped
        ? (language === 'si' ? 'නොවැ 02, පෙ.ව. 06:45' : 'Nov 02, 06:45 AM')
        : (language === 'si' ? 'ඉදිරියට බලාපොරොත්තු වේ' : 'Scheduled next'),
      completed: isShipped || isDelivered,
      active: isShipped,
      icon: Truck,
    },
    {
      label: language === 'si' ? 'බෙදාහැරීමට පිටත්ව ඇත (ලබන්නා වෙත)' : 'Out for Final Delivery',
      date: isDelivered
        ? (language === 'si' ? 'නොවැ 02 - සාර්ථකව බෙදාහරින ලදී' : 'Nov 02 - Successfully Delivered')
        : (language === 'si' ? 'අද දිනයේ බලාපොරොත්තු වේ' : 'Expected today'),
      completed: isDelivered,
      active: isDelivered,
      icon: MapPin,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />

      <div className="relative bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 p-5 sm:p-6 border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-orange-100 text-[#ea580c] flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 font-display">
                {language === 'si' ? 'ඇණවුම් සහ පාර්සල් ලුහුබැඳීම' : 'Track Order & Shipment'}
              </h3>
              <p className="text-[11px] text-slate-500 font-sans">
                {language === 'si' ? 'තත්‍ය කාලීන ප්‍රවාහන තත්ත්වය පරීක්ෂා කරන්න' : 'Real-time fulfillment tracking'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-800 p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleTrack} className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder={language === 'si' ? 'ඇණවුම් අංකය (උදා: MKT-2026-8941)' : 'Enter Order ID (e.g. MKT-2026-8941)'}
              className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#ea580c] font-mono uppercase"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer font-display transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{language === 'si' ? 'සොයන්න' : 'Track'}</span>
          </button>
        </form>

        {/* Not Found Warning */}
        {notFound && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800 flex items-start gap-2 font-sans">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">
                {language === 'si' ? `"${orderNumber}" ඇණවුම සොයාගත නොහැකි විය` : `Order "${orderNumber}" not found`}
              </span>
              <span className="text-[11px] text-amber-700">
                {language === 'si'
                  ? 'කරුණාකර නිවැරදි ඇණවුම් අංකය ඇතුළත් කරන්න හෝ "MKT-2026-8941" උත්සාහ කරන්න.'
                  : 'Please check your Order ID or try sample order "MKT-2026-8941".'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setOrderNumber('MKT-2026-8941');
                  lookupOrder('MKT-2026-8941');
                }}
                className="mt-1.5 text-[11px] font-bold text-orange-600 underline block cursor-pointer"
              >
                {language === 'si' ? 'පෙරනිමි ඇණවුම පෙන්වන්න (MKT-2026-8941)' : 'Load sample order (MKT-2026-8941)'}
              </button>
            </div>
          </div>
        )}

        {/* Order Details Card */}
        {matchedOrder && (
          <div className="mt-5 bg-slate-50 border border-slate-200 rounded-lg p-4 font-sans space-y-4">
            {/* Top Bar: Order ID & Status */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
              <div>
                <span className="text-slate-500">{language === 'si' ? 'ඇණවුම් අංකය: ' : 'Order ID: '}</span>
                <span className="font-mono font-black text-slate-900">{matchedOrder.id}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{matchedOrder.date}</span>
              </div>
              <span className={`font-bold px-2.5 py-1 rounded text-[10px] font-display uppercase tracking-wider ${
                matchedOrder.status === 'Delivered'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : matchedOrder.status === 'Shipped'
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : matchedOrder.status === 'Processing'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-orange-100 text-orange-800 border border-orange-300'
              }`}>
                {matchedOrder.status}
              </span>
            </div>

            {/* Buyer Contact & Phone Card */}
            <div className="bg-white p-3 rounded border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">
                    {language === 'si' ? 'ලබන්නා' : 'Buyer / Recipient'}
                  </span>
                  <strong className="text-slate-900 font-display text-sm">{matchedOrder.customer}</strong>
                </div>

                {/* Buyer Phone Number with direct call action */}
                <a
                  href={`tel:${matchedOrder.phone.replace(/[^+\d]/g, '')}`}
                  className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 px-2.5 py-1 rounded font-mono text-[11px] font-bold transition-colors"
                  title={`Call buyer at ${matchedOrder.phone}`}
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{matchedOrder.phone}</span>
                </a>
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-col gap-1 text-[11px] text-slate-600">
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{matchedOrder.shippingAddress}</span>
                </div>
                <div className="flex items-center justify-between pt-1 text-slate-500 text-[10px]">
                  <span>{matchedOrder.itemsCount} {language === 'si' ? 'භාණ්ඩ' : 'Items'} • {matchedOrder.paymentMethod}</span>
                  <span className="font-mono font-bold text-slate-900 text-xs">
                    {currencySymbol}{(matchedOrder.total * currencyRate).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline Milestones */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3 font-display">
                {language === 'si' ? 'බෙදාහැරීමේ පියවර' : 'Dispatch Milestones'}
              </div>
              <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {steps.map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <div key={idx} className="flex items-start gap-3 relative z-10">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white ${
                          s.active
                            ? 'bg-[#ea580c] ring-4 ring-orange-100'
                            : s.completed
                            ? 'bg-emerald-500'
                            : 'bg-slate-300'
                        }`}
                      >
                        <Icon className="w-3 h-3" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-slate-800 flex items-center justify-between font-display">
                          <span>{s.label}</span>
                          {s.active && (
                            <span className="text-[10px] text-[#ea580c] font-bold">
                              {language === 'si' ? 'වත්මන් තත්ත්වය' : 'ACTIVE'}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 font-sans">{s.date}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
