import React, { useState } from 'react';
import { Gift, Check, Copy } from 'lucide-react';
import { Language } from '../../types/marketplace';

interface CouponBarProps {
  onCopyCoupon: (code: string) => void;
  language?: Language;
}

export const CouponBar: React.FC<CouponBarProps> = ({ onCopyCoupon, language = 'si' }) => {
  const [copied, setCopied] = useState(false);
  const couponCode = 'Happy2017';

  const handleCopy = () => {
    onCopyCoupon(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="mt-4 bg-[#f8fafc] border border-slate-200 rounded-sm overflow-hidden flex flex-col sm:flex-row items-stretch justify-between shadow-xs">
      {/* Left Red Polygonal Banner Badge */}
      <div className="bg-gradient-to-r from-[#ea580c] to-[#ff6b3d] text-white px-5 py-2.5 flex items-center gap-2 font-bold text-xs uppercase tracking-wider relative shrink-0 font-display">
        <Gift className="w-4 h-4" />
        <span>{language === 'si' ? 'විශේෂ වෙළඳ දීමනාව' : 'Marketplace Special'}</span>
        {/* Slanted edge aesthetic */}
        <div className="hidden sm:block absolute right-[-12px] top-0 bottom-0 w-0 h-0 border-t-[38px] border-t-transparent border-l-[12px] border-l-[#ff6b3d] border-b-[0px]" />
      </div>

      {/* Center Promotional Text */}
      <div className="px-4 py-2 flex-1 flex items-center text-xs text-slate-700 font-medium truncate sm:pl-6">
        <span className="truncate">
          {language === 'si'
            ? 'සති අන්ත වෙළඳ ප්‍රසාද දීමනාව · ක්ෂණික 20% ක වට්ටම් කූපනය: '
            : 'Flash weekend trade bonus · Instant 20% discount voucher: '}
          <strong className="text-[#ea580c] font-bold font-mono-numbers text-sm bg-orange-100/80 border border-orange-200 px-1.5 py-0.5 rounded ml-1">
            {couponCode}
          </strong>
        </span>
      </div>

      {/* Right Action Button */}
      <div className="p-1.5 sm:p-2 shrink-0 flex items-center justify-end">
        <button
          onClick={handleCopy}
          className="w-full sm:w-auto bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-1.5 rounded font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs font-display"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-white" />
              <span>{language === 'si' ? 'පිටපත් විය! (20% වට්ටමක්)' : 'Copied! (20% OFF)'}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>{language === 'si' ? 'කූපනය ලබාගන්න' : 'Get Coupon'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
