import React, { useState } from 'react';
import {
  BeddingIllustration,
  CeramicVaseIllustration,
  HangingRobesIllustration,
  HeadphonesThumbnail,
  LaptopThumbnail,
  NightstandIllustration,
  OttomanIllustration,
  PhoneThumbnail,
  PinkArmchairIllustration,
  PinkTuftedArmchairIllustration,
  PlantStandIllustration,
  RedPillowIllustration,
  SmartwatchThumbnail,
  WardrobeIllustration,
  YellowDuckIllustration,
  YellowSwivelChairIllustration
} from './ProductIllustrations';

export const PHOTO_PATHS = {
  heroSofa: '/assets/images/hero_office_furniture_sofa_1793430619351.jpg',
  heroLiving: '/assets/images/hero_scandinavian_living_1793431084202.jpg',
  heroOffice: '/assets/images/hero_ergonomic_office_1793431084223.jpg',
  colorfulPillows: '/assets/images/colorful_pillows_stack_1793430617804.jpg',
  greyArmchair: '/assets/images/grey_armchair_interior_1793430620217.jpg',
  pinkArmchair: '/assets/images/pink_bucket_armchair_1793430619942.jpg',
  ceramicVase: '/assets/images/ceramic_flower_vase_1793430619937.jpg',
  jacquardTowels: '/assets/images/jacquard_bed_towels_1793430622120.jpg',
  // Trending Items Photos:
  greyOttoman: '/assets/images/trending_grey_ottoman_1793430711205.jpg',
  redPillow: '/assets/images/trending_red_pillow_1793430710467.jpg',
  yellowSwivelChair: '/assets/images/trending_yellow_swivel_chair_1793430712796.jpg',
  oakWardrobe: '/assets/images/trending_oak_wardrobe_1793430712699.jpg',
  ceramicDucks: '/assets/images/trending_ceramic_ducks_1793430712875.jpg',
  oakNightstand: '/assets/images/trending_oak_nightstand_1793430713590.jpg',
};

interface ProductImageRendererProps {
  name: string;
  className?: string;
}

export const ProductImageRenderer: React.FC<ProductImageRendererProps> = ({ name, className = "w-full h-full" }) => {
  const [imgError, setImgError] = useState(false);

  // High quality photo matching map
  const photoMap: { [key: string]: { src: string; alt: string } } = {
    PinkArmchair: { src: PHOTO_PATHS.pinkArmchair, alt: "Nordic Pink Accent Lounge Chair" },
    CeramicVase: { src: PHOTO_PATHS.ceramicVase, alt: "Minimalist Ceramic Bloom Vase" },
    Ottoman: { src: PHOTO_PATHS.greyOttoman, alt: "Grey Upholstered Ottoman Stool" },
    RedPillow: { src: PHOTO_PATHS.redPillow, alt: "Red Embroidered Cushion Pillow" },
    YellowSwivelChair: { src: PHOTO_PATHS.yellowSwivelChair, alt: "Yellow Modern Swivel Accent Chair" },
    Wardrobe: { src: PHOTO_PATHS.oakWardrobe, alt: "Bella Natural Oak Wardrobe" },
    YellowDuck: { src: PHOTO_PATHS.ceramicDucks, alt: "Ceramic Duck Trio Art Figurines" },
    Nightstand: { src: PHOTO_PATHS.oakNightstand, alt: "Scandinavian Oak Nightstand Table" },
  };

  if (photoMap[name] && !imgError) {
    return (
      <img
        src={photoMap[name].src}
        alt={photoMap[name].alt}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className={`${className} object-contain transition-transform duration-300`}
      />
    );
  }

  // Support direct web URLs, uploaded data URLs, or asset paths
  if (name && (name.startsWith('http://') || name.startsWith('https://') || name.startsWith('data:') || name.startsWith('/')) && !imgError) {
    return (
      <img
        src={name}
        alt="Product preview"
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className={`${className} object-contain transition-transform duration-300`}
      />
    );
  }

  switch (name) {
    case 'PinkArmchair':
      return <PinkArmchairIllustration className={className} />;
    case 'CeramicVase':
      return <CeramicVaseIllustration className={className} />;
    case 'Ottoman':
      return <OttomanIllustration className={className} />;
    case 'RedPillow':
      return <RedPillowIllustration className={className} />;
    case 'YellowSwivelChair':
      return <YellowSwivelChairIllustration className={className} />;
    case 'HangingRobes':
      return <HangingRobesIllustration className={className} />;
    case 'Wardrobe':
      return <WardrobeIllustration className={className} />;
    case 'YellowDuck':
      return <YellowDuckIllustration className={className} />;
    case 'Nightstand':
      return <NightstandIllustration className={className} />;
    case 'Bedding':
      return <BeddingIllustration className={className} />;
    case 'PlantStand':
      return <PlantStandIllustration className={className} />;
    case 'PinkTuftedArmchair':
      return <PinkTuftedArmchairIllustration className={className} />;
    case 'Laptop':
      return <LaptopThumbnail className={className} />;
    case 'Headphones':
      return <HeadphonesThumbnail className={className} />;
    case 'Smartwatch':
      return <SmartwatchThumbnail className={className} />;
    case 'Phone':
      return <PhoneThumbnail className={className} />;
    default:
      return (
        <div className={`flex items-center justify-center bg-slate-100 text-slate-400 ${className}`}>
          <span className="text-xs uppercase font-medium">Market Item</span>
        </div>
      );
  }
};
