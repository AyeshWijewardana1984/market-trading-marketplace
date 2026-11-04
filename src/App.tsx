import React, { useState, useEffect } from 'react';
import { TopBar } from './components/Header/TopBar';
import { MainHeader } from './components/Header/MainHeader';
import { NavigationBar } from './components/Header/NavigationBar';
import { CategorySidebar } from './components/Sidebar/CategorySidebar';
import { LatestProductsWidget } from './components/Sidebar/LatestProductsWidget';
import { TrustBadges } from './components/Sidebar/TrustBadges';
import { TopSidebarBanner, BottomSidebarBanner } from './components/Sidebar/SidebarBanners';
import { HeroSlider } from './components/Center/HeroSlider';
import { CouponBar } from './components/Center/CouponBar';
import { DailyDealsSection } from './components/Center/DailyDealsSection';
import { MiddleBanner } from './components/Center/MiddleBanner';
import { TrendingItemsSection } from './components/Center/TrendingItemsSection';
import { RightPromoBanners } from './components/RightSidebar/RightPromoBanners';
import { ProductDetailsPage } from './components/Product/ProductDetailsPage';
import { CartDrawer } from './components/Modals/CartDrawer';
import { QuickViewModal } from './components/Modals/QuickViewModal';
import { WishlistDrawer } from './components/Modals/WishlistDrawer';
import { CompareModal } from './components/Modals/CompareModal';
import { TrackOrderModal } from './components/Modals/TrackOrderModal';
import { AuthModal } from './components/Modals/AuthModal';
import { CheckoutModal } from './components/Modals/CheckoutModal';
import { HelpModal } from './components/Modals/HelpModal';
import { VendorModal } from './components/Modals/VendorModal';
import { B2BQuoteModal } from './components/Modals/B2BQuoteModal';
import { BlogModal } from './components/Modals/BlogModal';
import { PagesModal, PagesModalTab } from './components/Modals/PagesModal';
import { SupplierChatModal } from './components/Modals/SupplierChatModal';
import { VendorStorefrontModal } from './components/Modals/VendorStorefrontModal';
import { AdminDashboardModal } from './components/Modals/AdminDashboardModal';
import { AdminBackendView } from './components/Admin/AdminBackendView';
import { MobileNavDrawer } from './components/Header/MobileNavDrawer';
import { MobileBottomBar } from './components/UI/MobileBottomBar';
import { Footer } from './components/Footer/Footer';
import { Toast, ToastMessage } from './components/UI/Toast';
import { CartItem, Currency, Language, Product, HeroSlideItem } from './types/marketplace';
import { ALL_PRODUCTS, DAILY_DEALS, TRENDING_PRODUCTS } from './data/products';
import { INITIAL_HERO_SLIDES } from './data/heroSlides';
import { getProductName } from './i18n/translations';
import { getStoredProducts, subscribeToProducts } from './services/productService';
import { AddProductModal } from './components/Admin/AddProductModal';
import { UserAccount } from './services/authService';

export default function App() {
  // Global Marketplace View & State
  const [currentView, setCurrentView] = useState<'storefront' | 'admin'>('storefront');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('marketplace_language');
        if (stored === 'en' || stored === 'si') return stored;
      } catch {
        // ignore
      }
    }
    return 'en';
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('HOME');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [heroSlides, setHeroSlides] = useState<HeroSlideItem[]>(INITIAL_HERO_SLIDES);

  // Dynamic Catalog Products State (Synced across admin & storefront)
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(() => getStoredProducts());
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Subscribe to real-time products updates
  useEffect(() => {
    setCatalogProducts(getStoredProducts());
    const unsubscribe = subscribeToProducts((latest) => {
      setCatalogProducts(latest);
    });
    return unsubscribe;
  }, []);

  // Cart State (initialize with 2 items as in reference header)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: DAILY_DEALS[0], quantity: 1 },
    { product: DAILY_DEALS[1], quantity: 1 },
  ]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('Happy2017');

  // Wishlist & Compare State
  const [wishlist, setWishlist] = useState<Product[]>([TRENDING_PRODUCTS[1]]);
  const [compareList, setCompareList] = useState<Product[]>([
    TRENDING_PRODUCTS[0],
    TRENDING_PRODUCTS[2],
  ]);

  // Modals & Drawers Visibility
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [wishlistDrawerOpen, setWishlistDrawerOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [trackOrderOpen, setTrackOrderOpen] = useState(false);
  const [trackedOrderId, setTrackedOrderId] = useState<string>('MKT-2026-8941');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [vendorModalOpen, setVendorModalOpen] = useState(false);
  const [b2bQuoteOpen, setB2bQuoteOpen] = useState(false);
  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [pagesModalOpen, setPagesModalOpen] = useState(false);
  const [pagesModalTab, setPagesModalTab] = useState<PagesModalTab>('about');
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);

  // Multi-vendor specialized modals
  const [supplierChatData, setSupplierChatData] = useState<{
    isOpen: boolean;
    vendorName: string;
    productName?: string;
  }>({
    isOpen: false,
    vendorName: 'Direct Tech Co.',
  });

  const [vendorStorefrontData, setVendorStorefrontData] = useState<{
    isOpen: boolean;
    vendorName: string;
  }>({
    isOpen: false,
    vendorName: 'Nordic Living Studio',
  });

  // Synchronize Product Details Page & Admin View via URL search params & browser back/forward
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'admin') {
      setCurrentView('admin');
    }
    const prodId = params.get('product');
    if (prodId) {
      const stored = getStoredProducts();
      const found = stored.find((p) => p.id === prodId) || ALL_PRODUCTS.find((p) => p.id === prodId);
      if (found) setViewingProduct(found);
    }

    const handlePopState = (e: PopStateEvent) => {
      const currentParams = new URLSearchParams(window.location.search);
      if (currentParams.get('view') === 'admin' || (e.state && e.state.view === 'admin')) {
        setCurrentView('admin');
      } else {
        setCurrentView('storefront');
      }

      if (e.state && e.state.productId) {
        const stored = getStoredProducts();
        const found = stored.find((p) => p.id === e.state.productId) || ALL_PRODUCTS.find((p) => p.id === e.state.productId);
        if (found) setViewingProduct(found);
      } else {
        setViewingProduct(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync document title with current language
  useEffect(() => {
    document.title =
      language === 'si'
        ? 'Market - බහු වෙළඳ තොග වෙළඳපොළ'
        : 'Market - Multi-Vendor Trading Marketplace';
  }, [language]);

  const handleToggleLanguage = () => {
    setLanguage((prev) => {
      const next: Language = prev === 'si' ? 'en' : 'si';
      try {
        localStorage.setItem('marketplace_language', next);
      } catch (e) {
        // ignore
      }
      return next;
    });
  };

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    try {
      localStorage.setItem('marketplace_language', newLang);
    } catch (e) {
      // ignore
    }
  };

  // Modal Open Handlers
  const handleOpenPages = (tab: PagesModalTab = 'about') => {
    setPagesModalTab(tab);
    setPagesModalOpen(true);
  };

  const handleOpenSupplierChat = (vendorName: string, productName?: string) => {
    setSupplierChatData({
      isOpen: true,
      vendorName,
      productName,
    });
  };

  const handleOpenVendorStorefront = (vendorName: string) => {
    setVendorStorefrontData({
      isOpen: true,
      vendorName,
    });
  };

  const handleNewsletterSubscribe = (email: string) => {
    setAppliedCoupon('Happy2017');
    addToast(`Subscribed "${email}"! Happy2017 20% discount coupon applied!`, 'success');
  };

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (text: string, type: 'success' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart Handlers
  const handleAddToCart = (product: Product, quantity = 1, color?: string) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedColor: color }];
    });
    const displayName = getProductName(product, language);
    addToast(
      language === 'si'
        ? `"${displayName.slice(0, 30)}..." කරත්තයට එක් කරන ලදී!`
        : `Added "${product.name.slice(0, 30)}..." to your cart!`
    );
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    addToast(language === 'si' ? 'භාණ්ඩය කරත්තයෙන් ඉවත් කරන ලදී' : 'Item removed from cart', 'info');
  };

  const handleClearCart = () => {
    setCartItems([]);
    addToast(language === 'si' ? 'කරත්තය හිස් කරන ලදී' : 'Cart cleared', 'info');
  };

  const handleApplyCoupon = (code: string) => {
    if (code.trim().toLowerCase() === 'happy2017') {
      setAppliedCoupon('Happy2017');
      addToast(
        language === 'si'
          ? 'Happy2017 කූපනය යොදන ලදී: 20%ක වට්ටමක්!'
          : 'Coupon Happy2017 applied: 20% discount!',
        'success'
      );
      return true;
    }
    return false;
  };

  // Wishlist Handlers
  const handleAddToWishlist = (product: Product) => {
    const displayName = getProductName(product, language);
    if (!wishlist.some((p) => p.id === product.id)) {
      setWishlist((prev) => [...prev, product]);
      addToast(
        language === 'si'
          ? `පැතුම් ලැයිස්තුවට එක් කරන ලදී: ${displayName.slice(0, 25)}...`
          : `Added to Wishlist: ${product.name.slice(0, 25)}...`
      );
    } else {
      addToast(
        language === 'si'
          ? 'භාණ්ඩය දැනටමත් ඔබගේ පැතුම් ලැයිස්තුවේ ඇත'
          : 'Item is already in your wishlist',
        'info'
      );
    }
  };

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  };

  // Compare Handlers
  const handleAddToCompare = (product: Product) => {
    if (compareList.length >= 4) {
      addToast(
        language === 'si'
          ? 'ඔබට එකවර සැසඳිය හැක්කේ උපරිම නිෂ්පාදන 4ක් පමණි'
          : 'You can compare a maximum of 4 products at once',
        'info'
      );
      return;
    }
    const displayName = getProductName(product, language);
    if (!compareList.some((p) => p.id === product.id)) {
      setCompareList((prev) => [...prev, product]);
      addToast(
        language === 'si'
          ? `සැසඳුම් ලැයිස්තුවට එක් කරන ලදී: ${displayName.slice(0, 25)}...`
          : `Added to Compare: ${product.name.slice(0, 25)}...`
      );
    } else {
      addToast(
        language === 'si'
          ? 'භාණ්ඩය දැනටමත් සැසඳුම් ලැයිස්තුවේ ඇත'
          : 'Item already in comparison list',
        'info'
      );
    }
  };

  const handleRemoveFromCompare = (productId: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleClearCompare = () => {
    setCompareList([]);
  };

  // Dedicated Product Page Navigation
  const handleOpenProductPage = (product: Product) => {
    setViewingProduct(product);
    window.history.pushState({ productId: product.id }, '', `?product=${product.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const displayName = getProductName(product, language);
    addToast(
      language === 'si'
        ? `විස්තර පෙන්වයි: ${displayName.slice(0, 30)}...`
        : `Viewing product: ${product.name.slice(0, 30)}...`,
      'info'
    );
  };

  const handleBackToHome = () => {
    setViewingProduct(null);
    window.history.pushState({}, '', window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBuyNow = (product: Product, quantity = 1, color?: string) => {
    handleAddToCart(product, quantity, color);
    setCheckoutModalOpen(true);
  };

  const handleShareProduct = (productName: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    addToast(
      language === 'si'
        ? `"${productName.slice(0, 30)}..." වෙත සබැඳිය පිටපත් කරන ලදී!`
        : `Link to "${productName.slice(0, 30)}..." copied to clipboard!`,
      'info'
    );
  };

  // Search & Navigation
  const handleSearch = (query: string, category: string) => {
    setViewingProduct(null);
    setSearchQuery(query);
    if (category && category !== 'All Categories') {
      setSelectedCategory(category);
    }
    addToast(
      language === 'si'
        ? `"${query || '*'}" සොයමින්...`
        : `Searching for "${query || '*'}" in ${category}...`,
      'info'
    );
    setTimeout(() => {
      const el = document.getElementById('trending-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleSelectNav = (nav: string) => {
    setActiveNav(nav);
    if (nav === 'DEAL') {
      setViewingProduct(null);
      setTimeout(() => {
        const el = document.getElementById('daily-deals');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else if (nav === 'SHOP' || nav === 'BEST-SELLING') {
      setViewingProduct(null);
      setTimeout(() => {
        const el = document.getElementById('trending-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      handleBackToHome();
      setSelectedCategory('All');
      setSearchQuery('');
    }
  };

  const handleOpenAdminView = () => {
    setCurrentView('admin');
    setViewingProduct(null);
    window.history.pushState({ view: 'admin' }, '', '?view=admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    addToast(language === 'si' ? 'පාලක පසුපස පද්ධතියට (Admin Backend) පිවිසුණි' : 'Entered Admin Backend Dashboard', 'info');
  };

  const handleBackToStorefront = () => {
    setCurrentView('storefront');
    window.history.pushState({}, '', window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    addToast(language === 'si' ? 'වෙළඳසැල් මුහුණතට පැමිණියා' : 'Switched back to Public Storefront', 'info');
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // If in dedicated Admin Backend mode, render full-screen Admin Interface
  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col font-sans">
        <AdminBackendView
          onBackToStorefront={handleBackToStorefront}
          currency={currency}
          language={language}
          heroSlides={heroSlides}
          onUpdateHeroSlides={setHeroSlides}
          onUpdateHeroBanner={(title, subtitle, coupon) => {
            setAppliedCoupon(coupon);
            addToast(`Live homepage banner & coupon updated to "${coupon}"!`, 'success');
          }}
          onSelectProduct={handleOpenProductPage}
          onAddToast={addToast}
        />
        <Toast toasts={toasts} onDismiss={removeToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-slate-800 flex flex-col font-sans selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden w-full">
      {/* 1. Header & Top Bar */}
      <TopBar
        currentCurrency={currency}
        onCurrencyChange={setCurrency}
        language={language}
        onLanguageChange={handleLanguageChange}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenTrackOrder={() => setTrackOrderOpen(true)}
        onOpenHelp={() => setHelpModalOpen(true)}
        onOpenAdminDashboard={handleOpenAdminView}
        userEmail={userEmail}
        currentUser={currentUser}
        onSignOut={() => {
          setUserEmail(null);
          setCurrentUser(null);
          addToast(language === 'si' ? 'සාර්ථකව නික්මෙන ලදී' : 'Signed out successfully', 'info');
        }}
      />

      <MainHeader
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        cartTotal={cartTotal}
        wishlistCount={wishlist.length}
        compareCount={compareList.length}
        currency={currency}
        language={language}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenWishlist={() => setWishlistDrawerOpen(true)}
        onOpenCompare={() => setCompareModalOpen(true)}
        onSearch={handleSearch}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSearchQuery('');
        }}
        onGoHome={handleBackToHome}
        onOpenMobileMenu={() => setMobileDrawerOpen(true)}
      />

      <NavigationBar
        categoryMenuOpen={categoryMenuOpen}
        onToggleCategoryMenu={() => setCategoryMenuOpen(!categoryMenuOpen)}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSearchQuery('');
          addToast(language === 'si' ? `පෙරහන යොදන ලදී: ${cat}` : `Filter applied: ${cat}`, 'info');
          const el = document.getElementById('trending-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        activeNav={activeNav}
        onSelectNav={handleSelectNav}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onOpenVendorModal={() => setVendorModalOpen(true)}
        onOpenTrackOrder={() => setTrackOrderOpen(true)}
        onOpenB2BQuote={() => setB2bQuoteOpen(true)}
        onOpenHelp={() => setHelpModalOpen(true)}
        onOpenBlog={() => setBlogModalOpen(true)}
        onOpenPages={() => handleOpenPages('about')}
        onOpenAdminDashboard={handleOpenAdminView}
        onOpenMobileDrawer={() => setMobileDrawerOpen(true)}
        isHomepage={!viewingProduct}
      />

      {/* 2. Main Content Area */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-4 sm:py-5 w-full flex-1 pb-20 md:pb-6">
        {viewingProduct ? (
          <ProductDetailsPage
            product={viewingProduct}
            onBack={handleBackToHome}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onAddToWishlist={handleAddToWishlist}
            onAddToCompare={handleAddToCompare}
            isInWishlist={wishlist.some((p) => p.id === viewingProduct.id)}
            isInCompare={compareList.some((p) => p.id === viewingProduct.id)}
            currency={currency}
            language={language}
            onSelectProduct={handleOpenProductPage}
            onOpenB2BQuote={() => setB2bQuoteOpen(true)}
            onOpenVendorModal={() => setVendorModalOpen(true)}
            onOpenSupplierChat={handleOpenSupplierChat}
            onOpenVendorStorefront={handleOpenVendorStorefront}
            onSelectCategory={(cat) => {
              handleBackToHome();
              setSelectedCategory(cat);
              setSearchQuery('');
              addToast(language === 'si' ? `පෙරහන් කරන ලදී: ${cat}` : `Filtered by: ${cat}`, 'info');
            }}
            onShare={handleShareProduct}
            onEditProduct={(prod) => {
              setEditingProduct(prod);
              setAddProductModalOpen(true);
            }}
          />
        ) : (
          <div className="flex flex-col lg:flex-row items-start gap-5">
            {/* Left Column: Sidebar on Desktop, Discovery Widgets on Mobile */}
            <aside className="w-full lg:w-[260px] xl:w-[280px] shrink-0 order-2 lg:order-1 mt-6 lg:mt-0">
              {/* Category Navigation Accordion (Desktop only; Mobile uses MobileNavDrawer / Quick Chips) */}
              <div className="hidden lg:block">
                <CategorySidebar
                  isOpen={categoryMenuOpen}
                  selectedCategory={selectedCategory}
                  language={language}
                  onSelectCategory={(cat) => {
                    setSelectedCategory(cat);
                    setSearchQuery('');
                    addToast(language === 'si' ? `පෙරහන යොදන ලදී: ${cat}` : `Filter applied: ${cat}`, 'info');
                    const el = document.getElementById('trending-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                />
              </div>

              {/* Sidebar Banners & Widgets */}
              <TopSidebarBanner
                language={language}
                onShopBanner={(cat) => {
                  setSelectedCategory(cat);
                  setSearchQuery('');
                  const el = document.getElementById('trending-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              />

              <LatestProductsWidget
                currency={currency}
                language={language}
                onSelectProduct={setQuickViewProduct}
                onOpenProductPage={handleOpenProductPage}
                onAddToCart={handleAddToCart}
              />

              <TrustBadges
                language={language}
                onBadgeClick={(title, sub) => {
                  addToast(language === 'si' ? `වෙළඳපල සහතිකය: ${title} (${sub})` : `Guarantee: ${title} (${sub})`, 'info');
                  if (title.includes('DELIVERY') || title.includes('බෙදාහැරීම')) handleOpenPages('shipping');
                  else if (title.includes('MONEY BACK') || title.includes('ආපසු')) handleOpenPages('returns');
                  else if (title.includes('PROTECTION') || title.includes('ආරක්ෂණය')) handleOpenPages('privacy');
                  else handleOpenPages('about');
                }}
              />

              <BottomSidebarBanner
                language={language}
                onShopBanner={(cat) => {
                  setSelectedCategory(cat);
                  setSearchQuery('');
                  const el = document.getElementById('trending-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            </aside>

            {/* Center & Right Combined Grid Area */}
            <div className="flex-1 w-full min-w-0 order-1 lg:order-2">
              {/* Mobile Quick Category Filter Chips */}
              <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-3 text-xs select-none">
                {['All', 'Furniture', 'Living', 'Office', 'Electronics', 'Textiles', 'Accessories'].map((cat) => {
                  const isSelected = selectedCategory.toLowerCase().includes(cat.toLowerCase()) || (cat === 'All' && selectedCategory === 'All');
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSearchQuery('');
                        addToast(language === 'si' ? `පෙරහන යොදන ලදී: ${cat}` : `Filter applied: ${cat}`, 'info');
                        const el = document.getElementById('trending-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-[#ea580c] text-white border-[#ea580c] shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {cat === 'All' ? (language === 'si' ? 'සියල්ල' : 'All') : cat}
                    </button>
                  );
                })}
              </div>

              {/* Top Row: Hero Slider (Center) + Right Banners (Right) */}
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 items-start">
                {/* Center Hero Slider (spans 3 columns on desktop) */}
                <div className="xl:col-span-3">
                  <HeroSlider
                    language={language}
                    slides={heroSlides}
                    onShopNow={() => {
                      const el = document.getElementById('daily-deals');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                  />
                </div>

                {/* Right Sidebar Widgets (spans 1 column on desktop) */}
                <div className="xl:col-span-1">
                  <RightPromoBanners
                    language={language}
                    onSelectBannerCategory={(cat) => {
                      setSelectedCategory(cat);
                      setSearchQuery('');
                      const el = document.getElementById('trending-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                  />
                </div>
              </div>

              {/* Coupon Ribbon Bar */}
              <CouponBar
                language={language}
                onCopyCoupon={(code) => {
                  handleApplyCoupon(code);
                }}
              />

              {/* Daily Deals Section */}
              <div id="daily-deals">
                <DailyDealsSection
                  currency={currency}
                  language={language}
                  products={catalogProducts}
                  onSelectProduct={setQuickViewProduct}
                  onOpenProductPage={handleOpenProductPage}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                  onAddToCompare={handleAddToCompare}
                />
              </div>

              {/* Full-width Middle Banner */}
              <MiddleBanner
                language={language}
                onShopNow={() => {
                  setSelectedCategory('Textiles');
                  setSearchQuery('');
                  const el = document.getElementById('trending-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              />

              {/* Trending Items Section */}
              <div id="trending-section">
                <TrendingItemsSection
                  currency={currency}
                  language={language}
                  products={catalogProducts}
                  onSelectProduct={setQuickViewProduct}
                  onOpenProductPage={handleOpenProductPage}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                  onAddToCompare={handleAddToCompare}
                  selectedCategory={selectedCategory}
                  searchQuery={searchQuery}
                  onClearFilters={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                    addToast(language === 'si' ? 'සියලු භාණ්ඩ පෙන්වීමට පෙරහන් ඉවත් කරන ලදී' : 'Filters reset to show all items', 'info');
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. Footer */}
      <Footer
        language={language}
        onCategoryClick={(cat) => {
          setSelectedCategory(cat);
          setSearchQuery('');
          const el = document.getElementById('trending-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenTrackOrder={() => setTrackOrderOpen(true)}
        onOpenHelp={() => setHelpModalOpen(true)}
        onOpenVendor={() => setVendorModalOpen(true)}
        onOpenPages={handleOpenPages}
        onOpenB2B={() => setB2bQuoteOpen(true)}
        onNewsletterSubscribe={handleNewsletterSubscribe}
      />

      {/* 4. Interactive Drawers & Modals */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOpenCheckout={() => setCheckoutModalOpen(true)}
        currency={currency}
        language={language}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onSelectProduct={handleOpenProductPage}
      />

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
        onAddToCompare={handleAddToCompare}
        currency={currency}
        language={language}
        onViewProductPage={handleOpenProductPage}
        onEditProduct={(prod) => {
          setEditingProduct(prod);
          setAddProductModalOpen(true);
        }}
      />

      <WishlistDrawer
        isOpen={wishlistDrawerOpen}
        onClose={() => setWishlistDrawerOpen(false)}
        items={wishlist}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onAddToCart={handleAddToCart}
        currency={currency}
        language={language}
        onSelectProduct={handleOpenProductPage}
      />

      <CompareModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        products={compareList}
        onRemoveFromCompare={handleRemoveFromCompare}
        onClearCompare={handleClearCompare}
        onAddToCart={handleAddToCart}
        currency={currency}
        language={language}
        onSelectProduct={handleOpenProductPage}
      />

      <TrackOrderModal
        isOpen={trackOrderOpen}
        onClose={() => setTrackOrderOpen(false)}
        initialOrderId={trackedOrderId}
        currency={currency}
        language={language}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        language={language}
        onSuccess={(email, account) => {
          const cleanEmail = email.trim();
          setUserEmail(cleanEmail);
          if (account) {
            setCurrentUser(account);
          }
          const isUserAdmin =
            account?.role === 'super_admin' ||
            account?.role === 'catalog_admin' ||
            cleanEmail.toLowerCase() === 'admin' ||
            cleanEmail.toLowerCase() === 'admin@market.com' ||
            cleanEmail.toLowerCase().includes('admin');

          if (isUserAdmin) {
            handleOpenAdminView();
            addToast(
              language === 'si'
                ? `පාලක ලෙස සාර්ථකව ඇතුල් වුණි (${account?.name || cleanEmail}). Backend පාලක පුවරුවට පිවිසිණි!`
                : `Logged in as Administrator (${account?.name || cleanEmail}). Directed to Backend Interface.`,
              'success'
            );
          } else if (account?.role === 'vendor') {
            handleBackToStorefront();
            setVendorStorefrontData({
              isOpen: true,
              vendorName: account.name || 'Verified Vendor Studio',
            });
            addToast(
              language === 'si'
                ? `විකුණුම්කරු ලෙස ඇතුල් වුණි (${account.name})! වෙළඳසැල විවෘත විය.`
                : `Logged in as Vendor (${account.name})! Merchant portal loaded.`,
              'success'
            );
          } else {
            handleBackToStorefront();
            addToast(
              language === 'si'
                ? `පාරිභෝගික ගිණුමට ඇතුල් වුණි (${account?.name || cleanEmail}). වෙළඳසැල් මුහුණතට සාදරයෙන් පිළිගනිමු!`
                : `Logged in as ${account?.role === 'buyer' ? 'B2B Wholesale Buyer' : 'Customer'} (${account?.name || cleanEmail}). Welcome to the Storefront!`,
              'success'
            );
          }
        }}
      />

      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        items={cartItems}
        currency={currency}
        appliedCoupon={appliedCoupon}
        language={language}
        onOrderCompleted={() => {
          setCartItems([]);
          addToast(
            language === 'si'
              ? 'ඔබගේ ඇණවුමට ස්තූතියි! තහවුරු කිරීමේ විද්‍යුත් තැපෑල යවන ලදී.'
              : 'Thank you for your order! Confirmation email dispatched.',
            'success'
          );
        }}
        onTrackOrder={(id) => {
          setTrackedOrderId(id);
          setTrackOrderOpen(true);
          addToast(
            language === 'si' ? `ඇණවුම ${id} ලුහුබඳිමින්...` : `Tracking order ${id}...`,
            'info'
          );
        }}
      />

      <HelpModal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
        language={language}
      />

      <VendorModal
        isOpen={vendorModalOpen}
        onClose={() => setVendorModalOpen(false)}
        language={language}
        onOpenAddProduct={() => setAddProductModalOpen(true)}
        onSuccess={(store) => {
          addToast(
            language === 'si'
              ? `"${store}" වෙළඳසැල විකුණුම්කරු සත්‍යාපනය සඳහා යොමු කරන ලදී!`
              : `Store "${store}" submitted for seller verification!`
          );
        }}
      />

      <B2BQuoteModal
        isOpen={b2bQuoteOpen}
        onClose={() => setB2bQuoteOpen(false)}
        language={language}
        onSuccess={(company) => {
          addToast(
            language === 'si'
              ? `${company} සඳහා තොග RFQ ඉල්ලුම්පත යොමු කරන ලදී!`
              : `Wholesale RFQ request dispatched for ${company}!`,
            'success'
          );
        }}
      />

      <BlogModal
        isOpen={blogModalOpen}
        onClose={() => setBlogModalOpen(false)}
        language={language}
        onReadArticle={(title) => {
          addToast(
            language === 'si'
              ? `ලිපිය කියවීම: "${title.slice(0, 30)}..."`
              : `Viewing article: "${title.slice(0, 30)}..."`,
            'info'
          );
        }}
      />

      <PagesModal
        isOpen={pagesModalOpen}
        onClose={() => setPagesModalOpen(false)}
        onOpenVendor={() => setVendorModalOpen(true)}
        onOpenHelp={() => setHelpModalOpen(true)}
        initialTab={pagesModalTab}
        language={language}
      />

      {/* Supplier Live Trade Desk Chat */}
      <SupplierChatModal
        isOpen={supplierChatData.isOpen}
        onClose={() => setSupplierChatData((prev) => ({ ...prev, isOpen: false }))}
        vendorName={supplierChatData.vendorName}
        productName={supplierChatData.productName}
        onRequestQuote={() => setB2bQuoteOpen(true)}
        language={language}
      />

      {/* Verified Vendor Storefront & Catalog */}
      <VendorStorefrontModal
        isOpen={vendorStorefrontData.isOpen}
        onClose={() => setVendorStorefrontData((prev) => ({ ...prev, isOpen: false }))}
        vendorName={vendorStorefrontData.vendorName}
        currency={currency}
        onSelectProduct={handleOpenProductPage}
        onOpenChat={(vendor) => handleOpenSupplierChat(vendor)}
        onRequestQuote={() => setB2bQuoteOpen(true)}
        language={language}
      />

      {/* Admin Backend & Store Management Modal */}
      <AdminDashboardModal
        isOpen={adminDashboardOpen}
        onClose={() => setAdminDashboardOpen(false)}
        currency={currency}
        language={language}
        onUpdateHeroBanner={(title, subtitle, coupon) => {
          setAppliedCoupon(coupon);
          addToast(`Live homepage banner & coupon updated to "${coupon}"!`, 'success');
        }}
        onUpdateProductStock={(id, stock) => {
          addToast(`Updated inventory stock to ${stock} units`, 'success');
        }}
        onToggleDailyDeal={(id, isDeal) => {
          addToast(isDeal ? 'Added product to active Daily Deals countdown' : 'Removed from Daily Deals', 'info');
        }}
      />

      {/* Comprehensive Add / Edit Product Interface Modal */}
      <AddProductModal
        isOpen={addProductModalOpen}
        productToEdit={editingProduct}
        onClose={() => {
          setAddProductModalOpen(false);
          setEditingProduct(null);
        }}
        onProductCreated={(newProd) => {
          addToast(`Product "${newProd.name.slice(0, 25)}..." added to catalog!`, 'success');
        }}
        onProductUpdated={(updatedProd) => {
          if (viewingProduct && viewingProduct.id === updatedProd.id) {
            setViewingProduct(updatedProd);
          }
          addToast(`Product "${updatedProd.name.slice(0, 25)}..." updated successfully!`, 'success');
        }}
        currency={currency}
        language={language}
      />

      {/* Mobile Slide-out Navigation & Category Drawer */}
      <MobileNavDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSearchQuery('');
        }}
        language={language}
        onLanguageChange={handleLanguageChange}
        currentCurrency={currency}
        onCurrencyChange={setCurrency}
        userEmail={userEmail}
        onOpenAuth={() => setAuthModalOpen(true)}
        onSignOut={() => {
          setUserEmail(null);
          setCurrentUser(null);
          addToast(language === 'si' ? 'සාර්ථකව නික්මෙන ලදී' : 'Signed out successfully', 'info');
        }}
        onOpenVendorModal={() => setVendorModalOpen(true)}
        onOpenTrackOrder={() => setTrackOrderOpen(true)}
        onOpenB2BQuote={() => setB2bQuoteOpen(true)}
        onOpenHelp={() => setHelpModalOpen(true)}
        onOpenBlog={() => setBlogModalOpen(true)}
        onOpenPages={() => handleOpenPages('about')}
        onOpenAdminDashboard={handleOpenAdminView}
        onSelectNav={handleSelectNav}
      />

      {/* Modern Sticky Bottom Navigation Bar on Mobile Phones */}
      <MobileBottomBar
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        cartTotal={cartTotal}
        wishlistCount={wishlist.length}
        currency={currency}
        language={language}
        onGoHome={handleBackToHome}
        onOpenCategories={() => setMobileDrawerOpen(true)}
        onGoDeals={() => {
          handleBackToHome();
          const el = document.getElementById('daily-deals');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenWishlist={() => setWishlistDrawerOpen(true)}
        onOpenCart={() => setCartDrawerOpen(true)}
      />

      {/* Toast Feedback */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
