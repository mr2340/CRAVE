import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  ChevronDown,
  ShoppingBag,
  Clock,
  Star,
  Plus,
  ArrowLeft,
  Heart,
  X,
  Check,
  Sparkles,
} from 'lucide-react';
import { PRODUCTS } from '../data/catalog.js';
import { useCart } from '../context/useCart.js';
import { gsap, useGSAP, Flip } from '../lib/gsap.js';
import ProductDetailSheet from '../components/ProductDetailSheet.jsx';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { itemCount, openCart, add } = useCart();

  // State Management
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [favorites, setFavorites] = useState(new Set());
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Delivery Location State
  const [selectedLocation, setSelectedLocation] = useState('Victoria Island, Lagos');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  const locations = [
    'Victoria Island, Lagos',
    'Ikoyi, Lagos',
    'Lekki Phase 1, Lagos',
    'Ikeja GRA, Lagos',
    'New York, USA',
    'Maitama, Abuja',
  ];

  // DOM Refs for GSAP
  const containerRef = useRef(null);
  const headerCartRef = useRef(null);
  const dockCartRef = useRef(null);
  const heroBannerRef = useRef(null);
  const heroPlateRef = useRef(null);
  const tabsContainerRef = useRef(null);
  const activeHighlightRef = useRef(null);

  // Hero Dish (Artisan Spaghetti / Linguine)
  const heroDish = useMemo(() => {
    return PRODUCTS.find((p) => p.id === 'prawn-linguine') || PRODUCTS[2];
  }, []);

  // Category Chips (Ergonomic 48x48px to 56x56px discs with clear labels)
  const categoryChips = useMemo(() => {
    return [
      { id: 'all', label: 'All', image: '/images/hero-plate-delicacy.jpg' },
      { id: 'burgers', label: 'Burger', image: '/images/dish-smash-burger.webp' },
      { id: 'pizza', label: 'Pizza', image: '/images/dish-margherita.webp' },
      { id: 'sides', label: 'Fries', image: '/images/dish-truffle-fries.webp' },
      { id: 'chicken', label: 'Chicken', image: '/images/dish-jollof-chicken.webp' },
      { id: 'pasta-noodles', label: 'Spaghetti', image: '/images/dish-prawn-linguine.webp' },
      { id: 'drinks', label: 'Drinks', image: '/images/dish-hibiscus-cooler.webp' },
      { id: 'desserts', label: 'Desserts', image: '/images/dish-lava-cake.webp' },
    ];
  }, []);

  // Filter Pills
  const filterPills = [
    { id: 'all', label: 'All Dishes' },
    { id: 'pickup', label: 'Pickup' },
    { id: 'under30', label: 'Under 30 min' },
    { id: 'budget', label: 'Price' },
    { id: 'top-rated', label: 'Top Rated ★' },
    { id: 'free-del', label: 'Free Delivery' },
  ];

  // Filtered Products Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category match
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      // Search query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.desc.toLowerCase().includes(q);
        const matchesCat = product.category.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }
      // Filter pills
      if (activeFilter === 'under30') {
        const mins = parseInt(product.prepTime, 10);
        if (mins > 30) return false;
      } else if (activeFilter === 'budget') {
        if (product.price > 6000) return false;
      } else if (activeFilter === 'top-rated') {
        return product.bestSeller || product.featured;
      }
      // Favorites tab filter
      if (activeTab === 'favorites') {
        return favorites.has(product.id);
      }
      return true;
    });
  }, [selectedCategory, searchQuery, activeFilter, activeTab, favorites]);

  // Toggle favorite
  const toggleFavorite = (productId, e) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  /* -------------------------------------------------------------
   * 3.1 Orchestrated Screen Entrance Timeline
   * ----------------------------------------------------------- */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const master = gsap.timeline({
          defaults: { ease: 'power3.out' },
        });

        // 1. Navigation & Search Bar drop down
        master.fromTo(
          '.dashboard-app-header',
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, clearProps: 'all' }
        );

        // 2. Filter chips glide horizontally with cascade
        master.fromTo(
          '.filter-chip',
          { x: 25, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            stagger: 0.03,
            duration: 0.35,
            clearProps: 'all',
          },
          '-=0.25'
        );

        // 3. Hero banner scales up with organic overshoot
        master.fromTo(
          '.hero-showcase-card',
          { scale: 0.95, y: 20, opacity: 0 },
          {
            scale: 1,
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'back.out(1.2)',
            clearProps: 'all',
          },
          '-=0.2'
        );

        // 4. Hero food image drops in with rotational spin
        master.fromTo(
          '.hero-food-plate',
          { scale: 0.6, rotation: -25, y: -15, opacity: 0 },
          {
            scale: 1,
            rotation: 0,
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'elastic.out(1, 0.75)',
            clearProps: 'opacity,transform',
          },
          '-=0.35'
        );

        // 5. Category icons bounce upward
        master.fromTo(
          '.category-pill',
          { y: 15, scale: 0.85, opacity: 0 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            stagger: 0.03,
            duration: 0.4,
            ease: 'back.out(1.4)',
            clearProps: 'all',
          },
          '-=0.3'
        );

        // 6. Product cards entrance (immediate fail-safe clearProps)
        master.fromTo(
          '.product-card',
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.03,
            duration: 0.4,
            ease: 'power2.out',
            clearProps: 'all',
          },
          '-=0.25'
        );

        // 7. Floating dock pops up from below
        master.fromTo(
          '.floating-dock-nav',
          { y: 40, scale: 0.9, opacity: 0 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: 'back.out(1.3)',
            clearProps: 'all',
          },
          '-=0.2'
        );
      });
    },
    { scope: containerRef }
  );

  /* -------------------------------------------------------------
   * 3.2 Hero Banner Ambient Idle Float & 3D Parallax Tilt
   * ----------------------------------------------------------- */
  useEffect(() => {
    // Ambient Idle Float
    const floatTween = gsap.to('.hero-food-plate', {
      y: -6,
      rotation: 1.5,
      duration: 2.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // 3D Parallax Tilt on Banner Hover
    const banner = heroBannerRef.current;
    const plate = heroPlateRef.current;

    if (!banner || !plate) return () => floatTween.kill();

    const handleMouseMove = (e) => {
      const rect = banner.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(banner, {
        rotateY: x * 0.03,
        rotateX: -y * 0.03,
        duration: 0.35,
        ease: 'power1.out',
        transformPerspective: 800,
      });

      gsap.to(plate, {
        x: x * 0.06,
        y: y * 0.06,
        duration: 0.3,
        ease: 'power1.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to([banner, plate], {
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    banner.addEventListener('mousemove', handleMouseMove);
    banner.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      floatTween.kill();
      banner.removeEventListener('mousemove', handleMouseMove);
      banner.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  /* -------------------------------------------------------------
   * 3.3 Add to Cart Micro-Interaction & Curved Particle Flight
   * ----------------------------------------------------------- */
  const handleAddToCart = useCallback(
    (product, e) => {
      const button = e.currentTarget;
      if (!button) {
        add(product.id);
        return;
      }

      // 1. Button Press Scale Feedback
      gsap
        .timeline()
        .to(button, { scale: 0.75, duration: 0.1, ease: 'power2.in' })
        .to(button, { scale: 1.15, duration: 0.15, ease: 'back.out(2)' })
        .to(button, { scale: 1.0, duration: 0.1 });

      // 2. Identify Target Cart Element (Header or Floating Dock)
      const targetCart =
        window.innerWidth >= 768
          ? headerCartRef.current
          : dockCartRef.current || headerCartRef.current;

      if (!targetCart) {
        add(product.id);
        return;
      }

      // 3. Compute Coordinates
      const origin = button.getBoundingClientRect();
      const destination = targetCart.getBoundingClientRect();

      // Create Flying Proxy Particle
      const flyer = document.createElement('div');
      flyer.className = 'cart-flyer-particle';
      Object.assign(flyer.style, {
        position: 'fixed',
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        backgroundColor: '#F5A623',
        boxShadow: '0 4px 12px rgba(245, 166, 35, 0.45)',
        zIndex: '99999',
        pointerEvents: 'none',
        left: `${origin.left + origin.width / 2 - 8}px`,
        top: `${origin.top + origin.height / 2 - 8}px`,
      });
      document.body.appendChild(flyer);

      const deltaX =
        destination.left + destination.width / 2 - (origin.left + origin.width / 2);
      const deltaY =
        destination.top + destination.height / 2 - (origin.top + origin.height / 2);

      // Curved Bezier Flight Animation
      const flightTimeline = gsap.timeline({
        onComplete: () => {
          flyer.remove();
          add(product.id);

          // 4. Cart icon receives item with elastic bump
          gsap
            .timeline()
            .to(targetCart, {
              scale: 1.35,
              rotate: -8,
              duration: 0.15,
              ease: 'power2.out',
            })
            .to(targetCart, {
              scale: 1.0,
              rotate: 0,
              duration: 0.45,
              ease: 'elastic.out(1.2, 0.3)',
            });
        },
      });

      flightTimeline.to(flyer, {
        x: deltaX,
        y: deltaY,
        scale: 0.35,
        duration: 0.55,
        ease: 'power2.in',
      });
    },
    [add]
  );

  /* -------------------------------------------------------------
   * 3.4 Floating Dock Active Indicator Slide (GSAP Flip)
   * ----------------------------------------------------------- */
  const handleTabClick = (tabId, e) => {
    if (tabId === 'cart') {
      openCart(dockCartRef.current);
      return;
    }
    if (tabId === 'search') {
      setIsSearchOpen((prev) => !prev);
      setActiveTab('search');
      return;
    }

    const tabElement = e.currentTarget;
    const highlight = activeHighlightRef.current;

    if (highlight && tabElement) {
      const state = Flip.getState(highlight);
      tabElement.appendChild(highlight);
      Flip.from(state, {
        duration: 0.4,
        ease: 'power3.out',
        absolute: true,
      });

      const icon = tabElement.querySelector('.tab-icon');
      if (icon) {
        gsap.fromTo(
          icon,
          { scale: 0.8 },
          { scale: 1, duration: 0.4, ease: 'back.out(2)' }
        );
      }
    }

    setActiveTab(tabId);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#F6F4EE] text-[#1A1A1A] selection:bg-[#F5A623] selection:text-black flex flex-col items-center justify-start pb-28 pt-2"
      style={{
        fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
      }}
    >
      {/* Centered Responsive Container with Neo-Editorial Width */}
      <div className="w-full max-w-xl lg:max-w-4xl px-3 sm:px-5">
        {/* =========================================================
            1.1 HEADER & STATUS REGION
            ========================================================= */}
        <header className="dashboard-app-header sticky top-0 z-30 pt-1 pb-2 bg-[#F6F4EE]/90 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3">
            {/* Left Action: Search Button (40x40px) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/')}
                aria-label="Back to landing page"
                className="w-10 h-10 rounded-full bg-white border border-black/5 shadow-2xs flex items-center justify-center text-[#1A1A1A] hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer"
                title="Return to CRAVE Home"
              >
                <ArrowLeft size={18} strokeWidth={2.2} />
              </button>

              <button
                type="button"
                onClick={() => setIsSearchOpen((prev) => !prev)}
                aria-label="Search dishes"
                className={`w-10 h-10 rounded-full border border-black/5 shadow-2xs flex items-center justify-center transition-all cursor-pointer ${
                  isSearchOpen
                    ? 'bg-[#1A1A1A] text-white'
                    : 'bg-white text-[#1A1A1A] hover:bg-neutral-100 active:scale-95'
                }`}
              >
                <Search size={18} strokeWidth={2.2} />
              </button>
            </div>

            {/* Center Control: Location Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLocationDropdownOpen((prev) => !prev)}
                className="flex flex-col items-center justify-center px-3 py-0.5 rounded-2xl hover:bg-white/60 active:scale-98 transition-all cursor-pointer"
                aria-expanded={isLocationDropdownOpen}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8A8E]">
                  Location
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-xs sm:text-sm font-black text-[#1A1A1A] tracking-tight truncate max-w-[170px] sm:max-w-[220px]">
                    {selectedLocation}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-[#1A1A1A] transition-transform duration-200 ${
                      isLocationDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Location Selector Dropdown Menu */}
              {isLocationDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-black/10 py-2 z-50">
                  <div className="px-3 py-1.5 border-b border-neutral-100 text-[10px] font-bold uppercase text-[#8A8A8E]">
                    Select Delivery Hearth
                  </div>
                  {locations.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        setSelectedLocation(loc);
                        setIsLocationDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs font-bold text-[#1A1A1A] hover:bg-[#F6F4EE] flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <MapPin size={13} className="text-[#F5A623]" />
                        <span>{loc}</span>
                      </span>
                      {selectedLocation === loc && (
                        <Check size={14} className="text-[#F5A623]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Action: Header Cart (40x40px) */}
            <button
              ref={headerCartRef}
              type="button"
              onClick={() => openCart(headerCartRef.current)}
              aria-label={`Cart with ${itemCount} items`}
              className="relative w-10 h-10 rounded-full bg-white border border-black/5 shadow-2xs flex items-center justify-center text-[#1A1A1A] hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer"
            >
              <ShoppingBag size={18} strokeWidth={2.2} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#F5A623] px-1 text-[10px] font-black text-black shadow-xs">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>
          </div>

          {/* Collapsible Search Input Box */}
          {isSearchOpen && (
            <div className="mt-2.5 relative">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8A8E]"
              />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jollof, burgers, wood-fired pizza..."
                className="w-full h-10 pl-10 pr-10 rounded-full bg-white border border-black/10 text-xs sm:text-sm font-semibold text-[#1A1A1A] placeholder:text-[#8A8A8E] outline-none focus:border-[#F5A623] shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-300"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          )}
        </header>

        {/* =========================================================
            1.2 INTERACTIVE FILTER PILL HORIZONTAL RAIL
            ========================================================= */}
        <div className="mt-1.5 -mx-3 px-3 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-2 w-max pr-4">
            {filterPills.map((pill) => {
              const isActive = activeFilter === pill.id;
              return (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setActiveFilter(pill.id)}
                  className={`filter-chip h-8 px-3.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 whitespace-nowrap shadow-2xs ${
                    isActive
                      ? 'bg-[#1A1A1A] text-white shadow-xs'
                      : 'bg-white text-[#1A1A1A] border border-black/5 hover:border-black/20'
                  }`}
                >
                  {pill.id === 'top-rated' && (
                    <Star size={11} className="text-[#F5A623] fill-[#F5A623]" />
                  )}
                  {pill.id === 'under30' && (
                    <Clock size={11} className="text-[#8A8A8E]" />
                  )}
                  <span>{pill.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================
            1.3 THE HERO SHOWCASE BANNER (Contrast Inversion Dark Card)
            ========================================================= */}
        <section
          ref={heroBannerRef}
          className="hero-showcase-card mt-3 relative rounded-[22px] bg-[#1E1E1E] text-white p-4 sm:p-5 overflow-hidden shadow-lg"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Subtle Ambient Accent Glow */}
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-[#F5A623]/20 blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-12 items-center gap-3">
            {/* Left Content */}
            <div className="col-span-7 sm:col-span-8 space-y-1">
              <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-[#F5A623] bg-white/10 px-2 py-0.5 rounded-full">
                <Sparkles size={10} />
                <span>Free Delivery</span>
              </span>

              <h2 className="text-base sm:text-lg md:text-xl font-black tracking-tight leading-tight">
                Free delivery for artisan spaghetti
              </h2>

              <p className="text-[11px] text-[#8A8A8E] leading-relaxed line-clamp-1">
                Wild tiger prawns, 48-hr stone broth & fresh garden basil.
              </p>

              <div className="pt-1.5">
                <button
                  type="button"
                  onClick={(e) => handleAddToCart(heroDish, e)}
                  className="h-8 sm:h-9 px-4 rounded-full bg-[#F5A623] hover:bg-[#e69818] active:scale-95 text-[#1A1A1A] font-extrabold text-[11px] sm:text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Order now</span>
                  <span className="text-[10px] font-bold opacity-80">
                    · {heroDish.formattedPrice}
                  </span>
                </button>
              </div>
            </div>

            {/* Right Overhanging Floating Food Plate Graphic */}
            <div className="col-span-5 sm:col-span-4 relative flex justify-end">
              <div
                ref={heroPlateRef}
                className="hero-food-plate w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden shadow-2xl relative select-none"
                style={{
                  boxShadow:
                    '0 16px 32px -8px rgba(0, 0, 0, 0.45), 0 0 0 2px rgba(255, 255, 255, 0.1)',
                }}
              >
                <img
                  src={heroDish.image}
                  alt={heroDish.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            1.4 CATEGORY ICON NAVIGATION BAR
            ========================================================= */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2 px-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1A1A1A]">
              Categories
            </h3>
            <span className="text-[10px] font-bold text-[#8A8A8E]">
              {categoryChips.length} cuisines
            </span>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-0.5 -mx-3 px-3">
            {categoryChips.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`category-pill flex flex-col items-center gap-1 shrink-0 transition-transform active:scale-95 cursor-pointer min-w-[50px]`}
                >
                  {/* Circular Disc with High-Res Image (48x48px to 52x52px) */}
                  <div
                    className={`w-12 h-12 rounded-full overflow-hidden p-0.5 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#1A1A1A] ring-2 ring-[#F5A623] shadow-md scale-105'
                        : 'bg-white border border-black/5 hover:border-black/20 shadow-2xs'
                    }`}
                  >
                    <img
                      src={cat.image}
                      alt={cat.label}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  {/* Title-case Label */}
                  <span
                    className={`text-[10px] font-bold tracking-tight text-center truncate max-w-[56px] ${
                      isSelected ? 'text-[#1A1A1A] font-black' : 'text-[#6E6D7A]'
                    }`}
                  >
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================
            1.5 PRODUCT LIST CARDS (Chef's Menu & Popular Dishes)
            ========================================================= */}
        <section className="mt-4 space-y-2.5">
          {/* Section Header */}
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-sm sm:text-base font-black text-[#1A1A1A] tracking-tight">
                {activeTab === 'favorites'
                  ? 'Saved Wishlist'
                  : selectedCategory !== 'all'
                  ? `${categoryChips.find((c) => c.id === selectedCategory)?.label || 'Selected'} Menu`
                  : 'Explore Our Menu'}
              </h3>
              <p className="text-[10px] sm:text-[11px] font-semibold text-[#6E6D7A]">
                {filteredProducts.length} chef-crafted dishes ready to order
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setActiveFilter('all');
                setSearchQuery('');
                setActiveTab('home');
              }}
              className="text-xs font-bold text-[#F5A623] hover:underline cursor-pointer"
            >
              See all
            </button>
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="bg-white rounded-2xl p-6 text-center space-y-2 border border-black/5">
              <div className="w-10 h-10 rounded-full bg-[#F6F4EE] flex items-center justify-center mx-auto text-[#8A8A8E]">
                <Search size={18} />
              </div>
              <h4 className="text-xs font-bold text-[#1A1A1A]">
                {activeTab === 'favorites'
                  ? 'No saved dishes yet'
                  : 'No dishes match your filter'}
              </h4>
              <p className="text-[11px] text-[#6E6D7A]">
                {activeTab === 'favorites'
                  ? 'Tap the heart icon on any dish to save it to your wishlist.'
                  : 'Try resetting your category or filter selection.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setActiveFilter('all');
                  setSearchQuery('');
                  setActiveTab('home');
                }}
                className="px-3.5 py-1.5 rounded-full bg-[#1A1A1A] text-white text-xs font-bold cursor-pointer"
              >
                {activeTab === 'favorites' ? 'Browse Full Menu' : 'Reset Filters'}
              </button>
            </div>
          )}

          {/* Responsive Cards Grid: 1 col on mobile, 2 cols on tablet/desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {filteredProducts.map((product) => {
              const isFav = favorites.has(product.id);
              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="product-card group relative bg-white rounded-2xl p-3 flex items-center gap-3 border border-black/5 hover:border-black/15 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  {/* Left Surface: Rounded Thumbnail Holder (64x64px or 70x70px) */}
                  <div className="w-16 h-16 sm:w-[70px] sm:h-[70px] rounded-xl overflow-hidden bg-[#F6F4EE] shrink-0 relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>

                  {/* Middle Content Block */}
                  <div className="flex-1 min-w-0 pr-8">
                    <h4 className="text-xs sm:text-sm font-extrabold text-[#1A1A1A] tracking-tight leading-snug truncate">
                      {product.name}
                    </h4>

                    {/* Metadata Subtitle (WCAG AA compliant #6E6D7A) */}
                    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-[#6E6D7A] mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock size={11} className="text-[#8A8A8E]" />
                        <span>~ {product.prepTime || '20 min'}</span>
                      </span>
                      <span>|</span>
                      <span className="font-extrabold text-[#1A1A1A] tabular-nums">
                        {product.formattedPrice}
                      </span>
                    </div>

                    <p className="text-[10px] text-[#8A8A8E] truncate mt-0.5">
                      {product.desc}
                    </p>
                  </div>

                  {/* Top-Right Metadata: Rating Pill */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(product.id, e)}
                      aria-label="Add to favorites"
                      className="text-neutral-400 hover:text-red-500 transition-colors p-0.5 cursor-pointer"
                    >
                      <Heart
                        size={14}
                        className={
                          isFav ? 'text-red-500 fill-red-500' : 'text-neutral-300'
                        }
                      />
                    </button>

                    <div className="flex items-center gap-0.5 bg-[#F6F4EE] px-1.5 py-0.5 rounded-full text-[9px] font-black text-[#1A1A1A]">
                      <Star size={10} className="text-[#F5A623] fill-[#F5A623]" />
                      <span>4.8</span>
                    </div>
                  </div>

                  {/* Bottom-Right Action: Circular Dark (+) Button (36x36px) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product, e);
                    }}
                    aria-label={`Add ${product.name} to order`}
                    className="absolute bottom-2.5 right-2.5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1A1A1A] hover:bg-[#F5A623] hover:text-black text-white flex items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus size={15} strokeWidth={2.6} />
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* =========================================================
          1.6 FLOATING BOTTOM ISLAND / DOCK NAVIGATION
          ========================================================= */}
      <aside className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-[340px] px-3 pointer-events-auto">
        <nav
          ref={tabsContainerRef}
          aria-label="Bottom Navigation Dock"
          className="floating-dock-nav relative flex items-center justify-between p-1 bg-[#1E1E1E]/95 backdrop-blur-md border border-white/10 rounded-full shadow-2xl"
        >
          {/* Tab 1: Home */}
          <button
            type="button"
            onClick={(e) => handleTabClick('home', e)}
            className="tab-item relative flex items-center justify-center h-10 px-3.5 rounded-full transition-all cursor-pointer select-none"
          >
            {activeTab === 'home' && (
              <span
                ref={activeHighlightRef}
                className="absolute inset-0 bg-[#F5A623] rounded-full z-0"
              />
            )}
            <div className="relative z-10 flex items-center gap-1.5 text-xs font-black">
              <span className="tab-icon">
                <Sparkles
                  size={15}
                  className={activeTab === 'home' ? 'text-black' : 'text-[#8A8A8E]'}
                />
              </span>
              {activeTab === 'home' && <span className="text-black">Home</span>}
            </div>
          </button>

          {/* Tab 2: Search */}
          <button
            type="button"
            onClick={(e) => handleTabClick('search', e)}
            className="tab-item relative flex items-center justify-center h-10 px-3.5 rounded-full transition-all cursor-pointer select-none"
          >
            {activeTab === 'search' && (
              <span
                ref={activeHighlightRef}
                className="absolute inset-0 bg-[#F5A623] rounded-full z-0"
              />
            )}
            <div className="relative z-10 flex items-center gap-1.5 text-xs font-black">
              <span className="tab-icon">
                <Search
                  size={15}
                  className={activeTab === 'search' ? 'text-black' : 'text-[#8A8A8E]'}
                />
              </span>
              {activeTab === 'search' && <span className="text-black">Search</span>}
            </div>
          </button>

          {/* Tab 3: Favorites */}
          <button
            type="button"
            onClick={(e) => handleTabClick('favorites', e)}
            className="tab-item relative flex items-center justify-center h-10 px-3.5 rounded-full transition-all cursor-pointer select-none"
          >
            {activeTab === 'favorites' && (
              <span
                ref={activeHighlightRef}
                className="absolute inset-0 bg-[#F5A623] rounded-full z-0"
              />
            )}
            <div className="relative z-10 flex items-center gap-1.5 text-xs font-black">
              <span className="tab-icon">
                <Heart
                  size={15}
                  className={activeTab === 'favorites' ? 'text-black' : 'text-[#8A8A8E]'}
                />
              </span>
              {activeTab === 'favorites' && (
                <span className="text-black">Saved ({favorites.size})</span>
              )}
            </div>
          </button>

          {/* Tab 4: Cart Quick Open */}
          <button
            ref={dockCartRef}
            type="button"
            onClick={(e) => handleTabClick('cart', e)}
            className="tab-item relative flex items-center justify-center h-10 px-3.5 rounded-full transition-all cursor-pointer select-none"
          >
            <div className="relative z-10 flex items-center gap-1.5 text-xs font-black">
              <span className="tab-icon relative">
                <ShoppingBag size={16} className="text-[#8A8A8E]" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full bg-[#F5A623] text-black text-[9px] font-black flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </span>
            </div>
          </button>
        </nav>
      </aside>

      {/* Product Detail Sheet Modal */}
      {selectedProduct && (
        <ProductDetailSheet
          product={selectedProduct}
          isOpen={Boolean(selectedProduct)}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(prod, qty) => {
            for (let i = 0; i < qty; i++) {
              add(prod.id);
            }
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}
