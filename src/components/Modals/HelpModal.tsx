import React, { useState } from 'react';
import { X, HelpCircle, Phone, Mail, MessageSquare } from 'lucide-react';
import { Language } from '../../types/marketplace';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: Language;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, language = 'si' }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  if (!isOpen) return null;

  const faqs = [
    {
      q: language === 'si'
        ? 'බහු-විකුණුම්කාර ප්‍රවාහන හා ලුහුබැඳීමේ සේවාව ක්‍රියාත්මක වන්නේ කෙසේද?'
        : 'How does Multi-Vendor shipping and tracking work?',
      a: language === 'si'
        ? 'සෑම තහවුරු කළ විකුණුම්කරුවෙකුම ඔවුන්ගේ බෙදාහැරීමේ මධ්‍යස්ථානයෙන් හෝ ප්‍රාදේශීය ගබඩාවෙන් සෘජුවම භාණ්ඩ එවනු ලැබේ. එක් එක් පාර්සලය සඳහා ඔබට ඒකාබද්ධ සජීවී ලුහුබැඳීමේ යාවත්කාලීන ලැබේ.'
        : 'Each verified vendor ships directly from their distribution center or local fulfillment warehouse. You receive unified tracking updates and consolidated status notifications for each package.'
    },
    {
      q: language === 'si'
        ? '"Happy2017" සති අන්ත කූපන් වට්ටම කුමක්ද?'
        : 'What is the "Happy2017" weekend coupon discount?',
      a: language === 'si'
        ? 'Happy2017 කූපන් කේතය මඟින් ඔබගේ ඇණවුම සඳහා ක්ෂණිකව 20% ක වට්ටමක් ලැබෙන අතර එය දවසේ විශේෂ දීමනා සහ අනෙකුත් භාණ්ඩ සඳහා අදාළ වේ.'
        : 'The Happy2017 coupon code provides an instant 20% discount on your order at checkout, applicable to both daily deals and trending items.'
    },
    {
      q: language === 'si'
        ? 'ගැණුම්කරු Escrow ආරක්ෂණය මඟින් මගේ ගෙවීම ආරක්ෂා වන්නේ කෙසේද?'
        : 'How does Buyer Protection Escrow safeguard my payment?',
      a: language === 'si'
        ? 'දින 30ක මුදල් ආපසු ගෙවීමේ කාලය තුළ ඔබට භාණ්ඩය ලැබුණු බව සහ පරීක්ෂා කළ බව තහවුරු කරන තුරු Market ආයතනය විසින් ඔබගේ ගෙවීම ආරක්ෂිතව රඳවා තබා ගනී.'
        : 'Payments are held securely by Market until you confirm arrival and inspection of your items within the 30-day money-back guarantee window.'
    },
    {
      q: language === 'si'
        ? 'මට තොග වශයෙන් මිලදී ගැනීමට හෝ B2B මිල ගණන් ඉල්ලා සිටිය හැකිද?'
        : 'Can I purchase in bulk or request B2B quotations?',
      a: language === 'si'
        ? 'ඔව්, ව්‍යාපාරික ගැනුම්කරුවන්ට ඕනෑම භාණ්ඩයක "B2B මිල ගණන් ඉල්ලන්න" බොත්තම ක්ලික් කිරීමෙන් නිෂ්පාදකයන්ගෙන් සෘජුවම විශේෂ තොග මිල ගණන් ලබා ගත හැක.'
        : 'Yes, verified corporate buyers can click "Request Wholesale Quote" on any product to receive tailored volume tier pricing directly from manufacturers.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />

      <div className="relative bg-white rounded-md shadow-2xl max-w-lg w-full overflow-hidden z-10 p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#ea580c]" />
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 font-display">
              {language === 'si' ? 'උදවු මධ්‍යස්ථානය සහ FAQ' : 'Market Help Center & FAQ'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Contact Bar */}
        <div className="grid grid-cols-3 gap-2 my-4 text-center font-sans">
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
            <Phone className="w-4 h-4 text-[#ea580c] mx-auto mb-1" />
            <span className="text-[10px] font-bold block text-slate-700">
              {language === 'si' ? 'දුරකථන සහාය' : 'Phone Support'}
            </span>
            <span className="text-[9px] text-slate-400">
              {language === 'si' ? '24/7 නොමිලේ' : '24/7 Toll-Free'}
            </span>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
            <Mail className="w-4 h-4 text-[#ea580c] mx-auto mb-1" />
            <span className="text-[10px] font-bold block text-slate-700">
              {language === 'si' ? 'ඊමේල් සේවාව' : 'Email Desk'}
            </span>
            <span className="text-[9px] text-slate-400">
              {language === 'si' ? 'පැයකට අඩු ප්‍රතිචාර' : '< 1 hr response'}
            </span>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
            <MessageSquare className="w-4 h-4 text-[#ea580c] mx-auto mb-1" />
            <span className="text-[10px] font-bold block text-slate-700">
              {language === 'si' ? 'සජීවී කතාබස්' : 'Live Chat'}
            </span>
            <span className="text-[9px] text-slate-400">
              {language === 'si' ? 'දැන් ක්‍රියාත්මකයි' : 'Online Now'}
            </span>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-2 mt-2 font-sans">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-200 rounded overflow-hidden">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-2.5 text-left text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 flex justify-between items-center cursor-pointer"
              >
                <span>{faq.q}</span>
                <span className="text-slate-400 font-bold ml-2">{activeFaq === idx ? '−' : '+'}</span>
              </button>
              {activeFaq === idx && (
                <div className="p-3 text-xs text-slate-600 bg-white leading-relaxed border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 bg-slate-800 hover:bg-slate-900 text-white py-2 rounded text-xs font-semibold cursor-pointer font-display"
        >
          {language === 'si' ? 'උදවු මධ්‍යස්ථානය වසන්න' : 'Close Help Center'}
        </button>
      </div>
    </div>
  );
};
