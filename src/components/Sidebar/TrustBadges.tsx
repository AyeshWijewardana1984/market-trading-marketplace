import React from 'react';
import { Truck, ShieldCheck, Gift, RotateCcw } from 'lucide-react';
import { TRUST_BADGES } from '../../data/products';
import { Language } from '../../types/marketplace';

interface TrustBadgesProps {
  onBadgeClick?: (title: string, subtitle: string) => void;
  language?: Language;
}

export const TrustBadges: React.FC<TrustBadgesProps> = ({ onBadgeClick, language = 'en' }) => {
  const getBadgeIcon = (name: string) => {
    switch (name) {
      case 'Truck':
        return <Truck className="w-5 h-5 text-slate-600 group-hover:text-[#ea580c] transition-colors" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-slate-600 group-hover:text-[#ea580c] transition-colors" />;
      case 'Gift':
        return <Gift className="w-5 h-5 text-slate-600 group-hover:text-[#ea580c] transition-colors" />;
      default:
        return <RotateCcw className="w-5 h-5 text-slate-600 group-hover:text-[#ea580c] transition-colors" />;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-sm p-4 shadow-xs mt-6 space-y-4">
      {TRUST_BADGES.map((badge, idx) => {
        const title = language === 'si' && badge.titleSi ? badge.titleSi : badge.title;
        const subtitle = language === 'si' && badge.subtitleSi ? badge.subtitleSi : badge.subtitle;

        return (
          <div
            key={badge.id}
            onClick={() => onBadgeClick?.(title, subtitle)}
            className={`flex items-center gap-3.5 cursor-pointer group transition-colors ${
              idx < TRUST_BADGES.length - 1 ? 'pb-3.5 border-b border-slate-100' : ''
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 group-hover:border-[#ea580c] flex items-center justify-center shrink-0 transition-colors">
              {getBadgeIcon(badge.iconName)}
            </div>
            <div>
              <h4 className="text-[11px] font-bold tracking-wider text-slate-800 uppercase group-hover:text-[#ea580c] transition-colors font-display">
                {title}
              </h4>
              <p className="text-[10px] text-slate-500 font-medium font-sans">{subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
