import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Heart, Search, ShoppingBag, ChevronDown, Menu } from 'lucide-react';
import { CategoryItem, Currency, Language } from '../../types/marketplace';
import { getStoredDepartments, subscribeToDepartments } from '../../services/departmentService';
import { DepartmentIcon } from '../Common/DepartmentIcon';
import { getCategoryName, t } from '../../i18n/translations';

interface MainHeaderProps {
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  compareCount: number;
  currency: Currency;
  language: Language;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenCompare: () => void;
  onSearch: (query: string, category: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onGoHome?: () => void;
  onOpenMobileMenu?: () => void;
}

export const MainHeader: React.FC<MainHeaderProps> = ({
  cartCount,
  cartTotal,
  wishlistCount,
  compareCount,
  currency,
  language,
  onOpenCart,
  onOpenWishlist,
  onOpenCompare,
  onSearch,
  selectedCategory,
  onSelectCategory,
  onGoHome,
  onOpenMobileMenu,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [departments, setDepartments] = useState<CategoryItem[]>(() => getStoredDepartments());

  useEffect(() => {
    setDepartments(getStoredDepartments());
    const unsubscribe = subscribeToDepartments((latest) => {
      setDepartments(latest);
    });
    return unsubscribe;
  }, []);

  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';
  const currencyRate = currency === 'USD' ? 1 : currency === 'EUR' ? 0.92 : 0.79;
  const formattedTotal = (cartTotal * currencyRate).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery, selectedCategory);
  };

  const displayCategory = selectedCategory === 'All'
    ? t('allDepartments', language)
    : getCategoryName(selectedCategory, language);

  return (
    <div className="bg-[#111d2e] text-white py-2 sm:py-2.5 md:py-3 border-b border-[#1e2d42] relative z-40">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        
        {/* MOBILE LAYOUT (< md) */}
        <div className="md:hidden flex flex-col gap-2.5">
          {/* Mobile Top Row: Hamburger + Brand + Wishlist + Cart */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {onOpenMobileMenu && (
                <button
                  type="button"
                  onClick={onOpenMobileMenu}
                  className="w-9 h-9 rounded bg-[#18263a] hover:bg-[#1f314a] text-slate-200 flex items-center justify-center border border-[#263c5a] cursor-pointer active:scale-95 transition-all"
                  title="Open Navigation Menu"
                  aria-label="Open Navigation Menu"
                >
                  <Menu className="w-5 h-5 text-slate-200" />
                </button>
              )}

              {/* Brand Logo */}
              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => {
                  if (onGoHome) onGoHome();
                  else onSelectCategory('All');
                }}
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#ea580c] to-[#ff7a45] flex items-center justify-center font-bold text-sm text-white shadow-md">
                  <span className="translate-y-[-1px]">@</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black tracking-tight leading-none text-white font-display">
                    market
                  </span>
                  <span className="text-[8px] text-slate-400 font-semibold tracking-wider uppercase">
                    {language === 'si' ? 'වෙළඳ පරිශ්‍රය' : 'Multi-Trade'}
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Actions: Wishlist + Cart */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenWishlist}
                className="w-9 h-9 rounded bg-[#18263a] hover:bg-[#1f314a] text-slate-200 flex items-center justify-center border border-[#263c5a] cursor-pointer relative active:scale-95 transition-all"
                title={t('wishlist', language)}
              >
                <Heart className="w-4 h-4 text-slate-300" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#ea580c] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={onOpenCart}
                className="flex items-center gap-1.5 bg-[#18263a] hover:bg-[#1f314a] pl-2 pr-2.5 py-1.5 rounded border border-[#263c5a] cursor-pointer active:scale-95 transition-all"
                title={t('cart', language)}
              >
                <div className="relative w-6 h-6 rounded-full bg-gradient-to-tr from-[#ea580c] to-[#ff7a45] flex items-center justify-center text-white shrink-0">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span className="absolute -top-1 -right-1 bg-white text-[#ea580c] text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center shadow font-mono">
                    {cartCount}
                  </span>
                </div>
                <span className="text-[#fb923c] font-bold font-mono text-xs">
                  {currencySymbol}{formattedTotal}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Bottom Row: Full-width Search Bar */}
          <form onSubmit={handleSubmit} className="flex h-9 w-full bg-white rounded shadow-sm relative focus-within:ring-2 focus-within:ring-[#ea580c]/50">
            {/* Category Dropdown Trigger */}
            <div className="relative shrink-0 border-r border-slate-200">
              <button
                type="button"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="h-full px-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors max-w-[110px] rounded-l"
              >
                <span className="truncate">{displayCategory}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 shrink-0 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoryDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setCategoryDropdownOpen(false)}
                  />
                  <div className="absolute left-0 top-full mt-1.5 w-60 max-h-72 overflow-y-auto bg-white rounded shadow-2xl border border-slate-200 py-1.5 z-50 text-xs text-slate-800 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1 font-bold text-slate-400 text-[10px] uppercase tracking-wider border-b border-slate-100 mb-1 font-display">
                      {language === 'si' ? 'අංශ අනුව පෙරන්න' : 'Filter by Department'}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectCategory('All');
                        setCategoryDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-orange-50 hover:text-[#ea580c] transition-colors cursor-pointer flex items-center justify-between ${
                        selectedCategory === 'All' ? 'font-bold text-[#ea580c] bg-orange-50/80' : ''
                      }`}
                    >
                      <span>{t('allDepartments', language)}</span>
                      {selectedCategory === 'All' && <span className="text-[#ea580c] font-bold">✓</span>}
                    </button>
                    {departments.map((cat) => {
                      const catDisplayName = language === 'si' && cat.nameSi ? cat.nameSi : cat.name;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            onSelectCategory(cat.name);
                            setCategoryDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 hover:bg-orange-50 hover:text-[#ea580c] transition-colors cursor-pointer truncate flex items-center justify-between gap-2 ${
                            selectedCategory === cat.name ? 'font-bold text-[#ea580c] bg-orange-50/80' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <DepartmentIcon iconName={cat.iconName} className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{catDisplayName}</span>
                          </div>
                          {selectedCategory === cat.name && <span className="text-[#ea580c] font-bold shrink-0 ml-1">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder', language)}
              className="flex-1 px-2.5 text-xs text-slate-800 focus:outline-none placeholder:text-slate-400 min-w-0"
            />

            <button
              type="submit"
              className="px-3.5 bg-[#ea580c] hover:bg-[#c2410c] text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 rounded-r shadow-xs active:scale-95 font-display text-xs font-bold gap-1"
              title={t('searchBtn', language)}
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* DESKTOP LAYOUT (>= md) */}
        <div className="hidden md:flex items-center justify-between gap-4">
          {/* Left: Brand Logo */}
          <div
            className="flex items-center gap-3 shrink-0 cursor-pointer group"
            onClick={() => {
              if (onGoHome) onGoHome();
              else onSelectCategory('All');
            }}
            title={language === 'si' ? 'මුල් පිටුවට යන්න' : 'Return to Marketplace Home'}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ea580c] to-[#ff7a45] flex items-center justify-center font-bold text-lg text-white shadow-md">
                <span className="translate-y-[-1px]">@</span>
              </div>
              <div className="ml-2">
                <div className="text-xl md:text-2xl font-black tracking-tight leading-none text-white flex items-center font-display">
                  market
                </div>
                <div className="text-[9px] text-slate-300 font-semibold tracking-widest uppercase mt-0.5">
                  {language === 'si' ? 'බහු-වෙළෙන්දන්ගේ වෙළඳ පරිශ්‍රය' : 'multi trading hub'}
                </div>
              </div>
            </div>
          </div>

          {/* Center: Search Bar with All Categories dropdown */}
          <div className="w-full md:max-w-xl lg:max-w-2xl flex-1 mx-2 lg:mx-4 relative z-50">
            <form onSubmit={handleSubmit} className="flex h-9.5 w-full bg-white rounded shadow-sm relative focus-within:ring-2 focus-within:ring-[#ea580c]/50">
              <div className="relative shrink-0 border-r border-slate-200">
                <button
                  type="button"
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  className="h-full px-3.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors max-w-[180px] rounded-l"
                >
                  <span className="truncate">{displayCategory}</span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 shrink-0 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {categoryDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setCategoryDropdownOpen(false)}
                    />
                    <div className="absolute left-0 top-full mt-1.5 w-64 max-h-80 overflow-y-auto bg-white rounded shadow-2xl border border-slate-200 py-1.5 z-50 text-xs text-slate-800 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-3 py-1 font-bold text-slate-400 text-[10px] uppercase tracking-wider border-b border-slate-100 mb-1 font-display">
                        {language === 'si' ? 'අංශ අනුව පෙරන්න' : 'Filter by Department'}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectCategory('All');
                          setCategoryDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 hover:bg-orange-50 hover:text-[#ea580c] transition-colors cursor-pointer flex items-center justify-between ${
                          selectedCategory === 'All' ? 'font-bold text-[#ea580c] bg-orange-50/80' : ''
                        }`}
                      >
                        <span>{t('allDepartments', language)}</span>
                        {selectedCategory === 'All' && <span className="text-[#ea580c] font-bold">✓</span>}
                      </button>
                      {departments.map((cat) => {
                        const catDisplayName = language === 'si' && cat.nameSi ? cat.nameSi : cat.name;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              onSelectCategory(cat.name);
                              setCategoryDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 hover:bg-orange-50 hover:text-[#ea580c] transition-colors cursor-pointer truncate flex items-center justify-between gap-2 ${
                              selectedCategory === cat.name ? 'font-bold text-[#ea580c] bg-orange-50/80' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <DepartmentIcon iconName={cat.iconName} className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{catDisplayName}</span>
                            </div>
                            {selectedCategory === cat.name && <span className="text-[#ea580c] font-bold shrink-0 ml-1">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder', language)}
                className="flex-1 px-4 text-xs sm:text-sm text-slate-800 focus:outline-none placeholder:text-slate-400 min-w-0"
              />

              <button
                type="submit"
                className="px-5 lg:px-6 bg-[#ea580c] hover:bg-[#c2410c] text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 rounded-r shadow-xs active:scale-95 font-display text-xs font-bold gap-1"
                title={t('searchBtn', language)}
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">{t('searchBtn', language)}</span>
              </button>
            </form>
          </div>

          {/* Right: Compare, Wishlist, My Cart */}
          <div className="flex items-center gap-4 lg:gap-6 shrink-0">
            {/* Compare Button */}
            <button
              onClick={onOpenCompare}
              className="flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors cursor-pointer group relative"
              title={t('compare', language)}
            >
              <div className="relative">
                <ArrowLeftRight className="w-5 h-5 text-slate-300 group-hover:text-white" />
                {compareCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#ea580c] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
                    {compareCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium hidden xl:inline">{t('compare', language)}</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors cursor-pointer group relative"
              title={t('wishlist', language)}
            >
              <div className="relative">
                <Heart className="w-5 h-5 text-slate-300 group-hover:text-white" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#ea580c] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium hidden xl:inline">{t('wishlist', language)}</span>
            </button>

            {/* My Cart Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2.5 bg-[#18263a] hover:bg-[#1f314a] px-3 py-1.5 rounded transition-colors cursor-pointer group border border-[#263c5a]"
            >
              <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-[#ea580c] to-[#ff7a45] group-hover:from-[#c2410c] group-hover:to-[#ea580c] flex items-center justify-center text-white shrink-0 shadow-inner">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="absolute -top-1 -right-1 bg-white text-[#ea580c] text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center shadow font-mono">
                  {cartCount}
                </span>
              </div>
              <div className="text-left text-xs hidden sm:block">
                <span className="text-slate-300 font-semibold block uppercase text-[9px] leading-tight font-display">
                  {language === 'si' ? 'මගේ කරත්තය' : 'MY CART'}
                </span>
                <span className="text-[#fb923c] font-bold font-mono text-xs leading-none">
                  {currencySymbol}{formattedTotal}
                </span>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
