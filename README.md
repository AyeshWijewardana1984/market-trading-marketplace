# Market - Multi Trading Marketplace

A production-grade, full-stack multi-vendor trading marketplace web application built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Node.js/Express**. Featuring dual Sinhala (`si`) and English (`en`) localization, responsive design across all viewports (320px–1440px+), and an enterprise Administration Backend Console.

---

## 🌟 Key Features

### 🛍️ Customer Storefront
- **Responsive Departments Mega-Menu**: Floating dropdown and drawer navigation with subcategories, active states, and supplier count indicators.
- **Hero Slider & Live Customizer**: Dynamic promotional hero banners with smooth slide controls and responsive badge overlays.
- **Daily Deals & Countdown**: Flash deals with animated timers, discount calculation, and quantity progress bars.
- **Trending & Featured Catalog**: Filterable product grids by department, price, stock status, and vendor rating.
- **Interactive Modals & Drawers**:
  - Cart Drawer with live currency conversion (USD `$`, EUR `€`, GBP `£`).
  - Wishlist & Comparison Drawer.
  - Quick View Modal with multi-image gallery and spec breakdown.
  - Bulk B2B Wholesale RFQ (Request for Quote) Modal.
  - Real-time Order Tracking Terminal.
  - Live Vendor Storefronts & Supplier Inquiries.
- **Internationalization (i18n)**: Instant one-click toggle between **English** and **සිංහල (Sinhala)** across all UI elements, categories, and notifications.

### 🛡️ Enterprise Admin Backend Console
- **Module Overview & Metrics**: Live analytics on revenue, customer orders, inventory stock health, and active vendors.
- **Homepage Customizer**: Real-time editor for hero slides, promotional banners, promo vouchers, and value propositions.
- **Product Inventory Terminal**: Add, edit, adjust stock, manage pricing, and delete catalog items.
- **Department Hierarchy Manager**: Create new categories, configure icon mappings, add/remove subcategories, and reorder.
- **Fulfillment & Order Desk**: Process incoming customer orders through status milestones (Pending, Processing, Shipped, Delivered, Cancelled) with simulated live buyer orders.
- **Coupons & Trade Vouchers**: Create discount promo codes with percentage or fixed reductions and usage limits.
- **User & Access Control (RBAC)**: Manage Admin, Vendor, and Customer accounts with security audit logs.
- **API Documentation & System Status**: Live endpoint testing interface for RESTful routes.

---

## 🚀 Quick Start (Frontend)

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, or pnpm

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Run local development server (port 3000)
npm run dev

# 3. Build production bundle
npm run build

# 4. Preview production build locally
npm run preview
```

---

## ⚙️ Backend (Node.js & Express)

A complete Express API is included in the `backend/` directory:

```bash
# Navigate to backend
cd backend

# Install backend dependencies
npm install

# Configure environment variables
cp .env.example .env

# Run database seeder (seeds initial products, categories, users)
npm run data:import

# Start backend server (port 5000)
npm run dev
```

---

## 🔐 Default Admin Credentials

Access the Admin Backend Console via the Storefront top bar or user menu:
- **Email**: `admin@market.com`
- **Password**: `admin123`
- **Role**: `Super Administrator`

---

## 📱 Multi-Screen Responsive Architecture

- **Mobile Viewports (320px – 480px)**: Fluid search bars, collapsible slide-out drawer, touch-scrollable module switcher in Admin Console.
- **Tablet Viewports (768px – 1023px)**: Zero dead-zone navigation, adaptive sidebars, and fluid promotional banners.
- **Laptop & Desktop (1024px – 1440px+)**: Sticky header, instant department mega-menu flyouts, and multi-column grid layouts.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
