import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { PHOTO_PATHS } from '../Images/ProductImageRenderer';
import { PinkArmchairIllustration } from '../Images/ProductIllustrations';
import { Language } from '../../types/marketplace';
import { t } from '../../i18n/translations';

interface SidebarBannersProps {
  onShopBanner: (category: string) => void;
  language?: Language;
}

export const TopSidebarBanner: React.FC<SidebarBannersProps> = ({ onShopBanner, language = 'en' }) => {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div
      onClick={() => onShopBanner('Furniture')}
      className="relative bg-gradient-to-br from-[#0c1524] via-[#111d2e] to-[#152238] rounded-sm overflow-hidden p-4 text-white shadow-xs mt-6 cursor-pointer group border border-slate-800"
    >
      <div className="relative z-10">
        <span className="text-[#ea580c] font-bold text-xs uppercase tracking-wider block font-mono-numbers">
          $49.89
        </span>
        <h4 className="text-sm font-extrabold tracking-wide uppercase mt-1 leading-snug font-display text-white">
          {language === 'si' ? 'අභ්‍යන්තර නිර්මාණ' : 'INTERIOR DESIGN'}
        </h4>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 group-hover:text-[#ea580c] mt-2 transition-colors">
          <span className="font-display">{t('shopNow', language)}</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* High Quality Original Photo Backdrop */}
      <div className="absolute right-0 bottom-0 w-36 h-28 opacity-40 group-hover:opacity-60 transition-opacity overflow-hidden pointer-events-none">
        {!imgErr ? (
          <img
            src={PHOTO_PATHS.greyArmchair}
            alt="Interior design preview"
            referrerPolicy="no-referrer"
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full border-4 border-[#ea580c]/20 rounded-full" />
        )}
      </div>
    </div>
  );
};

export const BottomSidebarBanner: React.FC<SidebarBannersProps> = ({ onShopBanner, language = 'en' }) => {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div
      onClick={() => onShopBanner('Furniture')}
      className="bg-amber-500/5 border border-amber-500/20 rounded-sm p-4 text-center shadow-xs mt-6 cursor-pointer group hover:border-[#ea580c]/50 transition-colors"
    >
      <span className="text-[#ea580c] font-bold text-[11px] uppercase tracking-wider block font-mono-numbers">
        {language === 'si' ? '50% දක්වා වට්ටම්' : 'up to 50% OFF'}
      </span>
      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide mt-0.5 font-display">
        {language === 'si' ? 'විවේක පුටු ගෘහ භාණ්ඩ' : 'ARMCHAIR FURNITURE'}
      </h4>
      <span className="text-[10px] font-bold text-[#ea580c] underline block mt-0.5 group-hover:text-[#c2410c] font-display">
        {t('shopNow', language)}
      </span>

      <div className="w-36 h-36 mx-auto mt-2 overflow-hidden flex items-center justify-center">
        {!imgErr ? (
          <img
            src={PHOTO_PATHS.pinkArmchair}
            alt="Pink Nordic Armchair"
            referrerPolicy="no-referrer"
            onError={() => setImgErr(true)}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <PinkArmchairIllustration className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
        )}
      </div>
    </div>
  );
};
