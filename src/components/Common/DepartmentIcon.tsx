import React from 'react';
import {
  Wrench,
  Sparkles,
  Gift,
  Shirt,
  Briefcase,
  FlaskConical,
  Eye,
  Home,
  Radio,
  Gem,
  MoreHorizontal,
  Cpu,
  Smartphone,
  Laptop,
  Tv,
  Car,
  Coffee,
  Utensils,
  BookOpen,
  HeartPulse,
  Boxes,
  Layers,
  Tag,
  Package,
  ShieldCheck,
  Gamepad2,
  Camera,
  Watch,
  Headphones,
  Zap,
  Flame,
  ShoppingBag,
  FolderTree,
} from 'lucide-react';

interface DepartmentIconProps {
  iconName?: string;
  className?: string;
}

export const DepartmentIcon: React.FC<DepartmentIconProps> = ({
  iconName = '',
  className = 'w-4 h-4',
}) => {
  switch (iconName) {
    case 'Wrench':
      return <Wrench className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Gift':
      return <Gift className={className} />;
    case 'Shirt':
      return <Shirt className={className} />;
    case 'Briefcase':
      return <Briefcase className={className} />;
    case 'FlaskConical':
      return <FlaskConical className={className} />;
    case 'Eye':
      return <Eye className={className} />;
    case 'Home':
      return <Home className={className} />;
    case 'Radio':
      return <Radio className={className} />;
    case 'Gem':
      return <Gem className={className} />;
    case 'Cpu':
      return <Cpu className={className} />;
    case 'Smartphone':
      return <Smartphone className={className} />;
    case 'Laptop':
      return <Laptop className={className} />;
    case 'Tv':
      return <Tv className={className} />;
    case 'Car':
      return <Car className={className} />;
    case 'Coffee':
      return <Coffee className={className} />;
    case 'Utensils':
      return <Utensils className={className} />;
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'HeartPulse':
      return <HeartPulse className={className} />;
    case 'Boxes':
      return <Boxes className={className} />;
    case 'Layers':
      return <Layers className={className} />;
    case 'Tag':
      return <Tag className={className} />;
    case 'Package':
      return <Package className={className} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} />;
    case 'Gamepad2':
      return <Gamepad2 className={className} />;
    case 'Camera':
      return <Camera className={className} />;
    case 'Watch':
      return <Watch className={className} />;
    case 'Headphones':
      return <Headphones className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'Flame':
      return <Flame className={className} />;
    case 'ShoppingBag':
      return <ShoppingBag className={className} />;
    case 'MoreHorizontal':
      return <MoreHorizontal className={className} />;
    case 'FolderTree':
    default:
      return <FolderTree className={className} />;
  }
};
