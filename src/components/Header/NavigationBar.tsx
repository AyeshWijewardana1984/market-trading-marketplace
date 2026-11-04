import React, { useState, useEffect } from 'react';
import { Menu, ChevronDown, ChevronRight, Sparkles, Globe, ShieldCheck } from 'lucide-react';
import { CategoryItem, Language } from '../../types/marketplace';
import { t } from '../../i18n/translations';
import { getStoredDepartments, subscribeToDepartments } from '../../services/departmentService';
import { DepartmentIcon } from '../Common/DepartmentIcon';

interface NavigationBarProps {
  categoryMenuOpen: boolean;
  onToggleCategoryMenu: () => void;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  activeNav: string;
  onSelectNav: (nav: string) => void;
  language: Language;
  onToggleLanguage: () => void;
  onOpenVendorModal: () => void;
  onOpenTrackOrder: () => void;
  onOpenB2BQuote: () => void;
  onOpenHelp: () => void;
  onOpenBlog: () => void;
  onOpenPages: () => void;
  onOpenAdminDashboard: () => void;
  onOpenMobileDrawer?: () => void;
  isHomepage?: boolean;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  categoryMenuOpen,
  onToggleCategoryMenu,
  selectedCategory,
  onSelectCategory,
  activeNav,
  onSelectNav,
  language,
  onToggleLanguage,
  onOpenVendorModal,
  onOpenTrackOrder,
  onOpenB2BQuote,
  onOpenHelp,
  onOpenBlog,
  onOpenPages,
  onOpenAdminDashboard,
  onOpenMobileDrawer,
  isHomepage = true,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [departments, setDepartments] = useState<CategoryItem[]>(() => getStoredDepartments());
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  useEffect(() => {
    setDepartments(getStoredDepartments());
    const unsubscribe = subscribeToDepartments((latest) => {
      setDepartments(latest);
    });
    return unsubscribe;
  }, []);

  const navItems = [
    { id: 'HOME', label: language === 'si' ? 'මුල් පිටුව' : 'HOME' },
    { id: 'FEATURES', label: language === 'si' ? 'විශේෂාංග' : 'FEATURES', hasDropdown: true },
    { id: 'BEST-SELLING', label: language === 'si' ? 'ඉහළම අලෙවිය' : 'BEST-SELLING' },
    { id: 'DEAL', label: language === 'si' ? 'විශේෂ දීමනා' : 'DEAL', badge: language === 'si' ? 'නව' : 'NEW' },
    { id: 'SHOP', label: language === 'si' ? 'සාප්පුව' : 'SHOP', hasDropdown: true },
    { id: 'BLOG', label: language === 'si' ? 'බ්ලොග්' : 'BLOG' },
    { id: 'PAGES', label: language === 'si' ? 'තොරතුරු' : 'PAGES' },
  ];

  const handleNavClick = (id: string) => {
    if (id === 'BLOG') {
      onOpenBlog();
    } else if (id === 'PAGES') {
      onOpenPages();
    } else {
      onSelectNav(id);
    }
  };

  return (
    <div className="bg-[#0c1524] border-b border-[#1b293e] sticky top-0 z-40 shadow-md">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex items-stretch justify-between h-10">
        {/* Left: Orange ALL DEPARTMENT Trigger Button (aligns with 280px sidebar) */}
        <div className="flex-1 sm:flex-initial sm:w-[260px] lg:w-[280px] min-w-0 shrink-0 relative">
          <button
            onClick={onToggleCategoryMenu}
            className="w-full h-full bg-[#ea580c] hover:bg-[#c2410c] text-white px-2.5 sm:px-4 font-bold text-xs uppercase tracking-wider flex items-center justify-between cursor-pointer transition-colors shadow-sm font-display select-none gap-1"
            aria-expanded={categoryMenuOpen}
            aria-label="Toggle all departments menu"
          >
            <div className="flex items-center gap-1.5 sm:gap-2 truncate min-w-0">
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="truncate text-[11px] sm:text-xs">{t('allDepartmentsBtn', language)}</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                categoryMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Floating Dropdown Mega-Menu directly below the button */}
          {categoryMenuOpen && (
            <>
              {/* Backdrop dismiss */}
              <div
                className={`fixed inset-0 z-40 ${isHomepage ? 'lg:hidden' : 'block'}`}
                onClick={onToggleCategoryMenu}
              />
              <div className={`absolute top-full left-0 w-full min-w-[240px] sm:min-w-[260px] lg:w-full bg-white border border-slate-200 border-t-0 shadow-2xl rounded-b-md z-50 animate-in fade-in duration-150 max-h-[75vh] overflow-y-auto ${
                isHomepage ? 'lg:hidden' : 'block'
              }`}>
                <ul className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                  {departments.map((cat) => {
                    const catName = language === 'si' && cat.nameSi ? cat.nameSi : cat.name;
                    const isSelected = selectedCategory === cat.name || selectedCategory === cat.nameSi;
                    const isHovered = hoveredCategory === cat.id;
                    const subcategories = language === 'si' && cat.subcategoriesSi ? cat.subcategoriesSi : cat.subcategories;

                    return (
                      <li
                        key={cat.id}
                        className="relative group"
                        onMouseEnter={() => setHoveredCategory(cat.id)}
                        onMouseLeave={() => setHoveredCategory(null)}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            if (onSelectCategory) {
                              onSelectCategory(cat.name);
                            }
                            onToggleCategoryMenu();
                          }}
                          className={`w-full px-3 py-2.5 flex items-center justify-between text-left transition-colors cursor-pointer group-hover:bg-slate-50 group-hover:text-[#ea580c] ${
                            isSelected
                              ? 'bg-orange-50/70 text-[#ea580c] font-semibold border-l-3 border-[#ea580c]'
                              : 'border-l-3 border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <div className="text-slate-400 group-hover:text-[#ea580c] transition-colors shrink-0">
                              <DepartmentIcon iconName={cat.iconName} className="w-4 h-4" />
                            </div>
                            <span className="truncate">{catName}</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#ea580c] shrink-0 transition-colors" />
                        </button>

                        {/* Flyout Submenu on Hover (Desktop) */}
                        {isHovered && subcategories && subcategories.length > 0 && (
                          <div className="hidden lg:block absolute left-full top-0 ml-[-1px] w-64 bg-white border border-slate-200 shadow-xl rounded-r py-2 z-50 animate-in fade-in duration-100">
                            <div className="px-3 py-1 font-bold border-b border-slate-100 text-[11px] uppercase tracking-wider text-[#ea580c] font-display flex items-center gap-2">
                              <DepartmentIcon iconName={cat.iconName} className="w-3.5 h-3.5 text-[#ea580c]" />
                              <span className="truncate">{catName}</span>
                            </div>
                            <div className="py-1 max-h-72 overflow-y-auto">
                              {subcategories.map((sub, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    if (onSelectCategory) {
                                      onSelectCategory(cat.subcategories[idx] || sub);
                                    }
                                    onToggleCategoryMenu();
                                  }}
                                  className="w-full text-left px-3 py-1.5 hover:bg-orange-50 hover:text-[#ea580c] text-slate-600 transition-colors text-xs cursor-pointer truncate block"
                                >
                                  {sub}
                                </button>
                              ))}
                            </div>
                            <div className="px-3 pt-2 pb-1 border-t border-slate-100 text-[10px] text-slate-400 flex justify-between font-mono-numbers">
                              <span>{language === 'si' ? 'සත්‍යාපිත සැපයුම්කරුවන්' : 'Verified Suppliers'}</span>
                              <span className="font-semibold text-slate-700">{cat.itemCount}+</span>
                            </div>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Center: Main Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 px-4 flex-1">
          {navItems.map((item) => (
            <div
              key={item.id}
              className="relative h-full flex items-center"
              onMouseEnter={() => setHoveredNav(item.id)}
              onMouseLeave={() => setHoveredNav(null)}
            >
              <button
                onClick={() => handleNavClick(item.id)}
                className={`h-full px-3 lg:px-4 text-xs font-bold tracking-wide flex items-center gap-1 transition-colors cursor-pointer relative font-display ${
                  activeNav === item.id
                    ? 'text-[#ea580c] border-b-2 border-[#ea580c]'
                    : 'text-slate-200 hover:text-[#ea580c]'
                }`}
              >
                <span>{item.label}</span>
                {item.hasDropdown && <ChevronDown className="w-3 h-3 opacity-70" />}
                {item.badge && (
                  <span className="absolute -top-1 right-1 bg-[#0284c7] text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded leading-tight shadow-sm font-mono-numbers">
                    {item.badge}
                  </span>
                )}
              </button>

              {/* Dropdown menu for Features / Shop with real functional actions */}
              {item.hasDropdown && hoveredNav === item.id && (
                <div className="absolute top-full left-0 w-60 bg-white text-slate-800 rounded shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  {item.id === 'FEATURES' ? (
                    <>
                      <button
                        onClick={() => {
                          onOpenVendorModal();
                          setHoveredNav(null);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs hover:bg-orange-50 hover:text-[#ea580c] transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <span>{language === 'si' ? 'වෙළෙන්දන්ගේ ද්වාරය' : 'Multi-Vendor Portals'}</span>
                        <span className="text-[9px] text-[#ea580c] font-bold">Seller</span>
                      </button>
                      <button
                        onClick={() => {
                          onOpenTrackOrder();
                          setHoveredNav(null);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs hover:bg-orange-50 hover:text-[#ea580c] transition-colors cursor-pointer"
                      >
                        {language === 'si' ? 'ඇණවුම් සජීවීව ලුහුබැඳීම' : 'Live Order Tracking'}
                      </button>
                      <button
                        onClick={() => {
                          onOpenB2BQuote();
                          setHoveredNav(null);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs hover:bg-orange-50 hover:text-[#ea580c] transition-colors cursor-pointer"
                      >
                        {language === 'si' ? 'තොග B2B මිල ගණන් (RFQ)' : 'Bulk B2B Quotes (RFQ)'}
                      </button>
                      <button
                        onClick={() => {
                          onOpenHelp();
                          setHoveredNav(null);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs hover:bg-orange-50 hover:text-[#ea580c] transition-colors cursor-pointer"
                      >
                        {language === 'si' ? 'ඇපකර ගෙවීම් ආරක්ෂාව' : 'Escrow Payment Protection'}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          onSelectNav('SHOP');
                          setHoveredNav(null);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs hover:bg-orange-50 hover:text-[#ea580c] transition-colors cursor-pointer"
                      >
                        {language === 'si' ? 'සියලු අයිතම නාමාවලිය' : 'Grid View (All Items)'}
                      </button>
                      <button
                        onClick={() => {
                          onSelectNav('DEAL');
                          setHoveredNav(null);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs hover:bg-orange-50 hover:text-[#ea580c] transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <span>{language === 'si' ? 'ක්ෂණික දීමනා සහ වට්ටම්' : 'Flash Deals & Sales'}</span>
                        <span className="bg-red-500 text-white text-[8px] font-bold px-1 rounded font-mono-numbers">HOT</span>
                      </button>
                      <button
                        onClick={() => {
                          onSelectNav('BEST-SELLING');
                          setHoveredNav(null);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs hover:bg-orange-50 hover:text-[#ea580c] transition-colors cursor-pointer"
                      >
                        {language === 'si' ? 'ඉහළම ශ්‍රේණිගත අයිතම' : 'Top Rated Trending'}
                      </button>
                      <button
                        onClick={() => {
                          onSelectNav('SHOP');
                          setHoveredNav(null);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs hover:bg-orange-50 hover:text-[#ea580c] transition-colors cursor-pointer"
                      >
                        {language === 'si' ? 'විශේෂ තොග නිෂ්කාශනය' : 'Clearance Specials'}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right: Quick Lang Toggle & Vendor Callout Button */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Direct Navbar Language Switcher Button */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 text-xs text-amber-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 px-2.5 py-1 rounded transition-colors border border-slate-700 cursor-pointer shadow-xs"
            title="Switch Language / භාෂාව මාරු කරන්න"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold text-[11px]">{language === 'si' ? 'English ට මාරු වන්න' : 'සිංහල'}</span>
          </button>

          <button
            onClick={onOpenVendorModal}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#152238] hover:bg-[#1f314f] px-3.5 py-1.5 rounded transition-colors border border-[#273a57] cursor-pointer shadow-xs hover:border-[#ea580c]/60"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#fb923c]" />
            <span>{t('becomeVendor', language)}</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onToggleLanguage}
            className="px-2 py-1 bg-slate-800 text-amber-300 rounded text-[11px] font-bold"
          >
            {language === 'si' ? 'EN' : 'සිංහල'}
          </button>
          <button
            onClick={() => {
              if (onOpenMobileDrawer) {
                onOpenMobileDrawer();
              } else {
                setMobileMenuOpen(!mobileMenuOpen);
              }
            }}
            className="text-slate-200 hover:text-white p-2 cursor-pointer active:scale-95"
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0c1524] border-t border-slate-800 px-4 py-3 text-xs space-y-2">
          <div className="flex items-center justify-between py-2 border-b border-slate-800">
            <span className="text-slate-400">{t('language', language)}:</span>
            <div className="flex gap-1">
              <button
                onClick={() => {
                  if (language !== 'si') onToggleLanguage();
                }}
                className={`px-2 py-0.5 rounded text-xs font-bold ${
                  language === 'si' ? 'bg-[#ea580c] text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                සිංහල
              </button>
              <button
                onClick={() => {
                  if (language !== 'en') onToggleLanguage();
                }}
                className={`px-2 py-0.5 rounded text-xs font-bold ${
                  language === 'en' ? 'bg-[#ea580c] text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                English
              </button>
            </div>
          </div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                handleNavClick(item.id);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 px-3 text-slate-200 hover:text-white hover:bg-slate-800 rounded font-medium"
            >
              {item.label} {item.badge && `(${item.badge})`}
            </button>
          ))}
          <button
            onClick={() => {
              onOpenVendorModal();
              setMobileMenuOpen(false);
            }}
            className="w-full text-center py-2 bg-[#ea580c] text-white font-bold rounded mt-2 font-display"
          >
            {t('becomeVendor', language)}
          </button>
        </div>
      )}
    </div>
  );
};
