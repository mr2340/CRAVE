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
import { PRODUCTS, CATEGORIES } from '../data/catalog.js';
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

  // Hero Dish
  const heroDish = useMemo(() => {
    return PRODUCTS.find((p) => p.id === 'prawn-linguine') || PRODUCTS[2];
  }, []);

  // Filter Categories
  const categoryChips = useMemo(() => {
    const list = [
      { id: 'all', label: 'All', image: '/images/hero-plate-delicacy.jpg' },
      ...CATEGORIES.filter((c) => c.id !== 'all').map((c) => {
        const dish = PRODUCTS.find((p) => p.category === c.id);
        return {
          id: c.id,
          label: c.label.replace(' & Noodles', '').replace(' & Grills', ''),
          image: dish ? dish.image : '/images/dish-smash-burger.webp',
        };
      }),
    ];
    return list;
  }, []);

  // Filter Pills Definition
  const filterPills = [
    { id: 'all', label: 'All Dishes' },
    { id: 'pickup', label: 'Pickup' },
    { id: 'under30', label: 'Under 25 min' },
    { id: 'budget', label: 'Under ₦6,000' },
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
        if (mins > 25) return false;
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
          defaults: { ease: 'power4.out' },
        });

        // 1. Navigation & Search Bar drop down
        master.from('.dashboard-app-header', {
          y: -30,
          opacity: 0,
          duration: 0.7,
        });

        // 2. Filter chips glide horizontally with slight cascade
        master.from(
          '.filter-chip',
          {
            x: 40,
            opacity: 0,
            stagger: 0.05,
            duration: 0.5,
            ease: 'power2.out',
          },
          '-=0.4'
        );

        // 3. Hero banner scales up with organic overshoot
        master.from(
          '.hero-showcase-card',
          {
            scale: 0.92,
            y: 35,
            opacity: 0,
            duration: 0.8,
            ease: 'back.out(1.2)',
          },
          '-=0.3'
        );

        // 4. Hero food image drops in with rotational spin
        master.from(
          '.hero-food-plate',
          {
            scale: 0.5,
            rotation: -35,
            y: -20,
            opacity: 0,
            duration: 1.0,
            ease: 'elastic.out(1, 0.75)',
          },
          '-=0.6'
        );

        // 5. Category icons bounce upward sequentially
        master.from(
          '.category-pill',
          {
            y: 25,
            scale: 0.8,
            opacity: 0,
            stagger: 0.05,
            duration: 0.6,
            ease: 'back.out(1.5)',
          },
          '-=0.6'
        );

        // 6. Product cards slide into place
        master.from(
          '.product-card',
          {
            y: 40,
            opacity: 0,
            stagger: 0.08,
            duration: 0.6,
          },
          '-=0.4'
        );

        // 7. Floating dock pops up from below
        master.from(
          '.floating-dock-nav',
          {
            y: 60,
            scale: 0.9,
            opacity: 0,
            duration: 0.7,
            ease: 'back.out(1.4)',
          },
          '-=0.4'
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
      y: -8,
      rotation: 2,
      duration: 2.4,
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

      // Tilt card gently
      gsap.to(banner, {
        rotateY: x * 0.04,
        rotateX: -y * 0.04,
        duration: 0.4,
        ease: 'power1.out',
        transformPerspective: 800,
      });

      // Parallax shift the food plate further for depth separation
      gsap.to(plate, {
        x: x * 0.07,
        y: y * 0.07,
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
        duration: 0.6,
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
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        backgroundColor: '#F5A623',
        boxShadow: '0 4px 12px rgba(245, 166, 35, 0.45)',
        zIndex: '99999',
        pointerEvents: 'none',
        left: `${origin.left + origin.width / 2 - 9}px`,
        top: `${origin.top + origin.height / 2 - 9}px`,
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
        scale: 0.4,
        duration: 0.65,
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
      className="min-h-screen bg-[#F6F4EE] text-[#1A1A1A] selection:bg-[#F5A623] selection:text-black flex flex-col items-center justify-start pb-32"
      style={{
        fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
      }}
    >
      {/* Centered Responsive Container with Neo-Editorial Width */}
      <div className="w-full max-w-[480px] md:max-w-2xl lg:max-w-4xl px-4 sm:px-6 py-3">
        {/* =========================================================
            1.1 HEADER & STATUS REGION
            ========================================================= */}
        <header className="dashboard-app-header sticky top-0 z-30 pt-2 pb-3 bg-[#F6F4EE]/90 backdrop-blur-md">
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
                className="flex flex-col items-center justify-center px-3 py-1 rounded-2xl hover:bg-white/60 active:scale-98 transition-all cursor-pointer"
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
            <div className="mt-3 relative">
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
                className="w-full h-11 pl-10 pr-10 rounded-full bg-white border border-black/10 text-xs sm:text-sm font-semibold text-[#1A1A1A] placeholder:text-[#8A8A8E] outline-none focus:border-[#F5A623] shadow-xs"
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
        <div className="mt-2 -mx-4 px-4 overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center gap-2 w-max pr-6">
            {filterPills.map((pill) => {
              const isActive = activeFilter === pill.id;
              return (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setActiveFilter(pill.id)}
                  className={`filter-chip h-9 px-4 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 whitespace-nowrap shadow-2xs ${
                    isActive
                      ? 'bg-[#1A1A1A] text-white shadow-xs'
                      : 'bg-white text-[#1A1A1A] border border-black/5 hover:border-black/20'
                  }`}
                >
                  {pill.id === 'top-rated' && (
                    <Star size={12} className="text-[#F5A623] fill-[#F5A623]" />
                  )}
                  {pill.id === 'under30' && (
                    <Clock size={12} className="text-[#8A8A8E]" />
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
          className="hero-showcase-card mt-5 relative rounded-[28px] bg-[#1E1E1E] text-white p-6 sm:p-7 overflow-hidden shadow-xl"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Subtle Accent Glow In Background */}
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-[#F5A623]/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-12 items-center gap-4">
            {/* Left Content */}
            <div className="col-span-7 sm:col-span-8 space-y-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#F5A623] bg-white/10 px-2.5 py-0.5 rounded-full">
                <Sparkles size={11} />
                <span>Free Delivery Special</span>
              </span>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                Free delivery for artisan pasta
              </h2>

              <p className="text-xs text-[#8A8A8E] leading-relaxed line-clamp-2">
                Wild tiger prawns, 48-hr stone-simmered broth & fresh garden basil.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={(e) => handleAddToCart(heroDish, e)}
                  className="h-10 px-5 rounded-full bg-[#F5A623] hover:bg-[#e69818] active:scale-95 text-[#1A1A1A] font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Order now</span>
                  <span className="text-[11px] font-bold opacity-80">
                    · {heroDish.formattedPrice}
                  </span>
                </button>
              </div>
            </div>

            {/* Right Overhanging Floating Food Plate Graphic */}
            <div className="col-span-5 sm:col-span-4 relative flex justify-end">
              <div
                ref={heroPlateRef}
                className="hero-food-plate w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden shadow-2xl relative select-none"
                style={{
                  boxShadow:
                    '0 20px 40px -10px rgba(0, 0, 0, 0.5), 0 0 0 2px rgba(255, 255, 255, 0.1)',
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
        <div className="mt-7">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-extrabold text-[#1A1A1A] tracking-tight">
              Categories
            </h3>
            <span className="text-[11px] font-bold text-[#8A8A8E]">
              {categoryChips.length} cuisines
            </span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1 -mx-4 px-4">
            {categoryChips.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`category-pill flex flex-col items-center gap-1.5 shrink-0 transition-transform active:scale-95 cursor-pointer min-w-[56px]`}
                >
                  {/* Circular Disc with High-Res Image (48x48px to 56x56px) */}
                  <div
                    className={`w-14 h-14 rounded-full overflow-hidden p-1 flex items-center justify-center transition-all ${
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
                    className={`text-[11px] font-bold tracking-tight text-center truncate max-w-[64px] ${
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
            1.5 PRODUCT LIST CARDS
            ========================================================= */}
        <section className="mt-8 space-y-3">
          {/* Section Header */}
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-base font-black text-[#1A1A1A] tracking-tight">
                {activeTab === 'favorites'
                  ? 'Your Saved Favorites'
                  : 'Coffee, Grills & Delicacy Moments'}
              </h3>
              <p className="text-[11px] font-semibold text-[#6E6D7A]">
                Showing {filteredProducts.length} handcrafted dishes
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setActiveFilter('all');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-[#F5A623] hover:underline cursor-pointer"
            >
              See all
            </button>
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="bg-white rounded-3xl p-8 text-center space-y-3 border border-black/5">
              <div className="w-12 h-12 rounded-full bg-[#F6F4EE] flex items-center justify-center mx-auto text-[#8A8A8E]">
                <Search size={20} />
              </div>
              <h4 className="text-sm font-bold text-[#1A1A1A]">
                No dishes match your filter
              </h4>
              <p className="text-xs text-[#6E6D7A]">
                Try resetting your filters or search keywords.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setActiveFilter('all');
                  setSearchQuery('');
                  setActiveTab('home');
                }}
                className="px-4 py-2 rounded-full bg-[#1A1A1A] text-white text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Cards Stack */}
          <div className="space-y-3">
            {filteredProducts.map((product) => {
              const isFav = favorites.has(product.id);
              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="product-card group relative bg-white rounded-2xl p-3.5 flex items-center gap-3.5 border border-black/5 hover:border-black/15 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  {/* Left Surface: Rounded Thumbnail Holder (72x72px) */}
                  <div className="w-[72px] h-[72px] rounded-xl overflow-hidden bg-[#F6F4EE] shrink-0 relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>

                  {/* Middle Content Block */}
                  <div className="flex-1 min-w-0 pr-8">
                    <h4 className="text-sm font-extrabold text-[#1A1A1A] tracking-tight leading-snug truncate">
                      {product.name}
                    </h4>

                    {/* Metadata Subtitle with High-Contrast WCAG AA */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#6E6D7A] mt-1">
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-[#8A8A8E]" />
                        <span>~ {product.prepTime || '20 min'}</span>
                      </span>
                      <span>·</span>
                      <span className="font-extrabold text-[#1A1A1A] tabular-nums">
                        {product.formattedPrice}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#8A8A8E] truncate mt-0.5">
                      {product.desc}
                    </p>
                  </div>

                  {/* Top-Right Metadata: Rating Pill */}
                  <div className="absolute top-3.5 right-3.5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(product.id, e)}
                      aria-label="Add to favorites"
                      className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Heart
                        size={15}
                        className={
                          isFav ? 'text-red-500 fill-red-500' : 'text-neutral-300'
                        }
                      />
                    </button>

                    <div className="flex items-center gap-0.5 bg-[#F6F4EE] px-2 py-0.5 rounded-full text-[10px] font-black text-[#1A1A1A]">
                      <Star size={11} className="text-[#F5A623] fill-[#F5A623]" />
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
                    className="absolute bottom-3.5 right-3.5 w-9 h-9 rounded-full bg-[#1A1A1A] hover:bg-[#F5A623] hover:text-black text-white flex items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus size={16} strokeWidth={2.6} />
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
      <aside className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-full max-w-[360px] px-4 pointer-events-auto">
        <nav
          ref={tabsContainerRef}
          aria-label="Bottom Navigation Dock"
          className="floating-dock-nav relative flex items-center justify-between p-1.5 bg-[#1E1E1E]/95 backdrop-blur-md border border-white/10 rounded-full shadow-2xl"
        >
          {/* Tab 1: Home */}
          <button
            type="button"
            onClick={(e) => handleTabClick('home', e)}
            className="tab-item relative flex items-center justify-center h-11 px-4 rounded-full transition-all cursor-pointer select-none"
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
                  size={16}
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
            className="tab-item relative flex items-center justify-center h-11 px-4 rounded-full transition-all cursor-pointer select-none"
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
                  size={16}
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
            className="tab-item relative flex items-center justify-center h-11 px-4 rounded-full transition-all cursor-pointer select-none"
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
                  size={16}
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
            className="tab-item relative flex items-center justify-center h-11 px-4 rounded-full transition-all cursor-pointer select-none"
          >
            <div className="relative z-10 flex items-center gap-1.5 text-xs font-black">
              <span className="tab-icon relative">
                <ShoppingBag size={17} className="text-[#8A8A8E]" />
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
