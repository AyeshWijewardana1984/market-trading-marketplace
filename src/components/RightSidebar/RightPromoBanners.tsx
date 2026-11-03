import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { PHOTO_PATHS } from '../Images/ProductImageRenderer';
import { ColorfulPillowsIllustration, GreyArmchairIllustration } from '../Images/ProductIllustrations';
import { Language } from '../../types/marketplace';

interface RightPromoBannersProps {
  onSelectBannerCategory: (category: string) => void;
  language?: Language;
}

export const RightPromoBanners: React.FC<RightPromoBannersProps> = ({ onSelectBannerCategory, language = 'si' }) => {
  const [pillowImgErr, setPillowImgErr] = useState(false);
  const [armchairImgErr, setArmchairImgErr] = useState(false);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
      {/* Top Banner: Colorful Pillows */}
      <div
        onClick={() => onSelectBannerCategory('Textiles')}
        className="bg-white border border-slate-200 rounded-sm p-3.5 hover:shadow-md transition-shadow cursor-pointer group flex flex-col justify-between"
      >
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-display">
            {language === 'si' ? 'රෙදිපිළි එකතුව' : 'Textile Collection'}
          </span>
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide mt-0.5 font-display">
            {language === 'si' ? 'වර්ණවත් කොට්ට' : 'COLORFUL PILLOWS'}
          </h4>
          <span className="text-xs font-bold text-[#ea580c] font-mono-numbers block mt-0.5">
            {language === 'si' ? '$29.99 සිට ආරම්භ වේ' : 'Starts at $29.99'}
          </span>
        </div>

        <div className="w-full h-32 flex items-center justify-center my-1.5 overflow-hidden">
          {!pillowImgErr ? (
            <img
              src={PHOTO_PATHS.colorfulPillows}
              alt="Colorful stacked pillows"
              referrerPolicy="no-referrer"
              onError={() => setPillowImgErr(true)}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <ColorfulPillowsIllustration className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
          )}
        </div>

        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 group-hover:text-[#ea580c] transition-colors pt-1 border-t border-slate-100 font-display">
          <span>{language === 'si' ? 'කොට්ට මිලදී ගන්න' : 'Shop pillows'}</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Bottom Banner: Interior Design Grey Armchair */}
      <div
        onClick={() => onSelectBannerCategory('Furniture')}
        className="bg-white border border-slate-200 rounded-sm p-3.5 hover:shadow-md transition-shadow cursor-pointer group flex flex-col justify-between"
      >
        <div>
          <span className="text-xs font-bold text-[#ea580c] font-mono-numbers block">
            $49.89
          </span>
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide mt-0.5 font-display">
            {language === 'si' ? 'අභ්‍යන්තර මෝස්තර' : 'INTERIOR DESIGN'}
          </h4>
          <span className="text-[10px] font-bold text-slate-500 underline block mt-0.5 group-hover:text-[#ea580c] font-display">
            {language === 'si' ? 'දැන් සාප්පු සවාරි' : 'Shop now'}
          </span>
        </div>

        <div className="w-full h-32 flex items-center justify-center my-1.5 overflow-hidden">
          {!armchairImgErr ? (
            <img
              src={PHOTO_PATHS.greyArmchair}
              alt="Grey armchair loveseat"
              referrerPolicy="no-referrer"
              onError={() => setArmchairImgErr(true)}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <GreyArmchairIllustration className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
          )}
        </div>

        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 group-hover:text-[#ea580c] transition-colors pt-1 border-t border-slate-100 font-display">
          <span>{language === 'si' ? 'ආසන ගවේෂණය කරන්න' : 'Explore seating'}</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};
