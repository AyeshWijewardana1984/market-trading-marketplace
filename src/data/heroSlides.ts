import { HeroSlideItem } from '../types/marketplace';
import { PHOTO_PATHS } from '../components/Images/ProductImageRenderer';

export interface HeroImagePreset {
  id: string;
  title: string;
  category: string;
  path: string;
}

export const HERO_IMAGE_PRESETS: HeroImagePreset[] = [
  {
    id: 'sofa',
    title: 'Modern Living & Office Lounge',
    category: 'Furniture',
    path: PHOTO_PATHS.heroSofa,
  },
  {
    id: 'nordic',
    title: 'Scandinavian Minimalist Atelier',
    category: 'Living',
    path: PHOTO_PATHS.heroLiving,
  },
  {
    id: 'workspace',
    title: 'Executive Ergonomic Workspace',
    category: 'Office',
    path: PHOTO_PATHS.heroOffice,
  },
  {
    id: 'armchair',
    title: 'Contemporary Grey Armchair Lounge',
    category: 'Furniture',
    path: PHOTO_PATHS.greyArmchair,
  },
  {
    id: 'pinkchair',
    title: 'Nordic Pink Bucket Accent Chair',
    category: 'Accent Chairs',
    path: PHOTO_PATHS.pinkArmchair,
  },
  {
    id: 'textiles',
    title: 'Luxury Jacquard Knitted Textiles',
    category: 'Home Textiles',
    path: PHOTO_PATHS.jacquardTowels,
  },
  {
    id: 'pillows',
    title: 'Bohemian Velvet Cushion Stack',
    category: 'Accessories',
    path: PHOTO_PATHS.colorfulPillows,
  },
  {
    id: 'electronics',
    title: 'High-Tech Consumer Electronics Desk',
    category: 'Electronics',
    path: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80',
  },
];

export const INITIAL_HERO_SLIDES: HeroSlideItem[] = [
  {
    id: 1,
    category: 'Office & Living Collection',
    categorySi: 'කාර්යාල සහ නිවාස එකතුව',
    badge: 'HOT DEAL',
    badgeSi: 'විශේෂ දීමනාව',
    badgeColor: '#0c1524',
    headline: 'Office furniture',
    headlineSi: 'කාර්යාලීය ගෘහ භාණ්ඩ',
    highlight: 'SALE UP TO 50% OFF',
    highlightSi: '50% දක්වා මහා වට්ටම්',
    description: 'Architectural beech wood frame with premium high-density velvet cushioning for modern spaces.',
    descriptionSi: 'සුවපහසු ඉරියව්වක් සහතික කරන උසස් තත්ත්වයේ ආකර්ෂණීය විවේක පුටු සහ මේස.',
    image: PHOTO_PATHS.heroSofa,
    ctaText: 'Shop now',
    ctaTextSi: 'දැන් මිලදී ගන්න',
    targetCategory: 'Furniture',
    isActive: true,
  },
  {
    id: 2,
    category: 'Scandinavian Atelier',
    categorySi: 'නෝර්ඩික් නිර්මාණ එකතුව',
    badge: 'NEW ARRIVALS',
    badgeSi: 'අලුත්ම පැමිණීම්',
    badgeColor: '#0284c7',
    headline: 'Architectural Living',
    headlineSi: 'සුවපහසු ජීවන රටාව',
    highlight: 'SPRING DESIGN 2026',
    highlightSi: 'නවීන වසන්ත සැලසුම් 2026',
    description: 'Handcrafted solid European oak coffee tables, acoustic linen armchairs, and warm diffused lighting.',
    descriptionSi: 'ස්වභාවික දැව රටා කැපී පෙනෙන ශක්තිමත් කෑම මේස, පුටු සහ අලංකාර ලාම්පු එකතුව.',
    image: PHOTO_PATHS.heroLiving,
    ctaText: 'Explore Living',
    ctaTextSi: 'පෙළගැස්ම බලන්න',
    targetCategory: 'Furniture',
    isActive: true,
  },
  {
    id: 3,
    category: 'Executive Ergonomics',
    categorySi: 'විධායක ආසන සහ මේස',
    badge: 'BEST SELLER',
    badgeSi: 'ඉහළම අලෙවිය',
    badgeColor: '#ea580c',
    headline: 'Smart Workspace',
    headlineSi: 'ස්මාර්ට් වැඩබිම',
    highlight: 'SUMMER CLEARANCE',
    highlightSi: 'ගිම්හාන විශේෂ නිෂ්කාශනය',
    description: 'Precision electric standing desks, active lumbar support seating, and dual-display monitor arms.',
    descriptionSi: 'කාර්යක්ෂමතාව ඉහළ නංවන නවීන විදුලි මේස සහ කොන්දට සුවපහසු ආසන.',
    image: PHOTO_PATHS.heroOffice,
    ctaText: 'Shop Workspace',
    ctaTextSi: 'වැඩබිම සකසන්න',
    targetCategory: 'Office',
    isActive: true,
  },
];
