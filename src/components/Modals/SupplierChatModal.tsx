import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Building2,
  Award,
  ShieldCheck,
  Paperclip,
  CheckCheck,
  FileText,
  Clock
} from 'lucide-react';
import { Language } from '../../types/marketplace';
import { getVendorName } from '../../i18n/translations';

interface ChatMessage {
  id: string;
  sender: 'vendor' | 'user';
  text: string;
  time: string;
}

interface SupplierChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorName: string;
  productName?: string;
  onRequestQuote: () => void;
  language?: Language;
}

export const SupplierChatModal: React.FC<SupplierChatModalProps> = ({
  isOpen,
  onClose,
  vendorName,
  productName,
  onRequestQuote,
  language = 'si',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isSi = language === 'si';
  const cleanVendor = getVendorName(vendorName || 'Direct Tech Co.', language);

  // Initial welcome greeting when chat opens
  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (isSi) {
        setMessages([
          {
            id: 'm1',
            sender: 'vendor',
            text: `ආයුබෝවන්! ${cleanVendor} හි නිල තහවුරු කළ වෙළඳ මේසය වෙත සාදරයෙන් පිළිගනිමු.`,
            time: timeStr,
          },
          {
            id: 'm2',
            sender: 'vendor',
            text: productName
              ? `ඔබ "${productName}" පිළිබඳව විමසන බව අපට පෙනේ. තොග මිල ගණන්, සාම්පල බෙදාහැරීම හෝ සහතික පත්‍ර සම්බන්ධයෙන් අපගේ අපනයන කණ්ඩායම ඔබට කෙසේ සහාය විය හැකිද?`
              : `අපගේ අපනයන සහ නිෂ්පාදන වෙළඳ කණ්ඩායම අද ඔබේ මිලදී ගැනීම් සඳහා කෙසේ සහාය විය හැකිද?`,
            time: timeStr,
          },
        ]);
      } else {
        setMessages([
          {
            id: 'm1',
            sender: 'vendor',
            text: `Hello! Welcome to ${cleanVendor}'s official verified trade desk.`,
            time: timeStr,
          },
          {
            id: 'm2',
            sender: 'vendor',
            text: productName
              ? `We see you are inquiring regarding "${productName}". How can our export team help with wholesale pricing, sample delivery, or certifications today?`
              : `How can our export & manufacturing trade team assist your procurement today?`,
            time: timeStr,
          },
        ]);
      }
    }
  }, [isOpen, cleanVendor, productName, isSi]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const quickPrompts = isSi
    ? [
        'ඒකක 50+ සඳහා තොග මිල කොපමණද?',
        'ඔබට කඩිනම් සාම්පල ඇණවුමක් යැවිය හැකිද?',
        'නැව්ගත කිරීමේ ප්‍රවාහන කාලසීමාවන් මොනවාද?',
        'ඔබ OEM / අභිරුචි ලාංඡන මුද්‍රණයට සහාය දක්වනවාද?',
      ]
    : [
        'What is the wholesale tier price for 50+ units?',
        'Can you dispatch an expedited sample order?',
        'What are the freight transit times to North America / EU?',
        'Do you support OEM / custom logo printing?',
      ];

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      time: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal('');

    // Simulate instant supplier trade response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let reply = isSi
        ? `ඔබගේ විමසුමට ස්තූතියි! අපගේ ජාත්‍යන්තර වාණිජ නියෝජිතයා ඔබගේ ඉල්ලීම ලබාගෙන ඇත: "${text.slice(0, 45)}...". සම්පූර්ණ වෙළඳ ඇපකර ආරක්ෂාව සමඟින් තහවුරු කළ ඇණවුම් සඳහා පැය 48ක් ඇතුළත භාණ්ඩ නැව්ගත කිරීම අපි සහතික කරමු.`
        : `Thank you for your inquiry! Our international commercial representative has received your request regarding: "${text.slice(0, 45)}...". We guarantee shipment dispatch within 48 hours for verified orders with full trade assurance escrow protection.`;

      const lower = text.toLowerCase();
      if (lower.includes('sample') || lower.includes('සාම්පල')) {
        reply = isSi
          ? `ඔව්, අපගේ ගබඩාවෙන් සාම්පල පහසුවෙන්ම ලබාගත හැකිය! අපට පැය 24-48ක් ඇතුළත DHL/FedEx Express හරහා සාම්පල ඒකකයක් එවිය හැක. අපි නිල Proforma ඉන්වොයිසියක් සකස් කළ යුතුද?`
          : `Yes, samples are readily available from our warehouse hub! We can dispatch a sample unit via DHL/FedEx Express in 24-48 hours. Would you like us to generate an official Proforma Invoice?`;
      } else if (lower.includes('wholesale') || lower.includes('තොග') || lower.includes('50') || lower.includes('tier')) {
        reply = isSi
          ? `ඒකක 50කට වැඩි ඇණවුම් සඳහා, අපි ලැයිස්තුගත මිලෙන් 20%ක් දක්වා වට්ටම් සහ මුහුදු/ගුවන් බහාලුම් නැව්ගත කිරීමේ සහන ලබා දෙන්නෙමු. ප්‍රමාණ අවසන් කිරීමට ඉහත ඇති "RFQ ඉල්ලන්න" ක්ලික් කරන්න!`
          : `For orders over 50 units, we offer volume tier discounting with up to 20% off list price and subsidized ocean/air container shipping. Click "Request RFQ" above to finalize quantities!`;
      } else if (lower.includes('oem') || lower.includes('custom') || lower.includes('ලාංඡන')) {
        reply = isSi
          ? `අපි ලේසර් කැටයම්, අභිරුචි ඇසුරුම් සහ බාර්කෝඩ් මුද්‍රණය ඇතුළු පුළුල් OEM/ODM සේවා සපයන්නෙමු. අභිරුචි වෙළඳ නාමකරණය සඳහා අවම ඇණවුම ඒකක 20කි.`
          : `We provide comprehensive OEM/ODM customization including laser engraving, custom Pantone packaging, and serialized barcodes. Minimum order for custom branding is 20 units.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `rep-${Date.now()}`,
          sender: 'vendor',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />

      <div className="relative bg-white rounded-md shadow-2xl max-w-lg w-full overflow-hidden z-10 flex flex-col h-[580px] animate-in fade-in zoom-in-95 duration-150">
        {/* Chat Header */}
        <div className="bg-[#232f3e] text-white p-3.5 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#ff5c00] flex items-center justify-center font-bold text-white shadow-sm">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#232f3e] rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-white tracking-tight leading-tight">
                  {cleanVendor}
                </h3>
                <span className="bg-amber-400 text-slate-900 text-[9px] font-black px-1.5 py-0.5 rounded uppercase flex items-center gap-0.5 font-display">
                  <Award className="w-2.5 h-2.5" />
                  {isSi ? 'රන් 5 වසර' : 'Gold 5Y'}
                </span>
              </div>
              <div className="text-[11px] text-slate-300 flex items-center gap-2 mt-0.5">
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {isSi ? 'සබැඳිව ඇත' : 'Online'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3 h-3" />
                  {isSi ? 'මිනිත්තු 15කින් පිළිතුරු' : 'Replies in <15 mins'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                onClose();
                onRequestQuote();
              }}
              className="hidden sm:flex items-center gap-1 bg-[#ff5c00] hover:bg-[#e05100] text-white text-[11px] font-bold px-2.5 py-1.5 rounded transition-colors cursor-pointer font-display"
              title="Request formal wholesale quote"
            >
              <FileText className="w-3 h-3" />
              <span>{isSi ? 'RFQ ඉල්ලන්න' : 'Request RFQ'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Trade Assurance Security Strip */}
        <div className="bg-emerald-50 border-b border-emerald-100 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-emerald-800">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {isSi
                ? 'වෙළඳපල ඇපකර ආරක්ෂණය: භාණ්ඩ ලැබීම තහවුරු කරන තුරු ඔබගේ මුදල් සුරක්ෂිතයි.'
                : 'Marketplace Escrow Protected: Payments are safe until delivery confirmation.'}
            </span>
          </div>
          <span className="font-mono text-[10px] text-emerald-700 font-bold hidden sm:inline">256-Bit SSL</span>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50 text-xs">
          {messages.map((m) => {
            const isMe = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in fade-in duration-100`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-3 shadow-xs leading-relaxed ${
                    isMe
                      ? 'bg-[#ff5c00] text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-none'
                  }`}
                >
                  <p>{m.text}</p>
                </div>
                <div className="flex items-center gap-1 mt-1 px-1 text-[10px] text-slate-400 font-mono-numbers">
                  <span>{m.time}</span>
                  {isMe && <CheckCheck className="w-3.5 h-3.5 text-blue-500 inline" />}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-1.5 text-slate-400 text-xs py-1">
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] text-slate-500 italic ml-1">
                {cleanVendor} {isSi ? 'පිළිතුරු ලියමින් සිටී...' : 'is typing...'}
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-slate-400 font-semibold shrink-0 pl-1">
            {isSi ? 'යෝජිත:' : 'Suggested:'}
          </span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="bg-slate-100 hover:bg-orange-50 hover:text-[#ff5c00] hover:border-orange-200 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap border border-slate-200 transition-colors cursor-pointer shrink-0 font-sans"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <button
            type="button"
            onClick={() =>
              handleSend(
                isSi
                  ? 'මිල ගණන් ඉල්ලීම සඳහා පිරිවිතර ලේඛනය අමුණා ඇත.'
                  : 'Attached specification drawing for quotation request.'
              )
            }
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
            title={isSi ? 'පිරිවිතර හෝ සැලසුම් එක් කරන්න' : 'Attach Specs or Drawing'}
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={
              isSi
                ? 'සැපයුම්කරු වෙත ඔබේ වෙළඳ විමසුම හෝ පණිවිඩය ටයිප් කරන්න...'
                : 'Type your trade inquiry or message to supplier...'
            }
            className="flex-1 bg-slate-100 border border-slate-200 rounded-md px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#ff5c00] focus:bg-white transition-colors"
          />

          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="bg-[#ff5c00] hover:bg-[#e05100] disabled:opacity-40 disabled:hover:bg-[#ff5c00] text-white p-2 rounded-md transition-colors cursor-pointer flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
