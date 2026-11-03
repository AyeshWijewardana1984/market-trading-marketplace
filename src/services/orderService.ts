import { OrderRecord } from '../types/marketplace';

const STORAGE_KEY = 'mkt_marketplace_orders_v2';
const ORDERS_EVENT = 'mkt:orders:updated';

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'MKT-2026-8941',
    customer: 'Alex Johnson',
    email: 'alex.buyer@market.com',
    phone: '+1 (415) 892-4410',
    date: 'Nov 01, 2026 - 08:30 AM',
    itemsCount: 2,
    total: 513.98,
    paymentMethod: 'Credit Card (Stripe)',
    status: 'Shipped',
    shippingAddress: '742 Evergreen Terrace, San Francisco, CA, USA',
  },
  {
    id: 'MKT-2026-7721',
    customer: 'Elena Rostova',
    email: 'elena.r@boutiquehotel.it',
    phone: '+39 02 7834 9102',
    date: 'Oct 31, 2026 - 04:15 PM',
    itemsCount: 6,
    total: 1240.0,
    paymentMethod: 'Escrow Wire Transfer',
    status: 'Processing',
    shippingAddress: 'Via Montenapoleone 18, Milan, Italy',
  },
  {
    id: 'MKT-2026-6619',
    customer: 'Marcus Vance',
    email: 'marcus@nordicdesign.se',
    phone: '+46 8 555 3190',
    date: 'Oct 29, 2026 - 11:20 AM',
    itemsCount: 1,
    total: 498.0,
    paymentMethod: 'PayPal Express',
    status: 'Delivered',
    shippingAddress: 'Hamngatan 14, Stockholm, Sweden',
  },
  {
    id: 'MKT-2026-5532',
    customer: 'David Chen',
    email: 'david.c@precisioncnc.ca',
    phone: '+1 (416) 720-9941',
    date: 'Oct 28, 2026 - 02:40 PM',
    itemsCount: 3,
    total: 135.5,
    paymentMethod: 'Cash on Delivery (COD)',
    status: 'Pending',
    shippingAddress: '1200 Bay Street, Toronto, ON, Canada',
  },
];

/**
 * Formats current date and time cleanly for order records
 */
export function formatOrderDate(date: Date = new Date()): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const m = months[date.getMonth()];
  const d = String(date.getDate()).padStart(2, '0');
  const y = date.getFullYear();

  let hours = date.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${m} ${d}, ${y} - ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
}

/**
 * Retrieve all orders from localStorage, fallback to INITIAL_ORDERS
 */
export function getStoredOrders(): OrderRecord[] {
  if (typeof window === 'undefined') return INITIAL_ORDERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_ORDERS;
  } catch (err) {
    console.error('Failed to load orders from localStorage:', err);
    return INITIAL_ORDERS;
  }
}

/**
 * Persist orders to localStorage and notify all listeners
 */
export function saveStoredOrders(orders: OrderRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent(ORDERS_EVENT, { detail: orders }));
  } catch (err) {
    console.error('Failed to save orders to localStorage:', err);
  }
}

/**
 * Places a new order from CheckoutModal and prepends it so it immediately appears
 * at the top of the Marketplace Orders & Fulfillment Terminal
 */
export function placeOrder(orderData: {
  customer: string;
  email: string;
  phone: string;
  shippingAddress: string;
  itemsCount: number;
  total: number;
  paymentMethod: string;
  customId?: string;
  status?: string;
}): OrderRecord {
  const currentOrders = getStoredOrders();

  const generatedId =
    orderData.customId ||
    `MKT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const newOrder: OrderRecord = {
    id: generatedId,
    customer: orderData.customer.trim() || 'Valued Marketplace Buyer',
    email: orderData.email.trim() || 'buyer@market.com',
    phone: orderData.phone.trim() || '+94 77 123 4567',
    date: formatOrderDate(),
    itemsCount: Math.max(1, orderData.itemsCount),
    total: Number(orderData.total.toFixed(2)),
    paymentMethod: orderData.paymentMethod || 'Credit Card (Stripe)',
    status: orderData.status || 'Pending',
    shippingAddress: orderData.shippingAddress.trim() || 'Standard Delivery Address',
  };

  const updated = [newOrder, ...currentOrders];
  saveStoredOrders(updated);
  return newOrder;
}

/**
 * Updates an order milestone/status and saves to storage
 */
export function updateOrderStatusInStorage(orderId: string, newStatus: string): OrderRecord[] {
  const current = getStoredOrders();
  const updated = current.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord));
  saveStoredOrders(updated);
  return updated;
}

/**
 * Deletes an order from storage
 */
export function deleteOrderInStorage(orderId: string): OrderRecord[] {
  const current = getStoredOrders();
  const updated = current.filter((ord) => ord.id !== orderId);
  saveStoredOrders(updated);
  return updated;
}

/**
 * Looks up an order by ID (e.g. for order tracking)
 */
export function findOrderById(orderId: string): OrderRecord | undefined {
  const orders = getStoredOrders();
  const normalized = orderId.trim().toUpperCase();
  return orders.find(
    (o) => o.id.toUpperCase() === normalized || o.id.replace(/-/g, '').includes(normalized.replace(/-/g, ''))
  );
}

/**
 * Subscribes to real-time order updates across components and window tabs
 */
export function subscribeToOrders(callback: (orders: OrderRecord[]) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = (e: Event) => {
    const customEvent = e as CustomEvent<OrderRecord[]>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    } else {
      callback(getStoredOrders());
    }
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed)) {
          callback(parsed);
        }
      } catch {
        callback(getStoredOrders());
      }
    }
  };

  window.addEventListener(ORDERS_EVENT, handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    window.removeEventListener(ORDERS_EVENT, handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
  };
}

/**
 * Reset orders to initial standard seed
 */
export function resetOrdersToDefault(): OrderRecord[] {
  saveStoredOrders(INITIAL_ORDERS);
  return INITIAL_ORDERS;
}
