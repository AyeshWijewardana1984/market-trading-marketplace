import React, { useState } from 'react';
import { X, Store, CheckCircle, ShieldCheck } from 'lucide-react';
import { Language } from '../../types/marketplace';

interface VendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (storeName: string) => void;
  language?: Language;
  onOpenAddProduct?: () => void;
}

export const VendorModal: React.FC<VendorModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  language = 'si',
  onOpenAddProduct,
}) => {
  const [storeName, setStoreName] = useState('');
  const [businessCategory, setBusinessCategory] = useState(
    language === 'si' ? 'ගෘහ භාණ්ඩ සහ විසිතුරු භාණ්ඩ' : 'Furniture & Living'
  );
  const [taxId, setTaxId] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (storeName) {
      setSubmitted(true);
      onSuccess(storeName);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
      }, 2000);
    }
  };

  const isSi = language === 'si';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />

      <div className="relative bg-white rounded-md shadow-2xl max-w-md w-full overflow-hidden z-10 p-6 animate-in fade-in zoom-in-95 duration-150">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 cursor-pointer">
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">
              {isSi ? 'අයදුම්පත සාර්ථකව යොමු කෙරිණි!' : 'Application Submitted!'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              {isSi ? (
                <>
                  සාදරයෙන් පිළිගනිමු, <strong>{storeName}</strong>. අපගේ වෙළඳපල තහවුරු කිරීමේ කණ්ඩායම පැය 24ක් ඇතුළත ඔබේ තොරතුරු පරීක්ෂා කරනු ඇත.
                </>
              ) : (
                <>
                  Welcome aboard, <strong>{storeName}</strong>. Our marketplace verification team will review your credentials within 24 hours.
                </>
              )}
            </p>
            {onOpenAddProduct && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAddProduct();
                }}
                className="inline-flex items-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2 rounded text-xs font-bold uppercase font-display cursor-pointer transition-colors shadow-sm"
              >
                <span>{isSi ? 'පළමු භාණ්ඩය ලැයිස්තුගත කරන්න' : 'List Your First Product'}</span>
              </button>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-[#ea580c]" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 font-display">
                  {isSi ? 'තහවුරු කළ වෙළඳපල විකුණුම්කරුවෙකු වන්න' : 'Become a Verified Marketplace Vendor'}
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-4 font-sans">
              {isSi
                ? 'පළමු දින 90 තුළ 0% ලැයිස්තුගත ගාස්තු සමඟ ගෝලීය තොග සහ සිල්ලර ගැනුම්කරුවන් මිලියන ගණනකට භාණ්ඩ අලෙවි කරන්න.'
                : 'Sell to millions of global wholesale and retail buyers with 0% listing fees for the first 90 days.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1 font-display">
                  {isSi ? 'වෙළඳ නාමය / සාප්පුවේ නම' : 'Brand / Store Name'}
                </label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder={isSi ? 'උදා: නෝර්ඩික් ක්‍රාෆ්ට් ස්ටූඩියෝ' : 'e.g. Nordic Craft Studio'}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#ea580c]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1 font-display">
                  {isSi ? 'ප්‍රධාන නිෂ්පාදන අංශය' : 'Primary Product Department'}
                </label>
                <select
                  value={businessCategory}
                  onChange={(e) => setBusinessCategory(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#ea580c]"
                >
                  {isSi ? (
                    <>
                      <option>ගෘහ භාණ්ඩ සහ විසිතුරු භාණ්ඩ</option>
                      <option>රෙදිපිළි සහ කුෂන්</option>
                      <option>කාර්මික කොටස් සහ මෙවලම්</option>
                      <option>ඉලෙක්ට්‍රොනික සහ ස්මාර්ට් උපාංග</option>
                      <option>සෞඛ්‍ය සහ රූපලාවන්‍ය</option>
                    </>
                  ) : (
                    <>
                      <option>Furniture & Living</option>
                      <option>Textiles & Cushions</option>
                      <option>Industrial Parts & Tools</option>
                      <option>Electronics & Smart Gadgets</option>
                      <option>Health & Beauty</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1 font-display">
                  {isSi ? 'බදු ලියාපදිංචි / ව්‍යාපාර බලපත්‍ර අංකය' : 'Tax Registration / Business License ID'}
                </label>
                <input
                  type="text"
                  required
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  placeholder={isSi ? 'උදා: LK-PV-849102-BR' : 'e.g. US-849102-EIN'}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#ea580c] font-mono-numbers"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-800 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  {isSi
                    ? 'නිෂ්පාදනවල සත්‍යතාව සහ සුරක්ෂිත බෙදාහැරීම සහතික කිරීම සඳහා සියලුම විකුණුම්කරුවන් ඇපකර ගිවිසුම් සත්‍යාපනයකට යටත් වේ.'
                    : 'All vendors undergo escrow agreement verification to guarantee product authenticity and safe delivery.'}
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer font-display"
              >
                {isSi ? 'විකුණුම්කරු අයදුම්පත යොමු කරන්න' : 'Submit Seller Application'}
              </button>

              {onOpenAddProduct && (
                <div className="pt-1 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAddProduct();
                    }}
                    className="text-xs text-orange-600 hover:text-orange-700 font-bold hover:underline cursor-pointer"
                  >
                    {isSi ? 'දැනටමත් අනුමත වී ඇත්ද? නව නිෂ්පාදනයක් ඇතුළත් කරන්න →' : 'Already approved? Add a new product now →'}
                  </button>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
