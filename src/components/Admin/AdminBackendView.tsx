import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Sliders,
  Package,
  FolderTree,
  ShoppingBag,
  Tag,
  Server,
  ArrowLeft,
  Plus,
  Search,
  Edit2,
  Trash2,
  Save,
  Clock,
  DollarSign,
  CheckCircle,
  TrendingUp,
  ShieldCheck,
  Eye,
  EyeOff,
  RefreshCw,
  Upload,
  UserCheck,
  ChevronRight,
  ChevronLeft,
  Filter,
  Check,
  Sparkles,
  Store,
  Calendar,
  AlertTriangle,
  Building2,
  Globe,
  X,
  Image as ImageIcon,
  Copy,
  Layers,
  Palette,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Info,
  Users,
  KeyRound,
  Lock,
  UserPlus,
  ShieldAlert,
} from 'lucide-react';
import { Currency, Language, Product, CategoryItem, HeroSlideItem, OrderRecord } from '../../types/marketplace';
import { ALL_PRODUCTS, CATEGORIES } from '../../data/products';
import { INITIAL_HERO_SLIDES, HERO_IMAGE_PRESETS, HeroImagePreset } from '../../data/heroSlides';
import {
  getStoredOrders,
  updateOrderStatusInStorage,
  subscribeToOrders,
  deleteOrderInStorage,
  resetOrdersToDefault,
  placeOrder
} from '../../services/orderService';
import {
  getStoredDepartments,
  saveDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  reorderDepartments,
  resetDepartmentsToDefault,
  subscribeToDepartments,
  AVAILABLE_DEPARTMENT_ICONS,
  addSubcategoryToDepartment,
  removeSubcategoryFromDepartment,
  slugifyDepartmentName,
} from '../../services/departmentService';
import { DepartmentIcon } from '../Common/DepartmentIcon';
import { ProductImageRenderer } from '../Images/ProductImageRenderer';
import { getProductName, getCategoryName, getVendorName } from '../../i18n/translations';
import {
  getStoredProducts,
  updateProduct as updateProductInStorage,
  deleteProduct as deleteProductInStorage,
  subscribeToProducts,
} from '../../services/productService';
import { AddProductModal } from './AddProductModal';
import {
  UserRole,
  UserAccount,
  LoginLogEntry,
  getStoredUsers,
  saveUsers,
  subscribeToUsers,
  getStoredLoginLogs,
  subscribeToLoginLogs,
  generateNewAccount,
  updateUserPassword,
  updateUserAccount,
  deleteUserAccount,
  resetUsersToDefault,
  clearLoginLogs,
  generateRandomPassword,
} from '../../services/authService';

interface AdminBackendViewProps {
  onBackToStorefront: () => void;
  currency: Currency;
  language?: Language;
  heroSlides?: HeroSlideItem[];
  onUpdateHeroSlides?: (slides: HeroSlideItem[]) => void;
  onUpdateHeroBanner?: (title: string, subtitle: string, coupon: string) => void;
  onSelectProduct?: (product: Product) => void;
  onAddToast: (text: string, type?: 'success' | 'info') => void;
}

type AdminSection = 'overview' | 'homepage' | 'products' | 'categories' | 'orders' | 'coupons' | 'users' | 'api-docs';

export const AdminBackendView: React.FC<AdminBackendViewProps> = ({
  onBackToStorefront,
  currency,
  language = 'en',
  heroSlides = INITIAL_HERO_SLIDES,
  onUpdateHeroSlides,
  onUpdateHeroBanner,
  onSelectProduct,
  onAddToast,
}) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');

  // Currency conversions
  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';
  const currencyRate = currency === 'USD' ? 1 : currency === 'EUR' ? 0.92 : 0.79;

  // 1. Homepage & Hero Slider Customizer State
  const [slidesList, setSlidesList] = useState<HeroSlideItem[]>(heroSlides);
  const [activeSlideIdx, setActiveSlideIdx] = useState<number>(0);
  const [previewSlideIdx, setPreviewSlideIdx] = useState<number>(0);
  const [customImageUrl, setCustomImageUrl] = useState<string>('');
  const [activeCoupon, setActiveCoupon] = useState('Happy2017');
  const [promoBannerText, setPromoBannerText] = useState('Jacquard Warp Knitted Microfiber Towel - Special 75% OFF');
  const [footerPromises, setFooterPromises] = useState([
    'Free Worldwide Delivery on qualifying orders over $49.89',
    'Buyer Protection Escrow: Funds secured until verified inspection',
    '30-Day Hassle-Free Money Back Guarantee on all marketplace items',
    '24/7 Dedicated Priority Customer Care and Live Trade Desk',
  ]);

  const currentSlide = slidesList[activeSlideIdx] || slidesList[0];

  const updateCurrentSlide = (fields: Partial<HeroSlideItem>) => {
    setSlidesList((prev) => {
      const updated = [...prev];
      if (updated[activeSlideIdx]) {
        updated[activeSlideIdx] = { ...updated[activeSlideIdx], ...fields };
      }
      return updated;
    });
  };

  const handleAddNewSlide = () => {
    const newSlide: HeroSlideItem = {
      id: Date.now(),
      category: 'Seasonal Living Collection',
      categorySi: 'සෘතුමය ජීවන එකතුව',
      badge: 'NEW ARRIVAL',
      badgeSi: 'අලුත්ම පැමිණීම්',
      badgeColor: '#ea580c',
      headline: 'Architectural Modern Design',
      headlineSi: 'නවීන වාස්තු විද්‍යාත්මක සැලසුම්',
      highlight: 'SPECIAL 40% OFF',
      highlightSi: 'විශේෂ 40% වට්ටම්',
      description: 'Handcrafted solid European beech wood frames with acoustic velvet cushioning for modern spaces.',
      descriptionSi: 'නිවසට සහ කාර්යාලයට නවීන සුවපහසුව ගෙනදෙන අලංකාර නිර්මාණ.',
      image: HERO_IMAGE_PRESETS[0].path,
      ctaText: 'Explore Now',
      ctaTextSi: 'දැන් ගවේෂණය කරන්න',
      targetCategory: 'Furniture',
      isActive: true,
    };
    const next = [...slidesList, newSlide];
    setSlidesList(next);
    setActiveSlideIdx(next.length - 1);
    setPreviewSlideIdx(next.length - 1);
    onAddToast('Added new slide to hero carousel!', 'success');
  };

  const handleDeleteSlide = (idx: number) => {
    if (slidesList.length <= 1) {
      onAddToast('Hero carousel must retain at least one slide', 'info');
      return;
    }
    const next = slidesList.filter((_, i) => i !== idx);
    setSlidesList(next);
    const nextIdx = Math.max(0, idx - 1);
    setActiveSlideIdx(nextIdx);
    setPreviewSlideIdx(nextIdx);
    onAddToast('Slide removed from hero carousel', 'info');
  };

  const handleDuplicateSlide = (idx: number) => {
    const toDup = slidesList[idx];
    if (!toDup) return;
    const duplicated: HeroSlideItem = {
      ...toDup,
      id: Date.now(),
      headline: `${toDup.headline} (Copy)`,
    };
    const next = [...slidesList];
    next.splice(idx + 1, 0, duplicated);
    setSlidesList(next);
    setActiveSlideIdx(idx + 1);
    setPreviewSlideIdx(idx + 1);
    onAddToast('Slide duplicated!', 'success');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateCurrentSlide({ image: event.target.result as string });
          onAddToast('Custom hero image uploaded from device!', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveHomepageCustomizer = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateHeroSlides) {
      onUpdateHeroSlides(slidesList);
    }
    if (onUpdateHeroBanner && slidesList[0]) {
      onUpdateHeroBanner(slidesList[0].headline, slidesList[0].description, activeCoupon);
    }
    onAddToast('Hero carousel & homepage customizations published live!', 'success');
  };

  // 2. Product Catalog State (Persistent & Synchronized with Storefront)
  const [products, setProducts] = useState<Product[]>(() => getStoredProducts());
  const [productSearch, setProductSearch] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState('All');
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [newStockVal, setNewStockVal] = useState<number>(20);

  // New / Edit Product Modal Controller
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Subscribe to real-time products changes across tabs and storefront
  useEffect(() => {
    setProducts(getStoredProducts());
    const unsubscribe = subscribeToProducts((latest) => {
      setProducts(latest);
    });
    return unsubscribe;
  }, []);

  // 3. Department & Category Customizer State (Synchronized with Storefront Navigation)
  const [categories, setCategories] = useState<CategoryItem[]>(() => getStoredDepartments());
  const [deptSearchTerm, setDeptSearchTerm] = useState('');

  // Department Modal State (Add or Edit)
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [editingDeptId, setEditingDeptId] = useState<string | null>(null);
  const [deptFormName, setDeptFormName] = useState('');
  const [deptFormNameSi, setDeptFormNameSi] = useState('');
  const [deptFormSlug, setDeptFormSlug] = useState('');
  const [deptFormIcon, setDeptFormIcon] = useState('FolderTree');
  const [deptFormItemCount, setDeptFormItemCount] = useState<number>(500);
  const [deptFormSubcategories, setDeptFormSubcategories] = useState<string[]>([]);
  const [deptFormSubcategoriesSi, setDeptFormSubcategoriesSi] = useState<string[]>([]);
  const [newSubInput, setNewSubInput] = useState('');
  const [newSubSiInput, setNewSubSiInput] = useState('');

  // Delete Department Confirmation Modal State
  const [deletingDept, setDeletingDept] = useState<CategoryItem | null>(null);

  // Reset to Defaults Confirmation Modal State
  const [showResetDeptConfirm, setShowResetDeptConfirm] = useState(false);

  // Quick Inline Subcategory Input per card
  const [quickSubDeptId, setQuickSubDeptId] = useState<string | null>(null);
  const [quickSubText, setQuickSubText] = useState('');

  // Live Mega-Menu Preview Tab in Admin View (open/collapsed)
  const [showLivePreview, setShowLivePreview] = useState(false);

  // Subscribe to real-time departments changes across tabs and storefront
  useEffect(() => {
    setCategories(getStoredDepartments());
    const unsubscribe = subscribeToDepartments((latest) => {
      setCategories(latest);
    });
    return unsubscribe;
  }, []);

  // 4. Order Management State (Persistent & Synchronized with Storefront Checkout)
  const [orders, setOrders] = useState<OrderRecord[]>(() => getStoredOrders());
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [isSyncingOrders, setIsSyncingOrders] = useState(false);

  // Subscribe to real-time orders placed in Storefront Checkout
  useEffect(() => {
    setOrders(getStoredOrders());
    const unsubscribe = subscribeToOrders((latest) => {
      setOrders(latest);
    });
    return unsubscribe;
  }, []);

  // 5. Coupons State
  const [coupons, setCoupons] = useState([
    { code: 'HAPPY2017', discount: 20, minSpend: 0, expires: '2028-12-31', active: true, usageCount: 142 },
    { code: 'BULKTRADE10', discount: 10, minSpend: 250, expires: '2027-06-30', active: true, usageCount: 68 },
    { code: 'FREESHIP50', discount: 100, minSpend: 49.89, expires: '2027-12-31', active: true, usageCount: 312 },
  ]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(15);
  const [newCouponMin, setNewCouponMin] = useState(50);

  // Computed metrics
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0) * currencyRate;
  const totalProductsCount = products.length;
  const dailyDealsCount = products.filter(p => p.isDailyDeal).length;

  // Filtered products list
  const filteredProducts = products.filter(p => {
    const matchesSearch = !productSearch.trim() ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.vendor && p.vendor.toLowerCase().includes(productSearch.toLowerCase()));
    const matchesCategory = selectedProductCategory === 'All' || p.category.toLowerCase().includes(selectedProductCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  // Handlers

  const handleToggleDailyDeal = (productId: string) => {
    const target = products.find(p => p.id === productId);
    if (!target) return;
    const nextState = !target.isDailyDeal;
    updateProductInStorage(productId, { isDailyDeal: nextState });
    onAddToast(nextState ? `"${target.name.slice(0, 20)}..." set as Daily Deal with live countdown!` : `Removed from Daily Deals`, 'info');
  };

  const handleSaveStock = (productId: string) => {
    updateProductInStorage(productId, { stock: newStockVal });
    setEditingStockId(null);
    onAddToast(`Stock updated to ${newStockVal} units!`, 'success');
  };

  const handleDeleteProduct = (productId: string, name: string) => {
    deleteProductInStorage(productId);
    onAddToast(`Deleted product: ${name.slice(0, 25)}...`, 'info');
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    const updated = updateOrderStatusInStorage(orderId, newStatus);
    setOrders(updated);
    onAddToast(`Order ${orderId} milestone updated to: ${newStatus}`, 'success');
  };

  const handleDeleteOrder = (orderId: string) => {
    const updated = deleteOrderInStorage(orderId);
    setOrders(updated);
    onAddToast(`Order ${orderId} archived from terminal`, 'info');
  };

  const handleSyncOrders = () => {
    setIsSyncingOrders(true);
    const fresh = getStoredOrders();
    setOrders(fresh);
    setTimeout(() => {
      setIsSyncingOrders(false);
      onAddToast(`Fulfillment Terminal synchronized: ${fresh.length} active orders`, 'success');
    }, 400);
  };

  const handleSimulateBuyerOrder = () => {
    const sampleBuyers = [
      { name: 'Kavinda Bandara', phone: '+94 77 982 1144', city: 'Colombo, Sri Lanka', addr: 'No. 88, Galle Road, Colombo 03' },
      { name: 'Ayesha Perera', phone: '+94 71 455 8920', city: 'Kandy, Sri Lanka', addr: 'No. 14, Peradeniya Rd, Kandy' },
      { name: 'Marcus Vance', phone: '+46 8 555 3190', city: 'Stockholm, Sweden', addr: 'Hamngatan 14, Stockholm' },
      { name: 'Sarah Jenkins', phone: '+1 (415) 302-9988', city: 'San Francisco, CA', addr: '500 Howard Street, SF' },
      { name: 'Ruwan Silva', phone: '+94 76 555 4321', city: 'Galle, Sri Lanka', addr: 'No. 29, Rampart Street, Fort Galle' },
    ];
    const payments = ['Credit Card (Stripe)', 'Cash on Delivery (COD)', 'PayPal Express'];
    const chosen = sampleBuyers[Math.floor(Math.random() * sampleBuyers.length)];
    const chosenPayment = payments[Math.floor(Math.random() * payments.length)];
    const itemsCount = Math.floor(1 + Math.random() * 4);
    const totalAmount = Math.floor(65 + Math.random() * 420) + 0.99;

    const newOrder = placeOrder({
      customer: chosen.name,
      email: `${chosen.name.toLowerCase().replace(/\s+/g, '.')}@buyer.market.com`,
      phone: chosen.phone,
      shippingAddress: `${chosen.addr}, ${chosen.city}`,
      itemsCount,
      total: totalAmount,
      paymentMethod: chosenPayment,
      status: 'Pending',
    });

    onAddToast(`Live buyer order placed! ID: ${newOrder.id} - ${newOrder.customer}`, 'success');
  };

  const handleResetOrdersToDefault = () => {
    const def = resetOrdersToDefault();
    setOrders(def);
    onAddToast('Reset orders terminal to standard seed records', 'info');
  };

  // Filtered orders list for Section 5
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === 'All' || o.status.toLowerCase() === orderStatusFilter.toLowerCase();
    const query = orderSearch.trim().toLowerCase();
    const matchesSearch =
      !query ||
      o.id.toLowerCase().includes(query) ||
      o.customer.toLowerCase().includes(query) ||
      o.phone.toLowerCase().includes(query) ||
      o.email.toLowerCase().includes(query) ||
      o.shippingAddress.toLowerCase().includes(query) ||
      o.paymentMethod.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    const cleanCode = newCouponCode.trim().toUpperCase();
    if (coupons.some(c => c.code === cleanCode)) {
      onAddToast('Coupon code already exists', 'info');
      return;
    }
    const newC = {
      code: cleanCode,
      discount: newCouponDiscount,
      minSpend: newCouponMin,
      expires: '2028-12-31',
      active: true,
      usageCount: 0,
    };
    setCoupons([newC, ...coupons]);
    setNewCouponCode('');
    onAddToast(`Coupon ${cleanCode} created with ${newCouponDiscount}% discount!`, 'success');
  };

  // Open Add Department Modal
  const handleOpenAddDeptModal = () => {
    setEditingDeptId(null);
    setDeptFormName('');
    setDeptFormNameSi('');
    setDeptFormSlug('');
    setDeptFormIcon('FolderTree');
    setDeptFormItemCount(250);
    setDeptFormSubcategories(['General Hardware', 'Fittings', 'Components']);
    setDeptFormSubcategoriesSi(['දෘඩාංග උපාංග', 'සවිකිරීම්', 'අමතර කොටස්']);
    setNewSubInput('');
    setNewSubSiInput('');
    setShowDeptModal(true);
  };

  // Open Edit Department Modal
  const handleOpenEditDeptModal = (dept: CategoryItem) => {
    setEditingDeptId(dept.id);
    setDeptFormName(dept.name);
    setDeptFormNameSi(dept.nameSi || '');
    setDeptFormSlug(dept.id);
    setDeptFormIcon(dept.iconName || 'FolderTree');
    setDeptFormItemCount(dept.itemCount || 100);
    setDeptFormSubcategories([...dept.subcategories]);
    setDeptFormSubcategoriesSi(dept.subcategoriesSi ? [...dept.subcategoriesSi] : []);
    setNewSubInput('');
    setNewSubSiInput('');
    setShowDeptModal(true);
  };

  // Add subcategory inside modal form
  const handleAddSubcategoryInForm = () => {
    const trimmedEn = newSubInput.trim();
    if (!trimmedEn) return;
    if (deptFormSubcategories.includes(trimmedEn)) {
      onAddToast(`Subcategory "${trimmedEn}" already exists in this department`, 'info');
      return;
    }
    setDeptFormSubcategories([...deptFormSubcategories, trimmedEn]);
    const trimmedSi = newSubSiInput.trim() || trimmedEn;
    setDeptFormSubcategoriesSi([...deptFormSubcategoriesSi, trimmedSi]);
    setNewSubInput('');
    setNewSubSiInput('');
  };

  // Remove subcategory inside modal form
  const handleRemoveSubcategoryInForm = (index: number) => {
    const updated = [...deptFormSubcategories];
    updated.splice(index, 1);
    setDeptFormSubcategories(updated);

    if (deptFormSubcategoriesSi && deptFormSubcategoriesSi.length > index) {
      const updatedSi = [...deptFormSubcategoriesSi];
      updatedSi.splice(index, 1);
      setDeptFormSubcategoriesSi(updatedSi);
    }
  };

  // Save Add/Edit Department
  const handleSaveDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptFormName.trim()) {
      onAddToast('Please enter a department name', 'info');
      return;
    }

    if (editingDeptId) {
      // Edit existing
      updateDepartment(editingDeptId, {
        name: deptFormName.trim(),
        nameSi: deptFormNameSi.trim() || undefined,
        iconName: deptFormIcon,
        itemCount: Number(deptFormItemCount) || 100,
        subcategories: deptFormSubcategories,
        subcategoriesSi: deptFormSubcategoriesSi.length > 0 ? deptFormSubcategoriesSi : undefined,
      });
      onAddToast(`Department "${deptFormName.trim()}" updated successfully!`, 'success');
    } else {
      // Add new
      const generatedSlug = deptFormSlug.trim() || slugifyDepartmentName(deptFormName.trim());
      addDepartment({
        id: generatedSlug,
        name: deptFormName.trim(),
        nameSi: deptFormNameSi.trim() || undefined,
        iconName: deptFormIcon,
        itemCount: Number(deptFormItemCount) || 100,
        subcategories: deptFormSubcategories.length > 0 ? deptFormSubcategories : ['Supplies', 'Accessories'],
        subcategoriesSi: deptFormSubcategoriesSi.length > 0 ? deptFormSubcategoriesSi : undefined,
      });
      onAddToast(`Department "${deptFormName.trim()}" added to storefront navigation!`, 'success');
    }

    setShowDeptModal(false);
  };

  // Delete Department confirmation
  const handleConfirmDeleteDept = () => {
    if (!deletingDept) return;
    deleteDepartment(deletingDept.id);
    onAddToast(`Department "${deletingDept.name}" removed from navigation`, 'info');
    setDeletingDept(null);
  };

  // Reorder department
  const handleMoveDepartment = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;
    reorderDepartments(index, targetIndex);
    onAddToast(`Department moved ${direction}!`, 'info');
  };

  // Quick inline add subcategory on card
  const handleQuickAddSub = (deptId: string) => {
    const trimmed = quickSubText.trim();
    if (!trimmed) return;
    addSubcategoryToDepartment(deptId, trimmed);
    setQuickSubText('');
    setQuickSubDeptId(null);
    onAddToast(`Added subcategory "${trimmed}"!`, 'success');
  };

  // Quick inline remove subcategory on card
  const handleQuickRemoveSub = (deptId: string, subIndex: number) => {
    removeSubcategoryFromDepartment(deptId, subIndex);
    onAddToast('Subcategory removed', 'info');
  };

  // Reset departments
  const handleConfirmResetDepartments = () => {
    resetDepartmentsToDefault();
    setShowResetDeptConfirm(false);
    onAddToast('Departments restored to default 11 mega-menu catalog', 'info');
  };

  // 5. User & Admin Accounts, Password Management & Login Audit Logs State
  const [usersList, setUsersList] = useState<UserAccount[]>(() => getStoredUsers());
  const [loginLogsList, setLoginLogsList] = useState<LoginLogEntry[]>(() => getStoredLoginLogs());
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('All');

  // Generator form state
  const [newLoginRole, setNewLoginRole] = useState<UserRole>('super_admin');
  const [newLoginName, setNewLoginName] = useState('');
  const [newLoginEmailPrefix, setNewLoginEmailPrefix] = useState('');
  const [newLoginPassword, setNewLoginPassword] = useState('');
  const [lastGeneratedAccount, setLastGeneratedAccount] = useState<UserAccount | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Edit password modal state
  const [editingPasswordUser, setEditingPasswordUser] = useState<UserAccount | null>(null);
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});

  // Audit log filter state
  const [logStatusFilter, setLogStatusFilter] = useState<'All' | 'SUCCESS' | 'FAILED_PASSWORD'>('All');
  const [logSearchQuery, setLogSearchQuery] = useState('');

  // Real-time synchronization
  useEffect(() => {
    setUsersList(getStoredUsers());
    const unsubUsers = subscribeToUsers((latest) => {
      setUsersList(latest);
    });
    setLoginLogsList(getStoredLoginLogs());
    const unsubLogs = subscribeToLoginLogs((latest) => {
      setLoginLogsList(latest);
    });
    return () => {
      unsubUsers();
      unsubLogs();
    };
  }, []);

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
    onAddToast('Copied to clipboard!', 'info');
  };

  const handleGenerateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const account = generateNewAccount({
      role: newLoginRole,
      name: newLoginName.trim() || undefined,
      emailPrefix: newLoginEmailPrefix.trim() || undefined,
      customPassword: newLoginPassword.trim() || undefined,
    });
    setLastGeneratedAccount(account);
    setNewLoginName('');
    setNewLoginEmailPrefix('');
    setNewLoginPassword('');
    onAddToast(`Created new ${account.role.replace('_', ' ')} login: ${account.email}!`, 'success');
  };

  const handleOpenEditPassword = (user: UserAccount) => {
    setEditingPasswordUser(user);
    setNewPasswordValue(generateRandomPassword());
    setShowPasswordModal(true);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPasswordUser) return;
    if (!newPasswordValue.trim() || newPasswordValue.trim().length < 6) {
      onAddToast('Password must be at least 6 characters', 'info');
      return;
    }
    updateUserPassword(editingPasswordUser.id, newPasswordValue.trim());
    onAddToast(`Password updated successfully for ${editingPasswordUser.email}!`, 'success');
    setShowPasswordModal(false);
    setEditingPasswordUser(null);
  };

  const handleToggleUserStatus = (user: UserAccount) => {
    if (user.role === 'super_admin' && user.isActive && usersList.filter(u => u.role === 'super_admin' && u.isActive).length <= 1) {
      onAddToast('Cannot deactivate the sole active Super Administrator', 'info');
      return;
    }
    updateUserAccount(user.id, { isActive: !user.isActive });
    onAddToast(`Account ${user.email} marked as ${!user.isActive ? 'Active' : 'Deactivated'}`, 'info');
  };

  const handleDeleteUserAccount = (user: UserAccount) => {
    if (user.role === 'super_admin') {
      const superAdminCount = usersList.filter(u => u.role === 'super_admin').length;
      if (superAdminCount <= 1) {
        onAddToast('Cannot delete the primary Super Administrator account', 'info');
        return;
      }
    }
    deleteUserAccount(user.id);
    onAddToast(`Account ${user.email} permanently deleted.`, 'info');
  };

  const handleResetUsersToDefault = () => {
    const def = resetUsersToDefault();
    setUsersList(def);
    onAddToast('Restored default credentials (Admin: admin@market.com / Admin@2026!)', 'info');
  };

  const handleClearAuditLogs = () => {
    clearLoginLogs();
    onAddToast('Authentication audit logs cleared', 'info');
  };

  const togglePasswordVisibility = (userId: string) => {
    setRevealedPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  // Filtered users
  const filteredUsers = usersList.filter((u) => {
    const matchesRole = userRoleFilter === 'All' || u.role === userRoleFilter;
    const query = userSearchQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      (u.username && u.username.toLowerCase().includes(query));
    return matchesRole && matchesQuery;
  });

  // Filtered audit logs
  const filteredLogs = loginLogsList.filter((log) => {
    const matchesStatus = logStatusFilter === 'All' || log.status === logStatusFilter;
    const query = logSearchQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      log.identifier.toLowerCase().includes(query) ||
      log.role.toLowerCase().includes(query) ||
      (log.device && log.device.toLowerCase().includes(query)) ||
      (log.ipAddress && log.ipAddress.toLowerCase().includes(query));
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* 1. Admin Dedicated Top Navigation Bar */}
      <header className="bg-[#0b1120] border-b border-slate-800 sticky top-0 z-40 px-4 sm:px-6 py-3 flex items-center justify-between shadow-md">
        {/* Left: Brand & Return to Storefront Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToStorefront}
            className="flex items-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] text-white px-3.5 py-1.5 rounded-md font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-95 font-display"
            title="Return to the customer marketplace storefront"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Storefront</span>
          </button>

          <div className="h-5 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#ea580c] to-[#ff7a45] flex items-center justify-center font-bold text-white text-sm shadow-sm">
              @
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-white tracking-tight leading-none font-display flex items-center gap-1.5">
                market <span className="text-[10px] bg-slate-800 text-orange-400 font-bold px-1.5 py-0.2 rounded border border-slate-700 font-mono">BACKEND</span>
              </span>
              <span className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
                Enterprise Administration Console
              </span>
            </div>
          </div>
        </div>

        {/* Center: System Status / Node.js Engine Indicator */}
        <div className="hidden md:flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-full text-[11px]">
          <span className="flex items-center gap-1.5 text-emerald-400 font-mono font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            API Online :5000
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 font-sans">Database: MongoDB Connected</span>
          <span className="text-slate-600">|</span>
          <span className="text-amber-400 font-mono">JWT Bearer Auth</span>
        </div>

        {/* Right: Admin User Profile */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-right hidden sm:flex">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white font-display">Super Administrator</span>
              <span className="text-[10px] text-slate-400 font-mono">admin@market.com</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[#ea580c]">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>

      {/* 2. Admin Workspace Layout: Left Sidebar + Main Work Area */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Mobile Horizontal Module Switcher (< md) */}
        <div className="md:hidden bg-[#0b1120] border-b border-slate-800 p-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none sticky top-12 z-30 touch-pan-x">
          {[
            { id: 'overview' as AdminSection, label: 'Dashboard', icon: LayoutDashboard },
            { id: 'homepage' as AdminSection, label: 'Customizer', icon: Sliders },
            { id: 'products' as AdminSection, label: `Products (${products.length})`, icon: Package },
            { id: 'categories' as AdminSection, label: `Depts (${categories.length})`, icon: FolderTree },
            { id: 'orders' as AdminSection, label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'coupons' as AdminSection, label: `Coupons (${coupons.length})`, icon: Tag },
            { id: 'users' as AdminSection, label: `Users (${usersList.length})`, icon: Users },
            { id: 'api-docs' as AdminSection, label: 'API / Node', icon: Server },
          ].map((item) => {
            const Icon = item.icon;
            const isCurrent = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 font-display ${
                  isCurrent
                    ? 'bg-[#ea580c] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Left Sidebar Navigation Menu for Desktop (>= md) */}
        <aside className="hidden md:flex md:w-60 bg-[#0b1120] border-r border-slate-800/80 p-3 sm:p-4 flex-col justify-between shrink-0">
          <div className="space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-display">
              Management Modules
            </div>

            <button
              onClick={() => setActiveSection('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer font-display ${
                activeSection === 'overview'
                  ? 'bg-[#ea580c] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Metrics & Dashboard</span>
            </button>

            <button
              onClick={() => setActiveSection('homepage')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer font-display ${
                activeSection === 'homepage'
                  ? 'bg-[#ea580c] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sliders className="w-4 h-4 shrink-0" />
              <span>Homepage Customizer</span>
            </button>

            <button
              onClick={() => setActiveSection('products')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer font-display ${
                activeSection === 'products'
                  ? 'bg-[#ea580c] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 shrink-0" />
                <span>Product Catalog</span>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-1.5 py-0.2 rounded">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSection('categories')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer font-display ${
                activeSection === 'categories'
                  ? 'bg-[#ea580c] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FolderTree className="w-4 h-4 shrink-0" />
                <span>All Departments</span>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-1.5 py-0.2 rounded">
                {categories.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSection('orders')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer font-display ${
                activeSection === 'orders'
                  ? 'bg-[#ea580c] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span>Orders Terminal</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono px-1.5 py-0.2 rounded">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSection('coupons')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer font-display ${
                activeSection === 'coupons'
                  ? 'bg-[#ea580c] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Tag className="w-4 h-4 shrink-0" />
                <span>Coupons & Promos</span>
              </div>
              <span className="text-[10px] bg-orange-500/20 text-orange-300 font-mono px-1.5 py-0.2 rounded">
                {coupons.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSection('users')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer font-display ${
                activeSection === 'users'
                  ? 'bg-[#ea580c] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 shrink-0" />
                <span>Users & Logins</span>
              </div>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-mono px-1.5 py-0.2 rounded border border-indigo-500/30">
                {usersList.length}
              </span>
            </button>

            <div className="pt-3 px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-display">
              Infrastructure
            </div>

            <button
              onClick={() => setActiveSection('api-docs')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer font-display ${
                activeSection === 'api-docs'
                  ? 'bg-[#ea580c] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Server className="w-4 h-4 shrink-0" />
              <span>Node / Express Server</span>
            </button>
          </div>

          {/* Bottom Sidebar Action: Return Storefront */}
          <div className="pt-4 border-t border-slate-800 mt-4 space-y-2">
            <button
              onClick={onBackToStorefront}
              className="w-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-2 rounded text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-800 font-display"
            >
              <Eye className="w-3.5 h-3.5 text-orange-400" />
              <span>View Live Marketplace</span>
            </button>
            <div className="text-[10px] text-slate-500 text-center font-mono">
              Build v1.0.4 • Express 4.21
            </div>
          </div>
        </aside>

        {/* Main Work Area (Right side) */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#0a0f1d] min-w-0">

          {/* SECTION 1: OVERVIEW & DASHBOARD METRICS */}
          {activeSection === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white font-display">
                    Marketplace Performance Dashboard
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time transaction volume, daily deals countdown timers, and catalog inventory overview
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAddToast('Metrics synchronized with MongoDB!', 'info')}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh Data</span>
                  </button>
                </div>
              </div>

              {/* 4 Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#11192d] p-4 rounded-xl border border-slate-800 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider font-display">Gross Trade Volume</span>
                    <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono-numbers">
                    {currencySymbol}{totalRevenue.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>+18.4% this week</span>
                  </div>
                </div>

                <div className="bg-[#11192d] p-4 rounded-xl border border-slate-800 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider font-display">Active Orders</span>
                    <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono-numbers">
                    {orders.length}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    100% Escrow protected dispatch
                  </span>
                </div>

                <div className="bg-[#11192d] p-4 rounded-xl border border-slate-800 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider font-display">Catalog Items</span>
                    <div className="p-2 bg-orange-500/10 text-orange-400 rounded-lg">
                      <Package className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono-numbers">
                    {totalProductsCount}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Across 11 verified categories
                  </span>
                </div>

                <div className="bg-[#11192d] p-4 rounded-xl border border-slate-800 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider font-display">Active Daily Deals</span>
                    <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono-numbers">
                    {dailyDealsCount}
                  </div>
                  <span className="text-[11px] text-amber-400/90 font-medium mt-1 block">
                    Live ticking countdown timers
                  </span>
                </div>
              </div>

              {/* Recent Orders Overview Table */}
              <div className="bg-[#11192d] rounded-xl border border-slate-800 overflow-hidden shadow-sm">
                <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#ea580c]" />
                    <h3 className="font-bold text-sm text-white font-display uppercase tracking-wider">
                      Recent Marketplace Orders
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveSection('orders')}
                    className="text-xs text-[#ea580c] hover:underline font-bold font-display cursor-pointer"
                  >
                    View All Orders →
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-900/60 text-slate-400 font-semibold uppercase font-display border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4 text-emerald-400 font-bold bg-emerald-950/20">Buyer Phone Number</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Payment Mode</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {orders.slice(0, 5).map(order => (
                        <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-white">
                            {order.id}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-medium text-white block">{order.customer}</span>
                            <span className="text-slate-500 font-mono text-[10px] flex items-center gap-1 mt-0.5">
                              <Mail className="w-2.5 h-2.5 text-slate-500 shrink-0" />
                              {order.email}
                            </span>
                          </td>
                          {/* Dedicated Buyer Phone Number Column */}
                          <td className="py-3.5 px-4 bg-emerald-950/10">
                            <a
                              href={`tel:${order.phone.replace(/[^+\d]/g, '')}`}
                              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded transition-colors group"
                              title={`Direct call ${order.customer} at ${order.phone}`}
                            >
                              <Phone className="w-3 h-3 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                              <span>{order.phone}</span>
                            </a>
                          </td>
                          <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                            {order.date}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-white">
                            {currencySymbol}{(order.total * currencyRate).toFixed(2)}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              order.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                              order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                              order.status === 'Processing' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                              'bg-slate-800 text-slate-300'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right text-slate-400 text-[11px]">
                            {order.paymentMethod}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: HOMEPAGE & HERO SLIDER CUSTOMIZATION */}
          {activeSection === 'homepage' && (
            <div className="space-y-6 max-w-5xl animate-in fade-in duration-150">
              {/* Header with Title and Quick Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30">
                      Live Storefront Engine
                    </span>
                    <span className="text-xs text-slate-500 font-mono">PUT /api/homepage/hero-slides</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-white font-display mt-1">
                    Hero Slider & Visual Merchandising Studio
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure multi-slide carousels, change hero photography with curated presets or custom URLs, customize badge palettes, and align copy in English & Sinhala.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handleSaveHomepageCustomizer(e as any)}
                    className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2 rounded-md font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md hover:scale-[1.02] active:scale-95 font-display"
                  >
                    <Save className="w-4 h-4" />
                    <span>Publish Live Changes</span>
                  </button>
                </div>
              </div>

              {/* A. REAL-TIME HERO CAROUSEL LIVE PREVIEW CARD */}
              <div className="bg-[#11192d] rounded-xl border border-slate-800 overflow-hidden shadow-lg">
                <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-orange-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-display">
                      Interactive Live Storefront Carousel Preview
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 border border-slate-700 font-mono px-2 py-0.5 rounded">
                      Slide {previewSlideIdx + 1} of {slidesList.length}
                    </span>
                    {slidesList[previewSlideIdx]?.isActive === false && (
                      <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono px-2 py-0.5 rounded">
                        Inactive (Hidden from Storefront)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline">Cycle Preview:</span>
                    <button
                      type="button"
                      onClick={() => setPreviewSlideIdx((prev) => (prev - 1 + slidesList.length) % slidesList.length)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                      title="Previous Slide"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewSlideIdx((prev) => (prev + 1) % slidesList.length)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                      title="Next Slide"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSlideIdx(previewSlideIdx);
                        onAddToast(`Editing slide #${previewSlideIdx + 1} in form below`, 'info');
                      }}
                      className="ml-2 text-[11px] font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 bg-orange-500/10 hover:bg-orange-500/20 px-2.5 py-1 rounded border border-orange-500/30 transition-colors cursor-pointer font-display"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit This Slide</span>
                    </button>
                  </div>
                </div>

                {/* Preview Viewport */}
                {(() => {
                  const pSlide = slidesList[previewSlideIdx] || slidesList[0];
                  if (!pSlide) return null;
                  return (
                    <div className="relative min-h-[260px] sm:min-h-[320px] bg-slate-950 overflow-hidden select-none">
                      {/* Background Image */}
                      <div className="absolute inset-0 z-0">
                        <img
                          src={pSlide.image}
                          alt={pSlide.headline}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-right"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        {/* Gradient overlay for text contrast */}
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-transparent sm:to-65%" />
                      </div>

                      {/* Foreground Text Content */}
                      <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-between max-w-lg min-h-[260px] sm:min-h-[320px]">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className="text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono shadow-sm"
                              style={{ backgroundColor: pSlide.badgeColor || '#0c1524' }}
                            >
                              {pSlide.badge || 'HOT DEAL'}
                            </span>
                            <span className="text-slate-300 text-xs font-semibold tracking-wide uppercase font-display">
                              {pSlide.category || 'Office & Living Collection'}
                            </span>
                          </div>

                          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight uppercase font-display drop-shadow-sm">
                            {pSlide.headline || 'Architectural Living'}
                          </h3>
                          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight uppercase mt-0.5 text-[#ea580c] font-display drop-shadow-sm">
                            {pSlide.highlight || 'SALE UP TO 50% OFF'}
                          </h2>

                          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed font-normal line-clamp-2 max-w-md drop-shadow">
                            {pSlide.description || 'Modern European beech wood frames with acoustic comfort.'}
                          </p>

                          <div className="mt-4">
                            <div className="inline-flex items-center gap-2 bg-[#ea580c] text-white px-4 py-2 rounded font-bold text-xs uppercase tracking-wider shadow-md font-display">
                              <span>{pSlide.ctaText || 'Shop now'}</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>

                        {/* Dot indicators in preview */}
                        <div className="flex items-center gap-1.5 pt-4">
                          {slidesList.map((_, dotIdx) => (
                            <button
                              key={dotIdx}
                              type="button"
                              onClick={() => setPreviewSlideIdx(dotIdx)}
                              className={`h-2 rounded-full transition-all cursor-pointer ${
                                dotIdx === previewSlideIdx
                                  ? 'w-6 bg-orange-500'
                                  : 'w-2 bg-slate-600 hover:bg-slate-400'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* B. SLIDE DECK TABS & CONTROLS */}
              <div className="bg-[#11192d] p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-orange-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-display">
                      Slide Deck Carousel ({slidesList.length} Slides)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDuplicateSlide(activeSlideIdx)}
                      className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded text-xs font-semibold transition-colors border border-slate-700 cursor-pointer"
                      title="Duplicate current slide"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Duplicate</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteSlide(activeSlideIdx)}
                      disabled={slidesList.length <= 1}
                      className="flex items-center gap-1.5 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-1.5 rounded text-xs font-semibold transition-colors border border-rose-800/60 cursor-pointer"
                      title="Delete current slide"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleAddNewSlide}
                      className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer shadow-sm font-display"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add New Slide</span>
                    </button>
                  </div>
                </div>

                {/* Slide Selection Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {slidesList.map((s, idx) => {
                    const isSelected = idx === activeSlideIdx;
                    return (
                      <button
                        key={s.id || idx}
                        type="button"
                        onClick={() => {
                          setActiveSlideIdx(idx);
                          setPreviewSlideIdx(idx);
                        }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer border ${
                          isSelected
                            ? 'bg-orange-500/20 text-orange-300 border-orange-500/60 shadow-sm'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            s.isActive !== false ? 'bg-emerald-400' : 'bg-slate-500'
                          }`}
                        />
                        <span className="font-mono font-bold">Slide {idx + 1}:</span>
                        <span className="truncate max-w-[130px] sm:max-w-[180px]">
                          {s.headline || `Slide #${idx + 1}`}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Active Slide Status Toggle */}
                <div className="flex items-center justify-between pt-2 px-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-300 font-semibold">Storefront Visibility:</span>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentSlide?.isActive !== false}
                        onChange={(e) => updateCurrentSlide({ isActive: e.target.checked })}
                        className="rounded bg-slate-900 border-slate-700 text-orange-500 focus:ring-0 cursor-pointer w-4 h-4"
                      />
                      <span className="text-xs font-mono text-slate-300">
                        {currentSlide?.isActive !== false ? 'Active (Visible on Storefront)' : 'Inactive (Hidden)'}
                      </span>
                    </label>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono">
                    Slide ID: {currentSlide?.id}
                  </span>
                </div>
              </div>

              {/* C. HERO PHOTOGRAPHY CHOOSER SUITE */}
              <div className="bg-[#11192d] p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-orange-400" />
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                        Hero Photography & Imagery Chooser
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Select from high-resolution workspace presets, paste a custom image URL, or upload from your computer.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Current Image Details */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  <div className="w-24 h-16 rounded overflow-hidden bg-slate-950 border border-slate-700 shrink-0">
                    <img
                      src={currentSlide?.image}
                      alt="Current preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 w-full">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase font-mono">Current Image Source:</div>
                    <div className="text-xs text-slate-200 font-mono truncate">{currentSlide?.image}</div>
                  </div>
                  <div className="shrink-0 w-full sm:w-auto">
                    <label className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded text-xs font-semibold transition-colors border border-slate-700 cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-orange-400" />
                      <span>Upload Device File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Preset Visual Gallery (8 High-Res Cards) */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 font-display block">
                    Curated High-Resolution Presets:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {HERO_IMAGE_PRESETS.map((preset) => {
                      const isSelected = currentSlide?.image === preset.path;
                      return (
                        <div
                          key={preset.id}
                          onClick={() => {
                            updateCurrentSlide({ image: preset.path });
                            onAddToast(`Applied preset: ${preset.title}`, 'success');
                          }}
                          className={`group relative rounded-lg overflow-hidden border cursor-pointer transition-all hover:scale-[1.02] ${
                            isSelected
                              ? 'border-orange-500 ring-2 ring-orange-500/30 shadow-md'
                              : 'border-slate-800 hover:border-slate-600 bg-slate-900'
                          }`}
                        >
                          <div className="h-24 bg-slate-950 relative overflow-hidden">
                            <img
                              src={preset.path}
                              alt={preset.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 bg-orange-500 text-white p-0.5 rounded-full shadow">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            )}
                            <span className="absolute bottom-1 left-1.5 bg-slate-950/80 text-[9px] font-mono font-bold text-slate-300 px-1.5 py-0.2 rounded">
                              {preset.category}
                            </span>
                          </div>
                          <div className="p-2 bg-slate-900/95">
                            <div className="text-[11px] font-semibold text-slate-200 truncate font-display">
                              {preset.title}
                            </div>
                            <button
                              type="button"
                              className={`mt-1.5 w-full text-[10px] font-bold py-1 rounded uppercase tracking-wider font-display transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                              }`}
                            >
                              {isSelected ? 'Applied' : 'Select'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Custom URL Input */}
                <div className="pt-2">
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Or Enter Custom HTTPS Image URL:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customImageUrl.trim()) {
                          updateCurrentSlide({ image: customImageUrl.trim() });
                          onAddToast('Custom image URL applied to slide!', 'success');
                          setCustomImageUrl('');
                        }
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-1.5 rounded text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                    >
                      Apply URL
                    </button>
                  </div>
                </div>
              </div>

              {/* D. BADGE STYLING & COLOR PALETTE */}
              <div className="bg-[#11192d] p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                  <Palette className="w-4 h-4 text-orange-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                    Badge & Visual Accent Palette
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Badge Text (EN & SI) */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1 text-xs">
                        Badge Text (English)
                      </label>
                      <input
                        type="text"
                        value={currentSlide?.badge || ''}
                        onChange={(e) => updateCurrentSlide({ badge: e.target.value })}
                        placeholder="e.g. HOT DEAL, 50% OFF, NEW ARRIVAL"
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white uppercase font-mono focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1 text-xs">
                        Badge Text (Sinhala)
                      </label>
                      <input
                        type="text"
                        value={currentSlide?.badgeSi || ''}
                        onChange={(e) => updateCurrentSlide({ badgeSi: e.target.value })}
                        placeholder="e.g. විශේෂ දීමනාව"
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  {/* Badge Color Swatches + Color Picker */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1 text-xs">
                        Badge Background Color:
                      </label>
                      <div className="flex items-center gap-2 flex-wrap">
                        {[
                          { name: 'Navy', hex: '#0c1524' },
                          { name: 'Orange', hex: '#ea580c' },
                          { name: 'Emerald', hex: '#059669' },
                          { name: 'Sky Blue', hex: '#0284c7' },
                          { name: 'Amber', hex: '#d97706' },
                          { name: 'Rose', hex: '#e11d48' },
                          { name: 'Violet', hex: '#7c3aed' },
                          { name: 'Slate', hex: '#334155' },
                        ].map((color) => {
                          const isActiveColor = currentSlide?.badgeColor === color.hex;
                          return (
                            <button
                              key={color.hex}
                              type="button"
                              onClick={() => updateCurrentSlide({ badgeColor: color.hex })}
                              className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer relative ${
                                isActiveColor ? 'scale-110 border-white shadow' : 'border-slate-700 hover:scale-105'
                              }`}
                              style={{ backgroundColor: color.hex }}
                              title={color.name}
                            >
                              {isActiveColor && (
                                <Check className="w-3.5 h-3.5 text-white absolute inset-0 m-auto" />
                              )}
                            </button>
                          );
                        })}

                        {/* Native color picker */}
                        <div className="flex items-center gap-1.5 ml-1">
                          <input
                            type="color"
                            value={currentSlide?.badgeColor || '#0c1524'}
                            onChange={(e) => updateCurrentSlide({ badgeColor: e.target.value })}
                            className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                            title="Custom Color Picker"
                          />
                          <span className="text-[11px] font-mono text-slate-400">
                            {currentSlide?.badgeColor || '#0c1524'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Live Badge Preview */}
                    <div className="p-3 bg-slate-900 rounded border border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Badge Live Appearance:</span>
                      <span
                        className="text-white text-[11px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider font-mono shadow-sm"
                        style={{ backgroundColor: currentSlide?.badgeColor || '#0c1524' }}
                      >
                        {currentSlide?.badge || 'PREVIEW BADGE'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* E. SLIDE COPYWRITING & CALL-TO-ACTION */}
              <div className="bg-[#11192d] p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                  <Sliders className="w-4 h-4 text-orange-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                    Slide Copywriting & Call-to-Action (Bilingual)
                  </h3>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">
                        Category Tag (English)
                      </label>
                      <input
                        type="text"
                        value={currentSlide?.category || ''}
                        onChange={(e) => updateCurrentSlide({ category: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white font-display focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">
                        Category Tag (Sinhala)
                      </label>
                      <input
                        type="text"
                        value={currentSlide?.categorySi || ''}
                        onChange={(e) => updateCurrentSlide({ categorySi: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white font-display focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  {/* Headline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">
                        Primary Headline (English)
                      </label>
                      <input
                        type="text"
                        value={currentSlide?.headline || ''}
                        onChange={(e) => updateCurrentSlide({ headline: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white font-display font-bold focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">
                        Primary Headline (Sinhala)
                      </label>
                      <input
                        type="text"
                        value={currentSlide?.headlineSi || ''}
                        onChange={(e) => updateCurrentSlide({ headlineSi: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white font-display font-bold focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  {/* Highlight */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">
                        Highlight Title / Discount Accent (English)
                      </label>
                      <input
                        type="text"
                        value={currentSlide?.highlight || ''}
                        onChange={(e) => updateCurrentSlide({ highlight: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-orange-400 font-display font-black uppercase focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">
                        Highlight Title / Discount Accent (Sinhala)
                      </label>
                      <input
                        type="text"
                        value={currentSlide?.highlightSi || ''}
                        onChange={(e) => updateCurrentSlide({ highlightSi: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-orange-400 font-display font-black focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">
                        Description (English)
                      </label>
                      <textarea
                        rows={2}
                        value={currentSlide?.description || ''}
                        onChange={(e) => updateCurrentSlide({ description: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white leading-relaxed focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">
                        Description (Sinhala)
                      </label>
                      <textarea
                        rows={2}
                        value={currentSlide?.descriptionSi || ''}
                        onChange={(e) => updateCurrentSlide({ descriptionSi: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white leading-relaxed focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  {/* CTA Text & Target Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">
                        CTA Button Label (English)
                      </label>
                      <input
                        type="text"
                        value={currentSlide?.ctaText || ''}
                        onChange={(e) => updateCurrentSlide({ ctaText: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white font-display focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">
                        CTA Button Label (Sinhala)
                      </label>
                      <input
                        type="text"
                        value={currentSlide?.ctaTextSi || ''}
                        onChange={(e) => updateCurrentSlide({ ctaTextSi: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white font-display focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">
                        Storefront Target Category
                      </label>
                      <select
                        value={currentSlide?.targetCategory || 'Furniture'}
                        onChange={(e) => updateCurrentSlide({ targetCategory: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white font-sans focus:outline-none focus:border-orange-500 cursor-pointer"
                      >
                        <option value="Furniture">Furniture</option>
                        <option value="Living">Living</option>
                        <option value="Office">Office</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Home Textiles">Home Textiles</option>
                        <option value="Accessories">Accessories</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* F. GLOBAL PROMO COUPON & FOOTER GUARANTEES */}
              <div className="bg-[#11192d] p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                  <Tag className="w-4 h-4 text-orange-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                    Flash Coupons & Trust Guarantees
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Active Flash Coupon Code (Ribbon)
                    </label>
                    <input
                      type="text"
                      value={activeCoupon}
                      onChange={(e) => setActiveCoupon(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-amber-300 font-mono font-bold uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Middle Promotional Feature Headline
                    </label>
                    <input
                      type="text"
                      value={promoBannerText}
                      onChange={(e) => setPromoBannerText(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-slate-300 font-semibold block mb-1 text-xs">
                    Footer Trust & Service Guarantees (4 Items)
                  </label>
                  <div className="space-y-2">
                    {footerPromises.map((promise, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-slate-500 font-mono text-[11px] w-6">#{idx + 1}</span>
                        <input
                          type="text"
                          value={promise}
                          onChange={(e) => {
                            const updated = [...footerPromises];
                            updated[idx] = e.target.value;
                            setFooterPromises(updated);
                          }}
                          className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-200"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* G. BOTTOM STICKY/SUBMIT ACTION BAR */}
              <div className="bg-[#0b1120] p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                <div className="text-xs text-slate-400">
                  <span className="text-emerald-400 font-semibold">● Changes Ready: </span>
                  {slidesList.length} slides configured with custom photography, badges, and copy.
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onBackToStorefront}
                    className="px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Cancel / Discard
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleSaveHomepageCustomizer(e as any)}
                    className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-6 py-2.5 rounded-md font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md hover:scale-[1.02] active:scale-95 font-display"
                  >
                    <Save className="w-4 h-4" />
                    <span>Publish Hero Carousel & Homepage</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: PRODUCT CATALOG & STOCK INVENTORY */}
          {activeSection === 'products' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white font-display">
                    Product Catalog & Stock Management
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    CRUD operations, instant inventory stock adjustment, and daily deal countdown toggling
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setShowAddProductModal(true);
                  }}
                  className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2 rounded-md font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm font-display"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="bg-[#11192d] p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search by product name or manufacturer..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white text-xs focus:outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-slate-400 font-display">Category:</span>
                  <select
                    value={selectedProductCategory}
                    onChange={(e) => setSelectedProductCategory(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#ea580c]"
                  >
                    <option value="All">All Categories ({products.length})</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Textiles">Textiles</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Home & Decor">Home & Decor</option>
                    <option value="Beauty">Beauty</option>
                  </select>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-[#11192d] rounded-xl border border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase font-display border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Item</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Vendor</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Stock</th>
                        <th className="py-3 px-4">Daily Deal</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {filteredProducts.map(prod => (
                        <tr key={prod.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded bg-slate-800 border border-slate-700 p-1 shrink-0 flex items-center justify-center">
                                <ProductImageRenderer name={prod.imageUrl} className="w-8 h-8 object-contain" />
                              </div>
                              <div>
                                <span className="font-bold text-white block max-w-xs truncate">{prod.name}</span>
                                <span className="text-[10px] text-slate-500 font-mono">ID: {prod.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-400">{prod.category}</td>
                          <td className="py-3 px-4 text-slate-400">{prod.vendor}</td>
                          <td className="py-3 px-4 font-mono font-bold text-orange-400">
                            {currencySymbol}{(prod.price * currencyRate).toFixed(2)}
                          </td>
                          <td className="py-3 px-4">
                            {editingStockId === prod.id ? (
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="number"
                                  min="0"
                                  value={newStockVal}
                                  onChange={(e) => setNewStockVal(parseInt(e.target.value) || 0)}
                                  className="w-16 bg-slate-900 border border-orange-500 rounded px-2 py-0.5 text-xs text-white text-center"
                                />
                                <button
                                  onClick={() => handleSaveStock(prod.id)}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer"
                                >
                                  Save
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <span className={`font-mono font-bold ${prod.stock && prod.stock < 10 ? 'text-red-400' : 'text-slate-200'}`}>
                                  {prod.stock || 20}
                                </span>
                                <button
                                  onClick={() => {
                                    setEditingStockId(prod.id);
                                    setNewStockVal(prod.stock || 20);
                                  }}
                                  className="text-[10px] text-slate-500 hover:text-slate-300 underline cursor-pointer"
                                >
                                  Edit
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleDailyDeal(prod.id)}
                              className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                                prod.isDailyDeal
                                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                              }`}
                            >
                              {prod.isDailyDeal ? '★ Active Deal' : 'Set as Deal'}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingProduct(prod);
                                  setShowAddProductModal(true);
                                }}
                                className="bg-slate-800 hover:bg-slate-700 text-orange-400 hover:text-orange-300 px-2 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-semibold border border-slate-700 shadow-xs"
                                title="Edit Product Details, Specifications & Taxonomy"
                              >
                                <Edit2 className="w-3 h-3" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-slate-800/60 transition-colors cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: ALL DEPARTMENTS CUSTOMIZER & TAXONOMY MANAGER */}
          {activeSection === 'categories' && (
            <div className="space-y-6 max-w-5xl animate-in fade-in duration-150">
              {/* Header and Quick Actions Bar */}
              <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                      Live Storefront Sync
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {categories.length} Departments Configured
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-white font-display mt-1">
                    All Departments Customizer & Mega-Menu Taxonomy
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Customize the storefront "All Departments" section: add, remove, and edit departments, icons, translations, and nested subcategory flyouts in real time.
                  </p>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setShowLivePreview(!showLivePreview)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-md font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer font-display"
                    title="Toggle simulated storefront mega-menu preview"
                  >
                    <Eye className="w-3.5 h-3.5 text-orange-400" />
                    <span>{showLivePreview ? 'Hide Preview' : 'Storefront Preview'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowResetDeptConfirm(true)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-md font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer font-display"
                    title="Reset to 11 default marketplace departments"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Defaults</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenAddDeptModal}
                    className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-1.5 rounded-md font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-md hover:scale-[1.02] active:scale-95 font-display"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Department</span>
                  </button>
                </div>
              </div>

              {/* Metrics & Filter Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#11192d] p-3 rounded-lg border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Departments</div>
                  <div className="text-xl font-black text-white font-mono mt-0.5">{categories.length}</div>
                </div>
                <div className="bg-[#11192d] p-3 rounded-lg border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Subcategories</div>
                  <div className="text-xl font-black text-orange-400 font-mono mt-0.5">
                    {categories.reduce((acc, c) => acc + (c.subcategories?.length || 0), 0)}
                  </div>
                </div>
                <div className="bg-[#11192d] p-3 rounded-lg border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Catalog Items Linked</div>
                  <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
                    {categories.reduce((acc, c) => acc + (c.itemCount || 0), 0).toLocaleString()}+
                  </div>
                </div>
                <div className="bg-[#11192d] p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sync Status</div>
                    <div className="text-xs font-bold text-emerald-400 font-display mt-0.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Active Real-time
                    </div>
                  </div>
                  <FolderTree className="w-6 h-6 text-slate-700" />
                </div>
              </div>

              {/* Search & Filter Departments */}
              <div className="bg-[#11192d] p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                <input
                  type="text"
                  value={deptSearchTerm}
                  onChange={(e) => setDeptSearchTerm(e.target.value)}
                  placeholder="Filter departments by name, Sinhala title, slug, or subcategory..."
                  className="w-full bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none"
                />
                {deptSearchTerm && (
                  <button
                    onClick={() => setDeptSearchTerm('')}
                    className="text-xs text-slate-400 hover:text-white px-2 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Collapsible Live Storefront Preview Box */}
              {showLivePreview && (
                <div className="bg-[#0b1322] border-2 border-orange-500/40 rounded-xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-orange-400" />
                      <span className="text-xs font-bold text-white font-display uppercase tracking-wider">
                        Storefront Live Preview ("All Departments" Mega-Menu)
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      How customers view the 280px left sidebar and dropdown
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Simulated Sidebar Widget */}
                    <div className="bg-white rounded-lg p-2 text-slate-800 shadow-md">
                      <div className="bg-[#ea580c] text-white text-xs font-bold px-3 py-2 rounded-t flex items-center justify-between font-display">
                        <div className="flex items-center gap-2">
                          <FolderTree className="w-4 h-4" />
                          <span>ALL DEPARTMENTS</span>
                        </div>
                        <span className="text-[10px] opacity-80">{categories.length} sections</span>
                      </div>
                      <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto text-xs">
                        {categories.slice(0, 7).map((cat) => (
                          <div key={cat.id} className="p-2 flex items-center justify-between hover:bg-orange-50 text-slate-700">
                            <div className="flex items-center gap-2 truncate">
                              <DepartmentIcon iconName={cat.iconName} className="w-3.5 h-3.5 text-slate-400" />
                              <span className="truncate font-medium">{cat.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">›</span>
                          </div>
                        ))}
                        {categories.length > 7 && (
                          <div className="p-2 text-center text-[10px] text-slate-400 font-semibold">
                            +{categories.length - 7} more departments in dropdown
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Simulated Sinhala Bilingual Preview */}
                    <div className="bg-white rounded-lg p-2 text-slate-800 shadow-md">
                      <div className="bg-[#111d2e] text-white text-xs font-bold px-3 py-2 rounded-t flex items-center justify-between font-display">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-orange-400" />
                          <span>සියලු අංශ (Sinhala Storefront View)</span>
                        </div>
                        <span className="text-[10px] opacity-80">ද්විභාෂා</span>
                      </div>
                      <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto text-xs">
                        {categories.slice(0, 7).map((cat) => (
                          <div key={cat.id} className="p-2 flex items-center justify-between hover:bg-orange-50 text-slate-700">
                            <div className="flex items-center gap-2 truncate">
                              <DepartmentIcon iconName={cat.iconName} className="w-3.5 h-3.5 text-orange-600" />
                              <span className="truncate font-medium">{cat.nameSi || cat.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">›</span>
                          </div>
                        ))}
                        {categories.length > 7 && (
                          <div className="p-2 text-center text-[10px] text-slate-400 font-semibold">
                            +තවත් අංශ {categories.length - 7} ක්
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Departments Management Cards Grid */}
              <div className="space-y-3">
                {categories
                  .filter((cat) => {
                    if (!deptSearchTerm.trim()) return true;
                    const term = deptSearchTerm.toLowerCase();
                    const nameMatch = cat.name.toLowerCase().includes(term);
                    const siMatch = cat.nameSi && cat.nameSi.toLowerCase().includes(term);
                    const slugMatch = cat.id.toLowerCase().includes(term);
                    const subMatch = cat.subcategories.some((s) => s.toLowerCase().includes(term));
                    return nameMatch || siMatch || slugMatch || subMatch;
                  })
                  .map((cat, index) => (
                    <div
                      key={cat.id}
                      className="bg-[#11192d] p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                    >
                      {/* Department Card Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start sm:items-center gap-3">
                          {/* Icon Badge */}
                          <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                            <DepartmentIcon iconName={cat.iconName} className="w-5 h-5" />
                          </div>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-base text-white font-display">
                                {cat.name}
                              </h3>
                              {cat.nameSi && (
                                <span className="bg-slate-800 text-orange-300 text-[10px] px-2 py-0.5 rounded border border-slate-700 font-medium">
                                  {cat.nameSi}
                                </span>
                              )}
                              <span className="text-[10px] text-slate-500 font-mono bg-slate-900 px-1.5 py-0.5 rounded">
                                #{cat.id}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                              <span>Icon: <code className="text-orange-300">{cat.iconName}</code></span>
                              <span>•</span>
                              <span>{cat.itemCount.toLocaleString()} items listed</span>
                              <span>•</span>
                              <span>{cat.subcategories.length} subcategories</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions Toolbar */}
                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          {/* Reorder Buttons */}
                          <div className="flex items-center bg-slate-900 rounded border border-slate-800 mr-2">
                            <button
                              type="button"
                              onClick={() => handleMoveDepartment(index, 'up')}
                              disabled={index === 0}
                              className={`p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer ${
                                index === 0 ? 'opacity-30 cursor-not-allowed' : ''
                              }`}
                              title="Move Department Up in navigation order"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveDepartment(index, 'down')}
                              disabled={index === categories.length - 1}
                              className={`p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer ${
                                index === categories.length - 1 ? 'opacity-30 cursor-not-allowed' : ''
                              }`}
                              title="Move Department Down in navigation order"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditDeptModal(cat)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer font-display"
                            title="Edit department name, icon, translations, and subcategories"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-orange-400" />
                            <span>Edit</span>
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => setDeletingDept(cat)}
                            className="bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer font-display"
                            title="Remove department from All Departments mega-menu"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>

                      {/* Subcategories Chips & Quick Add */}
                      <div className="pt-2 border-t border-slate-800/80">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                            Subcategories ({cat.subcategories.length}):
                          </span>
                          {quickSubDeptId !== cat.id && (
                            <button
                              type="button"
                              onClick={() => {
                                setQuickSubDeptId(cat.id);
                                setQuickSubText('');
                              }}
                              className="text-[11px] text-[#ea580c] hover:underline font-bold flex items-center gap-1 cursor-pointer font-display"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Quick Add Subcategory</span>
                            </button>
                          )}
                        </div>

                        {/* Quick Inline Subcategory Input */}
                        {quickSubDeptId === cat.id && (
                          <div className="mb-2 flex items-center gap-2 p-2 bg-slate-900 rounded border border-orange-500/40 animate-in fade-in">
                            <input
                              type="text"
                              value={quickSubText}
                              onChange={(e) => setQuickSubText(e.target.value)}
                              placeholder="New subcategory name..."
                              className="flex-1 bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs text-white focus:outline-none"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleQuickAddSub(cat.id);
                                }
                              }}
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleQuickAddSub(cat.id)}
                              className="bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs px-3 py-1 rounded font-bold cursor-pointer font-display"
                            >
                              Add
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setQuickSubDeptId(null);
                                setQuickSubText('');
                              }}
                              className="text-slate-400 hover:text-white text-xs px-2 py-1 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        )}

                        {/* Subcategory Badges with Remove "x" Button */}
                        <div className="flex flex-wrap gap-1.5">
                          {cat.subcategories.map((sub, sIdx) => {
                            const subSi = cat.subcategoriesSi && cat.subcategoriesSi[sIdx];
                            return (
                              <span
                                key={sIdx}
                                className="group/sub bg-slate-800/90 hover:bg-slate-750 text-slate-200 text-[11px] px-2.5 py-1 rounded-md border border-slate-700 flex items-center gap-1.5 transition-colors"
                              >
                                <span>{sub}</span>
                                {subSi && subSi !== sub && (
                                  <span className="text-[9px] text-slate-400 font-normal">
                                    ({subSi})
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleQuickRemoveSub(cat.id, sIdx)}
                                  className="text-slate-400 hover:text-rose-400 opacity-70 group-hover/sub:opacity-100 transition-opacity cursor-pointer ml-0.5"
                                  title={`Remove "${sub}"`}
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            );
                          })}
                          {cat.subcategories.length === 0 && (
                            <span className="text-xs text-slate-500 italic">
                              No subcategories added yet. Click "Quick Add Subcategory" to add.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* MODAL 1: ADD OR EDIT DEPARTMENT MODAL */}
              {showDeptModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                  <div className="bg-[#11192d] border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
                    {/* Modal Header */}
                    <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0b1120]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                          <DepartmentIcon iconName={deptFormIcon} className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white font-display">
                            {editingDeptId ? `Edit Department: ${deptFormName}` : 'Add New Department'}
                          </h3>
                          <p className="text-[11px] text-slate-400">
                            Configure title, Sinhala translation, icon, and nested mega-menu subcategories
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowDeptModal(false)}
                        className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Modal Body */}
                    <form onSubmit={handleSaveDepartment} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
                      {/* Name Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">
                            Department Name (English) *
                          </label>
                          <input
                            type="text"
                            required
                            value={deptFormName}
                            onChange={(e) => {
                              setDeptFormName(e.target.value);
                              if (!editingDeptId && !deptFormSlug) {
                                setDeptFormSlug(slugifyDepartmentName(e.target.value));
                              }
                            }}
                            placeholder="e.g. Gaming & Esports Gear"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">
                            Sinhala Translation (සිංහල නම)
                          </label>
                          <input
                            type="text"
                            value={deptFormNameSi}
                            onChange={(e) => setDeptFormNameSi(e.target.value)}
                            placeholder="e.g. ක්‍රීඩා සහ ඊ-ක්‍රීඩා උපාංග"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>

                      {/* Slug ID & Catalog Item Count */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">
                            Department Identifier (Slug / ID)
                          </label>
                          <input
                            type="text"
                            value={deptFormSlug}
                            disabled={!!editingDeptId}
                            onChange={(e) => setDeptFormSlug(slugifyDepartmentName(e.target.value))}
                            placeholder="e.g. gaming-esports"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-orange-500 disabled:opacity-50"
                          />
                          <span className="text-[10px] text-slate-500 mt-0.5 block">
                            {editingDeptId ? 'Department ID is permanent for link consistency' : 'Unique key used in URL routing'}
                          </span>
                        </div>

                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">
                            Estimated Catalog Items
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={deptFormItemCount}
                            onChange={(e) => setDeptFormItemCount(parseInt(e.target.value) || 0)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
                          />
                          <span className="text-[10px] text-slate-500 mt-0.5 block">
                            Displayed on sidebar and category chips (e.g. 1,420+ items)
                          </span>
                        </div>
                      </div>

                      {/* Visual Icon Picker */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-slate-300 font-semibold">
                            Select Department Icon: <span className="text-orange-400 font-mono font-bold">{deptFormIcon}</span>
                          </label>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                            <span>Selected:</span>
                            <div className="p-1 bg-orange-500/20 text-orange-400 rounded">
                              <DepartmentIcon iconName={deptFormIcon} className="w-4 h-4" />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800 max-h-44 overflow-y-auto">
                          {AVAILABLE_DEPARTMENT_ICONS.map((icon) => {
                            const isSelected = deptFormIcon === icon.key;
                            return (
                              <button
                                key={icon.key}
                                type="button"
                                onClick={() => setDeptFormIcon(icon.key)}
                                className={`p-2.5 rounded-lg flex flex-col items-center justify-center gap-1 transition-all cursor-pointer text-center ${
                                  isSelected
                                    ? 'bg-[#ea580c] text-white shadow-md scale-105'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                                }`}
                                title={`${icon.label} (${icon.category})`}
                              >
                                <DepartmentIcon iconName={icon.key} className="w-5 h-5 shrink-0" />
                                <span className="text-[9px] truncate w-full leading-tight">{icon.key}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Subcategories Management */}
                      <div className="space-y-3 pt-2 border-t border-slate-800">
                        <div className="flex items-center justify-between">
                          <label className="block text-slate-300 font-semibold">
                            Mega-Menu Subcategories ({deptFormSubcategories.length})
                          </label>
                          <span className="text-[10px] text-slate-500">
                            Displayed in hover flyout menus on desktop
                          </span>
                        </div>

                        {/* Add subcategory inputs */}
                        <div className="flex flex-col sm:flex-row items-center gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                          <input
                            type="text"
                            value={newSubInput}
                            onChange={(e) => setNewSubInput(e.target.value)}
                            placeholder="English Subcategory (e.g. Mechanical Keyboards)"
                            className="flex-1 w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddSubcategoryInForm();
                              }
                            }}
                          />
                          <input
                            type="text"
                            value={newSubSiInput}
                            onChange={(e) => setNewSubSiInput(e.target.value)}
                            placeholder="Sinhala Translation (optional)"
                            className="flex-1 w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddSubcategoryInForm();
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={handleAddSubcategoryInForm}
                            className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-3.5 py-1.5 rounded font-bold text-xs shrink-0 cursor-pointer font-display flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        </div>

                        {/* List of current subcategories */}
                        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
                          {deptFormSubcategories.map((sub, sIdx) => {
                            const subSi = deptFormSubcategoriesSi && deptFormSubcategoriesSi[sIdx];
                            return (
                              <span
                                key={sIdx}
                                className="bg-slate-800 text-slate-200 text-xs px-2.5 py-1 rounded-md border border-slate-700 flex items-center gap-1.5"
                              >
                                <span className="font-medium">{sub}</span>
                                {subSi && subSi !== sub && (
                                  <span className="text-[10px] text-slate-400">({subSi})</span>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSubcategoryInForm(sIdx)}
                                  className="text-slate-400 hover:text-rose-400 cursor-pointer ml-1"
                                  title="Remove"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </span>
                            );
                          })}
                          {deptFormSubcategories.length === 0 && (
                            <span className="text-xs text-slate-500 italic">
                              No subcategories added. Add at least one above.
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Modal Footer */}
                      <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setShowDeptModal(false)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider cursor-pointer font-display transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer font-display shadow-md transition-all"
                        >
                          <Save className="w-4 h-4" />
                          <span>{editingDeptId ? 'Update Department' : 'Create Department'}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* MODAL 2: DELETE CONFIRMATION MODAL */}
              {deletingDept && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-[#11192d] border border-rose-800/60 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
                    <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
                      <AlertTriangle className="w-6 h-6" />
                    </div>

                    <div className="text-center space-y-1">
                      <h3 className="text-lg font-bold text-white font-display">
                        Remove Department?
                      </h3>
                      <p className="text-xs text-slate-400">
                        Are you sure you want to remove <strong className="text-white">"{deletingDept.name}"</strong>?
                      </p>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs text-slate-400 space-y-1">
                      <div className="flex justify-between">
                        <span>Identifier:</span>
                        <span className="font-mono text-slate-300">#{deletingDept.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Items linked:</span>
                        <span className="font-mono text-slate-300">{deletingDept.itemCount} items</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Subcategories:</span>
                        <span className="font-mono text-slate-300">{deletingDept.subcategories.length}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-rose-400/80 text-center">
                      This will remove the department from the header search filter, desktop mega-menu sidebar, and mobile drawer.
                    </p>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setDeletingDept(null)}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg font-bold text-xs uppercase tracking-wider cursor-pointer font-display transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmDeleteDept}
                        className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer font-display shadow-md transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL 3: RESET TO DEFAULTS CONFIRMATION MODAL */}
              {showResetDeptConfirm && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-[#11192d] border border-amber-800/60 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
                      <RotateCcw className="w-6 h-6" />
                    </div>

                    <div className="text-center space-y-1">
                      <h3 className="text-lg font-bold text-white font-display">
                        Restore Default Departments?
                      </h3>
                      <p className="text-xs text-slate-400">
                        This will restore the 11 original marketplace departments and discard custom taxonomy additions or edits.
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowResetDeptConfirm(false)}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg font-bold text-xs uppercase tracking-wider cursor-pointer font-display transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmResetDepartments}
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer font-display shadow-md transition-all"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Confirm Reset</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION 5: ORDERS FULFILLMENT TERMINAL */}
          {activeSection === 'orders' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Header and Controls */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Order Pipeline Active
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {orders.length} Total Orders Registered
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-white font-display mt-1">
                    Marketplace Orders & Fulfillment Terminal
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Orders placed in Storefront Express Checkout route here in real time with buyer phone numbers, shipping destinations, and fulfillment milestones.
                  </p>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleSyncOrders}
                    disabled={isSyncingOrders}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-md font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer font-display"
                    title="Synchronize orders directly from local and active marketplace storage"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncingOrders ? 'animate-spin text-orange-400' : ''}`} />
                    <span>Sync Orders</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSimulateBuyerOrder}
                    className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-3.5 py-1.5 rounded-md font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-95 font-display"
                    title="Simulate an incoming order from a customer to test terminal routing"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Simulate Buyer Order</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetOrdersToDefault}
                    className="text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 p-1.5 rounded transition-colors text-xs cursor-pointer"
                    title="Reset to default seed orders"
                  >
                    <Clock className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Status Metric Badges / Filter Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { label: 'All Orders', count: orders.length, status: 'All', color: 'border-slate-700 bg-slate-900/60 text-slate-200' },
                  { label: 'Pending Orders', count: orders.filter(o => o.status === 'Pending').length, status: 'Pending', color: 'border-amber-500/40 bg-amber-950/20 text-amber-300' },
                  { label: 'In Processing', count: orders.filter(o => o.status === 'Processing').length, status: 'Processing', color: 'border-blue-500/40 bg-blue-950/20 text-blue-300' },
                  { label: 'Dispatched / Shipped', count: orders.filter(o => o.status === 'Shipped').length, status: 'Shipped', color: 'border-purple-500/40 bg-purple-950/20 text-purple-300' },
                  { label: 'Delivered', count: orders.filter(o => o.status === 'Delivered').length, status: 'Delivered', color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300' },
                ].map((stat) => {
                  const isActive = orderStatusFilter === stat.status;
                  return (
                    <button
                      key={stat.status}
                      type="button"
                      onClick={() => setOrderStatusFilter(stat.status)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isActive
                          ? 'ring-2 ring-orange-500 shadow-md scale-[1.01]'
                          : 'opacity-80 hover:opacity-100 hover:border-slate-600'
                      } ${stat.color}`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider block font-display">
                        {stat.label}
                      </span>
                      <span className="text-xl font-black font-mono mt-1 block">
                        {stat.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search & Filter Bar */}
              <div className="bg-[#11192d] p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by ID, buyer name, phone, or city..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                  {orderSearch && (
                    <button
                      onClick={() => setOrderSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-[11px] text-slate-400">
                    Showing <strong className="text-white">{filteredOrders.length}</strong> of {orders.length} orders
                  </span>
                  {(orderSearch || orderStatusFilter !== 'All') && (
                    <button
                      type="button"
                      onClick={() => {
                        setOrderSearch('');
                        setOrderStatusFilter('All');
                      }}
                      className="text-[11px] text-orange-400 hover:text-orange-300 underline font-semibold cursor-pointer"
                    >
                      Reset filters
                    </button>
                  )}
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-[#11192d] rounded-xl border border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase font-display border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Order ID & Date</th>
                        <th className="py-3 px-4">Buyer Name</th>
                        <th className="py-3 px-4 text-emerald-400 font-bold bg-emerald-950/20">Buyer Phone Number</th>
                        <th className="py-3 px-4">Delivery Address</th>
                        <th className="py-3 px-4">Items & Payment</th>
                        <th className="py-3 px-4">Total Amount</th>
                        <th className="py-3 px-4">Fulfillment Status</th>
                        <th className="py-3 px-4 text-right">Update Milestone</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-slate-400">
                            <ShoppingBag className="w-10 h-10 mx-auto text-slate-600 mb-2 opacity-50" />
                            <p className="font-semibold text-sm text-slate-300">No orders match your filter</p>
                            <p className="text-xs text-slate-500 mt-1">Try resetting the search filter or placing a new order in checkout.</p>
                            <div className="mt-4 flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setOrderSearch('');
                                  setOrderStatusFilter('All');
                                }}
                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded font-semibold cursor-pointer"
                              >
                                Show All Orders
                              </button>
                              <button
                                type="button"
                                onClick={handleSimulateBuyerOrder}
                                className="px-3 py-1.5 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs rounded font-semibold cursor-pointer"
                              >
                                Create Test Order
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map(order => (
                          <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-3 px-4 align-top">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-orange-400">{order.id}</span>
                                {order.status === 'Pending' && (
                                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" title="New pending order" />
                                )}
                              </div>
                              <span className="text-[10px] text-slate-500 block mt-0.5">{order.date}</span>
                            </td>
                            <td className="py-3 px-4 align-top">
                              <strong className="text-white block font-display text-sm">{order.customer}</strong>
                              <span className="text-slate-400 font-mono text-[10px] flex items-center gap-1.5 mt-1">
                                <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                                {order.email}
                              </span>
                            </td>
                            {/* Dedicated Buyer Phone Number Column with Click-to-Call, Copy & WhatsApp */}
                            <td className="py-3 px-4 align-top bg-emerald-950/10">
                              <div className="flex flex-col gap-1.5">
                                <a
                                  href={`tel:${order.phone.replace(/[^+\d]/g, '')}`}
                                  className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/40 hover:border-emerald-400 px-2.5 py-1 rounded transition-colors group shadow-sm w-fit"
                                  title={`Click to call buyer ${order.customer} directly at ${order.phone}`}
                                >
                                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                                  <span>{order.phone}</span>
                                </a>
                                <div className="flex items-center gap-2 text-[10px]">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard?.writeText(order.phone);
                                      onAddToast(`Copied buyer phone: ${order.phone}`, 'success');
                                    }}
                                    className="text-slate-400 hover:text-white flex items-center gap-1 underline transition-colors cursor-pointer"
                                    title="Copy phone to clipboard"
                                  >
                                    <Copy className="w-2.5 h-2.5" />
                                    <span>Copy Phone</span>
                                  </button>
                                  <span className="text-slate-600">•</span>
                                  <a
                                    href={`https://wa.me/${order.phone.replace(/[^+\d]/g, '').replace(/^\+/, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-400/80 hover:text-emerald-300 transition-colors"
                                    title="Message buyer on WhatsApp"
                                  >
                                    WhatsApp
                                  </a>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 align-top max-w-xs">
                              <span className="text-slate-300 text-[11px] flex items-start gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                                <span>{order.shippingAddress}</span>
                              </span>
                            </td>
                            <td className="py-3 px-4 align-top">
                              <span className="text-slate-200 block font-semibold">{order.itemsCount} Products</span>
                              <span className="text-[10px] text-slate-400">{order.paymentMethod}</span>
                            </td>
                            <td className="py-3 px-4 align-top font-mono font-bold text-white text-sm">
                              {currencySymbol}{(order.total * currencyRate).toFixed(2)}
                            </td>
                            <td className="py-3 px-4 align-top">
                              <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                                order.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                order.status === 'Processing' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                order.status === 'Cancelled' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                                'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 align-top text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <select
                                  value={order.status}
                                  onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                  className="bg-slate-900 border border-slate-700 text-white rounded px-2.5 py-1 text-xs focus:outline-none focus:border-[#ea580c] cursor-pointer"
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Processing">Processing</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteOrder(order.id)}
                                  className="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                                  title="Archive order"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: COUPONS & DISCOUNTS */}
          {activeSection === 'coupons' && (
            <div className="space-y-6 max-w-4xl animate-in fade-in duration-150">
              <div className="pb-4 border-b border-slate-800">
                <h1 className="text-xl sm:text-2xl font-black text-white font-display">
                  Promotional Coupons & Discount Codes
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage marketplace checkout discount vouchers
                </p>
              </div>

              {/* Create Coupon Form */}
              <form onSubmit={handleCreateCoupon} className="bg-[#11192d] p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-end gap-3 text-xs">
                <div className="flex-1 w-full">
                  <label className="text-slate-400 font-semibold block mb-1">Coupon Code</label>
                  <input
                    type="text"
                    required
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    placeholder="e.g. FLASH25"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-white font-mono uppercase"
                  />
                </div>
                <div className="w-full sm:w-36">
                  <label className="text-slate-400 font-semibold block mb-1">Discount %</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(parseInt(e.target.value) || 10)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-white"
                  />
                </div>
                <div className="w-full sm:w-36">
                  <label className="text-slate-400 font-semibold block mb-1">Min Spend ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={newCouponMin}
                    onChange={(e) => setNewCouponMin(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 font-display"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Coupon</span>
                </button>
              </form>

              {/* Coupons List */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {coupons.map((c) => (
                  <div key={c.code} className="bg-[#11192d] p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-amber-400 text-sm">{c.code}</span>
                      <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-1.5 py-0.2 rounded font-mono">
                        {c.discount}% OFF
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 space-y-1 pt-1 border-t border-slate-800">
                      <div>Min spend: ${c.minSpend}</div>
                      <div>Usage count: {c.usageCount} times</div>
                      <div>Valid until: {c.expires}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 6: USERS, LOGINS & CREDENTIALS TERMINAL */}
          {activeSection === 'users' && (
            <div className="space-y-6 max-w-7xl animate-in fade-in duration-150">
              {/* Header & Quick Action Toolbar */}
              <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-orange-500/20 text-[#ea580c] border border-orange-500/40 text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                      Identity & Access Management
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                      Strict Password Verification Active
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight flex items-center gap-2">
                    <Users className="w-6 h-6 text-[#ea580c]" />
                    User & Admin Logins, Password Security & Audit Logs
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Generate custom user and administrator logins with auto-generated secure passwords, manage accounts, update admin passwords, and monitor real-time authentication events.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <button
                    onClick={() => {
                      const el = document.getElementById('account-generator-card');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer font-display shadow-sm hover:scale-[1.02] active:scale-95"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Generate New Login</span>
                  </button>

                  <button
                    onClick={handleResetUsersToDefault}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Restores standard admin and test credentials"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Defaults</span>
                  </button>

                  <button
                    onClick={handleClearAuditLogs}
                    className="bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Clear login audit logs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Logs</span>
                  </button>
                </div>
              </div>

              {/* 1. Key Metrics Overview Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#11192d] p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">
                      Total Accounts
                    </div>
                    <div className="text-2xl font-black text-white font-display mt-0.5">
                      {usersList.length}
                    </div>
                    <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
                      {usersList.filter(u => u.isActive).length} active • {usersList.filter(u => !u.isActive).length} suspended
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#ea580c]">
                    <Users className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-[#11192d] p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">
                      Administrators
                    </div>
                    <div className="text-2xl font-black text-white font-display mt-0.5">
                      {usersList.filter(u => u.role === 'super_admin' || u.role === 'catalog_admin').length}
                    </div>
                    <div className="text-[11px] text-amber-400 font-mono mt-0.5">
                      Full backend & catalog control
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-[#11192d] p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">
                      Vendors & B2B Buyers
                    </div>
                    <div className="text-2xl font-black text-white font-display mt-0.5">
                      {usersList.filter(u => u.role === 'vendor' || u.role === 'buyer').length}
                    </div>
                    <div className="text-[11px] text-blue-400 font-mono mt-0.5">
                      Merchant & wholesale portals
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Store className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-[#11192d] p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">
                      Login Audit Events
                    </div>
                    <div className="text-2xl font-black text-white font-display mt-0.5">
                      {loginLogsList.length}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      <span className="text-emerald-400">{loginLogsList.filter(l => l.status === 'SUCCESS').length} ok</span> • <span className="text-rose-400">{loginLogsList.filter(l => l.status === 'FAILED_PASSWORD').length} failed</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* 2. Primary Super Admin Credentials Banner with Working Password Notice */}
              <div className="bg-gradient-to-r from-slate-900 via-[#11192d] to-slate-900 border-2 border-orange-500/40 rounded-xl p-4 sm:p-5 relative overflow-hidden shadow-lg">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-amber-400" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider font-display">
                        Master Super Administrator Security Authority
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                        Strict Password Validation Active
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                      Admin password validation is enforced directly against stored credentials. If an incorrect password is entered, authentication is rejected and recorded in the audit trail.
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      <span className="text-slate-400">Default Super Admin:</span>
                      <button
                        type="button"
                        onClick={() => handleCopyText('admin@market.com', 'admin-email')}
                        className="bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono px-2 py-1 rounded border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Click to copy email"
                      >
                        admin@market.com
                        {copiedKey === 'admin-email' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                      <span className="text-slate-400">Default Password:</span>
                      <button
                        type="button"
                        onClick={() => handleCopyText('Admin@2026!', 'admin-pwd')}
                        className="bg-slate-800 hover:bg-slate-700 text-emerald-300 font-mono px-2 py-1 rounded border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Click to copy default password"
                      >
                        Admin@2026!
                        {copiedKey === 'admin-pwd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const adminUser = usersList.find(u => u.role === 'super_admin');
                        if (adminUser) handleOpenEditPassword(adminUser);
                      }}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3.5 py-2 rounded-md text-xs flex items-center gap-1.5 transition-all cursor-pointer font-display shadow-md hover:scale-[1.02] active:scale-95"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>Change Master Admin Password</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. Account Generator Form Card */}
              <div id="account-generator-card" className="bg-[#11192d] rounded-xl border border-slate-800 p-5 shadow-sm">
                <div className="pb-3 border-b border-slate-800 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-400" />
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                      Generate New User or Administrator Login
                    </h2>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Instant creation with auto-generated secure credentials
                  </span>
                </div>

                <form onSubmit={handleGenerateAccount} className="space-y-4">
                  {/* Role Selection Pills */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-2 font-display">
                      Select Account Role & Permissions Level:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                      {[
                        {
                          role: 'super_admin' as UserRole,
                          label: 'Super Admin',
                          desc: 'Full backend & access management',
                          color: 'border-rose-500/50 bg-rose-500/10 text-rose-300',
                          activeColor: 'bg-rose-500 text-white border-rose-500 ring-2 ring-rose-500/40',
                        },
                        {
                          role: 'catalog_admin' as UserRole,
                          label: 'Catalog Admin',
                          desc: 'Products, categories & deals',
                          color: 'border-amber-500/50 bg-amber-500/10 text-amber-300',
                          activeColor: 'bg-amber-500 text-slate-950 font-bold border-amber-500 ring-2 ring-amber-500/40',
                        },
                        {
                          role: 'vendor' as UserRole,
                          label: 'Verified Vendor',
                          desc: 'Merchant catalog & fulfillment',
                          color: 'border-blue-500/50 bg-blue-500/10 text-blue-300',
                          activeColor: 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-500/40',
                        },
                        {
                          role: 'buyer' as UserRole,
                          label: 'B2B Buyer',
                          desc: 'Wholesale RFQs & bulk checkout',
                          color: 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300',
                          activeColor: 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-500/40',
                        },
                        {
                          role: 'customer' as UserRole,
                          label: 'Customer',
                          desc: 'Storefront shopper & orders',
                          color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
                          activeColor: 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-500/40',
                        },
                      ].map((item) => (
                        <button
                          key={item.role}
                          type="button"
                          onClick={() => setNewLoginRole(item.role)}
                          className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            newLoginRole === item.role
                              ? item.activeColor
                              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="font-bold text-xs font-display flex items-center justify-between">
                            <span>{item.label}</span>
                            {newLoginRole === item.role && <Check className="w-3.5 h-3.5 shrink-0" />}
                          </div>
                          <div className={`text-[10px] mt-1 leading-tight ${newLoginRole === item.role ? 'opacity-90' : 'text-slate-400'}`}>
                            {item.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Account Name, Email Prefix and Password inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Full Name / Account Display Name:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ruwan Silva or Nordic Tech"
                        value={newLoginName}
                        onChange={(e) => setNewLoginName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Custom Email or Prefix (Optional):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ruwan.silva or custom@domain.com"
                        value={newLoginEmailPrefix}
                        onChange={(e) => setNewLoginEmailPrefix(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors font-mono"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-slate-300">
                          Password:
                        </label>
                        <button
                          type="button"
                          onClick={() => setNewLoginPassword(generateRandomPassword())}
                          className="text-[10px] text-orange-400 hover:text-orange-300 flex items-center gap-1 font-mono cursor-pointer"
                        >
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>Generate Strong</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Leave blank to auto-generate strong password"
                        value={newLoginPassword}
                        onChange={(e) => setNewLoginPassword(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-1">
                    <button
                      type="submit"
                      className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-5 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer font-display shadow-sm hover:scale-[1.01] active:scale-95"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>⚡ Generate & Save Account</span>
                    </button>
                  </div>
                </form>

                {/* Display Newly Generated Credentials Card if available */}
                {lastGeneratedAccount && (
                  <div className="mt-4 p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 animate-in fade-in duration-200">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider font-display">
                            Account Successfully Generated & Saved!
                          </span>
                          <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-700">
                            Role: {lastGeneratedAccount.role.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">
                          These credentials can now be used immediately in the Storefront Login Modal or Administrator Login.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setLastGeneratedAccount(null)}
                        className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
                        title="Dismiss"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                      <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase">Email:</div>
                          <div className="text-white font-bold">{lastGeneratedAccount.email}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyText(lastGeneratedAccount.email, 'gen-email')}
                          className="text-slate-400 hover:text-white p-1"
                          title="Copy email"
                        >
                          {copiedKey === 'gen-email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase">Password:</div>
                          <div className="text-emerald-400 font-bold">{lastGeneratedAccount.password}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyText(lastGeneratedAccount.password, 'gen-pwd')}
                          className="text-slate-400 hover:text-white p-1"
                          title="Copy password"
                        >
                          {copiedKey === 'gen-pwd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase">Username:</div>
                          <div className="text-amber-400 font-bold">{lastGeneratedAccount.username}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyText(
                            `Email: ${lastGeneratedAccount.email}\nPassword: ${lastGeneratedAccount.password}\nRole: ${lastGeneratedAccount.role}`,
                            'gen-all'
                          )}
                          className="text-xs bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 px-2 py-1 rounded border border-emerald-500/30 flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy All</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Registered Accounts Directory Table */}
              <div className="bg-[#11192d] rounded-xl border border-slate-800 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#0e1628]">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                      Registered Accounts Directory
                    </h2>
                    <span className="text-[11px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-700">
                      {filteredUsers.length} of {usersList.length}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Role Filter Chips */}
                    <div className="flex items-center gap-1 text-[11px] bg-slate-900 border border-slate-700/80 rounded-md p-0.5">
                      {['All', 'super_admin', 'catalog_admin', 'vendor', 'buyer', 'customer'].map((roleKey) => (
                        <button
                          key={roleKey}
                          type="button"
                          onClick={() => setUserRoleFilter(roleKey)}
                          className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                            userRoleFilter === roleKey
                              ? 'bg-[#ea580c] text-white'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {roleKey === 'All' ? 'All Roles' : roleKey.replace('_', ' ')}
                        </button>
                      ))}
                    </div>

                    {/* Search Input */}
                    <div className="relative min-w-[200px]">
                      <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search name, email, role..."
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-md pl-8 pr-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0b1120] text-slate-400 uppercase text-[10px] font-display border-b border-slate-800 tracking-wider">
                      <tr>
                        <th className="p-3.5">User Identity</th>
                        <th className="p-3.5">Role</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Password</th>
                        <th className="p-3.5">Last Login</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-400">
                            No user or admin accounts found matching your query.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => {
                          const isRevealed = !!revealedPasswords[user.id];
                          const isMasterAdmin = user.role === 'super_admin';

                          const getRoleBadge = (role: UserRole) => {
                            switch (role) {
                              case 'super_admin':
                                return (
                                  <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold px-2 py-0.5 rounded font-mono inline-flex items-center gap-1">
                                    <ShieldAlert className="w-3 h-3" />
                                    SUPER ADMIN
                                  </span>
                                );
                              case 'catalog_admin':
                                return (
                                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded font-mono inline-flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3" />
                                    CATALOG ADMIN
                                  </span>
                                );
                              case 'vendor':
                                return (
                                  <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-bold px-2 py-0.5 rounded font-mono inline-flex items-center gap-1">
                                    <Store className="w-3 h-3" />
                                    VENDOR
                                  </span>
                                );
                              case 'buyer':
                                return (
                                  <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold px-2 py-0.5 rounded font-mono inline-flex items-center gap-1">
                                    <Building2 className="w-3 h-3" />
                                    B2B BUYER
                                  </span>
                                );
                              case 'customer':
                              default:
                                return (
                                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded font-mono inline-flex items-center gap-1">
                                    <UserCheck className="w-3 h-3" />
                                    CUSTOMER
                                  </span>
                                );
                            }
                          };

                          return (
                            <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                              {/* User identity */}
                              <td className="p-3.5">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-xs shrink-0">
                                    {user.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="font-bold text-white flex items-center gap-1.5">
                                      <span>{user.name}</span>
                                      {isMasterAdmin && (
                                        <span className="text-[9px] bg-rose-500 text-white font-mono px-1 rounded">
                                          PRIMARY
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                                      <span>{user.email}</span>
                                      <button
                                        type="button"
                                        onClick={() => handleCopyText(user.email, `tbl-email-${user.id}`)}
                                        className="text-slate-500 hover:text-slate-300"
                                        title="Copy email"
                                      >
                                        {copiedKey === `tbl-email-${user.id}` ? (
                                          <Check className="w-3 h-3 text-emerald-400" />
                                        ) : (
                                          <Copy className="w-3 h-3" />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Role */}
                              <td className="p-3.5">{getRoleBadge(user.role)}</td>

                              {/* Status */}
                              <td className="p-3.5">
                                <button
                                  type="button"
                                  onClick={() => handleToggleUserStatus(user)}
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                                    user.isActive
                                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
                                  }`}
                                  title="Click to toggle account status"
                                >
                                  {user.isActive ? 'ACTIVE' : 'SUSPENDED'}
                                </button>
                              </td>

                              {/* Password & Reveal */}
                              <td className="p-3.5 font-mono">
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs ${isRevealed ? 'text-amber-300 font-bold' : 'text-slate-400'}`}>
                                    {isRevealed ? user.password : '••••••••'}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility(user.id)}
                                    className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
                                    title={isRevealed ? 'Hide password' : 'Reveal password'}
                                  >
                                    {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                  </button>
                                  {isRevealed && (
                                    <button
                                      type="button"
                                      onClick={() => handleCopyText(user.password, `tbl-pwd-${user.id}`)}
                                      className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
                                      title="Copy password"
                                    >
                                      {copiedKey === `tbl-pwd-${user.id}` ? (
                                        <Check className="w-3 h-3 text-emerald-400" />
                                      ) : (
                                        <Copy className="w-3 h-3" />
                                      )}
                                    </button>
                                  )}
                                </div>
                              </td>

                              {/* Last Login */}
                              <td className="p-3.5 text-slate-400 text-[11px] font-mono">
                                {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never logged in'}
                              </td>

                              {/* Actions */}
                              <td className="p-3.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditPassword(user)}
                                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                                    title="Update Password"
                                  >
                                    <KeyRound className="w-3 h-3 text-amber-400" />
                                    <span>Password</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteUserAccount(user)}
                                    disabled={isMasterAdmin && usersList.filter(u => u.role === 'super_admin').length <= 1}
                                    className={`p-1.5 rounded transition-colors ${
                                      isMasterAdmin && usersList.filter(u => u.role === 'super_admin').length <= 1
                                        ? 'text-slate-600 cursor-not-allowed opacity-40'
                                        : 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer'
                                    }`}
                                    title={
                                      isMasterAdmin && usersList.filter(u => u.role === 'super_admin').length <= 1
                                        ? 'Cannot delete sole super administrator'
                                        : 'Delete Account'
                                    }
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 5. Real-Time Login Audit Logs Table */}
              <div className="bg-[#11192d] rounded-xl border border-slate-800 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0e1628]">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-400" />
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                      Authentication & Login Audit Trail
                    </h2>
                    <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-700">
                      {filteredLogs.length} events logged
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-[11px] bg-slate-900 border border-slate-700/80 rounded-md p-0.5">
                      <button
                        type="button"
                        onClick={() => setLogStatusFilter('All')}
                        className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                          logStatusFilter === 'All' ? 'bg-[#ea580c] text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        All Events
                      </button>
                      <button
                        type="button"
                        onClick={() => setLogStatusFilter('SUCCESS')}
                        className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                          logStatusFilter === 'SUCCESS' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:text-emerald-300'
                        }`}
                      >
                        Success Only
                      </button>
                      <button
                        type="button"
                        onClick={() => setLogStatusFilter('FAILED_PASSWORD')}
                        className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                          logStatusFilter === 'FAILED_PASSWORD' ? 'bg-rose-600 text-white' : 'text-rose-400 hover:text-rose-300'
                        }`}
                      >
                        Password Failures
                      </button>
                    </div>

                    <div className="relative min-w-[160px]">
                      <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Filter audit log..."
                        value={logSearchQuery}
                        onChange={(e) => setLogSearchQuery(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-md pl-8 pr-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto max-h-80 overflow-y-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#0b1120] text-slate-400 uppercase text-[10px] font-display border-b border-slate-800 tracking-wider sticky top-0">
                      <tr>
                        <th className="p-3">Status</th>
                        <th className="p-3">Timestamp</th>
                        <th className="p-3">User Identifier</th>
                        <th className="p-3">Detected Role</th>
                        <th className="p-3">Device / Client</th>
                        <th className="p-3 text-right">IP Address</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {filteredLogs.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-6 text-center text-slate-500 font-sans">
                            No authentication audit logs found. Try logging in with admin credentials!
                          </td>
                        </tr>
                      ) : (
                        filteredLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="p-3">
                              {log.status === 'SUCCESS' ? (
                                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-1.5 py-0.5 rounded inline-flex items-center gap-1">
                                  <Check className="w-3 h-3" />
                                  SUCCESS
                                </span>
                              ) : (
                                <span className="bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-bold px-1.5 py-0.5 rounded inline-flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  FAILED_PASSWORD
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-slate-400 text-[11px]">
                              {new Date(log.timestamp).toLocaleString()}
                            </td>
                            <td className="p-3 text-white font-bold">{log.identifier}</td>
                            <td className="p-3 text-amber-400 text-[11px]">{log.role}</td>
                            <td className="p-3 text-slate-400 text-[11px] truncate max-w-xs">{log.device || 'Web Browser (Desktop)'}</td>
                            <td className="p-3 text-right text-slate-500 text-[11px]">{log.ipAddress || '127.0.0.1'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: API DOCS & NODE SERVER SETUP */}
          {activeSection === 'api-docs' && (
            <div className="space-y-6 max-w-4xl animate-in fade-in duration-150">
              <div className="pb-4 border-b border-slate-800">
                <h1 className="text-xl sm:text-2xl font-black text-white font-display">
                  Backend Architecture, API Endpoints & Server Guide
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  All backend files are stored in the project's <code>/backend</code> directory with Express, Mongoose, JWT, and Cloudinary.
                </p>
              </div>

              {/* Terminal Instructions */}
              <div className="bg-[#0b1120] border border-slate-800 rounded-xl p-5 font-mono text-xs text-slate-300 space-y-2">
                <div className="text-amber-400 font-bold mb-3"># Terminal Commands to Launch Express Backend:</div>
                <div className="text-slate-400"># 1. Switch to backend directory</div>
                <div className="text-white">$ cd backend</div>
                <div className="text-slate-400 mt-2"># 2. Install dependencies (express, mongoose, bcryptjs, jsonwebtoken, multer, cors)</div>
                <div className="text-white">$ npm install</div>
                <div className="text-slate-400 mt-2"># 3. Seed MongoDB database with initial sample data and admin account</div>
                <div className="text-white">$ node seeder.js</div>
                <div className="text-slate-400 mt-2"># 4. Start the Express server on port 5000</div>
                <div className="text-emerald-400">$ npm start</div>
              </div>

              {/* GitHub Repository Sync Info */}
              <div className="bg-[#0b1120] border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold text-xs uppercase font-display flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-emerald-400" />
                      Connected GitHub Repository
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                      SYNCHRONIZED (main)
                    </span>
                  </div>
                  <a
                    href="https://github.com/AyeshWijewardana1984/market-trading-marketplace"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2.5 py-1 rounded flex items-center gap-1 transition-colors"
                  >
                    <span>Open GitHub Repo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed">
                  Remote URL: <code className="text-amber-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">https://github.com/AyeshWijewardana1984/market-trading-marketplace.git</code>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 font-mono text-[11px] text-slate-300 space-y-1">
                  <div className="text-slate-500"># How to push new updates to GitHub anytime:</div>
                  <div className="text-slate-400"># 1. Ask in AI Studio chat: "push changes to github" (automatic!)</div>
                  <div className="text-slate-400 mt-1"># 2. Or from your local terminal:</div>
                  <div className="text-white">$ git add .</div>
                  <div className="text-white">$ git commit -m "Update features"</div>
                  <div className="text-emerald-400">$ git push origin main</div>
                </div>
              </div>

              {/* Endpoint Reference Table */}
              <div className="bg-[#11192d] rounded-xl border border-slate-800 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-800 font-bold text-xs uppercase font-display text-white">
                  Active RESTful API Endpoints
                </div>
                <div className="divide-y divide-slate-800 text-xs">
                  <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="bg-blue-500/20 text-blue-400 border border-blue-500/40 px-2 py-0.5 rounded font-bold">GET</span>
                      <span className="text-white">/api/homepage</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">Returns Hero carousel, active Daily Deals, Trending Items, and Footer Promises</span>
                  </div>

                  <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">POST</span>
                      <span className="text-white">/api/auth/login</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">Authenticates Admin/Customer and returns signed JWT Bearer Token</span>
                  </div>

                  <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="bg-blue-500/20 text-blue-400 border border-blue-500/40 px-2 py-0.5 rounded font-bold">GET</span>
                      <span className="text-white">/api/products?keyword=chair&category=furniture</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">Public multi-parameter search, filtering & pagination</span>
                  </div>

                  <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded font-bold">PUT</span>
                      <span className="text-white">/api/homepage/customization</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">Admin route to update Hero text, URLs, and guarantees</span>
                  </div>

                  <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">POST</span>
                      <span className="text-white">/api/orders</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">Places order, validates stock, deducts inventory & calculates coupon discounts</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 3. Comprehensive Add / Edit Product & Customization Modal */}
      <AddProductModal
        isOpen={showAddProductModal}
        productToEdit={editingProduct}
        onClose={() => {
          setShowAddProductModal(false);
          setEditingProduct(null);
        }}
        onProductCreated={(newProd) => {
          onAddToast(`Product "${newProd.name.slice(0, 25)}..." successfully added to marketplace catalog!`, 'success');
        }}
        onProductUpdated={(updatedProd) => {
          onAddToast(`Product "${updatedProd.name.slice(0, 25)}..." updated successfully!`, 'success');
        }}
        currency={currency}
        language={language}
      />

      {/* 4. Edit User / Administrator Password Modal */}
      {showPasswordModal && editingPasswordUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#11192d] border border-slate-700 rounded-xl max-w-md w-full p-5 shadow-2xl relative">
            <button
              onClick={() => {
                setShowPasswordModal(false);
                setEditingPasswordUser(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-display">
                  Update Account Password
                </h3>
                <p className="text-[11px] text-slate-400">
                  {editingPasswordUser.name} ({editingPasswordUser.email})
                </p>
              </div>
            </div>

            <form onSubmit={handleSavePassword} className="mt-4 space-y-4">
              <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 text-xs text-slate-300">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Target Role:</span>
                  <span className="font-mono text-amber-400 uppercase font-bold">
                    {editingPasswordUser.role.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] mt-1">
                  <span className="text-slate-400">Username:</span>
                  <span className="font-mono text-white">
                    {editingPasswordUser.username}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    New Password:
                  </label>
                  <button
                    type="button"
                    onClick={() => setNewPasswordValue(generateRandomPassword())}
                    className="text-[10px] text-orange-400 hover:text-orange-300 flex items-center gap-1 font-mono cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generate Strong</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={newPasswordValue}
                    onChange={(e) => setNewPasswordValue(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Minimum 6 characters. For administrators, use letters, numbers, and symbols.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setEditingPasswordUser(null);
                  }}
                  className="px-3.5 py-1.5 rounded-md text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer font-display shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
