import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { HeroFurnitureIllustration } from '../Images/ProductIllustrations';
import { Language, HeroSlideItem } from '../../types/marketplace';
import { INITIAL_HERO_SLIDES } from '../../data/heroSlides';

interface HeroSliderProps {
  onShopNow: () => void;
  language?: Language;
  slides?: HeroSlideItem[];
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  onShopNow,
  language = 'en',
  slides = INITIAL_HERO_SLIDES,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [imgErrors, setImgErrors] = useState<{ [key: number]: boolean }>({});
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter to active slides only
  const activeSlides = slides.filter((s) => s.isActive !== false);
  const currentSlideIndex = Math.min(currentSlide, Math.max(0, activeSlides.length - 1));

  const handleNext = () => {
    if (activeSlides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  };

  const handlePrev = () => {
    if (activeSlides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Touch swipe support for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setIsPlaying(false);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setTouchStartX(null);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && activeSlides.length > 1) {
      timerRef.current = setInterval(() => {
        handleNext();
      }, 5500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, activeSlides.length]);

  if (activeSlides.length === 0) {
    return null;
  }

  return (
    <div
      className="relative rounded-sm overflow-hidden border border-slate-200 shadow-sm group select-none min-h-[300px] sm:min-h-[380px] lg:min-h-[420px] transition-all"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides Deck */}
      {activeSlides.map((slide, index) => {
        const isActive = index === currentSlideIndex;
        const hasError = imgErrors[slide.id];
        const category = language === 'si' ? slide.categorySi : slide.category;
        const badge = language === 'si' ? slide.badgeSi : slide.badge;
        const headline = language === 'si' ? slide.headlineSi : slide.headline;
        const highlight = language === 'si' ? slide.highlightSi : slide.highlight;
        const description = language === 'si' ? slide.descriptionSi : slide.description;
        const ctaText = language === 'si' ? slide.ctaTextSi : slide.ctaText;

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Full-Bleed Background Photo for the entire hero area */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              {!hasError ? (
                <img
                  src={slide.image}
                  alt={`${slide.headline} - ${slide.highlight}`}
                  referrerPolicy="no-referrer"
                  onError={() => setImgErrors((prev) => ({ ...prev, [slide.id]: true }))}
                  className={`w-full h-full object-cover object-right sm:object-right-bottom transition-transform duration-7000 ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                />
              ) : (
                <HeroFurnitureIllustration className="w-full h-full object-cover object-right" />
              )}

              {/* White Gradient from Left to Middle for Crisp Text Contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 sm:via-white/80 to-transparent to-95% sm:to-65%" />
            </div>

            {/* Slide Text Content & Call-to-Action */}
            <div className="relative z-10 h-full p-4 sm:p-8 lg:p-12 flex flex-col justify-between max-w-[280px] sm:max-w-md md:max-w-lg">
              <div>
                {/* Category & Tag */}
                <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                  <span
                    className="text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono shadow-xs"
                    style={{ backgroundColor: slide.badgeColor || '#0c1524' }}
                  >
                    {badge}
                  </span>
                  <span className="text-slate-700 text-[11px] sm:text-xs md:text-sm font-semibold tracking-wide uppercase font-display truncate">
                    {category}
                  </span>
                </div>

                {/* Main Headline & Highlight */}
                <h3 className="text-lg sm:text-2xl font-bold text-slate-800 tracking-tight leading-tight uppercase font-display">
                  {headline}
                </h3>
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight uppercase mt-0.5 text-[#ea580c] font-display">
                  {highlight}
                </h2>

                {/* Subtitle / Description */}
                <p className="text-slate-600 text-xs sm:text-sm mt-1.5 sm:mt-3 leading-relaxed font-normal line-clamp-2 sm:line-clamp-3">
                  {description}
                </p>

                {/* Action Button */}
                <div className="mt-4 sm:mt-6">
                  <button
                    onClick={onShopNow}
                    className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md cursor-pointer flex items-center gap-2 hover:scale-[1.02] active:scale-95 font-display"
                  >
                    <span>{ctaText}</span>
                    <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrow Controls */}
      <button
        onClick={handlePrev}
        className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md border border-slate-200/80 transition-all cursor-pointer z-20 hover:scale-105 active:scale-95"
        title="Previous Slide"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md border border-slate-200/80 transition-all cursor-pointer z-20 hover:scale-105 active:scale-95"
        title="Next Slide"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
      </button>

      {/* Bottom Controls Bar: Slide Indicators */}
      <div className="absolute bottom-3 left-4 sm:left-12 flex items-center gap-1.5 sm:gap-2 z-20">
        {activeSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              index === currentSlideIndex ? 'w-5 sm:w-6 bg-[#ea580c]' : 'w-2 bg-slate-300 hover:bg-slate-400'
            }`}
            title={`Go to slide ${index + 1}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
