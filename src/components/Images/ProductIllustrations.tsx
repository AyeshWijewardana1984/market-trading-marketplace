import React from 'react';

interface IllustrationProps {
  className?: string;
}

export const HeroFurnitureIllustration: React.FC<IllustrationProps> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 800 450" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFF9D2" />
        <stop offset="70%" stopColor="#FEF3B5" />
        <stop offset="100%" stopColor="#FDEE9E" />
      </linearGradient>
      <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F5A623" />
        <stop offset="15%" stopColor="#E28E14" />
        <stop offset="100%" stopColor="#C97507" />
      </linearGradient>
      <linearGradient id="sofaGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F0EFEB" />
      </linearGradient>
      <filter id="softShadow" x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#9C6B1F" floodOpacity="0.3" />
      </filter>
    </defs>

    {/* Background Wall */}
    <rect width="800" height="350" fill="url(#wallGrad)" />

    {/* Modern Wooden Floor */}
    <rect y="350" width="800" height="100" fill="url(#floorGrad)" />
    {/* Floor Planks */}
    <line x1="0" y1="350" x2="800" y2="350" stroke="#B86604" strokeWidth="2" opacity="0.4" />
    <line x1="120" y1="350" x2="160" y2="450" stroke="#9C5202" strokeWidth="1" opacity="0.3" />
    <line x1="280" y1="350" x2="330" y2="450" stroke="#9C5202" strokeWidth="1" opacity="0.3" />
    <line x1="450" y1="350" x2="520" y2="450" stroke="#9C5202" strokeWidth="1" opacity="0.3" />
    <line x1="620" y1="350" x2="700" y2="450" stroke="#9C5202" strokeWidth="1" opacity="0.3" />

    {/* Modern Arch Floor Lamp */}
    <g filter="url(#softShadow)">
      {/* Heavy base */}
      <ellipse cx="205" cy="360" rx="36" ry="10" fill="#2D313A" />
      {/* Arch pole */}
      <path d="M205 358 C 170 200, 240 80, 280 140" fill="none" stroke="#2D313A" strokeWidth="4.5" strokeLinecap="round" />
      {/* Cord & shade */}
      <line x1="280" y1="140" x2="280" y2="152" stroke="#2D313A" strokeWidth="3" />
      <path d="M255 180 L 270 152 L 290 152 L 305 180 Z" fill="#F49A00" stroke="#D37E00" strokeWidth="2" />
      {/* Glow bulb */}
      <ellipse cx="280" cy="180" rx="15" ry="5" fill="#FFEBA0" opacity="0.8" />
    </g>

    {/* Modern White Minimalist Sofa */}
    <g filter="url(#softShadow)">
      {/* Sofa shadow on floor */}
      <ellipse cx="460" cy="365" rx="155" ry="14" fill="#6B4109" opacity="0.35" />

      {/* Chrome Legs */}
      <rect x="330" y="340" width="8" height="24" rx="2" fill="#718096" />
      <rect x="585" y="340" width="8" height="24" rx="2" fill="#718096" />
      <rect x="455" y="342" width="8" height="20" rx="2" fill="#718096" />

      {/* Sofa Base & Backrest Frame */}
      <rect x="315" y="240" width="295" height="105" rx="14" fill="url(#sofaGrad)" stroke="#E2E8F0" strokeWidth="1.5" />
      <rect x="310" y="275" width="305" height="45" rx="10" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />

      {/* Left and Right Armrests */}
      <rect x="310" y="245" width="26" height="75" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
      <rect x="590" y="245" width="26" height="75" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />

      {/* 3 Plush Yellow Cushions */}
      {/* Cushion 1 */}
      <rect x="342" y="250" width="76" height="42" rx="7" fill="#E88B00" stroke="#C47300" strokeWidth="1.5" />
      <path d="M346 270 Q380 274 414 270" stroke="#C47300" strokeWidth="1.2" opacity="0.6" />
      {/* Cushion 2 */}
      <rect x="424" y="250" width="76" height="42" rx="7" fill="#E88B00" stroke="#C47300" strokeWidth="1.5" />
      <path d="M428 270 Q462 274 496 270" stroke="#C47300" strokeWidth="1.2" opacity="0.6" />
      {/* Cushion 3 */}
      <rect x="506" y="250" width="76" height="42" rx="7" fill="#E88B00" stroke="#C47300" strokeWidth="1.5" />
      <path d="M510 270 Q544 274 578 270" stroke="#C47300" strokeWidth="1.2" opacity="0.6" />

      {/* Bolster pillows on sides */}
      <rect x="338" y="258" width="12" height="34" rx="6" fill="#F4A325" />
      <rect x="574" y="258" width="12" height="34" rx="6" fill="#F4A325" />
    </g>

    {/* Modern Decorative Yellow Sphere & Tall Ceramic Vase on right */}
    <g filter="url(#softShadow)">
      <ellipse cx="685" cy="355" rx="20" ry="7" fill="#6B4109" opacity="0.3" />
      {/* Round yellow vase */}
      <circle cx="685" cy="335" r="18" fill="#F39C12" />
      <ellipse cx="685" cy="320" rx="6" ry="3" fill="#D68910" />

      {/* Tall fluted white vase with dry grass reeds */}
      <path d="M668 350 C666 310, 672 250, 670 230 L675 230 C673 250, 680 310, 678 350 Z" fill="#FFFFFF" stroke="#E2E8F0" />
      {/* Reeds */}
      <path d="M672 230 C665 190, 650 170, 645 160" stroke="#D4AC0D" strokeWidth="1.5" />
      <path d="M673 230 C675 185, 680 160, 685 155" stroke="#D4AC0D" strokeWidth="1.5" />
      <path d="M674 230 C682 195, 698 175, 705 165" stroke="#D4AC0D" strokeWidth="1.5" />
    </g>
  </svg>
);

export const ColorfulPillowsIllustration: React.FC<IllustrationProps> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <filter id="pillowShadow" x="-20%" y="-20%" width="140%" height="150%">
        <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000" floodOpacity="0.12" />
      </filter>
    </defs>
    {/* Bottom Cyan Pillow */}
    <g filter="url(#pillowShadow)">
      <rect x="50" y="145" width="220" height="42" rx="14" fill="#00C4D6" />
      <ellipse cx="160" cy="166" rx="90" ry="10" fill="#02B2C2" opacity="0.4" />
      <path d="M54 166 Q160 180 266 166" stroke="#009FB0" strokeWidth="1.5" />
    </g>
    {/* Green Pillow */}
    <g filter="url(#pillowShadow)">
      <rect x="62" y="112" width="196" height="40" rx="13" fill="#8CE024" />
      <ellipse cx="160" cy="132" rx="80" ry="9" fill="#7AC71C" opacity="0.4" />
      <path d="M66 132 Q160 144 254 132" stroke="#68AB14" strokeWidth="1.5" />
    </g>
    {/* Orange Pillow */}
    <g filter="url(#pillowShadow)">
      <rect x="72" y="80" width="176" height="38" rx="12" fill="#FF7710" />
      <ellipse cx="160" cy="99" rx="70" ry="8" fill="#E86400" opacity="0.4" />
      <path d="M76 99 Q160 109 244 99" stroke="#CF5500" strokeWidth="1.5" />
    </g>
    {/* Top Yellow Pillow */}
    <g filter="url(#pillowShadow)">
      <rect x="84" y="48" width="152" height="36" rx="11" fill="#FFCC00" />
      <ellipse cx="160" cy="66" rx="60" ry="7" fill="#E6B800" opacity="0.4" />
      <path d="M88 66 Q160 74 232 66" stroke="#CCA400" strokeWidth="1.5" />
    </g>
  </svg>
);

export const GreyArmchairIllustration: React.FC<IllustrationProps> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <filter id="chairShadow" x="-20%" y="-20%" width="140%" height="150%">
        <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000" floodOpacity="0.15" />
      </filter>
    </defs>
    {/* Shadow */}
    <ellipse cx="160" cy="195" rx="90" ry="12" fill="#CBD5E1" />
    {/* Dark wooden legs */}
    <g>
      <line x1="90" y1="170" x2="80" y2="200" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
      <line x1="230" y1="170" x2="240" y2="200" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
      <line x1="110" y1="165" x2="105" y2="195" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />
      <line x1="210" y1="165" x2="215" y2="195" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />
    </g>
    {/* Grey Loveseat / Armchair body */}
    <g filter="url(#chairShadow)">
      {/* Backrest with button tufting */}
      <rect x="80" y="65" width="160" height="90" rx="14" fill="#94A3B8" stroke="#64748B" strokeWidth="1.5" />
      {/* Tufting buttons */}
      <circle cx="115" cy="85" r="3" fill="#64748B" />
      <circle cx="145" cy="85" r="3" fill="#64748B" />
      <circle cx="175" cy="85" r="3" fill="#64748B" />
      <circle cx="205" cy="85" r="3" fill="#64748B" />
      <circle cx="130" cy="105" r="3" fill="#64748B" />
      <circle cx="160" cy="105" r="3" fill="#64748B" />
      <circle cx="190" cy="105" r="3" fill="#64748B" />

      {/* Seat Cushion */}
      <rect x="85" y="130" width="150" height="42" rx="8" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1" />
      {/* Armrests */}
      <rect x="70" y="100" width="24" height="65" rx="8" fill="#64748B" />
      <rect x="226" y="100" width="24" height="65" rx="8" fill="#64748B" />

      {/* Red Throw Cushion */}
      <rect x="94" y="115" width="38" height="34" rx="6" fill="#E11D48" stroke="#BE123C" strokeWidth="1" transform="rotate(-8 94 115)" />
      <path d="M96 130 L126 130" stroke="#FFF" strokeWidth="1.5" opacity="0.7" transform="rotate(-8 94 115)" />
    </g>
  </svg>
);

export const PinkArmchairIllustration: React.FC<IllustrationProps> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <filter id="pinkChairShadow" x="-20%" y="-20%" width="140%" height="150%">
        <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#F43F5E" floodOpacity="0.2" />
      </filter>
    </defs>
    {/* Shadow */}
    <ellipse cx="130" cy="225" rx="65" ry="10" fill="#E2E8F0" />
    {/* Light Wooden Legs */}
    <line x1="88" y1="165" x2="68" y2="230" stroke="#D97706" strokeWidth="5.5" strokeLinecap="round" />
    <line x1="172" y1="165" x2="192" y2="230" stroke="#D97706" strokeWidth="5.5" strokeLinecap="round" />
    <line x1="108" y1="160" x2="98" y2="220" stroke="#B45309" strokeWidth="4.5" strokeLinecap="round" />
    <line x1="152" y1="160" x2="162" y2="220" stroke="#B45309" strokeWidth="4.5" strokeLinecap="round" />
    {/* Pink Sculpted Shell */}
    <g filter="url(#pinkChairShadow)">
      {/* Curved Backrest */}
      <path d="M75 140 C65 80, 85 45, 130 45 C175 45, 195 80, 185 140 C180 175, 160 185, 130 185 C100 185, 80 175, 75 140 Z" fill="#FB7185" />
      {/* Inner softer pink bucket */}
      <path d="M85 135 C78 90, 92 60, 130 60 C168 60, 182 90, 175 135 C170 165, 155 175, 130 175 C105 175, 90 165, 85 135 Z" fill="#FDA4AF" />
      {/* Plush Cushion */}
      <ellipse cx="130" cy="155" rx="36" ry="16" fill="#F43F5E" />
    </g>
  </svg>
);

export const CeramicVaseIllustration: React.FC<IllustrationProps> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <filter id="vaseShadow" x="-20%" y="-20%" width="140%" height="150%">
        <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#78350F" floodOpacity="0.15" />
      </filter>
    </defs>
    {/* Shadow */}
    <ellipse cx="130" cy="225" rx="55" ry="9" fill="#E2E8F0" />
    {/* Stems & Delicate Blossoms */}
    <g>
      <path d="M130 140 Q122 80 115 45" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M130 140 Q138 90 145 50" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
      <path d="M125 100 Q105 85 98 75" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />

      {/* Blossoms */}
      <circle cx="115" cy="45" r="8" fill="#FCE7F3" stroke="#F472B6" strokeWidth="1.5" />
      <circle cx="115" cy="45" r="3" fill="#F59E0B" />
      <circle cx="145" cy="50" r="7" fill="#FCE7F3" stroke="#F472B6" strokeWidth="1.5" />
      <circle cx="145" cy="50" r="2.5" fill="#F59E0B" />
      <circle cx="98" cy="75" r="6" fill="#FCE7F3" stroke="#F472B6" strokeWidth="1.5" />
      <circle cx="98" cy="75" r="2" fill="#F59E0B" />
    </g>
    {/* Ceramic Fluted Minimalist Vase */}
    <g filter="url(#vaseShadow)">
      {/* Wooden Base Ring */}
      <ellipse cx="130" cy="216" rx="50" ry="12" fill="#B45309" stroke="#92400E" strokeWidth="1" />
      {/* Matte Porcelain Vase Body */}
      <path d="M124 135 C124 135, 118 165, 85 200 C80 206, 95 214, 130 214 C165 214, 180 206, 175 200 C142 165, 136 135, 136 135 Z" fill="#FDFBF7" stroke="#E2E8F0" strokeWidth="1.5" />
      <ellipse cx="130" cy="135" rx="6" ry="2" fill="#E2E8F0" />
      <ellipse cx="130" cy="180" rx="35" ry="5" fill="#F3EFE6" opacity="0.6" />
    </g>
  </svg>
);

export const OttomanIllustration: React.FC<IllustrationProps> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="120" cy="175" rx="75" ry="10" fill="#E2E8F0" />
    {/* Wooden legs */}
    <line x1="60" y1="135" x2="50" y2="175" stroke="#92400E" strokeWidth="7" strokeLinecap="round" />
    <line x1="180" y1="135" x2="190" y2="175" stroke="#92400E" strokeWidth="7" strokeLinecap="round" />
    <line x1="85" y1="130" x2="80" y2="165" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
    <line x1="155" y1="130" x2="160" y2="165" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
    {/* Grey Padded Stool Bench */}
    <rect x="45" y="85" width="150" height="55" rx="14" fill="#64748B" stroke="#475569" strokeWidth="1.5" />
    <rect x="48" y="87" width="144" height="22" rx="10" fill="#94A3B8" opacity="0.6" />
  </svg>
);

export const RedPillowIllustration: React.FC<IllustrationProps> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="50" y="30" width="140" height="140" rx="18" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
    {/* White geometric Moroccan embroidery pattern */}
    <g stroke="#FFFFFF" strokeWidth="2" fill="none" opacity="0.85">
      <circle cx="120" cy="100" r="32" />
      <polygon points="120,60 148,80 148,120 120,140 92,120 92,80" />
      <line x1="55" y1="35" x2="185" y2="165" strokeDasharray="4 4" />
      <line x1="185" y1="35" x2="55" y2="165" strokeDasharray="4 4" />
      <circle cx="70" cy="50" r="8" />
      <circle cx="170" cy="50" r="8" />
      <circle cx="70" cy="150" r="8" />
      <circle cx="170" cy="150" r="8" />
    </g>
  </svg>
);

export const YellowSwivelChairIllustration: React.FC<IllustrationProps> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Chrome swivel pedestal */}
    <ellipse cx="120" cy="178" rx="45" ry="8" fill="#94A3B8" />
    <rect x="116" y="135" width="8" height="40" rx="2" fill="#64748B" />
    {/* Mustard Yellow Molded Shell */}
    <path d="M70 95 C65 60, 85 45, 120 45 C155 45, 175 60, 170 95 C165 130, 150 140, 120 140 C90 140, 75 130, 70 95 Z" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.5" />
    <ellipse cx="120" cy="118" rx="36" ry="12" fill="#FACC15" />
  </svg>
);

export const HangingRobesIllustration: React.FC<IllustrationProps> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Wooden peg rack */}
    <rect x="35" y="30" width="170" height="12" rx="4" fill="#B45309" />
    <circle cx="65" cy="36" r="4" fill="#78350F" />
    <circle cx="120" cy="36" r="4" fill="#78350F" />
    <circle cx="175" cy="36" r="4" fill="#78350F" />
    {/* Grey Robe 1 */}
    <path d="M60 40 L50 165 C50 165, 65 170, 75 165 L80 40 Z" fill="#94A3B8" stroke="#64748B" />
    {/* White / Beige Robe 2 */}
    <path d="M115 40 L105 175 C105 175, 120 180, 130 175 L135 40 Z" fill="#F1F5F9" stroke="#CBD5E1" />
    {/* Dark Charcoal Robe 3 */}
    <path d="M170 40 L160 160 C160 160, 175 165, 185 160 L190 40 Z" fill="#334155" stroke="#1E293B" />
  </svg>
);

export const WardrobeIllustration: React.FC<IllustrationProps> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Natural Oak Wardrobe */}
    <rect x="40" y="30" width="160" height="145" rx="6" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
    {/* Left Door */}
    <rect x="48" y="38" width="46" height="128" fill="#FDE68A" stroke="#D97706" />
    <circle cx="86" cy="100" r="3" fill="#78350F" />
    {/* Center Mirror / Vanity */}
    <rect x="98" y="38" width="44" height="80" fill="#E0F2FE" stroke="#38BDF8" />
    <rect x="98" y="122" width="44" height="20" fill="#FDE68A" stroke="#D97706" />
    <line x1="120" y1="132" x2="120" y2="132" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
    <rect x="98" y="145" width="44" height="21" fill="#FDE68A" stroke="#D97706" />
    <line x1="120" y1="155" x2="120" y2="155" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
    {/* Right Door */}
    <rect x="146" y="38" width="46" height="128" fill="#FDE68A" stroke="#D97706" />
    <circle cx="154" cy="100" r="3" fill="#78350F" />
  </svg>
);

export const YellowDuckIllustration: React.FC<IllustrationProps> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="120" cy="165" rx="60" ry="10" fill="#E2E8F0" />
    {/* Cute stylized ceramic ducks (yellow, coral, aqua) */}
    {/* Aqua Duck */}
    <ellipse cx="70" cy="145" rx="22" ry="16" fill="#2DD4BF" />
    <circle cx="82" cy="132" r="11" fill="#2DD4BF" />
    <polygon points="93,132 102,130 93,135" fill="#FB923C" />
    <circle cx="86" cy="130" r="2" fill="#0F172A" />

    {/* Coral Red Duck */}
    <ellipse cx="98" cy="115" rx="26" ry="18" fill="#F87171" />
    <circle cx="112" cy="98" r="13" fill="#F87171" />
    <polygon points="125,98 135,95 125,102" fill="#F59E0B" />
    <circle cx="117" cy="96" r="2.5" fill="#0F172A" />

    {/* Big Yellow Duck */}
    <ellipse cx="145" cy="135" rx="34" ry="24" fill="#FACC15" stroke="#EAB308" strokeWidth="1.5" />
    <circle cx="165" cy="115" r="16" fill="#FACC15" stroke="#EAB308" strokeWidth="1" />
    <polygon points="181,115 198,112 181,120" fill="#EA580C" />
    <circle cx="172" cy="112" r="3" fill="#0F172A" />
  </svg>
);

export const NightstandIllustration: React.FC<IllustrationProps> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="120" cy="180" rx="55" ry="9" fill="#E2E8F0" />
    {/* Scandinavian Oak Nightstand */}
    <rect x="65" y="45" width="110" height="110" rx="6" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
    {/* Open Cubby Top */}
    <rect x="73" y="55" width="94" height="42" fill="#F59E0B" opacity="0.3" stroke="#D97706" />
    {/* Closed Drawer Bottom */}
    <rect x="73" y="105" width="94" height="42" fill="#FBBF24" stroke="#D97706" />
    <circle cx="120" cy="126" r="4" fill="#78350F" />
    {/* Dowel Legs */}
    <line x1="75" y1="155" x2="68" y2="182" stroke="#B45309" strokeWidth="6" strokeLinecap="round" />
    <line x1="165" y1="155" x2="172" y2="182" stroke="#B45309" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

export const BeddingIllustration: React.FC<IllustrationProps> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Folded Duvet & Pillows */}
    <rect x="50" y="45" width="140" height="120" rx="14" fill="#3B82F6" stroke="#2563EB" strokeWidth="2" />
    <path d="M50 45 L140 45 L80 120 L50 120 Z" fill="#93C5FD" />
    {/* Crisp White folded pillow on top */}
    <rect x="70" y="30" width="100" height="35" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
    <ellipse cx="120" cy="47" rx="35" ry="8" fill="#F1F5F9" />
  </svg>
);

export const PlantStandIllustration: React.FC<IllustrationProps> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Wooden Dowel Leg Frame */}
    <line x1="75" y1="110" x2="70" y2="180" stroke="#B45309" strokeWidth="7" strokeLinecap="round" />
    <line x1="165" y1="110" x2="170" y2="180" stroke="#B45309" strokeWidth="7" strokeLinecap="round" />
    <rect x="70" y="140" width="100" height="8" rx="2" fill="#92400E" />
    {/* Minimalist White Cylinder Planter Pot */}
    <rect x="80" y="60" width="80" height="85" rx="10" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
    <ellipse cx="120" cy="62" rx="40" ry="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
  </svg>
);

export const PinkTuftedArmchairIllustration: React.FC<IllustrationProps> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="120" cy="180" rx="55" ry="9" fill="#E2E8F0" />
    {/* Dark mahogany legs */}
    <line x1="80" y1="150" x2="70" y2="182" stroke="#451A03" strokeWidth="6" strokeLinecap="round" />
    <line x1="160" y1="150" x2="170" y2="182" stroke="#451A03" strokeWidth="6" strokeLinecap="round" />
    {/* Wingback Pink Velvet Armchair */}
    <path d="M70 120 C60 50, 75 35, 120 35 C165 35, 180 50, 170 120 L170 150 C170 155, 70 155, 70 150 Z" fill="#FB7185" stroke="#E11D48" strokeWidth="1.5" />
    {/* Button Tufting Rows */}
    <circle cx="95" cy="60" r="3" fill="#BE123C" />
    <circle cx="120" cy="60" r="3" fill="#BE123C" />
    <circle cx="145" cy="60" r="3" fill="#BE123C" />
    <circle cx="108" cy="85" r="3" fill="#BE123C" />
    <circle cx="132" cy="85" r="3" fill="#BE123C" />
    {/* Scroll Armrests */}
    <rect x="60" y="110" width="18" height="40" rx="8" fill="#F43F5E" />
    <rect x="162" y="110" width="18" height="40" rx="8" fill="#F43F5E" />
    {/* Seat Cushion */}
    <rect x="74" y="130" width="92" height="26" rx="6" fill="#FDA4AF" stroke="#F43F5E" strokeWidth="1" />
  </svg>
);

export const LaptopThumbnail: React.FC<IllustrationProps> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="18" y="18" width="44" height="30" rx="2" fill="#1E293B" stroke="#0F172A" />
    <rect x="21" y="21" width="38" height="24" fill="#0284C7" />
    <polygon points="10,50 70,50 66,54 14,54" fill="#64748B" />
  </svg>
);

export const HeadphonesThumbnail: React.FC<IllustrationProps> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M22 45 C22 28, 30 20, 40 20 C50 20, 58 28, 58 45" stroke="#DC2626" strokeWidth="5" fill="none" strokeLinecap="round" />
    <rect x="18" y="42" width="10" height="20" rx="5" fill="#EF4444" />
    <rect x="52" y="42" width="10" height="20" rx="5" fill="#EF4444" />
  </svg>
);

export const SmartwatchThumbnail: React.FC<IllustrationProps> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="34" y="10" width="12" height="60" rx="3" fill="#334155" />
    <rect x="25" y="25" width="30" height="30" rx="8" fill="#0F172A" stroke="#475569" strokeWidth="1.5" />
    <circle cx="40" cy="40" r="10" stroke="#06B6D4" strokeWidth="2" fill="#164E63" />
    <line x1="40" y1="40" x2="40" y2="34" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="40" y1="40" x2="45" y2="40" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const PhoneThumbnail: React.FC<IllustrationProps> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="26" y="14" width="28" height="52" rx="5" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
    <rect x="28" y="17" width="24" height="46" rx="3" fill="#3B82F6" />
    <circle cx="40" cy="62" r="2" fill="#FFFFFF" opacity="0.6" />
  </svg>
);
