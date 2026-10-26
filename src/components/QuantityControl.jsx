import { useRef, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useCart } from '../context/useCart.js';
import { MAX_LINE_QTY } from '../config/site.js';
import { gsap, useGSAP } from '../lib/gsap.js';

export default function QuantityControl({ product }) {
  const { qtyOf, add, increment, decrement } = useCart();
  const qty = qtyOf(product.id);
  const containerRef = useRef(null);
  const stepperRef = useRef(null);
  const prevQtyRef = useRef(qty);
  const addButtonRef = useRef(null);

  // M06: Animate stepper appearance on 0 -> 1 transition
  useGSAP(
    () => {
      if (prevQtyRef.current === 0 && qty === 1 && stepperRef.current) {
        const mm = gsap.matchMedia();
        mm.add('(prefers-reduced-motion: no-preference)', () => {
          gsap.fromTo(
            stepperRef.current,
            { scale: 0.85, opacity: 0, transformOrigin: 'right center' },
            { scale: 1, opacity: 1, duration: 0.25, ease: 'power2.out', overwrite: true }
          );
        });
      }
    },
    { scope: containerRef, dependencies: [qty] }
  );

  // Focus handoff per A-12: when decremented from 1 to 0, focus lands on the Add button
  useEffect(() => {
    if (prevQtyRef.current === 1 && qty === 0 && addButtonRef.current) {
      addButtonRef.current.focus();
    }
    prevQtyRef.current = qty;
  }, [qty]);

  return (
    <div ref={containerRef} className="h-11 flex items-center justify-end">
      {qty === 0 ? (
        <button
          ref={addButtonRef}
          type="button"
          onClick={() => add(product.id)}
          aria-label={`Add ${product.name} to cart`}
          className="w-11 h-11 rounded-full bg-[var(--color-ember)] hover:bg-[var(--color-ember-pressed)] active:scale-95 text-white flex items-center justify-center cursor-pointer transition-colors shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink)] select-none"
        >
          <Plus size={24} strokeWidth={2} aria-hidden="true" />
        </button>
      ) : (
        <div
          ref={stepperRef}
          className="stepper-control inline-flex items-center bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-[var(--radius-pill)] p-0.5"
          role="group"
          aria-label={`Quantity controls for ${product.name}`}
        >
          {/* Decrement Button */}
          <button
            type="button"
            onClick={() => decrement(product.id)}
            aria-label={`Decrease quantity of ${product.name}`}
            className="w-10 h-10 rounded-full bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-neutral-100 active:scale-95 flex items-center justify-center cursor-pointer transition-colors border border-[var(--color-border)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink)] select-none"
          >
            <Minus size={18} strokeWidth={2} aria-hidden="true" />
          </button>

          {/* Count Text */}
          <span
            className="min-w-[28px] text-center font-semibold text-sm text-[var(--color-ink)] tabular-nums px-1 select-none"
            aria-live="polite"
          >
            {qty}
          </span>

          {/* Increment Button */}
          <button
            type="button"
            disabled={qty >= MAX_LINE_QTY}
            onClick={() => increment(product.id)}
            aria-label={`Increase quantity of ${product.name}`}
            className="w-10 h-10 rounded-full bg-[var(--color-ember)] hover:bg-[var(--color-ember-pressed)] active:scale-95 text-white flex items-center justify-center cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink)] select-none"
          >
            <Plus size={18} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
