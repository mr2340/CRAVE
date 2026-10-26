import { useRef, useState } from 'react';
import {
  ShoppingBag,
  Search,
  Phone,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/useCart.js';
import { formatMoney } from '../lib/currency.js';
import { CATEGORIES } from '../data/catalog.js';
import { gsap, useGSAP } from '../lib/gsap.js';

export default function Header() {
  const { itemCount, subtotalMinor, openCart } = useCart();
  const headerRef = useRef(null);
  const badgeRef = useRef(null);
  const prevCountRef = useRef(itemCount);
  const isHydratedRef = useRef(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  const badgeText = itemCount > 99 ? '99+' : itemCount.toString();
  const accessibleLabel = itemCount === 0 ? 'Cart, empty' : `Cart, ${itemCount} items`;

  // Badge pulse animation on increase
  useGSAP(
    () => {
      if (!isHydratedRef.current) {
        isHydratedRef.current = true;
        prevCountRef.current = itemCount;
        return;
      }

      if (itemCount > prevCountRef.current && badgeRef.current) {
        const mm = gsap.matchMedia();
        mm.add('(prefers-reduced-motion: no-preference)', () => {
          gsap.fromTo(
            badgeRef.current,
            { scale: 1 },
            {
              scale: 1.25,
              duration: 0.15,
              ease: 'power2.out',
              yoyo: true,
              repeat: 1,
              overwrite: true,
            }
          );
        });
      }

      prevCountRef.current = itemCount;
    },
    { scope: headerRef, dependencies: [itemCount] }
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const target = document.getElementById('popular') || document.getElementById('best-sellers');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = '#popular';
    }
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 w-full bg-white border-b border-[#E8E6DF] shadow-2xs pt-[env(safe-area-inset-top,0px)]"
      style={{
        fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
      }}
    >
      <div className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          {/* Logo with African heritage tag */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="font-black text-2xl md:text-[28px] tracking-[-0.03em] text-[#111111] flex items-center gap-1"
              aria-label="CRAVE Home"
            >
              <span>CRAVE</span>
              <span className="text-[var(--color-ember)]">.</span>
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-neutral-500 bg-[#F6F5F2] px-2 py-0.5 rounded-full border border-[#E8E6DF]">
              <span>🇳🇬 Lagos Kitchen</span>
            </span>
          </div>

          {/* Center Search Input with Category Select (matches reference layout) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xl items-center bg-[#F6F5F2] border border-[#E8E6DF] rounded-full p-1 pl-4 focus-within:border-[#111111] focus-within:bg-white transition-all shadow-2xs"
          >
            <div className="flex items-center gap-2 flex-1 text-sm">
              <Search size={16} className="text-neutral-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jollof, smash burgers, wood-fired pizza..."
                className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-[#111111] placeholder:text-neutral-400"
              />
            </div>

            <div className="h-5 w-px bg-neutral-300 mx-2" />

            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="bg-transparent text-xs font-semibold text-neutral-600 outline-none pr-3 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="w-9 h-9 rounded-full bg-[var(--color-ember)] text-white flex items-center justify-center shrink-0 hover:bg-[#e04b14] transition-colors cursor-pointer"
              aria-label="Submit search"
            >
              <Search size={15} strokeWidth={2.5} />
            </button>
          </form>

          {/* Right Utility: Hotline & Cart with Naira Subtotal */}
          <div className="flex items-center gap-3">
            {/* Lagos Hotline (hidden on small screens) */}
            <a
              href="tel:+2348031234567"
              className="hidden lg:flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-black transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#F6F5F2] flex items-center justify-center text-[var(--color-ember)]">
                <Phone size={14} />
              </div>
              <div>
                <p className="text-[10px] text-neutral-400 leading-tight">Order Hotline</p>
                <p className="font-bold text-[#111111] leading-tight">+234 803 123 4567</p>
              </div>
            </a>
            {/* Ordering App Launch Button */}
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 h-9 sm:h-10 px-3.5 rounded-full bg-[#111111] text-white hover:bg-[var(--color-ember)] hover:text-black font-extrabold text-xs transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Sparkles size={14} className="text-[#FFB72B]" />
              <span className="hidden xs:inline">App View</span>
            </Link>

            {/* Cart Trigger with Naira Total */}
            <button
              id="header-cart-button"
              type="button"
              onClick={(e) => openCart(e.currentTarget)}
              aria-label={accessibleLabel}
              className="inline-flex items-center gap-2.5 h-9 sm:h-10 px-3.5 rounded-full bg-[#111111] text-white hover:bg-black transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <div className="relative">
                <ShoppingBag size={17} strokeWidth={2} />
                {itemCount > 0 && (
                  <span
                    ref={badgeRef}
                    id="header-cart-badge"
                    className="absolute -top-1.5 -right-2 min-w-[17px] h-[17px] px-1 rounded-full bg-[var(--color-ember)] text-white text-[10px] font-black flex items-center justify-center leading-none"
                  >
                    {badgeText}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-left border-l border-white/20 pl-2">
                <p className="text-[10px] text-neutral-400 leading-tight">Total</p>
                <p className="text-xs font-black text-white leading-tight tabular-nums">
                  {formatMoney(subtotalMinor)}
                </p>
              </div>
            </button>
          </div>
        </div>
    </header>
  );
}
