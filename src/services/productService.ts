import { Product } from '../types/marketplace';
import { ALL_PRODUCTS } from '../data/products';

const PRODUCTS_STORAGE_KEY = 'mkt_marketplace_products_v2';
const PRODUCTS_UPDATED_EVENT = 'mkt:products:updated';

/**
 * Retrieves all products from localStorage or initializes with seed catalog.
 */
export function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') {
    return ALL_PRODUCTS;
  }
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(ALL_PRODUCTS));
      return ALL_PRODUCTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return ALL_PRODUCTS;
  } catch (err) {
    console.error('Failed to load products from localStorage:', err);
    return ALL_PRODUCTS;
  }
}

/**
 * Saves products to localStorage and broadcasts the update event.
 */
export function saveProducts(products: Product[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(
      new CustomEvent(PRODUCTS_UPDATED_EVENT, { detail: products })
    );
  } catch (err) {
    console.error('Failed to save products to localStorage:', err);
  }
}

/**
 * Appends a new product to the front of the catalog.
 */
export function addProduct(product: Product): Product {
  const current = getStoredProducts();
  const next = [product, ...current];
  saveProducts(next);
  return product;
}

/**
 * Updates an existing product by ID.
 */
export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const current = getStoredProducts();
  let updatedProduct: Product | null = null;
  const next = current.map((item) => {
    if (item.id === id) {
      updatedProduct = { ...item, ...updates };
      return updatedProduct;
    }
    return item;
  });

  if (updatedProduct) {
    saveProducts(next);
  }
  return updatedProduct;
}

/**
 * Deletes a product by ID.
 */
export function deleteProduct(id: string): boolean {
  const current = getStoredProducts();
  const next = current.filter((item) => item.id !== id);
  if (next.length !== current.length) {
    saveProducts(next);
    return true;
  }
  return false;
}

/**
 * Resets the product catalog to the default baseline.
 */
export function resetProductsToDefault(): Product[] {
  saveProducts(ALL_PRODUCTS);
  return ALL_PRODUCTS;
}

/**
 * Subscribes to product changes across tabs and within the single-page application.
 */
export function subscribeToProducts(callback: (products: Product[]) => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleCustomEvent = (event: Event) => {
    const customEvent = event as CustomEvent<Product[]>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    } else {
      callback(getStoredProducts());
    }
  };

  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key === PRODUCTS_STORAGE_KEY && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue);
        if (Array.isArray(parsed)) {
          callback(parsed);
        }
      } catch (err) {
        console.error('Storage sync error for products:', err);
      }
    }
  };

  window.addEventListener(PRODUCTS_UPDATED_EVENT, handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    window.removeEventListener(PRODUCTS_UPDATED_EVENT, handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
  };
}

/**
 * Generates an alphanumeric SKU identifier based on category and timestamp.
 */
export function generateProductSKU(categoryName: string): string {
  const prefix = categoryName
    .replace(/[^a-zA-Z]/g, '')
    .slice(0, 3)
    .toUpperCase() || 'MKT';
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const timeSuffix = Date.now().toString().slice(-4);
  return `${prefix}-${timeSuffix}-${randomSuffix}`;
}
