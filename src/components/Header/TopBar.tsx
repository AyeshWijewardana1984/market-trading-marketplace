import React, { useState } from 'react';
import { ChevronDown, Globe, PhoneCall, ShieldCheck, Truck, User } from 'lucide-react';
import { Currency, Language } from '../../types/marketplace';
import { t } from '../../i18n/translations';
import { UserAccount } from '../../services/authService';

interface TopBarProps {
  currentCurrency: Currency;
  onCurrencyChange: (curr: Currency) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenTrackOrder: () => void;
  onOpenHelp: () => void;
  onOpenAdminDashboard: () => void;
  userEmail: string | null;
  currentUser?: UserAccount | null;
  onSignOut: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentCurrency,
  onCurrencyChange,
  language,
  onLanguageChange,
  onOpenAuth,
  onOpenTrackOrder,
  onOpenHelp,
  onOpenAdminDashboard,
  userEmail,
  currentUser,
  onSignOut,
}) => {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currDropdownOpen, setCurrDropdownOpen] = useState(false);

  const currencies: Currency[] = ['USD', 'EUR', 'GBP'];

  return (
    <div className="bg-[#0c1524] text-slate-300 text-[11px] border-b border-slate-800/80 transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-y-1.5">
        {/* Left: Welcome Announcement */}
        <div className="flex items-center gap-2 text-slate-300 truncate">
          <span className="font-semibold text-white tracking-tight">
            {language === 'si' ? 'Market ගෝලීය වෙළඳ පරිශ්‍රයට සාදරයෙන් පිළිගනිමු!' : 'Welcome to Market Global Trade!'}
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-300">
            {language === 'si' ? 'විශේෂ තොග සහ සිල්ලර වට්ටම් · කූපන් කේතය:' : 'Weekend B2B & Retail Flash Savings · Active Coupon Code:'}
          </span>
          <span className="bg-amber-400/15 border border-amber-400/30 text-amber-300 px-1.5 py-0.5 rounded font-mono-numbers font-bold tracking-wider">
            Happy2017
          </span>
        </div>

        {/* Right: Quick actions & utilities */}
        <div className="flex items-center gap-3 sm:gap-5 ml-auto">
          {/* Quick 1-Click Language Switcher Pill */}
          <div className="flex items-center bg-slate-800/90 rounded border border-slate-700/80 p-0.5 shadow-xs">
            <button
              onClick={() => onLanguageChange('si')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                language === 'si'
                  ? 'bg-[#ea580c] text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="සිංහල භාෂාවට මාරු වන්න"
            >
              සිංහල
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-[#ea580c] text-white shadow-xs font-mono-numbers'
                  : 'text-slate-300 hover:text-white font-mono-numbers'
              }`}
              title="Switch to English"
            >
              EN
            </button>
          </div>

          {/* Language selector dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setLangDropdownOpen(!langDropdownOpen);
                setCurrDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{language === 'si' ? 'සිංහල' : 'English'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {langDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-32 bg-white text-slate-800 rounded shadow-lg border border-slate-200 py-1 z-50 text-xs">
                <button
                  onClick={() => {
                    onLanguageChange('si');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-100 transition-colors flex items-center justify-between ${
                    language === 'si' ? 'font-bold text-[#ea580c] bg-orange-50' : ''
                  }`}
                >
                  <span>සිංහල</span>
                  {language === 'si' && <span className="text-[#ea580c]">✓</span>}
                </button>
                <button
                  onClick={() => {
                    onLanguageChange('en');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-100 transition-colors flex items-center justify-between ${
                    language === 'en' ? 'font-bold text-[#ea580c] bg-orange-50' : ''
                  }`}
                >
                  <span>English</span>
                  {language === 'en' && <span className="text-[#ea580c]">✓</span>}
                </button>
              </div>
            )}
          </div>

          {/* Currency selector */}
          <div className="relative">
            <button
              onClick={() => {
                setCurrDropdownOpen(!currDropdownOpen);
                setLangDropdownOpen(false);
              }}
              className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <span className="font-medium font-mono-numbers">{currentCurrency}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {currDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-24 bg-white text-slate-800 rounded shadow-lg border border-slate-200 py-1 z-50 text-xs">
                {currencies.map((curr) => (
                  <button
                    key={curr}
                    onClick={() => {
                      onCurrencyChange(curr);
                      setCurrDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-100 transition-colors font-mono-numbers ${
                      currentCurrency === curr ? 'font-bold text-[#ea580c]' : ''
                    }`}
                  >
                    {curr} ({curr === 'USD' ? '$' : curr === 'EUR' ? '€' : '£'})
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Login or Register / User Account */}
          {userEmail ? (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-slate-200">
                <User className="w-3.5 h-3.5 text-[#ea580c]" />
                <span className="max-w-[130px] truncate font-medium">
                  {currentUser?.name || userEmail.split('@')[0]}
                </span>
                {currentUser && (
                  <span className={`text-[9px] font-bold font-mono px-1.5 py-0.2 rounded border ${
                    currentUser.role === 'super_admin'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : currentUser.role === 'catalog_admin'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : currentUser.role === 'vendor'
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                      : currentUser.role === 'buyer'
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {currentUser.role === 'super_admin' ? 'Admin' : currentUser.role.replace('_', ' ')}
                  </span>
                )}
              </span>
              {(userEmail.toLowerCase().includes('admin') || currentUser?.role === 'super_admin' || currentUser?.role === 'catalog_admin') && (
                <button
                  onClick={onOpenAdminDashboard}
                  className="bg-orange-500/20 text-orange-300 border border-orange-500/40 text-[9px] font-bold px-1.5 py-0.5 rounded font-mono hover:bg-orange-500/30 transition-colors cursor-pointer"
                  title="Switch to Admin Backend Dashboard"
                >
                  Admin Backend →
                </button>
              )}
              <button
                onClick={onSignOut}
                className="text-slate-400 hover:text-red-400 text-[10px] underline cursor-pointer"
              >
                ({t('logout', language)})
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth('login')}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>{t('signIn', language)}</span>
            </button>
          )}

          {/* Track Your Order */}
          <button
            onClick={onOpenTrackOrder}
            className="hidden lg:flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Truck className="w-3.5 h-3.5 text-slate-400" />
            <span>{t('trackOrder', language)}</span>
          </button>

          {/* Help Center */}
          <button
            onClick={onOpenHelp}
            className="hidden xl:flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>{t('helpFaq', language)}</span>
          </button>

          {/* Hotline */}
          <a
            href="tel:+1234567890"
            className="hidden sm:flex items-center gap-1 text-[#fb923c] hover:text-[#fdba74] font-semibold transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="font-mono-numbers">{language === 'si' ? 'ක්ෂණික ඇමතුම් (+123) 4 567 890' : 'Hotline (+123) 4 567 890'}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
