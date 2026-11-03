import React, { useState } from 'react';
import { Mail, PhoneCall, MapPin, Send, ShieldCheck } from 'lucide-react';
import { PagesModalTab } from '../Modals/PagesModal';
import { Language } from '../../types/marketplace';

interface FooterProps {
  onCategoryClick: (category: string) => void;
  onOpenTrackOrder: () => void;
  onOpenHelp: () => void;
  onOpenVendor: () => void;
  onOpenPages: (tab?: PagesModalTab) => void;
  onOpenB2B: () => void;
  onNewsletterSubscribe?: (email: string) => void;
  language?: Language;
}

export const Footer: React.FC<FooterProps> = ({
  onCategoryClick,
  onOpenTrackOrder,
  onOpenHelp,
  onOpenVendor,
  onOpenPages,
  onOpenB2B,
  onNewsletterSubscribe,
  language = 'si',
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      if (onNewsletterSubscribe) {
        onNewsletterSubscribe(newsletterEmail);
      }
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#0c1524] text-slate-300 mt-16 border-t border-slate-800">
      {/* Newsletter Bar */}
      <div className="border-b border-slate-800/80 bg-[#111d2e] py-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider font-display">
              {language === 'si' ? 'අපගේ ප්‍රවෘත්ති පත්‍රිකාවට දායක වන්න' : 'SUBSCRIBE TO OUR NEWSLETTER'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              {language === 'si' ? 'ඔබේ පළමු වෙළඳපල ඇණවුම සඳහා $10 ක වට්ටම් කූපනයක් ලබා ගන්න.' : 'Get $10 coupon voucher off your first multi-vendor marketplace order.'}
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex max-w-md">
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder={language === 'si' ? 'ඔබගේ ඊමේල් ලිපිනය ඇතුළත් කරන්න...' : 'Enter your work email address...'}
              className="px-4 py-2.5 text-xs bg-[#0c1524] text-white rounded-l border border-slate-700 focus:outline-none focus:border-[#ea580c] flex-1 md:w-72"
            />
            <button
              type="submit"
              className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-5 py-2.5 rounded-r text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer font-display"
            >
              <span>{subscribed ? (language === 'si' ? 'දායක විය!' : 'Subscribed!') : (language === 'si' ? 'දායක වන්න' : 'Subscribe')}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#ea580c] flex items-center justify-center font-bold text-white text-base font-display shadow-md">
                @
              </div>
              <span className="text-xl font-black text-white tracking-tight font-display">market</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {language === 'si'
                ? 'Market යනු තහවුරු කළ නිෂ්පාදකයින්, සෘජු ආනයනකරුවන් සහ තොග සැපයුම්කරුවන් ගෝලීය ගැනුම්කරුවන් හා සම්බන්ධ කරන ප්‍රමුඛ බහු-විකුණුම්කාර වෙළඳපොළකි.'
                : 'Market is an international multi-vendor trading marketplace connecting thousands of verified manufacturers, direct importers, artisans, and wholesale suppliers to global consumers.'}
            </p>
            <div className="space-y-1.5 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#ea580c] shrink-0" />
                <span>840 Broadway Avenue, Suite 400, New York, NY 10003</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#ea580c] shrink-0" />
                <span>{language === 'si' ? 'ක්ෂණික ඇමතුම්: (+123) 4 567 890 (24/7 පාරිභෝගික සහාය)' : 'Hotline: (+123) 4 567 890 (24/7 Priority Support)'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#ea580c] shrink-0" />
                <span>support@market-marketplace.com</span>
              </div>
            </div>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-display">
              {language === 'si' ? 'පාරිභෝගික සත්කාරය' : 'Customer Care'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={onOpenHelp} className="hover:text-[#ea580c] transition-colors cursor-pointer text-left">
                  {language === 'si' ? 'උදවු මධ්‍යස්ථානය සහ FAQ' : 'Help Center & FAQ'}
                </button>
              </li>
              <li>
                <button onClick={onOpenTrackOrder} className="hover:text-[#ea580c] transition-colors cursor-pointer text-left">
                  {language === 'si' ? 'ඔබගේ පාර්සලය ලුහුබඳින්න' : 'Track Your Shipment'}
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPages('shipping')} className="hover:text-[#ea580c] transition-colors cursor-pointer text-left">
                  {language === 'si' ? 'නැව්ගත කිරීම සහ නොමිලේ බෙදාහැරීම' : 'Shipping & Free Delivery'}
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPages('returns')} className="hover:text-[#ea580c] transition-colors cursor-pointer text-left">
                  {language === 'si' ? 'දින 30ක මුදල් ආපසු ගෙවීමේ ඇපකරය' : '30-Day Money Back Returns'}
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPages('privacy')} className="hover:text-[#ea580c] transition-colors cursor-pointer text-left">
                  {language === 'si' ? 'ගැණුම්කරු Escrow ආරක්ෂණය' : 'Buyer Protection Escrow'}
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-display">
              {language === 'si' ? 'අංශ සහ කාණ්ඩ' : 'Departments'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onCategoryClick('Furniture')} className="hover:text-[#ea580c] transition-colors cursor-pointer text-left">
                  {language === 'si' ? 'කාර්යාල සහ නිවාස ගෘහ භාණ්ඩ' : 'Office & Home Furniture'}
                </button>
              </li>
              <li>
                <button onClick={() => onCategoryClick('Textiles')} className="hover:text-[#ea580c] transition-colors cursor-pointer text-left">
                  {language === 'si' ? 'රෙදිපිළි සහ කොට්ට' : 'Textiles & Cushions'}
                </button>
              </li>
              <li>
                <button onClick={() => onCategoryClick('Electronics')} className="hover:text-[#ea580c] transition-colors cursor-pointer text-left">
                  {language === 'si' ? 'ඉලෙක්ට්‍රොනික සහ ශ්‍රව්‍ය උපකරණ' : 'Electronics & Audio Gear'}
                </button>
              </li>
              <li>
                <button onClick={() => onCategoryClick('Industrial Parts & Tools')} className="hover:text-[#ea580c] transition-colors cursor-pointer text-left">
                  {language === 'si' ? 'කාර්මික කොටස් සහ මෙවලම්' : 'Industrial Parts & Tools'}
                </button>
              </li>
              <li>
                <button onClick={() => onCategoryClick('Beauty')} className="hover:text-[#ea580c] transition-colors cursor-pointer text-left">
                  {language === 'si' ? 'සුවතාවය, රූපලාවන්‍ය සහ සැරසිලි' : 'Health, Beauty & Decor'}
                </button>
              </li>
            </ul>
          </div>

          {/* Multi-Vendor Hub */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-display">
              {language === 'si' ? 'බහු-විකුණුම්කාර මධ්‍යස්ථානය' : 'Multi-Vendor Hub'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={onOpenVendor} className="text-[#ea580c] hover:text-white font-semibold flex items-center gap-1 cursor-pointer">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{language === 'si' ? 'තහවුරු කළ විකුණුම්කරුවෙකු වන්න' : 'Become a Verified Vendor'}</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenVendor} className="hover:text-[#ea580c] transition-colors cursor-pointer text-left">
                  {language === 'si' ? 'විකුණුම්කරු පාලක පුවරුව' : 'Vendor Merchant Dashboard'}
                </button>
              </li>
              <li>
                <button onClick={onOpenB2B} className="hover:text-[#ea580c] transition-colors cursor-pointer text-left">
                  {language === 'si' ? 'B2B තොග මිල ගණන්' : 'B2B Wholesale Quotations'}
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPages('terms')} className="hover:text-[#ea580c] transition-colors cursor-pointer text-left">
                  {language === 'si' ? 'වෙළඳ අනුකූලතා ප්‍රමිති' : 'Trade Compliance Standards'}
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPages('about')} className="hover:text-[#ea580c] transition-colors cursor-pointer text-left">
                  {language === 'si' ? 'සහකාර හවුල්කාර ජාලය' : 'Affiliate Partner Network'}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#070c16] py-4 border-t border-slate-800 text-[11px] text-slate-400">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>{language === 'si' ? '© 2026 Market - බහු වෙළඳ වෙළඳපොළ. සියලුම හිමිකම් ඇවිරිණි.' : '© 2026 Market - Multi Trading Marketplace. All Rights Reserved.'}</p>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-300">{language === 'si' ? 'පිළිගත් ගෙවීම් ක්‍රම:' : 'Accepted Payments:'}</span>
            <span className="bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 rounded text-white font-mono-numbers text-[10px]">VISA</span>
            <span className="bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 rounded text-white font-mono-numbers text-[10px]">MasterCard</span>
            <span className="bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 rounded text-white font-mono-numbers text-[10px]">PayPal</span>
            <span className="bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 rounded text-white font-mono-numbers text-[10px]">Escrow Wire</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
