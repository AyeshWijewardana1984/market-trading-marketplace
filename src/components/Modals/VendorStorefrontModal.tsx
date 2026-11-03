import React, { useState } from 'react';
import {
  X,
  Award,
  ShieldCheck,
  Star,
  MessageSquare,
  FileText,
  Search,
  CheckCircle,
  Truck,
  Building2,
  Clock
} from 'lucide-react';
import { ALL_PRODUCTS } from '../../data/products';
import { Currency, Language, Product } from '../../types/marketplace';
import { ProductImageRenderer } from '../Images/ProductImageRenderer';
import { getProductName, getVendorName } from '../../i18n/translations';

interface VendorStorefrontModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorName: string;
  currency: Currency;
  onSelectProduct: (product: Product) => void;
  onOpenChat: (vendor: string) => void;
  onRequestQuote: () => void;
  language?: Language;
}

export const VendorStorefrontModal: React.FC<VendorStorefrontModalProps> = ({
  isOpen,
  onClose,
  vendorName,
  currency,
  onSelectProduct,
  onOpenChat,
  onRequestQuote,
  language = 'si',
}) => {
  const [vendorSearch, setVendorSearch] = useState('');

  if (!isOpen) return null;

  const isSi = language === 'si';
  const cleanVendor = vendorName || 'Nordic Living Studio';
  const displayVendor = getVendorName(cleanVendor, language);

  // Find products belonging to or aligned with this vendor
  const vendorProducts = ALL_PRODUCTS.filter((p) => {
    const isVendorMatch = p.vendor?.toLowerCase() === cleanVendor.toLowerCase();
    const productNameMatch = getProductName(p, language).toLowerCase().includes(vendorSearch.toLowerCase());
    const originalNameMatch = p.name.toLowerCase().includes(vendorSearch.toLowerCase());
    const matchesSearch = !vendorSearch.trim() || productNameMatch || originalNameMatch;
    return (isVendorMatch || (!p.vendor && cleanVendor.includes('Nordic'))) && matchesSearch;
  });

  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';
  const currencyRate = currency === 'USD' ? 1 : currency === 'EUR' ? 0.92 : 0.79;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />

      <div className="relative bg-white rounded-md shadow-2xl max-w-4xl w-full overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Vendor Header Banner */}
        <div className="relative bg-gradient-to-r from-[#232f3e] via-[#2c3e50] to-[#1a232f] text-white p-5 sm:p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-white p-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded bg-white text-[#232f3e] p-2 flex items-center justify-center shadow-lg shrink-0 border-2 border-[#ff5c00]">
                <Building2 className="w-9 h-9 text-[#ff5c00]" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {displayVendor}
                  </h2>
                  <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded uppercase flex items-center gap-1 shadow-xs font-display">
                    <Award className="w-3 h-3 text-slate-900" />
                    {isSi ? 'රන් සැපයුම්කරු 5 වසර' : 'Gold Supplier 5Y'}
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 font-display">
                    <CheckCircle className="w-3 h-3" />
                    {isSi ? 'තහවුරු කළ අපනයනකරු' : 'Verified Exporter'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  {isSi
                    ? 'ISO9001 තත්ත්ව ප්‍රමිතීන්ට අනුකූලව වාස්තු විද්‍යාත්මක ගෘහ නිර්මාණ, කාර්යක්ෂම මොඩියුලර් ගෘහ භාණ්ඩ සහ උසස් රෙදිපිළි නිෂ්පාදනය පිළිබඳ විශේෂඥයෝ.'
                    : 'Specialized in premium architectural home living, ergonomic modular furniture, and precision lifestyle textiles with ISO9001 quality compliance.'}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-300 mt-2.5 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-white font-mono-numbers">4.9 / 5.0</span>
                    <span className="text-slate-400">{isSi ? '(සාප්පු ඇගයීම් 248)' : '(248 store ratings)'}</span>
                  </div>
                  <span className="text-slate-500">•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {isSi ? 'ප්‍රතිචාර අනුපාතය: ' : 'Response Rate: '}
                      <strong className="text-emerald-400 font-mono-numbers">98.6%</strong>
                    </span>
                  </div>
                  <span className="text-slate-500">•</span>
                  <div className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {isSi ? 'නියමිත වේලාවට යැවීම: ' : 'On-Time Dispatch: '}
                      <strong className="text-emerald-400 font-mono-numbers">99.2%</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex sm:flex-col gap-2 shrink-0 self-start sm:self-center">
              <button
                onClick={() => {
                  onClose();
                  onOpenChat(cleanVendor);
                }}
                className="bg-[#ff5c00] hover:bg-[#e05100] text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm font-display"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{isSi ? 'සැපයුම්කරු සමඟ කතාබස් කරන්න' : 'Chat with Supplier'}</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onRequestQuote();
                }}
                className="bg-slate-700/80 hover:bg-slate-700 text-white px-4 py-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-600 font-display"
              >
                <FileText className="w-4 h-4 text-slate-300" />
                <span>{isSi ? 'B2B RFQ මිල ඉල්ලන්න' : 'Request B2B RFQ'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Store Trust Ribbon */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-2 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-slate-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isSi ? 'සම්පූර්ණ වෙළඳ ඇපකර සහතිකය' : 'Full Trade Assurance Guaranteed'}</span>
            </span>
            <span className="text-slate-300">|</span>
            <span>
              {isSi ? 'ව්‍යාපාර බලපත්‍රය: ' : 'Business License: '}
              <strong className="text-slate-800 font-mono-numbers">ISO-9001:2015</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span>
              {isSi ? 'කර්මාන්තශාලා විගණනය: ' : 'Factory Audited: '}
              <strong className="text-emerald-600">{isSi ? 'සමත් (TÜV Rheinland)' : 'Passed (TÜV Rheinland)'}</strong>
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={vendorSearch}
              onChange={(e) => setVendorSearch(e.target.value)}
              placeholder={isSi ? 'මෙම සාප්පුව තුළ සොයන්න...' : 'Search in this store...'}
              className="w-full bg-white border border-slate-300 rounded px-3 py-1 text-xs text-slate-800 focus:outline-none focus:border-[#ff5c00]"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Vendor Products Grid */}
        <div className="p-5 overflow-y-auto flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 font-display">
              {isSi
                ? `සාප්පු නාමාවලිය (භාණ්ඩ ${vendorProducts.length})`
                : `Store Catalog (${vendorProducts.length} Items)`}
            </h3>
            <span className="text-[11px] text-slate-500">
              {isSi ? 'අපනයන තොග සහ සෘජු නිෂ්පාදන ඒකක පෙන්වයි' : 'Showing export stock and direct manufacturing units'}
            </span>
          </div>

          {vendorProducts.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Search className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-1" />
              <p className="text-xs font-semibold text-slate-600">
                {isSi ? 'මෙම සාප්පුව තුළ ඔබගේ සෙවුමට ගැලපෙන භාණ්ඩ හමු නොවීය.' : 'No items match your search in this store.'}
              </p>
              <button
                onClick={() => setVendorSearch('')}
                className="mt-2 text-xs text-[#ff5c00] font-bold hover:underline cursor-pointer"
              >
                {isSi ? 'සෙවුම හිස් කරන්න' : 'Clear store search'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
              {vendorProducts.map((p) => {
                const currentPrice = (p.price * currencyRate).toFixed(2);
                const originalPrice = p.originalPrice
                  ? (p.originalPrice * currencyRate).toFixed(2)
                  : null;
                const displayName = getProductName(p, language);

                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      onClose();
                      onSelectProduct(p);
                    }}
                    className="bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md rounded p-3 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="relative w-full h-36 bg-slate-50 rounded flex items-center justify-center overflow-hidden mb-2">
                      <div className="w-28 h-28 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                        <ProductImageRenderer name={p.imageUrl} className="w-full h-full object-contain" />
                      </div>
                      {p.discountPercent && (
                        <div className="absolute top-1.5 right-1.5 bg-[#ff403b] text-white text-[9px] font-bold px-1.5 py-0.5 rounded font-mono-numbers">
                          {isSi ? `${p.discountPercent}% වට්ටමක්` : `${p.discountPercent}% OFF`}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[#e74c3c] font-black text-xs font-mono-numbers">
                          {currencySymbol}{currentPrice}
                        </span>
                        {originalPrice && (
                          <span className="text-slate-400 line-through text-[10px] font-mono-numbers">
                            {currencySymbol}{originalPrice}
                          </span>
                        )}
                      </div>
                      <h4 className="text-[11px] font-medium text-slate-800 line-clamp-2 leading-tight group-hover:text-[#ff5c00] transition-colors">
                        {displayName}
                      </h4>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-1.5 border-t border-slate-100">
                        <span>{isSi ? 'අවම: 1 pc' : 'Min. Order: 1 pc'}</span>
                        <span className="text-emerald-600 font-semibold font-mono-numbers">
                          {p.sold || 35}+ {isSi ? 'අලෙවි විය' : 'sold'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">
            {isSi ? (
              <>
                සියලුම ගනුදෙනු <strong className="text-slate-700">Market ඇපකර වෙළඳ සහතිකය</strong> මඟින් ආරක්ෂා කර ඇත.
              </>
            ) : (
              <>
                Transactions are protected by <strong className="text-slate-700">Market Escrow Trade Assurance</strong>.
              </>
            )}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded font-semibold transition-colors cursor-pointer font-display"
          >
            {isSi ? 'සාප්පුව වසන්න' : 'Close Storefront'}
          </button>
        </div>
      </div>
    </div>
  );
};
