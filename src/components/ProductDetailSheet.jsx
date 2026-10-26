import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Heart, X } from 'lucide-react';
import { gsap } from '../lib/gsap.js';

/**
 * Responsive Product Detail Sheet / Modal matching the video specification:
 * - Back arrow (<) at top left / Close button
 * - Enlarged hero culinary food image
 * - Large 22px bold title + portion weight (e.g., 420g)
 * - Stepper pill (- 1 +) and large bold price ($14.99)
 * - "About the dish" section with authentic culinary descriptions
 * - Dietary tags
 * - Bottom row: Favorite heart button + warm yellow (#FFB72B) Add to Cart button
 *
 * @param {object} props
 * @param {import('../data/catalog.js').Product} props.product
 * @param {() => void} props.onClose
 * @param {(product: any, qty: number, heroImgEl: HTMLElement) => void} props.onAddToCart
 */
export default function ProductDetailSheet({ product, onClose, onAddToCart }) {
  const [qty, setQty] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const sheetRef = useRef(null);
  const backdropRef = useRef(null);
  const heroImgRef = useRef(null);
  const contentRef = useRef(null);
  const actionRowRef = useRef(null);

  // Animate detail sheet entrance
  useEffect(() => {
    if (!sheetRef.current) return;

    // Lock body scroll
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      // Backdrop fade
      if (backdropRef.current) {
        gsap.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.25, ease: 'power2.out' }
        );
      }

      // Sheet entrance
      gsap.fromTo(
        sheetRef.current,
        { opacity: 0, y: 30, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power2.out' }
      );

      // Hero image zoom
      if (heroImgRef.current) {
        gsap.fromTo(
          heroImgRef.current,
          { scale: 0.88, opacity: 0.6 },
          { scale: 1, opacity: 1, duration: 0.38, ease: 'back.out(1.2)' }
        );
      }

      // Metadata elements slide up
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current.children,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.32, stagger: 0.04, ease: 'power2.out', delay: 0.08 }
        );
      }

      // Action row entrance
      if (actionRowRef.current) {
        gsap.fromTo(
          actionRowRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', delay: 0.12 }
        );
      }
    }, sheetRef);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = origOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      ctx.revert();
    };
  }, [product, onClose]);

  if (!product) return null;

  const handleMinus = () => {
    setQty((prev) => Math.max(1, prev - 1));
  };

  const handlePlus = () => {
    setQty((prev) => Math.min(20, prev + 1));
  };

  const handleAdd = () => {
    onAddToCart(product, qty, heroImgRef.current);
  };

  const displayPrice = product.price
    ? `$${Number(product.price).toFixed(2)}`
    : product.priceMinor
    ? `$${(product.priceMinor / 100).toFixed(2)}`
    : '$14.99';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      {/* Sheet Container: Bottom sheet on mobile, rounded modal card on tablet & desktop */}
      <div
        ref={sheetRef}
        className="relative z-10 w-full sm:max-w-md md:max-w-lg max-h-[92vh] sm:max-h-[88vh] bg-[#FFFFFF] rounded-t-[32px] sm:rounded-[32px] flex flex-col justify-between overflow-hidden shadow-[0_-16px_48px_rgba(0,0,0,0.3)] sm:shadow-2xl"
        style={{
          fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
        }}
      >
        {/* Mobile Grab Handle Pill */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div
            onClick={onClose}
            className="w-10 h-1.5 rounded-full bg-neutral-300 cursor-pointer hover:bg-neutral-400 transition-colors"
            title="Tap to close"
          />
        </div>

        {/* Top App Bar with Back Arrow */}
        <div className="flex items-center justify-between px-5 pt-3 pb-2 shrink-0 border-b border-neutral-100">
          <button
            type="button"
            onClick={onClose}
            aria-label="Back to menu"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#111111] hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft size={20} strokeWidth={2.2} />
          </button>
          <span className="text-xs uppercase tracking-wider font-bold text-[#8E8E93]">
            Dish Detail
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#8E8E93] hover:text-[#111111] hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer"
          >
            <X size={18} strokeWidth={2.2} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="px-6 flex-1 overflow-y-auto py-4 space-y-4 overscroll-contain">
          {/* Hero Product Image */}
          <div className="py-2 flex items-center justify-center">
            <img
              ref={heroImgRef}
              src={product.image}
              alt={product.name}
              className="w-48 h-48 sm:w-56 sm:h-56 object-contain drop-shadow-md select-none"
              loading="eager"
            />
          </div>

          {/* Content Section */}
          <div ref={contentRef} className="space-y-4">
            {/* Title & Weight */}
            <div>
              <h1 className="text-[22px] sm:text-[24px] font-extrabold text-[#111111] leading-tight tracking-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-[#8E8E93] font-medium">
                  {product.weight || '500g'}
                </span>
                {product.prepTime && (
                  <>
                    <span className="text-neutral-300">•</span>
                    <span className="text-xs text-[#8E8E93] font-medium">
                      {product.prepTime}
                    </span>
                  </>
                )}
                {product.calories && (
                  <>
                    <span className="text-neutral-300">•</span>
                    <span className="text-xs text-[#8E8E93] font-medium">
                      {product.calories}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Stepper Pill & Large Right Price */}
            <div className="flex items-center justify-between pt-1">
              {/* Quantity Stepper Pill */}
              <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full border border-[#D1D1D6] bg-white text-[#111111] shadow-xs">
                <button
                  type="button"
                  onClick={handleMinus}
                  aria-label="Decrease quantity"
                  className="w-5 h-5 flex items-center justify-center font-bold text-base hover:text-black/60 transition-colors cursor-pointer select-none"
                >
                  −
                </button>
                <span className="w-5 text-center font-bold text-sm tabular-nums">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={handlePlus}
                  aria-label="Increase quantity"
                  className="w-5 h-5 flex items-center justify-center font-bold text-base hover:text-black/60 transition-colors cursor-pointer select-none"
                >
                  +
                </button>
              </div>

              {/* Inline Price */}
              <span className="text-[24px] sm:text-[28px] font-bold text-[#111111] tabular-nums tracking-tight">
                {displayPrice}
              </span>
            </div>

            {/* Dietary Tags */}
            {product.dietary && product.dietary.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {product.dietary.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-semibold bg-neutral-100 text-neutral-700 px-2.5 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* About The Dish Section */}
            <div className="pt-2 border-t border-neutral-100">
              <h2 className="text-[14px] font-bold text-[#111111] tracking-tight">
                About the dish
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-[#8E8E93] leading-relaxed">
                {product.longDesc || product.desc}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Action Row */}
        <div
          ref={actionRowRef}
          className="px-6 py-4 bg-white border-t border-neutral-100 flex items-center gap-3 shrink-0 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]"
        >
          {/* Wishlist Heart Button */}
          <button
            type="button"
            onClick={() => setIsLiked(!isLiked)}
            aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
            className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
              isLiked
                ? 'border-red-200 bg-red-50 text-red-500 scale-105'
                : 'border-[#D1D1D6] bg-white text-[#111111] hover:bg-neutral-50 active:scale-95'
            }`}
          >
            <Heart
              size={18}
              strokeWidth={2}
              className={isLiked ? 'fill-red-500 text-red-500' : 'text-[#111111]'}
            />
          </button>

          {/* Primary Warm Yellow Add to Cart Button */}
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 h-12 rounded-full bg-[#FFB72B] hover:bg-[#F5AB1C] active:scale-[0.98] text-[#0B0B0B] font-bold text-sm sm:text-base flex items-center justify-center transition-all shadow-sm cursor-pointer select-none"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
