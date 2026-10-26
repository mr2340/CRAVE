import { House, UtensilsCrossed, ShoppingBag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/useCart.js';

export default function MobileNav() {
  const { isOpen, itemCount } = useCart();
  const location = useLocation();
  // Hidden while cart sheet is open
  if (isOpen) {
    return null;
  }

  const isHome = location.pathname === '/';
  const isCart = location.pathname === '/cart' || location.pathname === '/checkout';

  return (
    <aside className="fixed bottom-[calc(16px+env(safe-area-inset-bottom,0px))] left-1/2 -translate-x-1/2 z-30 md:hidden pointer-events-auto">
      <nav
        aria-label="Sections"
        className="flex items-center gap-2 p-1.5 bg-[var(--color-ink)] border border-neutral-800 rounded-[var(--radius-pill)] shadow-2xl backdrop-blur-md"
      >
        {/* Home */}
        <Link
          to="/"
          aria-label="Home"
          aria-current={isHome ? 'page' : undefined}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
            isHome
              ? 'bg-[var(--color-ember)] text-white shadow-sm'
              : 'text-[#A3A3A3] hover:text-white'
          }`}
        >
          <House size={22} strokeWidth={1.8} aria-hidden="true" />
        </Link>

        {/* Menu & Dashboard */}
        <Link
          to="/dashboard"
          aria-label="Ordering Dashboard"
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white text-[#A3A3A3] hover:text-white"
        >
          <UtensilsCrossed size={22} strokeWidth={1.8} aria-hidden="true" />
        </Link>

        {/* Cart */}
        <Link
          to="/cart"
          aria-label={`Cart, ${itemCount} items`}
          aria-current={isCart ? 'page' : undefined}
          className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
            isCart
              ? 'bg-[var(--color-ember)] text-white shadow-sm'
              : 'text-[#A3A3A3] hover:text-white'
          }`}
        >
          <ShoppingBag size={22} strokeWidth={1.8} aria-hidden="true" />
          {itemCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--color-ember)] px-1 text-[10px] font-bold text-white shadow">
              {itemCount > 99 ? '99+' : itemCount}
            </span>
          )}
        </Link>
      </nav>
    </aside>
  );
}
