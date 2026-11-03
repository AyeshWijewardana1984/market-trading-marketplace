import React, { useState, useEffect } from 'react';
import { X, FileText, Shield, Award, Truck, RotateCcw } from 'lucide-react';
import { Language } from '../../types/marketplace';

export type PagesModalTab = 'about' | 'terms' | 'privacy' | 'shipping' | 'returns';

interface PagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenVendor: () => void;
  onOpenHelp: () => void;
  initialTab?: PagesModalTab;
  language?: Language;
}

export const PagesModal: React.FC<PagesModalProps> = ({
  isOpen,
  onClose,
  onOpenVendor,
  onOpenHelp,
  initialTab = 'about',
  language = 'si',
}) => {
  const [activeTab, setActiveTab] = useState<PagesModalTab>(initialTab);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const isSi = language === 'si';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />

      <div className="relative bg-white rounded-md shadow-2xl max-w-2xl w-full overflow-hidden z-10 p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#ff5c00]" />
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 font-display">
              {isSi ? 'වෙළඳපල පිටු සහ ප්‍රතිපත්ති' : 'Marketplace Pages & Policies'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mt-4 mb-4 text-xs font-bold overflow-x-auto font-display">
          <button
            onClick={() => setActiveTab('about')}
            className={`pb-2 px-3 sm:px-4 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'about'
                ? 'text-[#ff5c00] border-b-2 border-[#ff5c00]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {isSi ? 'අප ගැන' : 'About Us'}
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-2 px-3 sm:px-4 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'shipping'
                ? 'text-[#ff5c00] border-b-2 border-[#ff5c00]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {isSi ? 'නොමිලේ බෙදාහැරීම' : 'Free Delivery'}
          </button>
          <button
            onClick={() => setActiveTab('returns')}
            className={`pb-2 px-3 sm:px-4 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'returns'
                ? 'text-[#ff5c00] border-b-2 border-[#ff5c00]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {isSi ? 'දින 30ක මුදල් ආපසු ගෙවීම' : '30-Day Money Back'}
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-2 px-3 sm:px-4 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'privacy'
                ? 'text-[#ff5c00] border-b-2 border-[#ff5c00]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {isSi ? 'ඇණවුම් ආරක්ෂාව' : 'Order Protection'}
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`pb-2 px-3 sm:px-4 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'terms'
                ? 'text-[#ff5c00] border-b-2 border-[#ff5c00]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {isSi ? 'සේවා කොන්දේසි' : 'Terms of Service'}
          </button>
        </div>

        {/* Tab Content */}
        <div className="text-xs text-slate-600 leading-relaxed max-h-80 overflow-y-auto pr-2 space-y-3">
          {activeTab === 'about' && (
            <>
              <p>
                <strong>{isSi ? 'Market - බහු-වෙළඳ ජාත්‍යන්තර වෙළඳපොල' : 'Market - Multi Trading Marketplace'}</strong>{' '}
                {isSi
                  ? 'යනු තහවුරු කළ කර්මාන්තශාලා, ශිල්පීය නිෂ්පාදකයින්, තොග බෙදාහරින්නන් සහ ගෝලීය පාරිභෝගිකයින් සම්බන්ධ කරන ජාත්‍යන්තර මහා පරිමාණ වෙළඳ වේදිකාවකි.'
                  : 'is an enterprise-scale international marketplace connecting verified factories, artisan producers, wholesale distributors, and global retail shoppers.'}
              </p>
              <div className="grid grid-cols-2 gap-3 my-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <Award className="w-5 h-5 text-[#ff5c00] mb-1" />
                  <span className="font-bold text-slate-800 block">
                    {isSi ? 'තහවුරු කළ විකුණුම්කරුවන්' : 'Verified Vendors'}
                  </span>
                  <p className="text-[11px] text-slate-500">
                    {isSi
                      ? 'සෑම වෙළෙන්දෙකුම ලැයිස්තුගත කිරීමට පෙර දැඩි අනන්‍යතා සහ තත්ත්ව පරීක්ෂණ සමත් වේ.'
                      : 'Every merchant passes rigorous identity and quality checks before listing.'}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <Shield className="w-5 h-5 text-[#ff5c00] mb-1" />
                  <span className="font-bold text-slate-800 block">
                    {isSi ? 'ඇපකර ආරක්ෂාව (Escrow)' : 'Escrow Protection'}
                  </span>
                  <p className="text-[11px] text-slate-500">
                    {isSi
                      ? 'ගැනුම්කරු විසින් භාණ්ඩ භාරගෙන පරීක්ෂා කිරීමෙන් පසුව පමණක් මුදල් නිදහස් කෙරේ.'
                      : 'Payments are released only upon successful buyer delivery and inspection.'}
                  </p>
                </div>
              </div>
              <p>
                {isSi
                  ? 'අපි රටවල් 48 ක වෙළඳ හවුල්කරුවන් 12,000 කට අධික සංඛ්‍යාවක් සමඟ සජීවී තොග සමමුහුර්තකරණය, ස්වයංක්‍රීය රේගු නිෂ්කාශන සහාය සහ B2B මිල ලංසු තැබීමේ පහසුකම් සපයන්නෙමු.'
                  : 'We host over 12,000 active trade partners across 48 countries, providing real-time inventory synchronization, automated customs clearance support, and verified B2B quote bidding.'}
              </p>
            </>
          )}

          {activeTab === 'shipping' && (
            <>
              <div className="flex items-center gap-2 p-2.5 bg-blue-50 border border-blue-100 rounded text-blue-900 font-semibold mb-2">
                <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  {isSi
                    ? '$49.89 ට වැඩි සියලුම සුදුසුකම් ලත් ඇණවුම් සඳහා නොමිලේ ප්‍රමිතිගත බෙදාහැරීම!'
                    : 'Free standard delivery on all qualifying marketplace orders over $49.89!'}
                </span>
              </div>
              <p>
                <strong>{isSi ? '1. පිටත් කිරීමේ කාලසීමාව: ' : '1. Dispatch Timeframe: '}</strong>
                {isSi
                  ? 'තොගයේ ඇති අයිතමවලින් 98.4%ක් අපගේ සහතික කළ කලාපීය බෙදාහැරීමේ මධ්‍යස්ථානවලින් පැය 24-48ක් ඇතුළත පිටත් කර යවනු ලැබේ.'
                  : '98.4% of in-stock items are dispatched within 24–48 hours directly from our certified regional fulfillment centers.'}
              </p>
              <p>
                <strong>{isSi ? '2. ප්‍රවාහන හවුල්කරුවන්: ' : '2. Shipping Carriers: '}</strong>
                {isSi
                  ? 'සියලුම නැව්ගත කිරීම් DHL Express, FedEx, UPS සහ ජාතික තැපැල් සේවා ඇතුළු ප්‍රමුඛ පෙළේ ජාත්‍යන්තර භාණ්ඩ ප්‍රවාහන හවුල්කරුවන් මඟින් සිදු කෙරේ.'
                  : 'All shipments are handled via tier-1 international freight partners including DHL Express, FedEx, UPS, and national postal authorities.'}
              </p>
              <p>
                <strong>{isSi ? '3. සජීවී ලුහුබැඳීම: ' : '3. Real-Time Tracking: '}</strong>
                {isSi
                  ? 'සෑම පාර්සලයක් සඳහාම කෙටි පණිවුඩ (SMS) සහ විද්‍යුත් තැපෑල මඟින් සජීවී ලුහුබැඳීමේ දැනුම්දීම් ලබාදේ.'
                  : 'Every shipment includes live end-to-end milestone tracking and SMS/Email transit alerts.'}
              </p>
            </>
          )}

          {activeTab === 'returns' && (
            <>
              <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-100 rounded text-emerald-900 font-semibold mb-2">
                <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {isSi
                    ? 'දින 30ක කරදරයකින් තොර මුදල් ආපසු ගෙවීමේ සහතිකය'
                    : '30-Day Hassle-Free Money Back Guarantee'}
                </span>
              </div>
              <p>
                {isSi
                  ? 'ඔබගේ භාණ්ඩයට හානි සිදුවී ඇත්නම්, දෝෂ සහිත නම් හෝ නාමාවලියේ පිරිවිතර සමඟ නොගැලපේ නම්, 100%ක සම්පූර්ණ මුදල් ආපසු ගෙවීමක් හෝ නොමිලේ ප්‍රතිස්ථාපනයක් ලැබීමට ඔබට හිමිකම් ඇත.'
                  : 'If your item arrives damaged, defective, or does not match the product specifications shown in the marketplace catalog, you are entitled to a full 100% refund or free replacement.'}
              </p>
              <p>
                <strong>{isSi ? 'ආපසු භාරදීමේ ක්‍රියාවලිය:' : 'Return Process:'}</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>
                  {isSi
                    ? 'භාණ්ඩය ලැබී දින 30ක් ඇතුළත ආපසු භාරදීමේ ඉල්ලීමක් යොමු කරන්න.'
                    : 'Submit a return request within 30 days of receiving your package.'}
                </li>
                <li>
                  {isSi
                    ? 'ඔබගේ පෙරගෙවුම් ආපසු තැපැල් ලේබලය බාගත කරන්න.'
                    : 'Download your prepaid return postage label.'}
                </li>
                <li>
                  {isSi
                    ? 'වෙළෙන්දා විසින් ආපසු ලැබුණු භාණ්ඩය පරීක්ෂා කළ පසු, වැඩ කරන දින 3-5ක් ඇතුළත මුදල් ඔබගේ ගිණුමට බැර කෙරේ.'
                    : 'Once the merchant scans the return, refunds are credited back to your original payment method in 3–5 business days.'}
                </li>
              </ul>
            </>
          )}

          {activeTab === 'privacy' && (
            <>
              <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-100 rounded text-amber-900 font-semibold mb-2">
                <Shield className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  {isSi
                    ? 'ඇණවුම් ආරක්ෂාව සහ ඇපකර (Escrow) ගෙවීම් සහතිකය'
                    : 'Order Protection & Escrow Payment Guarantee'}
                </span>
              </div>
              <p>
                <strong>{isSi ? 'ඇපකර ගිණුම් ආරක්ෂාව: ' : 'Escrow Account Security: '}</strong>
                {isSi
                  ? 'ඔබ Market හරහා මිලදී ගන්නා විට, ඔබගේ ගෙවීම ස්වාධීන මූල්‍ය ඇපකර ගිණුමක සුරක්ෂිතව තබා ගැනේ. ඔබ භාණ්ඩය ලැබුණු බව සහ තත්ත්වය සතුටුදායක බව තහවුරු කළ විට පමණක් වෙළෙන්දාට මුදල් මුදාහරිනු ලැබේ.'
                  : 'When you purchase on Market, your payment is held securely in an independent financial escrow account. Funds are released to the vendor only when you confirm satisfactory delivery.'}
              </p>
              <p>
                <strong>{isSi ? 'දත්ත රහස්‍යතාව: ' : 'Data Privacy: '}</strong>
                {isSi
                  ? 'සියලුම ගනුදෙනු 256-bit SSL ආරක්ෂණ ප්‍රොටෝකෝල මඟින් සංකේතනය කර ඇත. අපි කිසිවිටෙකත් ඔබගේ ක්‍රෙඩිට් කාඩ්පත් තොරතුරු ගබඩා කිරීම හෝ තෙවන පාර්ශව වෙත ලබාදීම සිදු නොකරමු.'
                  : 'All transactions are encrypted via 256-bit SSL protocols. We never store raw credit card credentials or disclose buyer contact information to third parties.'}
              </p>
            </>
          )}

          {activeTab === 'terms' && (
            <>
              <p>
                <strong>{isSi ? '1. සාමාන්‍ය වෙළඳ කොන්දේසි: ' : '1. General Trading Terms: '}</strong>
                {isSi
                  ? 'සියලුම වෙළඳපල ගනුදෙනු වාණිජ ජාත්‍යන්තර වෙළඳ ප්‍රමිතීන්ට අනුකූල වේ. සැබෑ තොග ප්‍රමාණ පවත්වා ගැනීමට සහ ප්‍රකාශිත මිල ගණන්වලට ගරු කිරීමට සැපයුම්කරුවන් එකඟ වේ.'
                  : 'All marketplace transactions are governed by commercial international trade standards. Suppliers agree to maintain authentic stock numbers and honor posted prices.'}
              </p>
              <p>
                <strong>{isSi ? '2. තහනම් භාණ්ඩ: ' : '2. Prohibited Goods: '}</strong>
                {isSi
                  ? 'ව්‍යාජ, බලපත්‍ර රහිත සහ සීමා කරන ලද භාණ්ඩ සම්පූර්ණයෙන්ම තහනම් වන අතර, එවැනි අවස්ථාවලදී විකුණුම්කරුගේ ගිණුම අවලංගු කර ඇපකර මුදල් අත්හිටුවනු ලැබේ.'
                  : 'Counterfeit, unlicensed, and restricted items are strictly prohibited and result in permanent vendor de-listing and escrow forfeiture.'}
              </p>
              <p>
                <strong>{isSi ? '3. ආරවුල් විසඳීම: ' : '3. Dispute Resolution: '}</strong>
                {isSi
                  ? 'ගැනුම්කරුවන් සහ වෙළෙන්දන් අතර ආරවුල් කඩිනමින් සහ සාධාරණව විසඳීමට අපගේ පැය 24/7 ක්‍රියාත්මක වෙළඳ බේරුම්කරණ කණ්ඩායම පැය 48ක් ඇතුළත පියවර ගනී.'
                  : 'Our dedicated 24/7 Trade Arbitration team reviews buyer and vendor disputes within 48 hours for swift, fair resolution.'}
              </p>
            </>
          )}
        </div>

        <div className="mt-5 pt-3 border-t border-slate-200 flex justify-between items-center text-xs">
          <button
            onClick={() => {
              onClose();
              onOpenVendor();
            }}
            className="text-[#ff5c00] font-bold hover:underline cursor-pointer font-display"
          >
            {isSi ? 'තහවුරු කළ විකුණුම්කරුවෙකු වන්න →' : 'Become a Verified Seller →'}
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenHelp();
            }}
            className="text-slate-600 hover:text-slate-900 font-semibold cursor-pointer font-display"
          >
            {isSi ? 'උදවු මධ්‍යස්ථානය වෙත පිවිසෙන්න' : 'Visit Help Center'}
          </button>
        </div>
      </div>
    </div>
  );
};
