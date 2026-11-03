import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  DollarSign,
  Tag,
  Package,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  Palette,
  FileText,
  RotateCcw,
  Upload,
  Link as LinkIcon,
  HelpCircle,
  Eye,
  Sliders,
  ShieldCheck,
  Building2,
  ChevronRight,
  Info,
  Pencil,
  Check
} from 'lucide-react';
import { Product, Currency, Language, CategoryItem } from '../../types/marketplace';
import { getStoredDepartments } from '../../services/departmentService';
import { addProduct, updateProduct, generateProductSKU } from '../../services/productService';
import { ProductImageRenderer } from '../Images/ProductImageRenderer';
import { DepartmentIcon } from '../Common/DepartmentIcon';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductCreated: (product: Product) => void;
  onProductUpdated?: (product: Product) => void;
  productToEdit?: Product | null;
  currency: Currency;
  language?: Language;
}

// Preset visual gallery catalog
const IMAGE_PRESETS = [
  { id: 'PinkArmchair', label: 'Pink Lounge Chair', category: 'Furniture' },
  { id: 'CeramicVase', label: 'Ceramic Bloom Vase', category: 'Home & Decor' },
  { id: 'Ottoman', label: 'Grey Ottoman Stool', category: 'Furniture' },
  { id: 'RedPillow', label: 'Red Embroidered Pillow', category: 'Textiles' },
  { id: 'YellowSwivelChair', label: 'Yellow Swivel Chair', category: 'Furniture' },
  { id: 'Wardrobe', label: 'Oak Tall Wardrobe', category: 'Furniture' },
  { id: 'YellowDuck', label: 'Ceramic Art Ducks', category: 'Home & Decor' },
  { id: 'Nightstand', label: 'Oak Bedside Table', category: 'Furniture' },
  { id: 'Bedding', label: 'Jacquard Linen Bedding', category: 'Textiles' },
  { id: 'PlantStand', label: 'Mid-Century Plant Stand', category: 'Home & Decor' },
  { id: 'Laptop', label: 'Quad-Core Pro Laptop', category: 'Electronics' },
  { id: 'Headphones', label: 'Studio ANC Headphones', category: 'Electronics' },
  { id: 'Smartwatch', label: 'AMOLED Smartwatch', category: 'Electronics' },
  { id: 'Phone', label: 'Dual-SIM 5G Smartphone', category: 'Electronics' },
];

const VENDOR_PRESETS = [
  'Nordic Living Studio',
  'Direct Tech Co.',
  'Zenith Craftworks',
  'Apex Tools Mfg',
  'Bella Natural Furnishings',
  'EcoTextiles Ltd',
  'Ceylon Artisan Guild',
];

const BADGE_PRESETS = [
  { en: 'HOT DEAL', si: 'විශේෂ දීමනාව', color: '#ea580c' },
  { en: 'BEST SELLER', si: 'වැඩිම අලෙවිය', color: '#059669' },
  { en: 'NEW ARRIVAL', si: 'අලුත්ම පැමිණීම්', color: '#0284c7' },
  { en: 'CLEARANCE', si: 'තොග නිෂ්කාශනය', color: '#e11d48' },
  { en: 'WHOLESALE EXCLUSIVE', si: 'තොග වෙළඳ විශේෂ', color: '#7c3aed' },
  { en: 'ECO FRIENDLY', si: 'පරිසර හිතකාමී', color: '#16a34a' },
];

const COLOR_SWATCH_PRESETS = [
  { name: 'Rose Pink', hex: '#f43f5e' },
  { name: 'Coral Orange', hex: '#ea580c' },
  { name: 'Amber Gold', hex: '#f59e0b' },
  { name: 'Emerald Green', hex: '#10b981' },
  { name: 'Sky Blue', hex: '#0284c7' },
  { name: 'Royal Navy', hex: '#1e3a8a' },
  { name: 'Charcoal Slate', hex: '#334155' },
  { name: 'Warm Cream', hex: '#fef08a' },
  { name: 'Pure White', hex: '#ffffff' },
  { name: 'Deep Black', hex: '#0f172a' },
];

type FormTab = 'basics' | 'pricing' | 'media' | 'variants' | 'specs';

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onProductCreated,
  onProductUpdated,
  productToEdit,
  currency,
  language = 'en',
}) => {
  const isEditMode = Boolean(productToEdit);
  const [activeTab, setActiveTab] = useState<FormTab>('basics');
  const [departments, setDepartments] = useState<CategoryItem[]>([]);

  // Form Fields State
  const [name, setName] = useState('');
  const [nameSi, setNameSi] = useState('');
  const [category, setCategory] = useState('Furniture');
  const [categorySi, setCategorySi] = useState('ගෘහ භාණ්ඩ');
  const [subcategory, setSubcategory] = useState('');
  const [subcategorySi, setSubcategorySi] = useState('');
  const [vendor, setVendor] = useState('Nordic Living Studio');
  const [vendorSi, setVendorSi] = useState('');
  const [sku, setSku] = useState('');

  // Pricing & Stock
  const [price, setPrice] = useState<number>(39.99);
  const [originalPrice, setOriginalPrice] = useState<number>(59.99);
  const [stock, setStock] = useState<number>(45);
  const [isDailyDeal, setIsDailyDeal] = useState<boolean>(false);
  const [dealHours, setDealHours] = useState<number>(48);

  // Media
  const [imageType, setImageType] = useState<'preset' | 'url' | 'upload'>('preset');
  const [imageUrl, setImageUrl] = useState<string>('PinkArmchair');
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [imageAlt, setImageAlt] = useState<string>('');

  // Badges & Variants
  const [badge, setBadge] = useState<string>('HOT DEAL');
  const [badgeSi, setBadgeSi] = useState<string>('විශේෂ දීමනාව');
  const [customBadgeText, setCustomBadgeText] = useState('');
  const [selectedColors, setSelectedColors] = useState<string[]>(['Rose Pink', 'Charcoal Slate']);
  const [customColorName, setCustomColorName] = useState('');

  // Specifications
  const [specsList, setSpecsList] = useState<{ key: string; value: string }[]>([
    { key: 'Material', value: 'High-density Molded Foam & European Beech Wood' },
    { key: 'Dimensions', value: '78 x 72 x 84 cm' },
    { key: 'Weight', value: '8.4 kg' },
    { key: 'Warranty', value: '2-Year Commercial Manufacturer Guarantee' },
  ]);

  // Description
  const [description, setDescription] = useState(
    'Precision-engineered commercial marketplace grade construction. Designed for high-frequency retail display or contract interior spaces.'
  );
  const [descriptionSi, setDescriptionSi] = useState(
    'නවීන සුවපහසුව සහ කල්පැවැත්ම සහිත උසස් ප්‍රමිතියේ නිෂ්පාදනයකි. ඕනෑම කාර්යාල හෝ නිවාස පරිසරයකට ගැලපේ.'
  );

  // Currency helpers
  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';
  const currencyRate = currency === 'USD' ? 1 : currency === 'EUR' ? 0.92 : 0.79;

  // Load departments dynamically & populate form
  useEffect(() => {
    if (isOpen) {
      const stored = getStoredDepartments();
      setDepartments(stored);

      if (productToEdit) {
        // Pre-fill existing product for editing
        setName(productToEdit.name || '');
        setNameSi(productToEdit.nameSi || '');
        setCategory(productToEdit.category || (stored[0]?.name || 'Furniture'));
        setCategorySi(productToEdit.categorySi || (stored[0]?.nameSi || 'ගෘහ භාණ්ඩ'));
        setSubcategory(productToEdit.subcategory || '');
        setSubcategorySi(productToEdit.subcategorySi || '');
        setVendor(productToEdit.vendor || 'Nordic Living Studio');
        setVendorSi(productToEdit.vendorSi || '');
        setSku(productToEdit.id || '');
        setPrice(productToEdit.price || 9.99);
        setOriginalPrice(productToEdit.originalPrice || productToEdit.price || 9.99);
        setStock(productToEdit.stock ?? 20);
        setIsDailyDeal(Boolean(productToEdit.isDailyDeal));
        setDealHours(48);

        const img = productToEdit.imageUrl || 'PinkArmchair';
        setImageUrl(img);
        setImageAlt(productToEdit.imageAlt || productToEdit.name || '');
        if (img.startsWith('http://') || img.startsWith('https://')) {
          setImageType('url');
          setCustomUrlInput(img);
        } else if (img.startsWith('data:')) {
          setImageType('upload');
        } else {
          setImageType('preset');
        }

        setBadge(productToEdit.badge || '');
        setBadgeSi(productToEdit.badgeSi || '');
        setCustomBadgeText(productToEdit.badge || '');

        setSelectedColors(
          productToEdit.colors && productToEdit.colors.length > 0
            ? productToEdit.colors
            : ['Rose Pink', 'Charcoal Slate']
        );

        if (productToEdit.specs && Object.keys(productToEdit.specs).length > 0) {
          setSpecsList(
            Object.entries(productToEdit.specs).map(([key, value]) => ({ key, value }))
          );
        } else {
          setSpecsList([
            { key: 'Material', value: 'High-density Molded Foam & European Beech Wood' },
            { key: 'Dimensions', value: '78 x 72 x 84 cm' },
            { key: 'Weight', value: '8.4 kg' },
            { key: 'Warranty', value: '2-Year Commercial Manufacturer Guarantee' },
          ]);
        }

        setDescription(productToEdit.description || '');
        setDescriptionSi(productToEdit.descriptionSi || '');
      } else {
        // Reset to initial new product state
        setName('');
        setNameSi('');
        const initialCat = stored[0]?.name || 'Furniture';
        setCategory(initialCat);
        setCategorySi(stored[0]?.nameSi || 'ගෘහ භාණ්ඩ');
        setSubcategory(stored[0]?.subcategories?.[0] || '');
        setSubcategorySi(stored[0]?.subcategoriesSi?.[0] || '');
        setVendor('Nordic Living Studio');
        setVendorSi('');
        setSku(generateProductSKU(initialCat));
        setPrice(39.99);
        setOriginalPrice(59.99);
        setStock(45);
        setIsDailyDeal(false);
        setDealHours(48);
        setImageType('preset');
        setImageUrl('PinkArmchair');
        setCustomUrlInput('');
        setImageAlt('');
        setBadge('HOT DEAL');
        setBadgeSi('විශේෂ දීමනාව');
        setCustomBadgeText('');
        setSelectedColors(['Rose Pink', 'Charcoal Slate']);
        setSpecsList([
          { key: 'Material', value: 'High-density Molded Foam & European Beech Wood' },
          { key: 'Dimensions', value: '78 x 72 x 84 cm' },
          { key: 'Weight', value: '8.4 kg' },
          { key: 'Warranty', value: '2-Year Commercial Manufacturer Guarantee' },
        ]);
        setDescription(
          'Precision-engineered commercial marketplace grade construction. Designed for high-frequency retail display or contract interior spaces.'
        );
        setDescriptionSi(
          'නවීන සුවපහසුව සහ කල්පැවැත්ම සහිත උසස් ප්‍රමිතියේ නිෂ්පාදනයකි. ඕනෑම කාර්යාල හෝ නිවාස පරිසරයකට ගැලපේ.'
        );
      }
    }
  }, [isOpen, productToEdit]);

  // Synchronize category Sinhala when category changes
  const handleCategorySelect = (deptName: string) => {
    setCategory(deptName);
    const found = departments.find((d) => d.name === deptName);
    if (found) {
      setCategorySi(found.nameSi || deptName);
      if (found.subcategories && found.subcategories.length > 0) {
        setSubcategory(found.subcategories[0]);
        setSubcategorySi(found.subcategoriesSi?.[0] || found.subcategories[0]);
      } else {
        setSubcategory('');
        setSubcategorySi('');
      }
    }
    setSku(generateProductSKU(deptName));
  };

  const handleSubcategorySelect = (subName: string) => {
    setSubcategory(subName);
    const dept = departments.find((d) => d.name === category);
    if (dept && dept.subcategories) {
      const idx = dept.subcategories.indexOf(subName);
      if (idx !== -1 && dept.subcategoriesSi?.[idx]) {
        setSubcategorySi(dept.subcategoriesSi[idx]);
      } else {
        setSubcategorySi(subName);
      }
    }
  };

  // Auto calculate discount percentage
  const discountPercent =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : undefined;

  // Add Spec Row
  const handleAddSpecRow = () => {
    setSpecsList([...specsList, { key: '', value: '' }]);
  };

  const handleUpdateSpec = (idx: number, field: 'key' | 'value', text: string) => {
    const next = [...specsList];
    next[idx][field] = text;
    setSpecsList(next);
  };

  const handleRemoveSpec = (idx: number) => {
    setSpecsList(specsList.filter((_, i) => i !== idx));
  };

  // File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const resultStr = event.target.result as string;
          setImageUrl(resultStr);
          setImageType('upload');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle Color
  const handleToggleColor = (colorName: string) => {
    if (selectedColors.includes(colorName)) {
      setSelectedColors(selectedColors.filter((c) => c !== colorName));
    } else {
      setSelectedColors([...selectedColors, colorName]);
    }
  };

  const handleAddCustomColor = () => {
    if (customColorName.trim() && !selectedColors.includes(customColorName.trim())) {
      setSelectedColors([...selectedColors, customColorName.trim()]);
      setCustomColorName('');
    }
  };

  // Quick Demo Template Loader
  const handleLoadDemoTemplate = (type: 'furniture' | 'electronics' | 'tools') => {
    if (type === 'furniture') {
      setName('Nordic Minimalist Oak Dining Armchair');
      setNameSi('නෝර්ඩික් ඕක් කෑම මේස අත්පුටුව');
      setCategory('Furniture');
      setCategorySi('ගෘහ භාණ්ඩ');
      setSubcategory('Dining Chairs');
      setPrice(79.99);
      setOriginalPrice(119.99);
      setStock(35);
      setImageUrl('PinkArmchair');
      setImageType('preset');
      setVendor('Nordic Living Studio');
      setBadge('HOT DEAL');
      setSelectedColors(['Warm Cream', 'Charcoal Slate', 'Emerald Green']);
      setIsDailyDeal(true);
      setSpecsList([
        { key: 'Frame', value: 'FSC-Certified Solid European Oak' },
        { key: 'Upholstery', value: 'High-Resilience Linen Fabric' },
        { key: 'Weight Capacity', value: '150 kg (330 lbs)' },
        { key: 'Warranty', value: '5 Years Structural' },
      ]);
    } else if (type === 'electronics') {
      setName('SonicWave Active Noise-Cancelling Wireless Headphones');
      setNameSi('සොනික්වේව් රැහැන් රහිත හෙඩ්ෆෝන්');
      setCategory('Electronics');
      setCategorySi('ඉලෙක්ට්‍රොනික උපාංග');
      setSubcategory('Audio & Sound');
      setPrice(89.5);
      setOriginalPrice(149.0);
      setStock(60);
      setImageUrl('Headphones');
      setImageType('preset');
      setVendor('Direct Tech Co.');
      setBadge('BEST SELLER');
      setSelectedColors(['Charcoal Slate', 'Pure White']);
      setIsDailyDeal(true);
      setSpecsList([
        { key: 'Battery Life', value: '40 Hours Playtime' },
        { key: 'Bluetooth', value: '5.3 Ultra-Low Latency' },
        { key: 'Drivers', value: '40mm Titanium Dynamic Drivers' },
        { key: 'Fast Charging', value: '10 min for 5 hours' },
      ]);
    } else {
      setName('ApexPro 20V Cordless Brushless Hammer Drill Set');
      setNameSi('ඇපෙක්ස්ප්‍රෝ 20V විදුලි ඩ්‍රිල් කට්ටලය');
      setCategory('Industrial Parts & Tools');
      setCategorySi('කාර්මික අමතර කොටස් සහ මෙවලම්');
      setSubcategory('Power Drills');
      setPrice(129.0);
      setOriginalPrice(185.0);
      setStock(24);
      setImageUrl('Laptop');
      setImageType('preset');
      setVendor('Apex Tools Mfg');
      setBadge('WHOLESALE EXCLUSIVE');
      setSelectedColors(['Amber Gold', 'Charcoal Slate']);
      setIsDailyDeal(false);
      setSpecsList([
        { key: 'Motor', value: 'Brushless High-Torque 65Nm' },
        { key: 'Batteries', value: '2x 4.0Ah Lithium-Ion Packs' },
        { key: 'Chuck', value: '13mm All-Metal Keyless' },
        { key: 'Case', value: 'Heavy Duty Impact Resistant Carry Case' },
      ]);
    }
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setActiveTab('basics');
      return;
    }

    const currentDept = departments.find((d) => d.name === category);

    // Build specs record
    const specsMap: { [key: string]: string } = {};
    specsList.forEach((s) => {
      if (s.key.trim() && s.value.trim()) {
        specsMap[s.key.trim()] = s.value.trim();
      }
    });

    if (isEditMode && productToEdit) {
      const updatedFields: Partial<Product> = {
        name: name.trim(),
        nameSi: nameSi.trim() || undefined,
        category: category,
        categorySi: categorySi || currentDept?.nameSi || undefined,
        subcategory: subcategory.trim() || undefined,
        subcategorySi: subcategorySi.trim() || undefined,
        price: price > 0 ? price : 9.99,
        originalPrice: originalPrice > price ? originalPrice : undefined,
        discountPercent: discountPercent,
        imageUrl: imageUrl.trim() || 'PinkArmchair',
        imageAlt: imageAlt.trim() || name.trim(),
        badge: badge || undefined,
        badgeSi: badgeSi || undefined,
        stock: stock >= 0 ? stock : 50,
        description: description.trim() || 'Quality manufactured marketplace item.',
        descriptionSi: descriptionSi.trim() || undefined,
        vendor: vendor.trim() || 'Nordic Living Studio',
        vendorSi: vendorSi.trim() || undefined,
        isDailyDeal: isDailyDeal,
        colors: selectedColors.length > 0 ? selectedColors : undefined,
        specs: Object.keys(specsMap).length > 0 ? specsMap : undefined,
      };

      const updated = updateProduct(productToEdit.id, updatedFields);
      if (updated && onProductUpdated) {
        onProductUpdated(updated);
      }
      onClose();
      return;
    }

    const newProduct: Product = {
      id: sku.trim() ? sku.trim().toLowerCase().replace(/\s+/g, '-') : `prod-${Date.now()}`,
      name: name.trim(),
      nameSi: nameSi.trim() || undefined,
      category: category,
      categorySi: categorySi || currentDept?.nameSi || undefined,
      subcategory: subcategory.trim() || undefined,
      subcategorySi: subcategorySi.trim() || undefined,
      price: price > 0 ? price : 9.99,
      originalPrice: originalPrice > price ? originalPrice : undefined,
      discountPercent: discountPercent,
      rating: 5.0,
      reviewsCount: 1,
      imageUrl: imageUrl.trim() || 'PinkArmchair',
      imageAlt: imageAlt.trim() || name.trim(),
      badge: badge || undefined,
      badgeSi: badgeSi || undefined,
      stock: stock >= 0 ? stock : 50,
      sold: 0,
      description: description.trim() || 'Quality manufactured marketplace item.',
      descriptionSi: descriptionSi.trim() || undefined,
      vendor: vendor.trim() || 'Nordic Living Studio',
      vendorSi: vendorSi.trim() || undefined,
      isDailyDeal: isDailyDeal,
      colors: selectedColors.length > 0 ? selectedColors : undefined,
      specs: Object.keys(specsMap).length > 0 ? specsMap : undefined,
    };

    // Save persistent
    addProduct(newProduct);
    onProductCreated(newProduct);
    onClose();
  };

  if (!isOpen) return null;

  const currentDeptObj = departments.find((d) => d.name === category);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#0b1120] text-slate-100 rounded-2xl border border-slate-800 shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* MODAL HEADER */}
        <div className="px-6 py-4 bg-[#11192d] border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md ${
              isEditMode ? 'bg-gradient-to-tr from-amber-600 to-orange-500' : 'bg-gradient-to-tr from-[#ea580c] to-amber-500'
            }`}>
              {isEditMode ? <Pencil className="w-5 h-5 stroke-[2.5]" /> : <Plus className="w-5 h-5 stroke-[2.5]" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white font-display uppercase tracking-wide truncate max-w-xl">
                  {isEditMode
                    ? (language === 'si' ? `නිෂ්පාදනය සංස්කරණය: ${productToEdit?.name}` : `Edit Product: ${productToEdit?.name}`)
                    : (language === 'si' ? 'නව නිෂ්පාදනයක් එක් කරන්න' : 'Add New Product & Taxonomy Customizer')}
                </h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                  isEditMode
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                }`}>
                  {isEditMode ? 'EDIT MODE' : 'CATALOG MANAGER'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isEditMode
                  ? 'Update live pricing, department classification, media assets, inventory levels, and technical specs'
                  : 'Full-spectrum product specification, category mapping, visual asset configuration, and live storefront preview'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Demo Templates */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded-lg p-1 text-[11px]">
              <span className="text-slate-400 px-2 font-display">Templates:</span>
              <button
                type="button"
                onClick={() => handleLoadDemoTemplate('furniture')}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded hover:text-white transition-colors cursor-pointer"
              >
                🛋️ Furniture
              </button>
              <button
                type="button"
                onClick={() => handleLoadDemoTemplate('electronics')}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded hover:text-white transition-colors cursor-pointer"
              >
                🎧 Tech
              </button>
              <button
                type="button"
                onClick={() => handleLoadDemoTemplate('tools')}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded hover:text-white transition-colors cursor-pointer"
              >
                🔧 Tools
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MODAL TABS NAVIGATION */}
        <div className="px-6 bg-[#0f172a] border-b border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0 text-xs">
          {[
            { id: 'basics', label: '1. Basics & Category', icon: Layers },
            { id: 'pricing', label: '2. Pricing & Stock', icon: DollarSign },
            { id: 'media', label: '3. Media & Imagery', icon: ImageIcon },
            { id: 'variants', label: '4. Colors & Badges', icon: Palette },
            { id: 'specs', label: '5. Specs & Copy', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as FormTab)}
                className={`py-3 px-3.5 font-bold font-display uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-[#ea580c] text-white bg-slate-800/40'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#ea580c]' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* MODAL BODY (2 Columns: Form Fields + Live Card Preview) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 p-6 gap-6">
          {/* LEFT 7-8 COLS: FORM TABS */}
          <form id="new-product-form" onSubmit={handleSubmit} className="lg:col-span-7 xl:col-span-8 space-y-5">
            {/* TAB 1: BASICS & CATEGORIZATION */}
            {activeTab === 'basics' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="bg-[#11192d] p-5 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                    <Layers className="w-4 h-4 text-orange-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                      Product Name & SKU Identification
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-slate-300 font-semibold block mb-1 text-xs">
                        Product Title (English) <span className="text-orange-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ergonomic Lumbar Mesh Executive Swivel Chair"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-slate-300 font-semibold block mb-1 text-xs">
                        Product Title (Sinhala / සිංහල)
                      </label>
                      <input
                        type="text"
                        value={nameSi}
                        onChange={(e) => setNameSi(e.target.value)}
                        placeholder="e.g. සුවපහසු විධායක කාර්යාල පුටුව"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-slate-300 font-semibold text-xs">
                          Catalog SKU / Unique ID
                        </label>
                        <button
                          type="button"
                          onClick={() => setSku(generateProductSKU(category))}
                          className="text-[10px] text-orange-400 hover:text-orange-300 font-mono flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Regenerate</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-amber-300 font-mono focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold block mb-1 text-xs">
                        Manufacturer / Vendor Brand
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={vendor}
                          onChange={(e) => setVendor(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                        >
                          {VENDOR_PRESETS.map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CATEGORY & DEPARTMENT TAXONOMY */}
                <div className="bg-[#11192d] p-5 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                        Marketplace Department & Subcategory Categorization
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {departments.length} Departments Configured
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Primary Department Selector */}
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1.5 text-xs">
                        Primary Department <span className="text-orange-400">*</span>
                      </label>
                      <select
                        value={category}
                        onChange={(e) => handleCategorySelect(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white font-medium focus:outline-none focus:border-orange-500"
                      >
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.name}>
                            {dept.name} ({dept.itemCount || 0} items)
                          </option>
                        ))}
                      </select>
                      <div className="mt-1.5 flex items-center gap-2 text-[11px] text-slate-400">
                        {currentDeptObj && (
                          <>
                            <DepartmentIcon iconName={currentDeptObj.iconName} className="w-3.5 h-3.5 text-orange-400" />
                            <span>Sinhala: <strong className="text-slate-200">{currentDeptObj.nameSi || currentDeptObj.name}</strong></span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Dynamic Subcategory Dropdown */}
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1.5 text-xs">
                        Target Subcategory Taxonomy
                      </label>
                      {currentDeptObj && currentDeptObj.subcategories && currentDeptObj.subcategories.length > 0 ? (
                        <select
                          value={subcategory}
                          onChange={(e) => handleSubcategorySelect(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                        >
                          <option value="">-- Select Subcategory --</option>
                          {currentDeptObj.subcategories.map((sub, idx) => (
                            <option key={sub} value={sub}>
                              {sub} {currentDeptObj.subcategoriesSi?.[idx] ? `(${currentDeptObj.subcategoriesSi[idx]})` : ''}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={subcategory}
                          onChange={(e) => setSubcategory(e.target.value)}
                          placeholder="e.g. Executive Furniture"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      )}
                      <p className="mt-1.5 text-[10px] text-slate-500">
                        Links product to mega-menu drilldown and filtered facet searches
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PRICING & INVENTORY */}
            {activeTab === 'pricing' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="bg-[#11192d] p-5 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                    <DollarSign className="w-4 h-4 text-orange-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                      Pricing Structure & Auto-Discount Rules
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1 text-xs">
                        Regular / Compare Price ($)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">
                          {currencySymbol}
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={originalPrice}
                          onChange={(e) => setOriginalPrice(parseFloat(e.target.value) || 0)}
                          className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 block">Baseline strike-through list price</span>
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold block mb-1 text-xs">
                        Sale / Selling Price ($) <span className="text-orange-400">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 font-mono font-bold text-xs">
                          {currencySymbol}
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          required
                          value={price}
                          onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                          className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-orange-400 font-mono font-bold focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 block">Final price charged at checkout</span>
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold block mb-1 text-xs">
                        Calculated Discount Tag
                      </label>
                      <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 flex items-center justify-between">
                        <span className="text-xs text-slate-300 font-mono">
                          {discountPercent && discountPercent > 0 ? `${discountPercent}% OFF` : 'None (Full Price)'}
                        </span>
                        {discountPercent && discountPercent > 0 && (
                          <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            SAVE ${(originalPrice - price).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* INVENTORY & DAILY DEAL TIMER */}
                <div className="bg-[#11192d] p-5 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                      Inventory Level & Daily Deal Promotion
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1 text-xs">
                        Available Stock Quantity <span className="text-orange-400">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={stock}
                        onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        Triggers low-stock warning ribbon when &lt; 10 units
                      </span>
                    </div>

                    {/* Daily Deal Toggle */}
                    <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="modalDailyDeal"
                            checked={isDailyDeal}
                            onChange={(e) => setIsDailyDeal(e.target.checked)}
                            className="w-4 h-4 accent-[#ea580c] cursor-pointer"
                          />
                          <label htmlFor="modalDailyDeal" className="text-xs font-bold text-white cursor-pointer select-none">
                            Featured Daily Deal
                          </label>
                        </div>
                        {isDailyDeal && (
                          <span className="text-[10px] bg-amber-500/10 text-amber-400 font-bold px-2 py-0.5 rounded-full border border-amber-500/20">
                            Countdown Active
                          </span>
                        )}
                      </div>

                      {isDailyDeal && (
                        <div className="pt-2 border-t border-slate-800 space-y-2">
                          <label className="text-[11px] text-slate-300 block">
                            Countdown Duration (Hours)
                          </label>
                          <div className="flex items-center gap-2">
                            {[12, 24, 48, 72].map((hrs) => (
                              <button
                                key={hrs}
                                type="button"
                                onClick={() => setDealHours(hrs)}
                                className={`px-2.5 py-1 rounded text-[11px] font-bold font-mono transition-colors cursor-pointer ${
                                  dealHours === hrs
                                    ? 'bg-[#ea580c] text-white'
                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                                }`}
                              >
                                {hrs}h
                              </button>
                            ))}
                          </div>
                          <p className="text-[10px] text-amber-300/80">
                            Pinnable to the prominent Daily Deals countdown carousel on the homepage
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: MEDIA & VISUAL ASSETS */}
            {activeTab === 'media' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="bg-[#11192d] p-5 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-orange-400" />
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                        Product Visual Asset & Imagery
                      </h3>
                    </div>

                    {/* Mode Switcher */}
                    <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setImageType('preset')}
                        className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
                          imageType === 'preset' ? 'bg-[#ea580c] text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Presets Library
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageType('url')}
                        className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
                          imageType === 'url' ? 'bg-[#ea580c] text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Web URL
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageType('upload')}
                        className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
                          imageType === 'upload' ? 'bg-[#ea580c] text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Upload
                      </button>
                    </div>
                  </div>

                  {/* 1. Presets Library Grid */}
                  {imageType === 'preset' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
                        {IMAGE_PRESETS.map((preset) => {
                          const isSelected = imageUrl === preset.id;
                          return (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => {
                                setImageUrl(preset.id);
                                setImageAlt(preset.label);
                              }}
                              className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center cursor-pointer group ${
                                isSelected
                                  ? 'border-[#ea580c] bg-orange-500/10 shadow-sm ring-1 ring-orange-500'
                                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                              }`}
                            >
                              <div className="w-12 h-12 rounded-lg bg-slate-800/80 p-1 flex items-center justify-center overflow-hidden">
                                <ProductImageRenderer name={preset.id} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                              </div>
                              <span className="text-[10px] font-bold text-slate-200 line-clamp-1">
                                {preset.label}
                              </span>
                              <span className="text-[9px] text-slate-500 font-mono">
                                {preset.category}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 2. Web URL Input */}
                  {imageType === 'url' && (
                    <div className="space-y-3">
                      <label className="text-slate-300 font-semibold block text-xs">
                        Image Direct Web URL (HTTPS)
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="url"
                            value={customUrlInput}
                            onChange={(e) => setCustomUrlInput(e.target.value)}
                            placeholder="https://images.unsplash.com/photo-..."
                            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (customUrlInput.trim()) {
                              setImageUrl(customUrlInput.trim());
                            }
                          }}
                          className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Apply URL
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Supports high-resolution CDN images, Unsplash, Cloudinary, or any valid public URL.
                      </p>
                    </div>
                  )}

                  {/* 3. Device Upload */}
                  {imageType === 'upload' && (
                    <div className="space-y-3">
                      <label className="text-slate-300 font-semibold block text-xs">
                        Select Local Image File (PNG, JPG, WebP)
                      </label>
                      <label className="border-2 border-dashed border-slate-700 hover:border-orange-500 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-slate-900/40">
                        <Upload className="w-6 h-6 text-orange-400" />
                        <span className="text-xs text-slate-200 font-semibold">
                          Click to browse and upload product photo
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Instant base64 data encoding for persistent preview
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}

                  {/* Image Alt */}
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1 text-xs">
                      Image Accessibility Alt Text
                    </label>
                    <input
                      type="text"
                      value={imageAlt}
                      onChange={(e) => setImageAlt(e.target.value)}
                      placeholder="e.g. Front view of pink bucket lounge chair with solid wooden legs"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: COLORS & BADGES */}
            {activeTab === 'variants' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {/* Visual Ribbon Badge */}
                <div className="bg-[#11192d] p-5 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                    <Tag className="w-4 h-4 text-orange-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                      Merchandising Badge & Promo Ribbon
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1.5 text-xs">
                        Select Preset Merchandising Badge
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {BADGE_PRESETS.map((b) => (
                          <button
                            key={b.en}
                            type="button"
                            onClick={() => {
                              setBadge(b.en);
                              setBadgeSi(b.si);
                            }}
                            className={`px-3 py-2 rounded-lg text-[11px] font-bold uppercase transition-all flex items-center justify-between border cursor-pointer ${
                              badge === b.en
                                ? 'bg-orange-500 text-white border-orange-400 shadow-sm'
                                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <span>{b.en}</span>
                            {badge === b.en && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-slate-300 font-semibold block mb-1 text-xs">
                          Custom Badge Text (Optional Override)
                        </label>
                        <input
                          type="text"
                          value={customBadgeText}
                          onChange={(e) => {
                            setCustomBadgeText(e.target.value);
                            setBadge(e.target.value);
                          }}
                          placeholder="e.g. EXCLUSIVE 50% OFF"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white uppercase font-mono focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 font-semibold block mb-1 text-xs">
                          Badge Sinhala (සිංහල ලේබලය)
                        </label>
                        <input
                          type="text"
                          value={badgeSi}
                          onChange={(e) => setBadgeSi(e.target.value)}
                          placeholder="e.g. විශේෂ දීමනාව"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Color Variants */}
                <div className="bg-[#11192d] p-5 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-orange-400" />
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                        Color Variants Palette ({selectedColors.length} selected)
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {COLOR_SWATCH_PRESETS.map((swatch) => {
                      const isSelected = selectedColors.includes(swatch.name);
                      return (
                        <button
                          key={swatch.name}
                          type="button"
                          onClick={() => handleToggleColor(swatch.name)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-slate-800 border-orange-500 text-white shadow-xs'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/30 shadow-xs"
                            style={{ backgroundColor: swatch.hex }}
                          />
                          <span>{swatch.name}</span>
                          {isSelected && <CheckCircle2 className="w-3 h-3 text-orange-400" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Add Custom Color */}
                  <div className="pt-2 flex items-center gap-2 max-w-sm">
                    <input
                      type="text"
                      value={customColorName}
                      onChange={(e) => setCustomColorName(e.target.value)}
                      placeholder="Add custom color (e.g. Walnut Brown)..."
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomColor}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: SPECS & DESCRIPTIONS */}
            {activeTab === 'specs' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {/* Dynamic Specifications Key-Value */}
                <div className="bg-[#11192d] p-5 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-orange-400" />
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                        Technical Specifications & Attribute Matrix
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSpecRow}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-orange-400 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Row</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {specsList.map((spec, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={spec.key}
                          onChange={(e) => handleUpdateSpec(idx, 'key', e.target.value)}
                          placeholder="Spec Name (e.g. Material, Voltage)"
                          className="w-1/3 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                        />
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => handleUpdateSpec(idx, 'value', e.target.value)}
                          placeholder="Spec Value (e.g. High-density foam, 220V)"
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSpec(idx)}
                          className="w-7 h-7 rounded bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rich Descriptions (EN & SI) */}
                <div className="bg-[#11192d] p-5 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                    <FileText className="w-4 h-4 text-orange-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                      Bilingual Product Descriptions
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1 text-xs">
                        Marketplace Description (English)
                      </label>
                      <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Detailed information regarding durability, certification, wholesale pack sizes, and warranty."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold block mb-1 text-xs">
                        විස්තරය (Sinhala / සිංහල)
                      </label>
                      <textarea
                        rows={2}
                        value={descriptionSi}
                        onChange={(e) => setDescriptionSi(e.target.value)}
                        placeholder="නිෂ්පාදනය පිළිබඳ සම්පූර්ණ විස්තරය මෙහි සටහන් කරන්න..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>

          {/* RIGHT 4-5 COLS: LIVE STOREFRONT PRODUCT CARD PREVIEW */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4">
            <div className="bg-[#11192d] p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white font-display uppercase tracking-wider">
                  Live Storefront Preview
                </span>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                Instant Reactive
              </span>
            </div>

            {/* REALISTIC STOREFRONT CARD */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-md p-4 flex flex-col justify-between text-slate-800 relative group overflow-hidden">
              {/* Top Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                {badge ? (
                  <span className="bg-[#ea580c] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-xs font-display">
                    {badge}
                  </span>
                ) : (
                  <span />
                )}

                {isDailyDeal && (
                  <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-600" />
                    <span>{dealHours}h DEAL</span>
                  </span>
                )}
              </div>

              {/* Product Image Stage */}
              <div className="w-full h-44 bg-slate-50 rounded-lg flex items-center justify-center p-3 relative overflow-hidden mb-3 border border-slate-100">
                <ProductImageRenderer name={imageUrl} className="w-full h-full object-contain" />
              </div>

              {/* Category & Vendor */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                <span className="font-semibold text-orange-600 uppercase tracking-wider text-[10px]">
                  {category} {subcategory ? `› ${subcategory}` : ''}
                </span>
                <span className="font-medium truncate max-w-[120px]">{vendor}</span>
              </div>

              {/* Product Title */}
              <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug mb-2 font-display">
                {name || 'Product Title Preview...'}
              </h4>

              {/* Rating & Stock */}
              <div className="flex items-center justify-between mb-3 text-xs">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <span>★ 5.0</span>
                  <span className="text-slate-400 text-[11px] font-normal">(1 review)</span>
                </div>
                <div className="text-[11px] font-mono">
                  {stock > 0 ? (
                    <span className="text-emerald-700 font-semibold">{stock} units left</span>
                  ) : (
                    <span className="text-red-500 font-bold">Out of Stock</span>
                  )}
                </div>
              </div>

              {/* Pricing Box */}
              <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-black text-[#ea580c] font-mono">
                    {currencySymbol}{(price * currencyRate).toFixed(2)}
                  </span>
                  {originalPrice > price && (
                    <span className="text-xs text-slate-400 line-through font-mono">
                      {currencySymbol}{(originalPrice * currencyRate).toFixed(2)}
                    </span>
                  )}
                </div>
                {discountPercent && discountPercent > 0 && (
                  <span className="text-[10px] font-bold bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded">
                    -{discountPercent}%
                  </span>
                )}
              </div>

              {/* Available Colors */}
              {selectedColors.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1 text-[11px] text-slate-500">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Colors:</span>
                  <div className="flex items-center gap-1 flex-wrap">
                    {selectedColors.slice(0, 4).map((c) => (
                      <span key={c} className="text-[10px] bg-slate-100 px-1.5 py-0.2 rounded text-slate-700 font-medium">
                        {c}
                      </span>
                    ))}
                    {selectedColors.length > 4 && (
                      <span className="text-[9px] text-slate-400">+{selectedColors.length - 4}</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Metrics & Validation Check */}
            <div className="bg-[#11192d] p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Catalog SKU:</span>
                <span className="font-mono text-amber-300 font-bold">{sku || 'AUTO-GENERATED'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Taxonomy Path:</span>
                <span className="text-slate-200 font-medium truncate max-w-[180px]">
                  {category} / {subcategory || 'General'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Specs defined:</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {specsList.filter((s) => s.key && s.value).length} attributes
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-4 bg-[#11192d] border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Product will be immediately available across storefront search, category facets, and admin inventory.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="new-product-form"
              className="px-6 py-2.5 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer font-display hover:scale-[1.02] active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isEditMode
                  ? (language === 'si' ? 'වෙනස්කම් යාවත්කාලීන කරන්න' : 'Save & Update Product')
                  : (language === 'si' ? 'නිෂ්පාදනය ප්‍රකාශයට පත් කරන්න' : 'Publish Product to Catalog')}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
