import React, { useState } from 'react';
import { X, Building2, CheckCircle2, Send } from 'lucide-react';
import { Language } from '../../types/marketplace';

interface B2BQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (company: string) => void;
  language?: Language;
}

export const B2BQuoteModal: React.FC<B2BQuoteModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  language = 'si',
}) => {
  const [company, setCompany] = useState('');
  const [productCategory, setProductCategory] = useState(
    language === 'si' ? 'කාර්යාලීය ගෘහ භාණ්ඩ සහ ආසන' : 'Office Furniture & Seating'
  );
  const [quantity, setQuantity] = useState(language === 'si' ? 'ඒකක 50' : '50 units');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (company) {
      setSubmitted(true);
      onSuccess(company);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
      }, 2500);
    }
  };

  const isSi = language === 'si';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />

      <div className="relative bg-white rounded-md shadow-2xl max-w-lg w-full overflow-hidden z-10 p-6 animate-in fade-in zoom-in-95 duration-150">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 cursor-pointer">
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">
              {isSi ? 'RFQ ඉල්ලීම තහවුරු කළ සැපයුම්කරුවන් වෙත යොමු කරන ලදී!' : 'RFQ Dispatched to Verified Suppliers!'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {isSi ? (
                <>
                  ඔබේ තොග මිල විමසුම (<strong>{company}</strong>) යොමු කර ඇත. තහවුරු කළ නිෂ්පාදකයින් පැය 4ක් ඇතුළත තොග මිල ලේඛන සමඟ ඔබ හා සම්බන්ධ වනු ඇත.
                </>
              ) : (
                <>
                  Your wholesale inquiry for <strong>{company}</strong> has been forwarded. Verified manufacturers will contact you with tiered wholesale rate sheets within 4 hours.
                </>
              )}
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-[#ea580c]" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 font-display">
                {isSi ? 'තොග B2B මිල ගණන් ඉල්ලුම්පත (RFQ)' : 'Bulk B2B Wholesale Quote Request (RFQ)'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4 font-sans">
              {isSi
                ? 'තහවුරු කළ නිෂ්පාදකයින්ගෙන් සෘජුවම FOB/CIF නැව්ගත කිරීමේ කොන්දේසි සහිත කර්මාන්තශාලා තොග මිල ගණන් ලබා ගන්න.'
                : 'Receive competitive factory-direct wholesale pricing with FOB/CIF shipping terms directly from vetted manufacturers.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1 font-display">
                  {isSi ? 'සමාගමේ / ආයතනයේ නම' : 'Company / Organization Name'}
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder={isSi ? 'උදා: ඇක්මී කොමර්ෂල් ෆර්නිචර් පුද්ගලික සමාගම' : 'e.g. Acme Commercial Furnishings Ltd'}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#ea580c]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1 font-display">
                    {isSi ? 'අංශය' : 'Department'}
                  </label>
                  <select
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#ea580c]"
                  >
                    {isSi ? (
                      <>
                        <option>කාර්යාලීය ගෘහ භාණ්ඩ සහ ආසන</option>
                        <option>රෙදිපිළි සහ මයික්‍රෝෆයිබර් ඇතිරිලි</option>
                        <option>කාර්මික කොටස් සහ CNC මෙවලම්</option>
                        <option>ඉලෙක්ට්‍රොනික සහ පාරිභෝගික උපාංග</option>
                      </>
                    ) : (
                      <>
                        <option>Office Furniture & Seating</option>
                        <option>Textiles & Microfiber Linens</option>
                        <option>Industrial Parts & CNC Tools</option>
                        <option>Consumer Electronics & Gear</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1 font-display">
                    {isSi ? 'අපේක්ෂිත ප්‍රමාණය' : 'Target Volume'}
                  </label>
                  <input
                    type="text"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder={isSi ? 'උදා: ඒකක 100 - 500' : 'e.g. 100 - 500 units'}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#ea580c] font-mono-numbers"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1 font-display">
                  {isSi ? 'අභිරුචිකරණ පිරිවිතර හෝ ද්‍රව්‍ය සටහන්' : 'Customization Specifications or Material Notes'}
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    isSi
                      ? 'විශේෂ ප්‍රමාණ, ගිනි-ප්‍රතිරෝධී රෙදිපිළි පිරිවිතර හෝ බෙදාහැරීමේ වරාය අවශ්‍යතා සඳහන් කරන්න...'
                      : 'Include custom dimensions, fire-retardant fabric specs, or delivery port requirements...'
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#ea580c]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white py-2.5 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer font-display"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSi ? 'තොග RFQ ඉල්ලුම්පත යොමු කරන්න' : 'Submit Wholesale RFQ'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
