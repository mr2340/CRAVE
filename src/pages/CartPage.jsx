import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, ArrowLeft, Clock, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/useCart.js';
import { formatMoney } from '../lib/currency.js';
import { ETA_TEXT } from '../config/site.js';

export default function CartPage() {
  const { lines, subtotalMinor, deliveryMinor, totalMinor, increment, decrement, remove } = useCart();
  const navigate = useNavigate();
  const [instructions, setInstructions] = useState('');

  if (lines.length === 0) {
    return (
      <main id="main-content" className="w-full bg-[var(--color-canvas)] py-16 md:py-24 min-h-[75vh] flex items-center justify-center">
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-muted)] mx-auto mb-6 border border-[var(--color-border)] shadow-sm">
            <ShoppingBag size={36} strokeWidth={1.5} />
          </div>
          <h1 className="font-display text-3xl font-extrabold text-[var(--color-ink)]">
            Your Cart is Empty
          </h1>
          <p className="mt-3 text-sm text-[var(--color-muted)] leading-relaxed">
            You haven’t added any dishes to your order yet. Explore our handcrafted smash burgers, wood-smoked jollof, ramen, and pizzas.
          </p>
          <div className="mt-8">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              <span>Explore Our Menu</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="w-full bg-[var(--color-canvas)] py-8 md:py-14 min-h-[80vh]">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        {/* Header Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-ink)] hover:text-[var(--color-ember-text)] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Continue Shopping</span>
          </Link>
          <span className="text-xs text-[var(--color-muted)] font-mono">
            {lines.length} {lines.length === 1 ? 'item' : 'items'} in cart
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[var(--color-ink)] mb-8">
          Review Your Order
        </h1>

        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Cart Line Items */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6 shadow-sm divide-y divide-[var(--color-border)]">
              {lines.map((line) => (
                <div
                  key={line.product.id}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* Dish Thumbnail & Meta */}
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={line.product.image}
                      alt={line.product.imageAlt}
                      width={80}
                      height={60}
                      className="h-16 w-20 rounded-xl object-cover bg-[var(--color-panel)] shrink-0 border border-[var(--color-border)]"
                    />
                    <div className="min-w-0">
                      <Link
                        to={`/menu/${line.product.slug || line.product.id}`}
                        className="font-display text-base font-bold text-[var(--color-ink)] hover:text-[var(--color-ember-text)] transition-colors truncate block"
                      >
                        {line.product.name}
                      </Link>
                      <div className="text-xs text-[var(--color-muted)]">
                        {formatMoney(line.product.priceMinor)} each
                      </div>
                    </div>
                  </div>

                  {/* Quantity Stepper & Line Total */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
                    <div className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-canvas)] p-1">
                      <button
                        type="button"
                        onClick={() => decrement(line.product.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white text-[var(--color-ink)] transition-colors"
                        aria-label={`Decrease ${line.product.name} quantity`}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-sm font-bold tabular-nums">
                        {line.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => increment(line.product.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-ink)] text-white hover:bg-[var(--color-ink-hover)] transition-colors"
                        aria-label={`Increase ${line.product.name} quantity`}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <span className="font-semibold text-base text-[var(--color-ink)] tabular-nums min-w-[70px] text-right">
                      {formatMoney(line.lineTotalMinor)}
                    </span>

                    <button
                      type="button"
                      onClick={() => remove(line.product.id)}
                      className="text-[var(--color-muted)] hover:text-red-500 transition-colors p-1"
                      aria-label={`Remove ${line.product.name} from cart`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Special Instructions Box */}
            <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm space-y-2">
              <label
                htmlFor="order-instructions"
                className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink)]"
              >
                Special Kitchen or Delivery Instructions
              </label>
              <textarea
                id="order-instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="E.g. Extra spicy, sauce on the side, leave at gate with security..."
                rows={2}
                className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-3 text-sm text-[var(--color-ink)] placeholder-[var(--color-muted)] focus:border-[var(--color-ink)] focus:outline-none"
              />
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout Action */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-md space-y-6 sticky top-24">
              <h2 className="font-display text-xl font-bold text-[var(--color-ink)]">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm divide-y divide-[var(--color-border)]">
                <div className="flex justify-between pt-2">
                  <span className="text-[var(--color-muted)]">Subtotal</span>
                  <span className="font-medium text-[var(--color-ink)] tabular-nums">
                    {formatMoney(subtotalMinor)}
                  </span>
                </div>

                <div className="flex justify-between pt-3">
                  <span className="text-[var(--color-muted)]">Delivery Fee</span>
                  <span className="font-medium text-[var(--color-ink)] tabular-nums">
                    {formatMoney(deliveryMinor)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 text-xs text-[var(--color-muted)]">
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-[var(--color-ember-text)]" />
                    <span>Estimated Arrival</span>
                  </span>
                  <span>{ETA_TEXT}</span>
                </div>

                <div className="flex justify-between pt-4 text-base font-extrabold text-[var(--color-ink)]">
                  <span>Total</span>
                  <span className="text-2xl font-black text-[var(--color-ember-text)] tabular-nums">
                    {formatMoney(totalMinor)}
                  </span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => navigate('/checkout')}
                  className="w-full h-14 rounded-full bg-[var(--color-ink)] text-white font-semibold text-base shadow-xl hover:bg-[var(--color-ink-hover)] transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={18} />
                </button>

                <div className="flex items-center justify-center gap-1.5 text-xs text-[var(--color-muted)] text-center">
                  <ShieldCheck size={14} className="text-[var(--color-success)]" />
                  <span>Frontend demonstration checkout · No real payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
