import { CategoryItem } from '../types/marketplace';
import { CATEGORIES } from '../data/products';

const STORAGE_KEY = 'mkt_marketplace_departments_v2';
const DEPARTMENTS_EVENT = 'mkt:departments:updated';

export interface IconOption {
  key: string;
  label: string;
  category: string;
}

export const AVAILABLE_DEPARTMENT_ICONS: IconOption[] = [
  { key: 'Wrench', label: 'Tools & Hardware', category: 'Industrial' },
  { key: 'Sparkles', label: 'Beauty & Glow', category: 'Personal Care' },
  { key: 'Gift', label: 'Gifts & Toys', category: 'Lifestyle' },
  { key: 'Shirt', label: 'Textiles & Apparel', category: 'Fashion' },
  { key: 'Briefcase', label: 'Office & Business', category: 'Corporate' },
  { key: 'FlaskConical', label: 'Chemicals & Science', category: 'Industrial' },
  { key: 'Eye', label: 'Optics & Vision', category: 'Technology' },
  { key: 'Home', label: 'Home & Construction', category: 'Living' },
  { key: 'Radio', label: 'Telecom & Sensors', category: 'Technology' },
  { key: 'Gem', label: 'Jewelry & Luxury', category: 'Fashion' },
  { key: 'Cpu', label: 'Electronics & Chips', category: 'Technology' },
  { key: 'Smartphone', label: 'Mobile & Gadgets', category: 'Technology' },
  { key: 'Laptop', label: 'Computers & IT', category: 'Technology' },
  { key: 'Tv', label: 'Displays & AV', category: 'Electronics' },
  { key: 'Car', label: 'Automotive & Motors', category: 'Vehicles' },
  { key: 'Coffee', label: 'Beverages & Cafe', category: 'Food' },
  { key: 'Utensils', label: 'Kitchen & Dining', category: 'Living' },
  { key: 'BookOpen', label: 'Books & Stationery', category: 'Education' },
  { key: 'HeartPulse', label: 'Medical & Health', category: 'Personal Care' },
  { key: 'Boxes', label: 'Packaging & Logistics', category: 'Logistics' },
  { key: 'Layers', label: 'Raw Materials', category: 'Industrial' },
  { key: 'Tag', label: 'Special Clearance', category: 'Promotions' },
  { key: 'Package', label: 'Freight & Cargo', category: 'Logistics' },
  { key: 'ShieldCheck', label: 'Security & Safety', category: 'Security' },
  { key: 'Gamepad2', label: 'Gaming & Consoles', category: 'Entertainment' },
  { key: 'Camera', label: 'Photo & Video', category: 'Technology' },
  { key: 'Watch', label: 'Watches & Precision', category: 'Fashion' },
  { key: 'Headphones', label: 'Audio & Acoustics', category: 'Electronics' },
  { key: 'Zap', label: 'Power & Renewables', category: 'Energy' },
  { key: 'Flame', label: 'Trending & Deals', category: 'Promotions' },
  { key: 'ShoppingBag', label: 'Retail & Consumer', category: 'Lifestyle' },
  { key: 'MoreHorizontal', label: 'More Categories', category: 'General' },
];

/**
 * Loads current stored departments or initializes from defaults
 */
export function getStoredDepartments(): CategoryItem[] {
  if (typeof window === 'undefined') {
    return CATEGORIES;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(CATEGORIES));
      return CATEGORIES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    // If empty array or invalid, restore defaults
    localStorage.setItem(STORAGE_KEY, JSON.stringify(CATEGORIES));
    return CATEGORIES;
  } catch (err) {
    console.error('Failed to parse stored departments from localStorage:', err);
    return CATEGORIES;
  }
}

/**
 * Saves departments to localStorage and broadcasts update event
 */
export function saveDepartments(departments: CategoryItem[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(departments));
    window.dispatchEvent(
      new CustomEvent(DEPARTMENTS_EVENT, { detail: departments })
    );
  } catch (err) {
    console.error('Failed to save departments to localStorage:', err);
  }
}

/**
 * Creates a URL-friendly slug ID from a department name
 */
export function slugifyDepartmentName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Adds a new department to the list
 */
export function addDepartment(dept: Omit<CategoryItem, 'id'> & { id?: string }): CategoryItem {
  const current = getStoredDepartments();
  const id = dept.id && dept.id.trim()
    ? dept.id.trim()
    : `dept-${slugifyDepartmentName(dept.name) || Date.now()}`;

  // Ensure unique ID
  let uniqueId = id;
  let counter = 1;
  while (current.some((d) => d.id === uniqueId)) {
    uniqueId = `${id}-${counter++}`;
  }

  const newDepartment: CategoryItem = {
    id: uniqueId,
    name: dept.name.trim(),
    nameSi: dept.nameSi ? dept.nameSi.trim() : undefined,
    iconName: dept.iconName || 'FolderTree',
    itemCount: typeof dept.itemCount === 'number' && !isNaN(dept.itemCount) ? dept.itemCount : 100,
    subcategories: Array.isArray(dept.subcategories) ? dept.subcategories.filter(s => !!s.trim()) : [],
    subcategoriesSi: Array.isArray(dept.subcategoriesSi) ? dept.subcategoriesSi.filter(s => !!s.trim()) : undefined,
  };

  const updated = [...current, newDepartment];
  saveDepartments(updated);
  return newDepartment;
}

/**
 * Updates an existing department
 */
export function updateDepartment(id: string, updates: Partial<CategoryItem>): CategoryItem | null {
  const current = getStoredDepartments();
  const index = current.findIndex((d) => d.id === id);
  if (index === -1) return null;

  const target = current[index];
  const updatedDept: CategoryItem = {
    ...target,
    ...updates,
    id: target.id, // Never change primary ID
    name: updates.name ? updates.name.trim() : target.name,
    nameSi: updates.nameSi !== undefined ? updates.nameSi.trim() || undefined : target.nameSi,
    iconName: updates.iconName || target.iconName,
    itemCount: typeof updates.itemCount === 'number' ? updates.itemCount : target.itemCount,
    subcategories: Array.isArray(updates.subcategories)
      ? updates.subcategories.filter(s => !!s.trim())
      : target.subcategories,
    subcategoriesSi: Array.isArray(updates.subcategoriesSi)
      ? updates.subcategoriesSi.filter(s => !!s.trim())
      : target.subcategoriesSi,
  };

  current[index] = updatedDept;
  saveDepartments(current);
  return updatedDept;
}

/**
 * Removes a department by ID
 */
export function deleteDepartment(id: string): boolean {
  const current = getStoredDepartments();
  const filtered = current.filter((d) => d.id !== id);
  if (filtered.length === current.length) return false;

  saveDepartments(filtered);
  return true;
}

/**
 * Reorders departments by moving item from startIndex to endIndex
 */
export function reorderDepartments(startIndex: number, endIndex: number): CategoryItem[] {
  const current = [...getStoredDepartments()];
  if (
    startIndex < 0 ||
    startIndex >= current.length ||
    endIndex < 0 ||
    endIndex >= current.length
  ) {
    return current;
  }

  const [removed] = current.splice(startIndex, 1);
  current.splice(endIndex, 0, removed);
  saveDepartments(current);
  return current;
}

/**
 * Resets departments back to the initial default catalog
 */
export function resetDepartmentsToDefault(): CategoryItem[] {
  saveDepartments(CATEGORIES);
  return CATEGORIES;
}

/**
 * Adds a subcategory to an existing department
 */
export function addSubcategoryToDepartment(
  deptId: string,
  subcategory: string,
  subcategorySi?: string
): CategoryItem | null {
  const current = getStoredDepartments();
  const dept = current.find((d) => d.id === deptId);
  if (!dept) return null;

  const trimmed = subcategory.trim();
  if (!trimmed) return dept;

  const newSubs = dept.subcategories.includes(trimmed)
    ? dept.subcategories
    : [...dept.subcategories, trimmed];

  let newSubsSi = dept.subcategoriesSi;
  if (subcategorySi && subcategorySi.trim()) {
    newSubsSi = newSubsSi ? [...newSubsSi, subcategorySi.trim()] : [subcategorySi.trim()];
  }

  return updateDepartment(deptId, {
    subcategories: newSubs,
    subcategoriesSi: newSubsSi,
  });
}

/**
 * Removes a subcategory from an existing department
 */
export function removeSubcategoryFromDepartment(
  deptId: string,
  subIndex: number
): CategoryItem | null {
  const current = getStoredDepartments();
  const dept = current.find((d) => d.id === deptId);
  if (!dept) return null;

  const newSubs = [...dept.subcategories];
  newSubs.splice(subIndex, 1);

  let newSubsSi = dept.subcategoriesSi ? [...dept.subcategoriesSi] : undefined;
  if (newSubsSi && newSubsSi.length > subIndex) {
    newSubsSi.splice(subIndex, 1);
  }

  return updateDepartment(deptId, {
    subcategories: newSubs,
    subcategoriesSi: newSubsSi,
  });
}

/**
 * Subscribes to real-time department updates across tabs and components
 */
export function subscribeToDepartments(callback: (departments: CategoryItem[]) => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleCustomEvent = (e: Event) => {
    const custom = e as CustomEvent<CategoryItem[]>;
    if (custom.detail) {
      callback(custom.detail);
    } else {
      callback(getStoredDepartments());
    }
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback(getStoredDepartments());
    }
  };

  window.addEventListener(DEPARTMENTS_EVENT, handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    window.removeEventListener(DEPARTMENTS_EVENT, handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
  };
}
