import { useEffect, useRef } from 'react';
import { Check, Compass, Receipt } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatMoney } from '../lib/currency.js';
import { gsap, useGSAP } from '../lib/gsap.js';

export default function OrderConfirmation({ lastOrder, onBackToMenu }) {
  const containerRef = useRef(null);
  const headingRef = useRef(null);

  // M11: Confirmation view entrance animation
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          ok: '(prefers-reduced-motion: no-preference)',
          reduce: '(prefers-reduced-motion: reduce)',
        },
        (ctx) => {
          const { reduce } = ctx.conditions;

          if (reduce) {
            gsap.fromTo(
              containerRef.current,
              { opacity: 0 },
              { opacity: 1, duration: 0.15 }
            );
            return;
          }

          const tl = gsap.timeline();
          tl.from(containerRef.current, {
            y: 16,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
          }).from(
            '.success-mark',
            {
              scale: 0.6,
              duration: 0.5,
              ease: 'back.out(1.6)',
            },
            '-=0.3'
          );
        }
      );

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus();
    }
  }, []);

  if (!lastOrder) return null;

  return (
    <div
      ref={containerRef}
      className="order-confirmation flex flex-col h-full justify-between p-6 overflow-y-auto"
    >
      <div>
        {/* Success Mark */}
        <div className="flex justify-center mb-4">
          <div className="success-mark w-16 h-16 rounded-full bg-[var(--color-success)] flex items-center justify-center text-white shadow-sm">
            <Check size={32} strokeWidth={2.5} aria-hidden="true" />
          </div>
        </div>

        {/* Heading */}
        <h2
          ref={headingRef}
          id="confirmation-title"
          tabIndex={-1}
          className="font-[var(--font-display)] font-extrabold text-2xl text-[var(--color-ink)] text-center tracking-[-0.02em] mb-1 focus:outline-none"
        >
          Order placed (demo)
        </h2>

        {/* Order Meta */}
        <p className="text-xs text-[var(--color-muted)] text-center mb-6">
          Order {lastOrder.number} · Estimated {lastOrder.etaText} (illustrative)
        </p>

        {/* Itemised list */}
        <div className="border-t border-b border-[var(--color-border)] py-4 mb-6">
          <ul className="space-y-3 list-none p-0 m-0">
            {lastOrder.lines.map((line) => (
              <li
                key={line.product.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-[var(--color-ink)] font-medium">
                  {line.product.name}{' '}
                  <span className="text-[var(--color-muted)]">× {line.qty}</span>
                </span>
                <span className="font-semibold text-[var(--color-ink)] tabular-nums">
                  {formatMoney(line.lineTotalMinor)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Totals */}
        <div className="space-y-2 mb-6 text-sm">
          <div className="flex justify-between text-[var(--color-muted)]">
            <span>Subtotal</span>
            <span className="tabular-nums font-medium text-[var(--color-ink)]">
              {formatMoney(lastOrder.subtotalMinor)}
            </span>
          </div>
          <div className="flex justify-between text-[var(--color-muted)]">
            <span>Delivery</span>
            <span className="tabular-nums font-medium text-[var(--color-ink)]">
              {formatMoney(lastOrder.deliveryMinor)}
            </span>
          </div>
          <div className="flex justify-between text-base font-bold text-[var(--color-ink)] pt-2 border-t border-[var(--color-border)]">
            <span>Total</span>
            <span className="text-[1.375rem] font-bold text-[var(--color-ink)] tabular-nums">
              {formatMoney(lastOrder.totalMinor)}
            </span>
          </div>
        </div>

        {/* Demo Notice Box */}
        <div className="bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-[var(--radius-control)] p-3 text-center mb-6">
          <p className="text-xs text-[var(--color-muted)] leading-relaxed">
            This is a demonstration. No payment was taken and no real order was sent.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 space-y-2.5">
        <button
          type="button"
          onClick={onBackToMenu}
          className="w-full h-[52px] rounded-[var(--radius-control)] bg-[var(--color-ink)] hover:bg-[var(--color-ink-hover)] active:scale-[0.98] text-white font-[var(--font-body)] font-semibold text-base transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink)] cursor-pointer select-none"
        >
          Back to menu
        </button>

        <div className="flex items-center justify-center gap-3 pt-1 text-xs text-[var(--color-muted)]">
          <Link
            to={`/track/${lastOrder.number}`}
            onClick={onBackToMenu}
            className="hover:text-[var(--color-ink)] underline underline-offset-2 flex items-center gap-1"
          >
            <Compass size={13} />
            <span>Track Delivery</span>
          </Link>
          <span>·</span>
          <Link
            to={`/order/${lastOrder.number}/receipt`}
            onClick={onBackToMenu}
            className="hover:text-[var(--color-ink)] underline underline-offset-2 flex items-center gap-1"
          >
            <Receipt size={13} />
            <span>View Receipt</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
