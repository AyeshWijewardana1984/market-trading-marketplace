import React, { useState, useEffect } from 'react';
import {
  X,
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Sliders,
  DollarSign,
  TrendingUp,
  Clock,
  Sparkles,
  CheckCircle,
  Save,
  Server,
  Key,
  Database,
  ExternalLink,
  Plus,
  RefreshCw,
  Phone,
  Copy,
  Mail,
  MapPin,
  Check
} from 'lucide-react';
import { Currency, Language, Product, OrderRecord } from '../../types/marketplace';
import { ALL_PRODUCTS, DAILY_DEALS, TRENDING_PRODUCTS } from '../../data/products';
import {
  getStoredOrders,
  updateOrderStatusInStorage,
  subscribeToOrders,
  placeOrder,
  resetOrdersToDefault
} from '../../services/orderService';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  language?: Language;
  onUpdateHeroBanner?: (text: string, subtitle: string, coupon: string) => void;
  onUpdateProductStock?: (productId: string, newStock: number) => void;
  onToggleDailyDeal?: (productId: string, isDeal: boolean) => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  currency,
  language = 'en',
  onUpdateHeroBanner,
  onUpdateProductStock,
  onToggleDailyDeal,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'homepage' | 'products' | 'deals' | 'orders' | 'api'>('overview');

  // Customization Form State
  const [heroTitle, setHeroTitle] = useState('Office furniture - SALE UP TO 50% OFF');
  const [heroSubtitle, setHeroSubtitle] = useState('Architectural beech wood frame with premium high-density velvet cushioning for modern spaces.');
  const [couponCode, setCouponCode] = useState('Happy2017');
  const [promoText, setPromoText] = useState('Jacquard Warp Knitted Microfiber Towel - Special 75% OFF');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Products and Stock State
  const [productsList, setProductsList] = useState<Product[]>(ALL_PRODUCTS);
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [tempStock, setTempStock] = useState<number>(20);

  // Orders State (Synchronized with shared orderService and Storefront Checkout)
  const [ordersList, setOrdersList] = useState<OrderRecord[]>(() => getStoredOrders());
  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setOrdersList(getStoredOrders());
    }
    const unsubscribe = subscribeToOrders((latest) => {
      setOrdersList(latest);
    });
    return unsubscribe;
  }, [isOpen]);

  const handleCopyPhone = (orderId: string, phone: string) => {
    navigator.clipboard?.writeText(phone);
    setCopiedPhoneId(orderId);
    setTimeout(() => setCopiedPhoneId(null), 2000);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    const updated = updateOrderStatusInStorage(orderId, newStatus);
    setOrdersList(updated);
  };

  const handleSimulateBuyerOrder = () => {
    const sampleBuyers = [
      { name: 'Kavinda Perera', phone: '+94 77 412 8890', city: 'Colombo 07, Sri Lanka', addr: 'No 45 Horton Place' },
      { name: 'Sophia Sterling', phone: '+1 (415) 620-4109', city: 'San Francisco, CA, USA', addr: '120 Market St' },
      { name: 'Matteo Moretti', phone: '+39 02 8820 1192', city: 'Milan, Italy', addr: 'Corso Buenos Aires 12' },
      { name: 'Hana Tanaka', phone: '+81 3 5519 2041', city: 'Tokyo, Japan', addr: 'Roppongi Hills 8F' },
    ];
    const chosen = sampleBuyers[Math.floor(Math.random() * sampleBuyers.length)];
    const newOrd = placeOrder({
      customer: chosen.name,
      email: `${chosen.name.toLowerCase().replace(/\s+/g, '.')}@buyer.com`,
      phone: chosen.phone,
      shippingAddress: `${chosen.addr}, ${chosen.city}`,
      itemsCount: 2,
      total: 349.99,
      paymentMethod: 'Credit Card (Stripe)',
      status: 'Pending',
    });
    setOrdersList(getStoredOrders());
  };

  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';
  const currencyRate = currency === 'USD' ? 1 : currency === 'EUR' ? 0.92 : 0.79;

  const totalRevenue = ordersList.reduce((acc, o) => acc + o.total, 0) * currencyRate;

  const handleSaveHomepage = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateHeroBanner) {
      onUpdateHeroBanner(heroTitle, heroSubtitle, couponCode);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveStock = (prodId: string) => {
    setProductsList(prev => prev.map(p => p.id === prodId ? { ...p, stock: tempStock } : p));
    if (onUpdateProductStock) {
      onUpdateProductStock(prodId, tempStock);
    }
    setEditingStockId(null);
  };

  const handleToggleDeal = (prodId: string) => {
    setProductsList(prev => prev.map(p => {
      if (p.id === prodId) {
        const nextState = !p.isDailyDeal;
        if (onToggleDailyDeal) onToggleDailyDeal(prodId, nextState);
        return { ...p, isDailyDeal: nextState };
      }
      return p;
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-5">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-xs" />

      {/* Main Admin Modal Window */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-5xl w-full overflow-hidden z-10 flex flex-col h-[85vh] animate-in fade-in zoom-in-95 duration-150 border border-slate-300">
        
        {/* Top Header */}
        <div className="bg-[#0c1524] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#ea580c] flex items-center justify-center font-bold text-white shadow-md">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight font-display">
                  Marketplace Admin & Backend Portal
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Connected: Port 5000 / DB Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Manage live catalog, hero sliders, daily deals, customer orders, and API endpoints
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 flex items-center gap-2 overflow-x-auto text-xs font-bold font-display shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'overview'
                ? 'border-[#ea580c] text-[#ea580c] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('homepage')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'homepage'
                ? 'border-[#ea580c] text-[#ea580c] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Homepage & Banners</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'products'
                ? 'border-[#ea580c] text-[#ea580c] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Inventory ({productsList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('deals')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'deals'
                ? 'border-[#ea580c] text-[#ea580c] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Daily Deals & Timers</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'orders'
                ? 'border-[#ea580c] text-[#ea580c] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Customer Orders ({ordersList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'api'
                ? 'border-[#ea580c] text-[#ea580c] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>API Docs & Node Server</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50">

          {/* 1. Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider font-display">Total Revenue</span>
                    <DollarSign className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 font-mono-numbers">
                    {currencySymbol}{totalRevenue.toFixed(2)}
                  </div>
                  <span className="text-[11px] text-emerald-600 font-medium">↑ +14.2% from last month</span>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider font-display">Total Orders</span>
                    <ShoppingBag className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 font-mono-numbers">
                    {ordersList.length}
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">4 active in fulfillment pipeline</span>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider font-display">Active Products</span>
                    <Package className="w-5 h-5 text-[#ea580c]" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 font-mono-numbers">
                    {productsList.length}
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">Across 11 global departments</span>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider font-display">Active Daily Deals</span>
                    <Clock className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 font-mono-numbers">
                    {productsList.filter(p => p.isDailyDeal).length}
                  </div>
                  <span className="text-[11px] text-amber-600 font-medium">Ticking live with countdown clock</span>
                </div>
              </div>

              {/* Quick Actions & Recent Orders Banner */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider font-display">
                      Recent Marketplace Orders
                    </h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-[#ea580c] font-bold hover:underline cursor-pointer"
                    >
                      View All Orders →
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {ordersList.slice(0, 3).map(order => (
                      <div key={order.id} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-800 flex items-center gap-2">
                            <span>{order.id}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                              order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'Processing' ? 'bg-amber-100 text-amber-800' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400 text-[11px] mt-0.5">
                            <span>{order.customer}</span>
                            <span>•</span>
                            <a
                              href={`tel:${order.phone.replace(/[^+\d]/g, '')}`}
                              className="text-emerald-700 hover:text-emerald-900 font-mono font-medium flex items-center gap-1"
                              title={`Call ${order.customer}`}
                            >
                              <Phone className="w-2.5 h-2.5 text-emerald-600" />
                              <span>{order.phone}</span>
                            </a>
                            <span>•</span>
                            <span>{order.itemsCount} items</span>
                            <span>•</span>
                            <span>{order.paymentMethod}</span>
                          </div>
                        </div>
                        <div className="font-mono-numbers font-bold text-slate-900 text-sm">
                          {currencySymbol}{(order.total * currencyRate).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider font-display mb-3">
                      Server & Backend Status
                    </h3>
                    <div className="space-y-3 text-xs text-slate-600">
                      <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded">
                        <span className="text-slate-500">API Health:</span>
                        <span className="font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> 200 OK
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded">
                        <span className="text-slate-500">MongoDB Models:</span>
                        <span className="font-mono text-slate-800 font-bold">6 Registered</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded">
                        <span className="text-slate-500">Active Coupon:</span>
                        <span className="font-mono font-bold text-[#ea580c] bg-orange-50 px-1.5 py-0.5 rounded">Happy2017</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('api')}
                    className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white py-2 rounded text-xs font-bold uppercase tracking-wider font-display cursor-pointer transition-colors"
                  >
                    View Node.js Backend Code
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. Homepage Customization Tab */}
          {activeTab === 'homepage' && (
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs max-w-3xl">
              <div className="pb-4 mb-4 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Homepage & Hero Slider Customizer (PUT /api/homepage/customization)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Changes made here update the live homepage hero banner and promotional ribbon in real-time.
                </p>
              </div>

              {savedSuccess && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Homepage customization updated successfully! Check the live site.</span>
                </div>
              )}

              <form onSubmit={handleSaveHomepage} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Hero Banner Headline
                  </label>
                  <input
                    type="text"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Hero Banner Subtitle / Description
                  </label>
                  <textarea
                    rows={2}
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Promotional Coupon Code (Ribbon Bar)
                    </label>
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-xs uppercase font-mono-numbers focus:outline-none focus:border-[#ea580c]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Discount Value
                    </label>
                    <input
                      type="text"
                      disabled
                      value="20% Instant Order Discount"
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded text-xs text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Middle Banner Text
                  </label>
                  <input
                    type="text"
                    value={promoText}
                    onChange={(e) => setPromoText(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-6 py-2.5 rounded font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm cursor-pointer transition-colors font-display"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save & Publish Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 3. Products Inventory Tab */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 font-display">
                    Product Catalog & Stock Management (GET/POST/PUT /api/products)
                  </h3>
                  <span className="text-xs text-slate-500">Edit stock levels directly or toggle Daily Deal status</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase font-display">
                    <tr>
                      <th className="py-3 px-4">Product Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">Daily Deal</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {productsList.map(prod => (
                      <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-800 max-w-xs truncate">
                          {prod.name}
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {prod.category}
                        </td>
                        <td className="py-3 px-4 font-mono-numbers font-bold text-[#ea580c]">
                          {currencySymbol}{(prod.price * currencyRate).toFixed(2)}
                        </td>
                        <td className="py-3 px-4 font-mono-numbers">
                          {editingStockId === prod.id ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                min="0"
                                value={tempStock}
                                onChange={(e) => setTempStock(parseInt(e.target.value) || 0)}
                                className="w-16 px-1.5 py-0.5 border border-[#ea580c] rounded text-xs text-center"
                              />
                              <button
                                onClick={() => handleSaveStock(prod.id)}
                                className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold cursor-pointer"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span className={`font-bold ${prod.stock && prod.stock < 10 ? 'text-red-500' : 'text-slate-800'}`}>
                                {prod.stock || 20}
                              </span>
                              <button
                                onClick={() => {
                                  setEditingStockId(prod.id);
                                  setTempStock(prod.stock || 20);
                                }}
                                className="text-[10px] text-slate-400 hover:text-slate-700 underline cursor-pointer"
                              >
                                Edit
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleDeal(prod.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                              prod.isDailyDeal
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            {prod.isDailyDeal ? '★ Active Deal' : 'Set as Deal'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-slate-400 text-[10px] font-mono-numbers">
                            {prod.sold || 28} sold
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. Daily Deals Tab */}
          {activeTab === 'deals' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Daily Deals Countdown Synchronization</strong>
                  <span>
                    When a product is marked as a Daily Deal, the backend computes the live deadline using <code>dealEndTime</code>. The frontend countdown clock automatically calculates remaining days, hours, minutes, and seconds.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {productsList.filter(p => p.isDailyDeal).map(deal => (
                  <div key={deal.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span className="text-amber-600 font-bold uppercase text-[10px] font-display">Active Deal</span>
                        <span className="bg-red-500 text-white font-bold text-[9px] px-1.5 py-0.2 rounded font-mono-numbers">
                          {deal.discountPercent || 75}% OFF
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-800 line-clamp-2 leading-snug">
                        {deal.name}
                      </h4>
                      <div className="mt-2 text-sm font-black text-[#ea580c] font-mono-numbers">
                        {currencySymbol}{(deal.price * currencyRate).toFixed(2)}
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Stock: <strong>{deal.stock || 20}</strong></span>
                      <button
                        onClick={() => handleToggleDeal(deal.id)}
                        className="text-xs text-red-600 hover:underline cursor-pointer"
                      >
                        Remove from Deals
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900 font-display">
                      Marketplace Orders & Fulfillment Terminal
                    </h3>
                    <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded">
                      {ordersList.length} Live Orders
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    Real-time buyer contact information, phone dispatch verification, and milestone fulfillment
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setOrdersList(getStoredOrders())}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer font-display transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSimulateBuyerOrder}
                    className="px-3 py-1.5 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer font-display transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Simulate Order</span>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase font-display">
                    <tr>
                      <th className="py-3 px-4">Order ID & Date</th>
                      <th className="py-3 px-4">Buyer Name</th>
                      <th className="py-3 px-4 text-emerald-700 font-extrabold bg-emerald-50/50">Buyer Phone Number</th>
                      <th className="py-3 px-4">Items & Shipping</th>
                      <th className="py-3 px-4">Total Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Update Milestone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {ordersList.map(order => (
                      <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-slate-900 block">{order.id}</span>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{order.date}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900 text-sm">{order.customer}</div>
                          <span className="text-slate-400 font-mono text-[10px] flex items-center gap-1 mt-0.5">
                            <Mail className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                            {order.email}
                          </span>
                        </td>
                        {/* Dedicated Buyer Phone Number Column */}
                        <td className="py-3 px-4 bg-emerald-50/20">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <a
                              href={`tel:${order.phone.replace(/[^+\d]/g, '')}`}
                              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-100/80 hover:bg-emerald-200/90 border border-emerald-300 px-2.5 py-1 rounded transition-colors group shadow-2xs"
                              title={`Direct dial buyer ${order.customer} at ${order.phone}`}
                            >
                              <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0 group-hover:scale-110 transition-transform" />
                              <span>{order.phone}</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => handleCopyPhone(order.id, order.phone)}
                              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                              title="Copy buyer phone number"
                            >
                              {copiedPhoneId === order.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-slate-800 font-semibold block">{order.itemsCount} Items</span>
                          <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{order.shippingAddress}</span>
                        </td>
                        <td className="py-3 px-4 font-mono-numbers font-bold text-[#ea580c] text-sm">
                          {currencySymbol}{(order.total * currencyRate).toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'Processing' ? 'bg-amber-100 text-amber-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="px-2 py-1 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:border-[#ea580c] cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. API Docs Tab */}
          {activeTab === 'api' && (
            <div className="space-y-5 text-xs text-slate-700">
              <div className="bg-slate-900 text-slate-200 p-4 rounded-lg font-mono">
                <div className="text-amber-400 font-bold mb-2"># How to launch the Node.js / Express backend:</div>
                <div>$ cd backend</div>
                <div>$ npm install</div>
                <div>$ node seeder.js     <span className="text-slate-500"># Seeds initial categories, products & admin</span></div>
                <div>$ npm start          <span className="text-emerald-400"># Starts Express on http://localhost:5000</span></div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 font-bold text-xs uppercase font-display text-slate-800">
                  Core RESTful Backend Endpoints
                </div>
                <div className="divide-y divide-slate-100 font-mono text-[11px]">
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold mr-2">GET</span>
                      <code>/api/homepage</code>
                    </div>
                    <span className="text-slate-500 font-sans">Returns Hero banners, active Daily Deals, Trending Items & Service Guarantees</span>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold mr-2">POST</span>
                      <code>/api/auth/login</code>
                    </div>
                    <span className="text-slate-500 font-sans">Issues JWT Bearer token for customer or admin</span>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold mr-2">GET</span>
                      <code>/api/products?category=furniture&keyword=chair</code>
                    </div>
                    <span className="text-slate-500 font-sans">Public multi-criteria product search & filtering</span>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold mr-2">PUT</span>
                      <code>/api/homepage/customization</code>
                    </div>
                    <span className="text-slate-500 font-sans">Admin-only route to update banners and footer guarantees</span>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold mr-2">POST</span>
                      <code>/api/orders</code>
                    </div>
                    <span className="text-slate-500 font-sans">Places order, verifies inventory, applies coupon discount</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-500">
            Marketplace Full-Stack Architecture • Node.js + Express + Mongoose + JWT
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded font-bold uppercase tracking-wider transition-colors cursor-pointer font-display"
          >
            Close Portal
          </button>
        </div>
      </div>
    </div>
  );
};
