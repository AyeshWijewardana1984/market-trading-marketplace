import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { PHOTO_PATHS } from '../Images/ProductImageRenderer';
import { Language } from '../../types/marketplace';
import { t } from '../../i18n/translations';

interface MiddleBannerProps {
  onShopNow: () => void;
  language?: Language;
}

export const MiddleBanner: React.FC<MiddleBannerProps> = ({ onShopNow, language = 'en' }) => {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div
      onClick={onShopNow}
      className="mt-7 relative rounded-sm overflow-hidden border border-slate-300/80 shadow-xs cursor-pointer group min-h-[220px] sm:min-h-[260px] flex items-center justify-between"
    >
      {/* Background Photo */}
      <div className="absolute inset-0 z-0">
        {!imgErr ? (
          <img
            src={PHOTO_PATHS.jacquardTowels}
            alt="Jacquard Warp Knitted Microfiber Towel on luxury bed"
            referrerPolicy="no-referrer"
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-stone-200 via-slate-100 to-stone-200" />
        )}
        {/* Soft light scrim overlay so the text is crisp and readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent md:to-transparent" />
      </div>

      {/* Left Special Offer 75% Badge */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0c1524] border-2 border-dashed border-[#ea580c] flex flex-col items-center justify-center text-white shadow-xl rotate-[-12deg] group-hover:rotate-0 transition-transform">
          <span className="text-[7px] uppercase font-bold text-slate-300 leading-none tracking-wider font-display">
            {language === 'si' ? 'විශේෂ' : 'SPECIAL'}
          </span>
          <span className="text-[#ea580c] font-black text-xs sm:text-sm leading-none mt-0.5 font-mono-numbers">
            75%
          </span>
          <span className="text-[7px] uppercase font-bold text-slate-300 leading-none font-display">
            {t('off', language)}
          </span>
        </div>
      </div>

      {/* Content Details */}
      <div className="relative z-10 text-left pl-18 sm:pl-24 max-w-lg p-4 sm:p-6">
        <h3 className="text-lg sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-snug drop-shadow-xs font-display">
          {language === 'si'
            ? 'ජැකාර්ඩ් සුඛෝපභෝගී මයික්‍රෝෆයිබර් හෝටල් තුවා'
            : 'Jacquard Warp Knitted Microfiber Towel'}
        </h3>
        <p className="text-slate-700 text-xs sm:text-sm mt-1.5 font-medium leading-relaxed font-sans">
          {language === 'si'
            ? 'ප්‍රිමියම් අධි-ඝනත්ව රෙදිපිළි · හෝටල් සහ නිවාස සඳහා අතිශය තෙතමනය උරාගන්නා සුපිරි නිමාව'
            : 'Premium high-density weave · Ultra absorbent microfiber for commercial hospitality'}
        </p>
        <div className="mt-4 inline-block">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShopNow();
            }}
            className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-5 sm:px-6 py-2.5 rounded font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-transform group-hover:scale-105 cursor-pointer font-display"
          >
            <span>{t('shopNow', language)}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
