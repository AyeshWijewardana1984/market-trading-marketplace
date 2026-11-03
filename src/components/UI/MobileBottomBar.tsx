import React from 'react';
import { Home, LayoutGrid, Flame, Heart, ShoppingBag } from 'lucide-react';
import { Currency, Language } from '../../types/marketplace';

interface MobileBottomBarProps {
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  currency: Currency;
  language?: Language;
  onGoHome: () => void;
  onOpenCategories: () => void;
  onGoDeals: () => void;
  onOpenWishlist: () => void;
  onOpenCart: () => void;
  activeTab?: string;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  cartCount,
  cartTotal,
  wishlistCount,
  currency,
  language = 'en',
  onGoHome,
  onOpenCategories,
  onGoDeals,
  onOpenWishlist,
  onOpenCart,
  activeTab = 'home',
}) => {
  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';
  const currencyRate = currency === 'USD' ? 1 : currency === 'EUR' ? 0.92 : 0.79;
  const formattedTotal = (cartTotal * currencyRate).toFixed(2);

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-2 py-1 flex items-center justify-around select-none">
      {/* 1. Home */}
      <button
        onClick={onGoHome}
        className="flex flex-col items-center justify-center py-1 px-2 text-slate-600 hover:text-[#ea580c] transition-colors cursor-pointer group active:scale-95"
      >
        <Home className="w-5 h-5 text-slate-700 group-hover:text-[#ea580c] transition-colors" />
        <span className="text-[10px] font-bold mt-0.5 tracking-tight font-display">
          {language === 'si' ? 'මුල් පිටුව' : 'Home'}
        </span>
      </button>

      {/* 2. Categories / Departments */}
      <button
        onClick={onOpenCategories}
        className="flex flex-col items-center justify-center py-1 px-2 text-slate-600 hover:text-[#ea580c] transition-colors cursor-pointer group active:scale-95"
      >
        <LayoutGrid className="w-5 h-5 text-slate-700 group-hover:text-[#ea580c] transition-colors" />
        <span className="text-[10px] font-bold mt-0.5 tracking-tight font-display">
          {language === 'si' ? 'අංශ' : 'Categories'}
        </span>
      </button>

      {/* 3. Daily Flash Deals (Floating focal center button) */}
      <button
        onClick={onGoDeals}
        className="flex flex-col items-center justify-center py-1 px-2 text-[#ea580c] hover:text-[#c2410c] transition-colors cursor-pointer group active:scale-95 relative"
      >
        <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-[#ea580c] -mt-1 group-hover:bg-orange-500/20 transition-colors shadow-xs">
          <Flame className="w-5 h-5 text-[#ea580c]" />
        </div>
        <span className="text-[10px] font-bold mt-0.5 tracking-tight font-display text-[#ea580c]">
          {language === 'si' ? 'දීමනා' : 'Deals'}
        </span>
      </button>

      {/* 4. Wishlist */}
      <button
        onClick={onOpenWishlist}
        className="flex flex-col items-center justify-center py-1 px-2 text-slate-600 hover:text-[#ea580c] transition-colors cursor-pointer group relative active:scale-95"
      >
        <div className="relative">
          <Heart className="w-5 h-5 text-slate-700 group-hover:text-[#ea580c] transition-colors" />
          {wishlistCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-[#ea580c] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center font-mono shadow-xs">
              {wishlistCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold mt-0.5 tracking-tight font-display">
          {language === 'si' ? 'කැමැත්ත' : 'Wishlist'}
        </span>
      </button>

      {/* 5. Cart */}
      <button
        onClick={onOpenCart}
        className="flex flex-col items-center justify-center py-1 px-2 text-slate-600 hover:text-[#ea580c] transition-colors cursor-pointer group relative active:scale-95"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 text-slate-700 group-hover:text-[#ea580c] transition-colors" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-[#ea580c] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center font-mono shadow-xs">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold mt-0.5 tracking-tight font-display text-slate-700">
          {cartCount > 0 ? `${currencySymbol}${formattedTotal}` : (language === 'si' ? 'කරත්තය' : 'Cart')}
        </span>
      </button>
    </div>
  );
};
