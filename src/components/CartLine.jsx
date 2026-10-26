import { useRef } from 'react';
import { Plus, Minus } from 'lucide-react';
import { formatMoney } from '../lib/currency.js';
import { useCart } from '../context/useCart.js';
import { MAX_LINE_QTY } from '../config/site.js';
import { gsap } from '../lib/gsap.js';

export default function CartLine({
  line,
  removeBtnRef,
  onRemoveWithFocusHandoff,
}) {
  const { increment, decrement } = useCart();
  const { product, qty, lineTotalMinor } = line;
  const rowRef = useRef(null);
  const isRemovingRef = useRef(false);

  // M10: Cart line removal animation (height -> 0, opacity -> 0)
  const handleRemove = () => {
    if (isRemovingRef.current) return;
    isRemovingRef.current = true;

    const row = rowRef.current;
    if (!row) {
      onRemoveWithFocusHandoff(product.id);
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      onRemoveWithFocusHandoff(product.id);
      return;
    }

    gsap.to(row, {
      height: 0,
      opacity: 0,
      paddingTop: 0,
      paddingBottom: 0,
      marginTop: 0,
      marginBottom: 0,
      duration: 0.25,
      ease: 'power1.in',
      overflow: 'hidden',
      onComplete: () => {
        onRemoveWithFocusHandoff(product.id);
      },
    });
  };

  return (
    <li
      ref={rowRef}
      className="cart-line flex items-center gap-3 md:gap-4 py-4 border-b border-[var(--color-border)] last:border-b-0 overflow-hidden"
    >
      {/* 56px square thumbnail */}
      <div className="w-14 h-14 shrink-0 rounded-[var(--radius-img)] overflow-hidden bg-[var(--color-panel)] border border-[var(--color-border)]">
        <img
          src={product.image}
          alt=""
          width={1200}
          height={900}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      {/* Middle: Name, Unit Price, Stepper */}
      <div className="flex-1 min-w-0">
        <h3 className="font-[var(--font-display)] font-bold text-base text-[var(--color-ink)] leading-snug line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-[var(--color-muted)] tabular-nums mb-2">
          {formatMoney(product.priceMinor)}
        </p>

        {/* Stepper + Remove row */}
        <div className="flex items-center gap-3">
          <div
            className="inline-flex items-center bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-[var(--radius-pill)] p-0.5"
            role="group"
            aria-label={`Quantity controls for ${product.name}`}
          >
            <button
              type="button"
              onClick={() => {
                if (qty === 1) {
                  handleRemove();
                } else {
                  decrement(product.id);
                }
              }}
              aria-label={`Decrease quantity of ${product.name}`}
              className="w-8 h-8 rounded-full bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-neutral-100 active:scale-95 flex items-center justify-center cursor-pointer transition-colors border border-[var(--color-border)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink)] select-none"
            >
              <Minus size={16} strokeWidth={2} aria-hidden="true" />
            </button>

            <span
              className="min-w-[24px] text-center font-semibold text-xs text-[var(--color-ink)] tabular-nums px-1 select-none"
              aria-live="polite"
            >
              {qty}
            </span>

            <button
              type="button"
              disabled={qty >= MAX_LINE_QTY}
              onClick={() => increment(product.id)}
              aria-label={`Increase quantity of ${product.name}`}
              className="w-8 h-8 rounded-full bg-[var(--color-ember)] hover:bg-[var(--color-ember-pressed)] active:scale-95 text-white flex items-center justify-center cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink)] select-none"
            >
              <Plus size={16} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>

          <button
            ref={removeBtnRef}
            type="button"
            onClick={handleRemove}
            aria-label={`Remove ${product.name} from cart`}
            className="text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)] underline underline-offset-2 transition-colors cursor-pointer focus-visible:rounded p-1"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Right: Line Total */}
      <div className="shrink-0 text-right">
        <span className="font-semibold text-sm md:text-base text-[var(--color-ink)] tabular-nums">
          {formatMoney(lineTotalMinor)}
        </span>
      </div>
    </li>
  );
}
