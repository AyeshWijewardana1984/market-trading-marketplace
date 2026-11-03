export interface Product {
  id: string;
  name: string;
  nameSi?: string;
  category: string;
  categorySi?: string;
  subcategory?: string;
  subcategorySi?: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  imageAlt: string;
  badge?: string;
  badgeSi?: string;
  stock?: number;
  sold?: number;
  description: string;
  descriptionSi?: string;
  vendor: string;
  vendorSi?: string;
  isDailyDeal?: boolean;
  colors?: string[];
  colorsSi?: string[];
  specs?: { [key: string]: string };
  specsSi?: { [key: string]: string };
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  nameSi?: string;
  iconName: string;
  itemCount: number;
  subcategories: string[];
  subcategoriesSi?: string[];
}

export type Currency = 'USD' | 'EUR' | 'GBP';
export type Language = 'en' | 'si';

export interface HeroSlideItem {
  id: number;
  category: string;
  categorySi: string;
  badge: string;
  badgeSi: string;
  badgeColor?: string;
  headline: string;
  headlineSi: string;
  highlight: string;
  highlightSi: string;
  description: string;
  descriptionSi: string;
  image: string;
  ctaText: string;
  ctaTextSi: string;
  targetCategory?: string;
  isActive?: boolean;
}

export interface OrderRecord {
  id: string;
  customer: string;
  email: string;
  phone: string;
  date: string;
  itemsCount: number;
  total: number;
  paymentMethod: string;
  status: string;
  shippingAddress: string;
}

