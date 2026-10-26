import { useRef, useEffect } from 'react';
import { X, Truck, Plus, Minus } from 'lucide-react';
import { gsap } from '../lib/gsap.js';
import { formatMoney } from '../lib/currency.js';

/**
 * Expanded full bottom sheet modal matching the video specifications:
 * - Header: "Cart" in bold white text
 * - Itemized list: white circle cutout thumbnail, "1 x", title, price
 * - Delivery row: truck icon in amber circle, delivery fee ($30.00), free shipping threshold note & progress bar
 * - Total & action footer: "Total:" label with bold currency amount ($59.97)
 * - Checkout CTA: full-width rounded yellow button (#FFB72B) labeled "Next"
 *
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {Array} props.lines
 * @param {(id: string) => void} props.increment
 * @param {(id: string) => void} props.decrement
 * @param {(id: string) => void} props.remove
 * @param {number} props.subtotalMinor
 * @param {number} props.deliveryMinor
 * @param {number} props.totalMinor
 * @param {() => void} props.onNext
 */
export default function ExpandedCartModal({
  isOpen,
  onClose,
  lines,
  increment,
  decrement,
  subtotalMinor,
  deliveryMinor,
  totalMinor,
  onNext,
  isAbsolute = false,
}) {
  const sheetRef = useRef(null);
  const backdropRef = useRef(null);
  const listRef = useRef(null);
  const footerRef = useRef(null);

  // GSAP sheet morph animation
  useEffect(() => {
    if (!sheetRef.current) return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';

      const tl = gsap.timeline();
      if (backdropRef.current) {
        tl.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.25, ease: 'power2.out' },
          0
        );
      }

      // Morph / slide from bottom capsule
      tl.fromTo(
        sheetRef.current,
        {
          yPercent: 100,
          opacity: 0.9,
          borderTopLeftRadius: '32px',
          borderTopRightRadius: '32px',
        },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.4,
          ease: 'power3.out',
        },
        0
      );

      // Stagger items cascading into view
      if (listRef.current) {
        tl.fromTo(
          listRef.current.children,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' },
          0.12
        );
      }

      if (footerRef.current) {
        tl.fromTo(
          footerRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
          0.18
        );
      }
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Threshold: $40.00 (4000 cents)
  const thresholdMinor = 4000;
  const progressRatio = Math.min(1, (subtotalMinor || 0) / thresholdMinor);
  const progressPercent = Math.round(progressRatio * 100);

  return (
    <div
      className={`${
        isAbsolute ? 'absolute inset-0 z-40' : 'fixed inset-0 z-50'
      } flex flex-col justify-end overflow-hidden`}
    >
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={onClose}
        className={`${
          isAbsolute ? 'absolute inset-0' : 'fixed inset-0'
        } bg-black/60 backdrop-blur-xs transition-opacity`}
        aria-hidden="true"
      />

      {/* Sheet Container */}
      <div
        ref={sheetRef}
        id="expanded-cart-sheet"
        className={`relative z-10 w-full ${
          isAbsolute ? 'h-[92%]' : 'max-w-[480px] mx-auto h-[88vh] max-h-[850px]'
        } bg-[#0B0B0B] text-white rounded-t-[32px] flex flex-col shadow-[0_-16px_48px_rgba(0,0,0,0.6)] overflow-hidden`}
        style={{
          fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
        }}
      >
        {/* Top Grab Handle Pill */}
        <div className="pt-3 pb-1 flex justify-center">
          <div
            onClick={onClose}
            className="w-10 h-1.5 rounded-full bg-white/25 cursor-pointer hover:bg-white/40 transition-colors"
            title="Drag or tap to close"
          />
        </div>

        {/* Sheet Header */}
        <div className="px-6 py-3 flex items-center justify-between border-b border-white/10 shrink-0">
          <h2 className="text-2xl md:text-[26px] font-extrabold text-white tracking-tight">
            Cart
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="w-9 h-9 rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} strokeWidth={2.2} />
          </button>
        </div>

        {/* Scrollable Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 overscroll-contain">
          {lines.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center text-white/60">
              <p className="text-sm">Your cart is empty.</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold hover:bg-white/20"
              >
                Browse menu
              </button>
            </div>
          ) : (
            <div ref={listRef} className="space-y-4">
              {lines.map((line) => {
                const imgSrc = line.product.icon || line.product.image;

                return (
                  <div
                    key={line.product.id}
                    className="flex items-center justify-between gap-3 py-2 border-b border-white/5"
                  >
                    {/* Left: Circular White Thumbnail */}
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 shrink-0 shadow-xs">
                      <img
                        src={imgSrc}
                        alt={line.product.name}
                        className="w-full h-full object-contain"
                        loading="eager"
                      />
                    </div>

                    {/* Quantity Multiplier */}
                    <span className="text-white font-extrabold text-sm shrink-0">
                      {line.qty} x
                    </span>

                    {/* Product Name & Details */}
                    <div className="flex-1 min-w-0 pr-2">
                      <h3 className="text-white font-semibold text-sm leading-tight truncate">
                        {line.product.name}
                      </h3>
                      <p className="text-[#8E8E93] text-xs font-medium mt-0.5 truncate">
                        {line.product.weight || '500g'}
                      </p>
                    </div>

                    {/* Quantity Stepper for adjustments */}
                    <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-2 py-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => decrement(line.product.id)}
                        aria-label={`Decrease ${line.product.name}`}
                        className="w-5 h-5 flex items-center justify-center text-white/70 hover:text-white text-xs font-bold"
                      >
                        <Minus size={11} strokeWidth={2.5} />
                      </button>
                      <button
                        type="button"
                        onClick={() => increment(line.product.id)}
                        aria-label={`Increase ${line.product.name}`}
                        className="w-5 h-5 flex items-center justify-center text-white/70 hover:text-white text-xs font-bold"
                      >
                        <Plus size={11} strokeWidth={2.5} />
                      </button>
                    </div>

                    {/* Line Total / Unit Price */}
                    <div className="text-right shrink-0 min-w-[60px]">
                      <span className="text-white font-bold text-sm tabular-nums">
                        {formatMoney(line.lineTotalMinor || line.product.priceMinor * line.qty)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Delivery Information Row */}
          {lines.length > 0 && (
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FFB72B]/15 text-[#FFB72B] flex items-center justify-center shrink-0">
                    <Truck size={16} strokeWidth={2.2} />
                  </div>
                  <div>
                    <span className="text-white font-bold text-sm">Delivery</span>
                    <p className="text-[#8E8E93] text-[11px] leading-tight mt-0.5">
                      All orders of $40 or more qualify for FREE delivery.
                    </p>
                  </div>
                </div>
                <span className="text-white/90 font-bold text-sm tabular-nums">
                  {deliveryMinor === 0 ? 'FREE' : formatMoney(deliveryMinor)}
                </span>
              </div>

              {/* Progress bar towards Free Delivery */}
              <div className="mt-2.5 w-full bg-white/15 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#FFB72B] h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Pinned Footer: Total & "Next" CTA Button */}
        {lines.length > 0 && (
          <div
            ref={footerRef}
            className="p-6 bg-[#0B0B0B] border-t border-white/10 shrink-0 space-y-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]"
          >
            {/* Total Row */}
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-white/80">Total:</span>
              <span className="text-[26px] md:text-[28px] font-black text-white tabular-nums tracking-tight">
                {formatMoney(totalMinor)}
              </span>
            </div>

            {/* Next CTA Button */}
            <button
              type="button"
              onClick={onNext}
              className="w-full h-12 md:h-14 rounded-full bg-[#FFB72B] hover:bg-[#F5AB1C] active:scale-[0.98] text-[#0B0B0B] font-extrabold text-base md:text-[17px] flex items-center justify-center transition-all shadow-[0_8px_20px_rgba(255,183,43,0.3)] cursor-pointer select-none"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
