import { useRef, useEffect } from 'react';
import { gsap } from '../lib/gsap.js';

/**
 * Floating bottom capsule pill cart matching the video specification:
 * - Deep black container (#0B0B0B)
 * - "Cart" in bold white font
 * - Miniature dynamic thumbnail tray of added items
 * - Saturated warm yellow badge (#FFB72B) with bounce pulse
 *
 * @param {object} props
 * @param {number} props.itemCount
 * @param {Array} props.lines
 * @param {() => void} props.onClick
 * @param {boolean} [props.isSheetOpen]
 * @param {boolean} [props.isAbsolute]
 */
export default function FloatingCartBar({
  itemCount,
  lines,
  onClick,
  isSheetOpen = false,
  isAbsolute = false,
}) {
  const barRef = useRef(null);
  const badgeRef = useRef(null);
  const prevCountRef = useRef(itemCount);

  // Spring bounce pulse on badge when count changes
  useEffect(() => {
    if (badgeRef.current && itemCount !== prevCountRef.current) {
      gsap.killTweensOf(badgeRef.current);
      gsap.fromTo(
        badgeRef.current,
        { scale: 1.0 },
        {
          scale: 1.35,
          duration: 0.16,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(badgeRef.current, {
              scale: 1.0,
              duration: 0.28,
              ease: 'elastic.out(1.2, 0.4)',
            });
          },
        }
      );
    }
    prevCountRef.current = itemCount;
  }, [itemCount]);

  if (isSheetOpen) return null;

  return (
    <div
      ref={barRef}
      id="floating-cart-bar"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`View cart, ${itemCount} items`}
      className={`${
        isAbsolute ? 'absolute bottom-6' : 'fixed bottom-5'
      } left-1/2 -translate-x-1/2 z-30 w-[calc(100%-36px)] max-w-[330px] md:max-w-[350px] h-[58px] md:h-[62px] bg-[#0B0B0B] text-white rounded-full px-5 flex items-center justify-between shadow-[0_12px_32px_rgba(0,0,0,0.35)] cursor-pointer select-none transition-transform hover:scale-[1.02] active:scale-[0.98] border border-white/10`}
      style={{
        fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
      }}
    >
      {/* Left: Bold Cart Label */}
      <span className="font-extrabold text-[16px] md:text-[17px] tracking-tight text-white">
        Cart
      </span>

      {/* Center: Dynamic Miniature Thumbnail Strip */}
      <div className="flex items-center -space-x-1.5 overflow-hidden max-w-[170px] px-2">
        {lines.map((line) => {
          const imgSrc = line.product.icon || line.product.image;
          return (
            <div
              key={line.product.id}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-0.5 shadow-sm border border-black/10 shrink-0 transition-transform"
              title={`${line.product.name} (x${line.qty})`}
            >
              <img
                src={imgSrc}
                alt={line.product.name}
                className="w-full h-full object-contain"
                loading="eager"
              />
            </div>
          );
        })}
      </div>

      {/* Right: Amber Badge with Dynamic Counter */}
      <div
        ref={badgeRef}
        id="floating-cart-badge"
        className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#FFB72B] text-black font-extrabold text-xs md:text-sm flex items-center justify-center shrink-0 shadow-sm transition-transform"
      >
        {itemCount}
      </div>
    </div>
  );
}
