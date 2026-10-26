import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, CreditCard, Banknote, Building2, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/useCart.js';
import { formatMoney } from '../lib/currency.js';
import { getDemoUser } from '../lib/storage.js';
import { ETA_TEXT } from '../config/site.js';

export default function CheckoutPage() {
  const { lines, subtotalMinor, deliveryMinor, totalMinor, placeOrder } = useCart();
  const navigate = useNavigate();

  const demoUser = getDemoUser();

  const [form, setForm] = useState({
    name: demoUser.name || '',
    email: demoUser.email || '',
    phone: demoUser.phone || '',
    address: demoUser.address || '',
    instructions: '',
    paymentMethod: 'card-demo',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If cart is empty, render empty state
  if (lines.length === 0) {
    return (
      <main id="main-content" className="w-full bg-[var(--color-canvas)] py-20 min-h-[70vh] flex items-center justify-center">
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-muted)] mx-auto mb-4 border border-[var(--color-border)]">
            <ShoppingBag size={32} />
          </div>
          <h1 className="font-display text-2xl font-bold text-[var(--color-ink)]">
            Your Cart is Empty
          </h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            You cannot proceed to checkout with an empty cart. Please select items from our menu first.
          </p>
          <div className="mt-6">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105"
            >
              <ArrowLeft size={16} />
              <span>Browse Menu</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const validate = () => {
    const errs = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      errs.name = 'Please enter your full name.';
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!form.phone.trim() || form.phone.trim().replace(/\D/g, '').length < 8) {
      errs.phone = 'Please enter a valid phone number (e.g. +234 800 000 0000).';
    }
    if (!form.address.trim() || form.address.trim().length < 6) {
      errs.address = 'Please enter a complete delivery address with street and landmark.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const order = placeOrder({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        instructions: form.instructions.trim(),
        paymentMethod: form.paymentMethod,
      });

      setIsSubmitting(false);

      if (order && order.number) {
        navigate(`/order/${order.number}/receipt`);
      } else {
        navigate('/');
      }
    }, 600);
  };

  return (
    <main id="main-content" className="w-full bg-[var(--color-canvas)] py-8 md:py-14 min-h-[85vh]">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-ink)] hover:text-[var(--color-ember-text)] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Cart</span>
          </Link>
          <span className="text-xs text-[var(--color-muted)] font-mono">
            Demo Checkout
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[var(--color-ink)] mb-8">
          Complete Your Order
        </h1>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Delivery & Payment Details */}
            <div className="lg:col-span-7 space-y-8">
              {/* Demo Mode Notice */}
              <div className="rounded-2xl border border-[var(--color-border)] bg-[rgba(31,157,85,0.08)] p-4 text-xs text-[var(--color-ink)] flex items-start gap-3">
                <ShieldCheck size={20} className="text-[var(--color-success)] shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Simulated Demonstration Checkout</strong>
                  <p className="text-[var(--color-muted)] mt-0.5">
                    No real money will be charged. All payments, tracking, and receipts are local simulations designed to test the frontend architecture.
                  </p>
                </div>
              </div>

              {/* Delivery Details Section */}
              <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm space-y-4">
                <h2 className="font-display text-xl font-bold text-[var(--color-ink)] mb-2">
                  1. Delivery Details
                </h2>

                <div>
                  <label htmlFor="customer-name" className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink)] mb-1">
                    Full Name *
                  </label>
                  <input
                    id="customer-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="E.g. Amara Okafor"
                    className={`w-full rounded-xl border p-3 text-sm text-[var(--color-ink)] bg-[var(--color-canvas)] focus:outline-none ${
                      errors.name ? 'border-red-500 bg-red-50/20' : 'border-[var(--color-border)] focus:border-[var(--color-ink)]'
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="customer-email" className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink)] mb-1">
                      Email Address *
                    </label>
                    <input
                      id="customer-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="amara@example.com"
                      className={`w-full rounded-xl border p-3 text-sm text-[var(--color-ink)] bg-[var(--color-canvas)] focus:outline-none ${
                        errors.email ? 'border-red-500 bg-red-50/20' : 'border-[var(--color-border)] focus:border-[var(--color-ink)]'
                      }`}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="customer-phone" className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink)] mb-1">
                      Phone Number *
                    </label>
                    <input
                      id="customer-phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+234 800 123 4567"
                      className={`w-full rounded-xl border p-3 text-sm text-[var(--color-ink)] bg-[var(--color-canvas)] focus:outline-none ${
                        errors.phone ? 'border-red-500 bg-red-50/20' : 'border-[var(--color-border)] focus:border-[var(--color-ink)]'
                      }`}
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="customer-address" className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink)] mb-1">
                    Delivery Address *
                  </label>
                  <input
                    id="customer-address"
                    type="text"
                    required
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Street name, house number, apartment, estate, or landmark"
                    className={`w-full rounded-xl border p-3 text-sm text-[var(--color-ink)] bg-[var(--color-canvas)] focus:outline-none ${
                      errors.address ? 'border-red-500 bg-red-50/20' : 'border-[var(--color-border)] focus:border-[var(--color-ink)]'
                    }`}
                  />
                  {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
                </div>

                <div>
                  <label htmlFor="customer-instructions" className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink)] mb-1">
                    Delivery Instructions (Optional)
                  </label>
                  <input
                    id="customer-instructions"
                    type="text"
                    value={form.instructions}
                    onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                    placeholder="Gate code, landmark, or driver call notes"
                    className="w-full rounded-xl border border-[var(--color-border)] p-3 text-sm text-[var(--color-ink)] bg-[var(--color-canvas)] focus:border-[var(--color-ink)] focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Method Section */}
              <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold text-[var(--color-ink)]">
                    2. Payment Method
                  </h2>
                  <span className="text-xs text-[var(--color-ember-text)] font-semibold">
                    Simulated Demo
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label
                    className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center cursor-pointer transition-all ${
                      form.paymentMethod === 'card-demo'
                        ? 'border-[var(--color-ember)] bg-[rgba(255,90,31,0.06)] text-[var(--color-ink)]'
                        : 'border-[var(--color-border)] bg-[var(--color-canvas)] text-[var(--color-muted)] hover:border-[var(--color-ink)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card-demo"
                      checked={form.paymentMethod === 'card-demo'}
                      onChange={() => setForm({ ...form, paymentMethod: 'card-demo' })}
                      className="sr-only"
                    />
                    <CreditCard size={22} className="mb-2 text-[var(--color-ember-text)]" />
                    <span className="text-xs font-bold">Debit / Card</span>
                    <span className="text-[10px] text-[var(--color-muted)] mt-0.5">Instant payment</span>
                  </label>

                  <label
                    className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center cursor-pointer transition-all ${
                      form.paymentMethod === 'transfer-demo'
                        ? 'border-[var(--color-ember)] bg-[rgba(255,90,31,0.06)] text-[var(--color-ink)]'
                        : 'border-[var(--color-border)] bg-[var(--color-canvas)] text-[var(--color-muted)] hover:border-[var(--color-ink)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transfer-demo"
                      checked={form.paymentMethod === 'transfer-demo'}
                      onChange={() => setForm({ ...form, paymentMethod: 'transfer-demo' })}
                      className="sr-only"
                    />
                    <Building2 size={22} className="mb-2 text-[var(--color-ember-text)]" />
                    <span className="text-xs font-bold">Bank Transfer</span>
                    <span className="text-[10px] text-[var(--color-muted)] mt-0.5">Simulated dynamic USSD</span>
                  </label>

                  <label
                    className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center cursor-pointer transition-all ${
                      form.paymentMethod === 'cash-demo'
                        ? 'border-[var(--color-ember)] bg-[rgba(255,90,31,0.06)] text-[var(--color-ink)]'
                        : 'border-[var(--color-border)] bg-[var(--color-canvas)] text-[var(--color-muted)] hover:border-[var(--color-ink)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash-demo"
                      checked={form.paymentMethod === 'cash-demo'}
                      onChange={() => setForm({ ...form, paymentMethod: 'cash-demo' })}
                      className="sr-only"
                    />
                    <Banknote size={22} className="mb-2 text-[var(--color-ember-text)]" />
                    <span className="text-xs font-bold">Cash on Delivery</span>
                    <span className="text-[10px] text-[var(--color-muted)] mt-0.5">Pay courier in person</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Review Summary & Place Action */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-md space-y-6 sticky top-24">
                <h2 className="font-display text-xl font-bold text-[var(--color-ink)]">
                  Order Summary
                </h2>

                {/* Compact Itemised Lines */}
                <div className="max-h-60 overflow-y-auto space-y-3 pr-1 divide-y divide-[var(--color-border)]">
                  {lines.map((line) => (
                    <div key={line.product.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[var(--color-ink)]">{line.qty}×</span>
                        <span className="text-[var(--color-ink)]">{line.product.name}</span>
                      </div>
                      <span className="font-semibold text-[var(--color-ink)] tabular-nums">
                        {formatMoney(line.lineTotalMinor)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Calculation Totals */}
                <div className="space-y-2 border-t border-[var(--color-border)] pt-4 text-sm">
                  <div className="flex justify-between text-[var(--color-muted)]">
                    <span>Subtotal</span>
                    <span className="tabular-nums font-medium text-[var(--color-ink)]">
                      {formatMoney(subtotalMinor)}
                    </span>
                  </div>

                  <div className="flex justify-between text-[var(--color-muted)]">
                    <span>Delivery Fee</span>
                    <span className="tabular-nums font-medium text-[var(--color-ink)]">
                      {formatMoney(deliveryMinor)}
                    </span>
                  </div>

                  <div className="flex justify-between pt-2 border-t border-[var(--color-border)] text-base font-extrabold text-[var(--color-ink)]">
                    <span>Grand Total</span>
                    <span className="text-2xl font-black text-[var(--color-ember-text)] tabular-nums">
                      {formatMoney(totalMinor)}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-[var(--color-canvas)] p-3 text-xs text-[var(--color-muted)]">
                  Estimated delivery time: <strong className="text-[var(--color-ink)]">{ETA_TEXT}</strong>
                </div>

                {/* Order Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-full bg-[var(--color-ink)] text-white font-semibold text-base shadow-xl hover:bg-[var(--color-ink-hover)] transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Processing Demo Order...</span>
                  ) : (
                    <>
                      <CheckCircle2 size={19} />
                      <span>Place Demo Order · {formatMoney(totalMinor)}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
