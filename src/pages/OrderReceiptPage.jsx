import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, Compass, Printer, ArrowLeft, ShieldCheck, MapPin, Phone, User, Calendar, AlertCircle } from 'lucide-react';
import { getOrder } from '../lib/storage.js';
import { formatMoney } from '../lib/currency.js';

export default function OrderReceiptPage() {
  const { id } = useParams();

  const order = useMemo(() => {
    return getOrder(id);
  }, [id]);

  if (!order) {
    return (
      <main id="main-content" className="w-full bg-[var(--color-canvas)] py-20 min-h-[70vh] flex items-center justify-center">
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-muted)] mx-auto mb-4 border border-[var(--color-border)]">
            <AlertCircle size={32} />
          </div>
          <h1 className="font-display text-2xl font-bold text-[var(--color-ink)]">
            Receipt Not Found
          </h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            We couldn&apos;t locate an order matching reference “{id}”. It may have expired or been placed in a different browser session.
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

  const orderDate = new Date(order.createdAt || order.savedAt || Date.now()).toLocaleString('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <main id="main-content" className="w-full bg-[var(--color-canvas)] py-8 md:py-14 min-h-[85vh]">
      <div className="mx-auto max-w-2xl px-4 md:px-6">
        {/* Top Actions */}
        <div className="mb-6 flex items-center justify-between print:hidden">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-ink)] hover:text-[var(--color-ember-text)] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Continue Browsing</span>
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-xs font-semibold text-[var(--color-ink)] hover:bg-[var(--color-canvas)] transition-colors"
          >
            <Printer size={14} />
            <span>Print Receipt</span>
          </button>
        </div>

        {/* Printable Receipt Card */}
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-10 shadow-lg space-y-8">
          {/* Success Banner */}
          <div className="text-center space-y-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-success)] text-white mx-auto shadow-md">
              <Check size={32} strokeWidth={2.5} />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--color-ink)]">
              Order Confirmed (Demo)
            </h1>
            <p className="text-xs text-[var(--color-muted)] max-w-md mx-auto">
              Thank you for ordering with CRAVE. This is a local frontend demonstration.
            </p>
          </div>

          {/* Meta Header */}
          <div className="grid grid-cols-2 gap-4 rounded-2xl bg-[var(--color-canvas)] p-4 text-xs">
            <div>
              <span className="text-[var(--color-muted)] block">Order Reference</span>
              <strong className="font-mono text-sm font-bold text-[var(--color-ink)]">{order.number}</strong>
            </div>
            <div>
              <span className="text-[var(--color-muted)] block">Date & Time</span>
              <span className="font-medium text-[var(--color-ink)] flex items-center gap-1 mt-0.5">
                <Calendar size={13} className="text-[var(--color-muted)]" />
                <span>{orderDate}</span>
              </span>
            </div>
          </div>

          {/* Customer & Delivery Information */}
          {order.customer && (
            <div className="rounded-2xl border border-[var(--color-border)] p-4 space-y-2 text-xs text-[var(--color-muted)]">
              <div className="font-bold text-[var(--color-ink)] uppercase tracking-wider text-[11px] mb-1">
                Delivery Details
              </div>
              <div className="flex items-center gap-2 text-[var(--color-ink)]">
                <User size={13} className="text-[var(--color-ember-text)]" />
                <span className="font-semibold">{order.customer.name}</span>
                {order.customer.email && <span className="text-[var(--color-muted)]">({order.customer.email})</span>}
              </div>
              {order.customer.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={13} className="text-[var(--color-ember-text)]" />
                  <span>{order.customer.phone}</span>
                </div>
              )}
              {order.customer.address && (
                <div className="flex items-start gap-2">
                  <MapPin size={13} className="text-[var(--color-ember-text)] shrink-0 mt-0.5" />
                  <span>{order.customer.address}</span>
                </div>
              )}
              {order.customer.instructions && (
                <div className="mt-2 pt-2 border-t border-[var(--color-border)] italic text-[var(--color-muted)]">
                  Note: “{order.customer.instructions}”
                </div>
              )}
            </div>
          )}

          {/* Itemized Line Items */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink)]">
              Purchased Items
            </h2>
            <div className="divide-y divide-[var(--color-border)] border-t border-b border-[var(--color-border)]">
              {order.lines.map((line) => (
                <div key={line.product.id} className="py-3 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[var(--color-ink)] tabular-nums">{line.qty}×</span>
                    <span className="font-medium text-[var(--color-ink)]">{line.product.name}</span>
                  </div>
                  <span className="font-bold text-[var(--color-ink)] tabular-nums">
                    {formatMoney(line.lineTotalMinor)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-[var(--color-muted)]">
              <span>Subtotal</span>
              <span className="font-medium text-[var(--color-ink)] tabular-nums">
                {formatMoney(order.subtotalMinor)}
              </span>
            </div>
            <div className="flex justify-between text-[var(--color-muted)]">
              <span>Delivery Fee</span>
              <span className="font-medium text-[var(--color-ink)] tabular-nums">
                {formatMoney(order.deliveryMinor)}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-[var(--color-border)] text-base font-extrabold text-[var(--color-ink)]">
              <span>Total Paid (Simulated)</span>
              <span className="text-2xl font-black text-[var(--color-ember-text)] tabular-nums">
                {formatMoney(order.totalMinor)}
              </span>
            </div>
          </div>

          {/* Tracking Call To Action */}
          <div className="pt-2 space-y-3 print:hidden">
            <Link
              to={`/track/${order.number}`}
              className="w-full h-14 rounded-full bg-[var(--color-ember)] text-white font-semibold text-base shadow-xl hover:bg-[#e04b14] transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Compass size={20} />
              <span>Track Live Delivery Simulation</span>
            </Link>

            <div className="flex items-center justify-center gap-1.5 text-xs text-[var(--color-muted)] text-center">
              <ShieldCheck size={14} className="text-[var(--color-success)]" />
              <span>Reference saved locally · Refreshing will preserve this receipt</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
