import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Globe,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  FileText,
  HelpCircle,
  Briefcase,
  Store,
  Flame,
  LayoutGrid,
  Home,
  Wrench,
  Gift,
  Shirt,
  FlaskConical,
  Eye,
  Radio,
  Gem,
  MoreHorizontal
} from 'lucide-react';
import { CategoryItem, Currency, Language } from '../../types/marketplace';
import { getStoredDepartments, subscribeToDepartments } from '../../services/departmentService';
import { DepartmentIcon } from '../Common/DepartmentIcon';
import { getCategoryName, t } from '../../i18n/translations';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currentCurrency: Currency;
  onCurrencyChange: (curr: Currency) => void;
  userEmail: string | null;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onSignOut: () => void;
  onOpenVendorModal: () => void;
  onOpenTrackOrder: () => void;
  onOpenB2BQuote: () => void;
  onOpenHelp: () => void;
  onOpenBlog: () => void;
  onOpenPages: () => void;
  onOpenAdminDashboard: () => void;
  onSelectNav: (nav: string) => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
  language,
  onLanguageChange,
  currentCurrency,
  onCurrencyChange,
  userEmail,
  onOpenAuth,
  onSignOut,
  onOpenVendorModal,
  onOpenTrackOrder,
  onOpenB2BQuote,
  onOpenHelp,
  onOpenBlog,
  onOpenPages,
  onOpenAdminDashboard,
  onSelectNav,
}) => {
  const [activeTab, setActiveTab] = useState<'departments' | 'menu'>('departments');
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [departments, setDepartments] = useState<CategoryItem[]>(() => getStoredDepartments());

  useEffect(() => {
    setDepartments(getStoredDepartments());
    const unsubscribe = subscribeToDepartments((latest) => {
      setDepartments(latest);
    });
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wrench':
        return <Wrench className="w-4 h-4 text-[#ea580c]" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-[#ea580c]" />;
      case 'Gift':
        return <Gift className="w-4 h-4 text-[#ea580c]" />;
      case 'Shirt':
        return <Shirt className="w-4 h-4 text-[#ea580c]" />;
      case 'Briefcase':
        return <Briefcase className="w-4 h-4 text-[#ea580c]" />;
      case 'FlaskConical':
        return <FlaskConical className="w-4 h-4 text-[#ea580c]" />;
      case 'Eye':
        return <Eye className="w-4 h-4 text-[#ea580c]" />;
      case 'Home':
        return <Home className="w-4 h-4 text-[#ea580c]" />;
      case 'Radio':
        return <Radio className="w-4 h-4 text-[#ea580c]" />;
      case 'Gem':
        return <Gem className="w-4 h-4 text-[#ea580c]" />;
      default:
        return <MoreHorizontal className="w-4 h-4 text-[#ea580c]" />;
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    onSelectCategory(categoryName);
    onClose();
    const el = document.getElementById('trending-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
      {/* Dimmed backdrop with blur */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Drawer content pane */}
      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div className="w-[85vw] max-w-sm bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-250">
          
          {/* Header: User Account Bar & Close Button */}
          <div className="p-4 bg-[#0c1524] text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#ea580c] to-[#ff7a45] flex items-center justify-center font-bold text-white text-base shadow-sm">
                @
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black text-white tracking-tight leading-none font-display">
                  market
                </span>
                {userEmail ? (
                  <span className="text-[11px] text-slate-300 font-medium truncate max-w-[160px] mt-0.5">
                    {userEmail}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                    {language === 'si' ? 'ගෝලීය වෙළඳ පරිශ්‍රය' : 'Multi-Trading Hub'}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Sign In / Profile Quick Bar */}
          <div className="px-4 py-2.5 bg-[#111d2e] border-b border-slate-800 flex items-center justify-between text-xs text-slate-200">
            {userEmail ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{language === 'si' ? 'සම්බන්ධ වී ඇත' : 'Signed In'}</span>
                </div>
                {userEmail.toLowerCase().includes('admin') && (
                  <button
                    onClick={() => {
                      onOpenAdminDashboard();
                      onClose();
                    }}
                    className="bg-orange-500/20 text-orange-300 border border-orange-500/40 text-[10px] font-bold px-2 py-0.5 rounded font-mono hover:bg-orange-500/30 transition-colors"
                  >
                    Backend →
                  </button>
                )}
                <button
                  onClick={() => {
                    onSignOut();
                    onClose();
                  }}
                  className="text-slate-400 hover:text-red-400 text-[11px] underline ml-2"
                >
                  {t('logout', language)}
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth('login');
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] text-white py-2 rounded font-bold text-xs uppercase tracking-wider font-display transition-colors shadow-sm"
              >
                <User className="w-4 h-4" />
                <span>{t('signIn', language)} / {language === 'si' ? 'ලියාපදිංචි වන්න' : 'Register'}</span>
              </button>
            )}
          </div>

          {/* Segmented Tab Switcher: Departments vs Navigation Menu */}
          <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold font-display">
            <button
              onClick={() => setActiveTab('departments')}
              className={`flex-1 py-3 text-center transition-all flex items-center justify-center gap-1.5 border-b-2 ${
                activeTab === 'departments'
                  ? 'border-[#ea580c] text-[#ea580c] bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>{t('allDepartmentsBtn', language)}</span>
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex-1 py-3 text-center transition-all flex items-center justify-center gap-1.5 border-b-2 ${
                activeTab === 'menu'
                  ? 'border-[#ea580c] text-[#ea580c] bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{language === 'si' ? 'මෙනුව සහ සේවා' : 'Menu & Services'}</span>
            </button>
          </div>

          {/* Drawer Body Scroll Area */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 text-xs">
            {activeTab === 'departments' ? (
              <div className="p-2 space-y-1">
                {/* All Departments Reset Option */}
                <button
                  onClick={() => handleCategoryClick('All')}
                  className={`w-full px-3 py-2.5 rounded-md flex items-center justify-between text-left transition-colors font-medium ${
                    selectedCategory === 'All'
                      ? 'bg-orange-50 text-[#ea580c] font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutGrid className="w-4 h-4 text-[#ea580c]" />
                    <span>{t('allDepartments', language)}</span>
                  </div>
                  {selectedCategory === 'All' && <span className="text-[#ea580c] font-bold">✓</span>}
                </button>

                {/* Categories with accordions */}
                {departments.map((cat) => {
                  const catName = language === 'si' && cat.nameSi ? cat.nameSi : cat.name;
                  const isSelected = selectedCategory === cat.name;
                  const isExpanded = expandedCat === cat.id;
                  const subcategories = language === 'si' && cat.subcategoriesSi ? cat.subcategoriesSi : cat.subcategories;

                  return (
                    <div key={cat.id} className="rounded-md overflow-hidden">
                      <div className="flex items-center">
                        <button
                          onClick={() => handleCategoryClick(cat.name)}
                          className={`flex-1 px-3 py-2.5 flex items-center gap-2.5 text-left transition-colors font-medium ${
                            isSelected
                              ? 'bg-orange-50 text-[#ea580c] font-bold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <DepartmentIcon iconName={cat.iconName} className="w-4 h-4 text-[#ea580c] shrink-0" />
                          <span className="truncate">{catName}</span>
                          <span className="text-[10px] text-slate-400 font-mono font-normal">
                            ({cat.itemCount})
                          </span>
                        </button>
                        
                        {subcategories && subcategories.length > 0 && (
                          <button
                            onClick={() => setExpandedCat(isExpanded ? null : cat.id)}
                            className="p-2.5 text-slate-400 hover:text-slate-700 transition-colors"
                            title="Expand subcategories"
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            />
                          </button>
                        )}
                      </div>

                      {/* Expanded Subcategories */}
                      {isExpanded && subcategories && (
                        <div className="pl-9 pr-3 py-1.5 bg-slate-50 space-y-1 border-l-2 border-orange-200 ml-4 mb-1">
                          {subcategories.map((sub, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleCategoryClick(cat.name)}
                              className="w-full text-left py-1 text-slate-600 hover:text-[#ea580c] text-[11px] block transition-colors"
                            >
                              • {sub}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-3 space-y-2">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">
                  {language === 'si' ? 'ප්‍රධාන පිටු' : 'Quick Navigation'}
                </div>

                <button
                  onClick={() => {
                    onSelectNav('HOME');
                    onClose();
                  }}
                  className="w-full px-3 py-2 rounded flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 hover:text-[#ea580c] font-medium"
                >
                  <Home className="w-4 h-4 text-slate-500" />
                  <span>{language === 'si' ? 'මුල් පිටුව' : 'Home Marketplace'}</span>
                </button>

                <button
                  onClick={() => {
                    onSelectNav('DEAL');
                    onClose();
                  }}
                  className="w-full px-3 py-2 rounded flex items-center justify-between text-slate-700 hover:bg-slate-50 hover:text-[#ea580c] font-medium"
                >
                  <div className="flex items-center gap-2.5">
                    <Flame className="w-4 h-4 text-rose-500" />
                    <span>{language === 'si' ? 'ක්ෂණික දීමනා සහ වට්ටම්' : 'Flash Deals & Discounts'}</span>
                  </div>
                  <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded font-mono">
                    HOT
                  </span>
                </button>

                <button
                  onClick={() => {
                    onSelectNav('BEST-SELLING');
                    onClose();
                  }}
                  className="w-full px-3 py-2 rounded flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 hover:text-[#ea580c] font-medium"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{language === 'si' ? 'ඉහළම අලෙවිය' : 'Best Selling Items'}</span>
                </button>

                <div className="pt-2 px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display border-t border-slate-100">
                  {language === 'si' ? 'ව්‍යාපාර සහ සහාය' : 'B2B Trade & Support'}
                </div>

                <button
                  onClick={() => {
                    onOpenVendorModal();
                    onClose();
                  }}
                  className="w-full px-3 py-2 rounded flex items-center justify-between text-slate-700 hover:bg-slate-50 hover:text-[#ea580c] font-medium"
                >
                  <div className="flex items-center gap-2.5">
                    <Store className="w-4 h-4 text-[#ea580c]" />
                    <span>{t('becomeVendor', language)}</span>
                  </div>
                  <span className="text-[10px] text-[#ea580c] font-bold font-mono">SELLER</span>
                </button>

                <button
                  onClick={() => {
                    onOpenTrackOrder();
                    onClose();
                  }}
                  className="w-full px-3 py-2 rounded flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 hover:text-[#ea580c] font-medium"
                >
                  <Truck className="w-4 h-4 text-blue-500" />
                  <span>{t('trackOrder', language)}</span>
                </button>

                <button
                  onClick={() => {
                    onOpenB2BQuote();
                    onClose();
                  }}
                  className="w-full px-3 py-2 rounded flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 hover:text-[#ea580c] font-medium"
                >
                  <Briefcase className="w-4 h-4 text-emerald-500" />
                  <span>{language === 'si' ? 'තොග B2B මිල ගණන් (RFQ)' : 'Bulk B2B Quotes (RFQ)'}</span>
                </button>

                <button
                  onClick={() => {
                    onOpenHelp();
                    onClose();
                  }}
                  className="w-full px-3 py-2 rounded flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 hover:text-[#ea580c] font-medium"
                >
                  <HelpCircle className="w-4 h-4 text-purple-500" />
                  <span>{t('helpFaq', language)}</span>
                </button>

                <button
                  onClick={() => {
                    onOpenBlog();
                    onClose();
                  }}
                  className="w-full px-3 py-2 rounded flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 hover:text-[#ea580c] font-medium"
                >
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>{language === 'si' ? 'වෙළඳ බ්ලොගය' : 'Trading Articles & Blog'}</span>
                </button>

                <button
                  onClick={() => {
                    onOpenPages();
                    onClose();
                  }}
                  className="w-full px-3 py-2 rounded flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 hover:text-[#ea580c] font-medium"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-500" />
                  <span>{language === 'si' ? 'ආයතනික තොරතුරු සහ වගකීම්' : 'Company & Guarantees'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Footer: Language & Currency Switcher Bar */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">{t('language', language)}:</span>
              <div className="flex items-center gap-1 bg-white p-0.5 rounded border border-slate-200">
                <button
                  onClick={() => onLanguageChange('si')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                    language === 'si' ? 'bg-[#ea580c] text-white' : 'text-slate-600'
                  }`}
                >
                  සිංහල
                </button>
                <button
                  onClick={() => onLanguageChange('en')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors font-mono ${
                    language === 'en' ? 'bg-[#ea580c] text-white' : 'text-slate-600'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">{t('currency', language)}:</span>
              <div className="flex items-center gap-1 bg-white p-0.5 rounded border border-slate-200 font-mono">
                {(['USD', 'EUR', 'GBP'] as Currency[]).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => onCurrencyChange(curr)}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                      currentCurrency === curr ? 'bg-[#ea580c] text-white' : 'text-slate-600'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
