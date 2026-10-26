import { useState, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { gsap, useGSAP } from '../lib/gsap.js';
import CulinaryPatternBg from './CulinaryPatternBg.jsx';

export default function LandingHero() {
  const containerRef = useRef(null);
  const [slideIdx, setSlideIdx] = useState(0);

  const heroDishes = [
    {
      id: 'jollof-chicken',
      tag: '100% WOOD-SMOKED HERITAGE',
      titleLine1: 'Savor Authentic Craft',
      titleLine2: 'The Finest Taste in Lagos',
      desc: 'Slow-simmered firewood party jollof with charcoal-grilled suya chicken thigh and golden caramelized dodo plantains.',
      price: '₦7,500',
      badge: 'HOT 25% OFF',
      image: '/images/hero-plate-delicacy.jpg',
      alt: 'Artisan top-down plate of authentic Lagos party jollof, suya grilled chicken, and plantains',
    },
    {
      id: 'smash-burger',
      tag: 'HAND-SMASHED PRIME CHUCK',
      titleLine1: 'Pure Sizzling Flavor',
      titleLine2: 'Double Beef Smash Burger',
      desc: 'Two 100% prime beef patties smashed ultra-thin for maximum crust, layered with aged cheddar and smoked relish.',
      price: '₦6,500',
      badge: 'TOP CRAVE',
      image: '/images/dish-smash-burger.webp',
      alt: 'Juicy double beef smash burger with melted cheddar',
    },
    {
      id: 'prawn-linguine',
      tag: 'FRESH WILD CULINARY SEAFOOD',
      titleLine1: 'Bronze-Die Artisan',
      titleLine2: 'Garlic Tiger Prawn Pasta',
      desc: 'Succulent wild jumbo tiger prawns tossed in cultured garlic butter, dry white wine, lemon zest and fresh Italian parsley.',
      price: '₦9,200',
      badge: 'CHEF CHOICE',
      image: '/images/dish-prawn-linguine.webp',
      alt: 'Garlic tiger prawn linguine pasta',
    },
  ];

  const currentDish = heroDishes[slideIdx];

  // GSAP animation on slide change
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.hero-dish-img',
          { scale: 0.9, rotate: -6, opacity: 0.6 },
          { scale: 1, rotate: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.4)' }
        );
        gsap.fromTo(
          '.hero-text-block',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
        );
      });
    },
    { scope: containerRef, dependencies: [slideIdx] }
  );

  const handlePrev = () => {
    setSlideIdx((prev) => (prev === 0 ? heroDishes.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSlideIdx((prev) => (prev === heroDishes.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-[#F6F5F2] py-8 md:py-14 border-b border-[#E8E6DF]"
    >
      {/* Background subtle hand-drawn culinary pattern */}
      <CulinaryPatternBg opacity={0.045} color="#111111" />

      <div className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="hero-text-block lg:col-span-7 space-y-5">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-surface)] border border-[#E8E6DF] text-[var(--color-ember-text)] text-xs font-bold tracking-wider uppercase shadow-2xs">
              <Flame size={14} className="text-[var(--color-ember)]" />
              <span>{currentDish.tag}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-[34px] sm:text-[46px] lg:text-[58px] font-black text-[#111111] leading-[1.06] tracking-tight">
              <span>{currentDish.titleLine1}</span>
              <br />
              <span className="text-[var(--color-ember)]">{currentDish.titleLine2}</span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-[50ch]">
              {currentDish.desc}
            </p>

            {/* Price & Actions Row */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2.5 h-12 md:h-14 px-8 rounded-full bg-[var(--color-ember)] hover:bg-[#e04b14] active:scale-95 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-[rgba(255,90,31,0.25)] transition-all cursor-pointer select-none"
              >
                <span>Order Now</span>
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <ArrowRight size={14} />
                </span>
              </Link>

              {/* Price Pill */}
              <div className="flex items-baseline gap-1.5 px-4 py-2 rounded-full bg-white border border-[#E8E6DF] shadow-2xs">
                <span className="text-xs text-neutral-400 font-bold uppercase">From</span>
                <span className="text-lg sm:text-xl font-black text-[#111111] tabular-nums">
                  {currentDish.price}
                </span>
              </div>
            </div>

            {/* Slider Navigation Arrows (matches reference image on left) */}
            <div className="pt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous hero dish"
                className="w-10 h-10 rounded-full border border-[#E8E6DF] bg-white text-neutral-700 hover:text-black hover:border-black flex items-center justify-center transition-colors shadow-2xs cursor-pointer active:scale-90"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next hero dish"
                className="w-10 h-10 rounded-full border border-[#E8E6DF] bg-white text-neutral-700 hover:text-black hover:border-black flex items-center justify-center transition-colors shadow-2xs cursor-pointer active:scale-90"
              >
                <ChevronRight size={18} />
              </button>
              <div className="ml-3 flex items-center gap-1.5">
                {heroDishes.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlideIdx(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      i === slideIdx ? 'w-6 bg-[var(--color-ember)]' : 'w-2 bg-neutral-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Media Column: Large Circular Dish Presentation with Painterly Accent Splash */}
          <div className="lg:col-span-5 relative flex items-center justify-center py-6">
            {/* Painterly Orange Back-Splash matching reference design */}
            <div className="absolute w-[300px] sm:w-[380px] md:w-[430px] h-[300px] sm:h-[380px] md:h-[430px] rounded-[48%_52%_45%_55%/52%_45%_55%_48%] bg-gradient-to-tr from-[#FF5A1F] to-[#FFA337] opacity-90 blur-xs -rotate-6 transform scale-105 pointer-events-none" />
            <div className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-[var(--color-ember)]/30 blur-2xl pointer-events-none" />

            {/* Circular Plate Presentation with smooth rounded overflow-hidden */}
            <div className="relative w-72 sm:w-96 md:w-[420px] aspect-square z-10">
              <div className="w-full h-full rounded-full bg-white p-2.5 shadow-2xl border-4 border-white overflow-hidden flex items-center justify-center">
                <img
                  src={currentDish.image}
                  alt={currentDish.alt}
                  className="hero-dish-img w-full h-full object-cover rounded-full select-none"
                  loading="eager"
                />
              </div>

              {/* Floating Promo Discount Badge (matches reference image) */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-[var(--color-ember)] text-white px-3.5 py-1.5 rounded-full font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-[rgba(255,90,31,0.45)] border-2 border-white z-20">
                {currentDish.badge}
              </div>

              {/* Verified Lagos Kitchen Badge */}
              <div className="absolute -bottom-2 left-6 bg-[#111111]/90 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-[11px] font-bold shadow-md flex items-center gap-1.5 border border-white/20 z-20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Live Kitchen · Lagos, NG</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
