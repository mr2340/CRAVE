import { useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/useCart.js';
import { formatMoney } from '../lib/currency.js';
import { gsap } from '../lib/gsap.js';
import CartLine from './CartLine.jsx';
import OrderConfirmation from './OrderConfirmation.jsx';

/**
 * CartDrawer - Native <dialog> Modal Drawer
 *
 * Implements CRAVE-DOCS exact specifications:
 * - UI_UX_SPEC.md §4.8 (Cart drawer / sheet) & §4.9 (Order confirmation)
 * - MOTION_SPEC.md M08 (Drawer enter/exit 0.45s/0.3s), M10 (Cart line removal), M11 (Confirmation transition)
 * - ACCESSIBILITY_SPEC.md §3 (Dialog pattern), §5 (Accessible names), §6 (Live announcements)
 * - ACCEPTANCE_TESTS.md Part 3 (D-01 to D-11)
 * - DESIGN_SYSTEM.md §2 (Colors), §3 (Typography), §5 (Shape & elevation)
 */
export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    isOpen,
    requestClose,
    lines,
    subtotalMinor,
    deliveryMinor,
    totalMinor,
    view,
    lastOrder,
    placeOrder,
    finishOrder,
    remove,
  } = useCart();

  const dialogRef = useRef(null);
  const scrimRef = useRef(null);
  const panelRef = useRef(null);
  const cartHeadingRef = useRef(null);
  const browseMenuBtnRef = useRef(null);
  const removeBtnRefs = useRef([]);
  const isClosingRef = useRef(false);

  // Close with reverse exit animation (M08)
  const handleClose = useCallback(
    (callback) => {
      if (isClosingRef.current) return;
      isClosingRef.current = true;

      const scrim = scrimRef.current;
      const panel = panelRef.current;
      const dialog = dialogRef.current;

      const finish = () => {
        isClosingRef.current = false;
        if (dialog && dialog.open) {
          dialog.close();
        }
        document.body.style.overflow = '';
        if (view === 'confirmation') {
          finishOrder();
        }
        requestClose();
        if (typeof callback === 'function') {
          callback();
        }
      };

      if (!scrim || !panel) {
        finish();
        return;
      }

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (prefersReducedMotion) {
        gsap.to([scrim, panel], {
          opacity: 0,
          duration: 0.15,
          onComplete: finish,
        });
        return;
      }

      const isDesktop = window.matchMedia('(min-width: 768px)').matches;

      gsap.to(scrim, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
      });

      gsap.to(panel, {
        [isDesktop ? 'xPercent' : 'yPercent']: 100,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: finish,
      });
    },
    [view, finishOrder, requestClose]
  );

  // Open / Close lifecycle (M08 entrance)
  useEffect(() => {
    const dialog = dialogRef.current;
    const scrim = scrimRef.current;
    const panel = panelRef.current;
    if (!dialog) return;

    if (isOpen) {
      isClosingRef.current = false;
      if (!dialog.open) {
        dialog.showModal();
      }
      document.body.style.overflow = 'hidden';

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (scrim && panel) {
        if (prefersReducedMotion) {
          gsap.fromTo(
            [scrim, panel],
            { opacity: 0 },
            { opacity: 1, duration: 0.15 }
          );
        } else {
          const isDesktop = window.matchMedia('(min-width: 768px)').matches;

          gsap.fromTo(
            scrim,
            { opacity: 0 },
            { opacity: 1, duration: 0.25, ease: 'power2.out' }
          );

          gsap.fromTo(
            panel,
            { [isDesktop ? 'xPercent' : 'yPercent']: 100 },
            {
              [isDesktop ? 'xPercent' : 'yPercent']: 0,
              duration: 0.45,
              ease: 'power3.out',
            }
          );
        }
      }

      // Focus drawer heading per UI_UX §4.8
      setTimeout(() => {
        if (view === 'cart' && cartHeadingRef.current) {
          cartHeadingRef.current.focus();
        }
      }, 50);
    } else {
      if (dialog.open) {
        dialog.close();
      }
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, view]);

  // Focus handoff after removing a line (D-08, UI_UX §4.8)
  const handleRemoveWithFocusHandoff = useCallback(
    (productId, index) => {
      remove(productId);
      setTimeout(() => {
        if (removeBtnRefs.current[index]) {
          removeBtnRefs.current[index]?.focus();
        } else if (index > 0 && removeBtnRefs.current[index - 1]) {
          removeBtnRefs.current[index - 1]?.focus();
        } else if (browseMenuBtnRef.current) {
          browseMenuBtnRef.current?.focus();
        }
      }, 50);
    },
    [remove]
  );

  // Browse the menu handler (D-07)
  const handleBrowseMenu = useCallback(() => {
    handleClose(() => {
      const menuEl = document.getElementById('menu');
      if (menuEl) {
        menuEl.scrollIntoView({ behavior: 'smooth' });
      } else if (window.location.pathname !== '/dashboard') {
        navigate('/dashboard');
      }
    });
  }, [handleClose, navigate]);

  // Place order action
  const handlePlaceOrder = () => {
    placeOrder();
  };

  // End demo from confirmation view (D-10)
  const handleEndDemo = useCallback(() => {
    handleClose();
  }, [handleClose]);

  return (
    <dialog
      id="cart-drawer"
      ref={dialogRef}
      aria-labelledby={view === 'confirmation' ? 'confirmation-title' : 'cart-title'}
      onCancel={(e) => {
        e.preventDefault();
        handleClose();
      }}
      className="m-0 p-0 border-0 bg-transparent text-[var(--color-ink)]"
    >
      {/* Scrim: clicks close drawer (D-04) */}
      <div
        ref={scrimRef}
        onClick={() => handleClose()}
        aria-hidden="true"
        className="fixed inset-0 bg-[var(--color-overlay)] transition-opacity"
      />

      {/* Panel: ≥768 right drawer 440px; <768 bottom sheet ≤ 88dvh (D-01) */}
      <div
        ref={panelRef}
        role="document"
        className="fixed bottom-0 left-0 right-0 md:left-auto md:top-0 md:bottom-0 md:right-0 w-full md:max-w-[440px] max-h-[88dvh] md:max-h-full h-auto md:h-full bg-[var(--color-surface)] rounded-t-[var(--radius-sheet)] md:rounded-t-none md:rounded-l-[var(--radius-card)] shadow-[var(--shadow-card)] z-10 flex flex-col overflow-hidden"
      >
        {view === 'confirmation' ? (
          // ==========================================
          // ORDER CONFIRMATION VIEW (F14, P1, M11)
          // ==========================================
          <div className="flex flex-col h-full overflow-hidden">
            <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] font-[var(--font-body)]">
                Order Receipt
              </span>
              <button
                type="button"
                onClick={handleEndDemo}
                aria-label="Close confirmation"
                className="w-11 h-11 rounded-full flex items-center justify-center text-[var(--color-ink)] hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink)] select-none"
              >
                <X size={20} strokeWidth={1.75} aria-hidden="true" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto">
              <OrderConfirmation
                lastOrder={lastOrder}
                onBackToMenu={handleEndDemo}
              />
            </div>
          </div>
        ) : (
          // ==========================================
          // CART LINES VIEW (F12, F13, P0)
          // ==========================================
          <div className="flex flex-col h-full overflow-hidden">
            {/* Header: h2 "Your cart", close X button 44px (UI_UX §4.8) */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] shrink-0">
              <h2
                id="cart-title"
                ref={cartHeadingRef}
                tabIndex={-1}
                className="font-[var(--font-display)] font-extrabold text-2xl text-[var(--color-ink)] tracking-tight focus:outline-none"
              >
                Your cart
              </h2>
              <button
                type="button"
                onClick={() => handleClose()}
                aria-label="Close cart"
                className="w-11 h-11 rounded-full flex items-center justify-center text-[var(--color-ink)] hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink)] select-none"
              >
                <X size={20} strokeWidth={1.75} aria-hidden="true" />
              </button>
            </header>

            {/* Scrollable Cart Lines Region */}
            <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
              {lines.length === 0 ? (
                // Empty state (D-06, UI_UX §4.8)
                <div className="flex flex-col items-center justify-center text-center py-16 px-4 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-canvas)] flex items-center justify-center text-[var(--color-muted)] mb-2">
                    <ShoppingBag size={32} strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <h3 className="font-[var(--font-display)] font-bold text-lg text-[var(--color-ink)]">
                    Your cart is empty
                  </h3>
                  <p className="text-sm text-[var(--color-muted)] max-w-[260px] leading-relaxed">
                    Add a dish from the menu and it will show up here.
                  </p>
                  <button
                    ref={browseMenuBtnRef}
                    type="button"
                    onClick={handleBrowseMenu}
                    className="mt-2 h-12 px-6 rounded-[var(--radius-control)] bg-[var(--color-ink)] hover:bg-[var(--color-ink-hover)] text-white text-sm font-semibold transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink)]"
                  >
                    Browse the menu
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-[var(--color-border)] list-none p-0 m-0">
                  {lines.map((line, index) => (
                    <CartLine
                      key={line.product.id}
                      line={line}
                      removeBtnRef={(el) => {
                        removeBtnRefs.current[index] = el;
                      }}
                      onRemoveWithFocusHandoff={(productId) =>
                        handleRemoveWithFocusHandoff(productId, index)
                      }
                    />
                  ))}
                </ul>
              )}
            </div>

            {/* Pinned Footer: rendered ONLY when cart has items (C-06, UI_UX §4.8) */}
            {lines.length > 0 && (
              <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-4 pb-[calc(16px+env(safe-area-inset-bottom,0px))] space-y-3 shrink-0">
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center justify-between text-[var(--color-muted)] font-medium">
                    <span>Subtotal</span>
                    <span className="text-[var(--color-ink)] font-semibold tabular-nums">
                      {formatMoney(subtotalMinor)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[var(--color-muted)] font-medium">
                    <span>Delivery</span>
                    <span className="text-[var(--color-ink)] font-semibold tabular-nums">
                      {formatMoney(deliveryMinor)}
                    </span>
                  </div>
                  <div className="h-px bg-[var(--color-border)] my-1" />
                  <div className="flex items-center justify-between text-base font-bold text-[var(--color-ink)]">
                    <span>Total</span>
                    <span className="text-[1.375rem] font-bold tabular-nums text-[var(--color-ink)]">
                      {formatMoney(totalMinor)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="w-full h-[52px] rounded-[var(--radius-control)] bg-[var(--color-ink)] hover:bg-[var(--color-ink-hover)] active:scale-[0.98] text-white font-[var(--font-body)] font-semibold text-base flex items-center justify-center transition-all cursor-pointer shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink)]"
                >
                  Place order (demo)
                </button>
              </footer>
            )}
          </div>
        )}
      </div>
    </dialog>
  );
}
