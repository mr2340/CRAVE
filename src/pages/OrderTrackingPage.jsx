import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, Flame, Bike, PackageCheck, AlertCircle, ArrowLeft, RefreshCw, Phone, Receipt, Info } from 'lucide-react';
import { getOrder } from '../lib/storage.js';
import { formatMoney } from '../lib/currency.js';

const TRACKING_STEPS = [
  {
    step: 1,
    title: 'Order Received',
    desc: 'Kitchen has received and confirmed your ticket.',
    time: '2 mins ago',
    icon: Check,
  },
  {
    step: 2,
    title: 'Preparing Your Food',
    desc: 'Chef is searing prime chuck and firing wood-stone ovens.',
    time: 'In progress',
    icon: Flame,
  },
  {
    step: 3,
    title: 'Out for Delivery',
    desc: 'Courier has picked up your thermal-sealed order bag.',
    time: 'Estimated ~18 mins',
    icon: Bike,
  },
  {
    step: 4,
    title: 'Delivered',
    desc: 'Order handed over. Enjoy your CRAVE feast!',
    time: 'Completed',
    icon: PackageCheck,
  },
];

export default function OrderTrackingPage() {
  const { id } = useParams();

  const order = useMemo(() => {
    return getOrder(id);
  }, [id]);

  // Current simulation step (1 to 4)
  const [currentStep, setCurrentStep] = useState(2);

  if (!order) {
    return (
      <main id="main-content" className="w-full bg-[var(--color-canvas)] py-20 min-h-[70vh] flex items-center justify-center">
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-muted)] mx-auto mb-4 border border-[var(--color-border)]">
            <AlertCircle size={32} />
          </div>
          <h1 className="font-display text-2xl font-bold text-[var(--color-ink)]">
            Order Not Found
          </h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            We couldn&apos;t locate active tracking for order reference “{id}”.
          </p>
          <div className="mt-6">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105"
            >
              <ArrowLeft size={16} />
              <span>Back to Menu</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const handleAdvanceStep = () => {
    setCurrentStep((prev) => (prev < 4 ? prev + 1 : 1));
  };

  const activeStepMeta = TRACKING_STEPS[currentStep - 1];

  return (
    <main id="main-content" className="w-full bg-[var(--color-canvas)] py-8 md:py-14 min-h-[85vh]">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-ink)] hover:text-[var(--color-ember-text)] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Menu</span>
          </Link>
          <Link
            to={`/order/${order.number}/receipt`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-ink)]"
          >
            <Receipt size={14} />
            <span>View Receipt</span>
          </Link>
        </div>

        {/* Demo Disclaimer Notice */}
        <div className="mb-6 rounded-2xl border border-[var(--color-border)] bg-[rgba(255,90,31,0.06)] p-4 text-xs text-[var(--color-ink)] flex items-start gap-3">
          <Info size={18} className="text-[var(--color-ember-text)] shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="block font-semibold">Simulated Order Tracking</strong>
            <p className="text-[var(--color-muted)] mt-0.5">
              This timeline is a deterministic demonstration of CRAVE&apos;s planned fulfillment experience. No real GPS or driver is dispatched.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAdvanceStep}
            className="shrink-0 rounded-full bg-[var(--color-ink)] px-3 py-1.5 text-xs font-semibold text-white flex items-center gap-1.5 hover:bg-[var(--color-ink-hover)] transition-colors shadow"
          >
            <RefreshCw size={12} />
            <span>Advance (Demo)</span>
          </button>
        </div>

        {/* Main Status Hero Card */}
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8 shadow-lg space-y-8">
          {/* Header Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-6">
            <div>
              <span className="text-xs font-bold font-mono uppercase tracking-widest text-[var(--color-ember-text)]">
                Order {order.number}
              </span>
              <h1 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-[var(--color-ink)]">
                {activeStepMeta.title}
              </h1>
              <p className="text-sm text-[var(--color-muted)] mt-1">
                {activeStepMeta.desc}
              </p>
            </div>

            <div className="rounded-2xl bg-[var(--color-canvas)] p-3 text-center sm:text-right border border-[var(--color-border)]">
              <span className="text-[11px] uppercase tracking-wider text-[var(--color-muted)] block">
                Estimated Delivery
              </span>
              <strong className="text-base font-bold text-[var(--color-ink)] tabular-nums">
                {currentStep === 4 ? 'Arrived!' : '20–30 mins'}
              </strong>
            </div>
          </div>

          {/* 4-Step Timeline Stepper */}
          <div className="py-2">
            <div className="relative flex items-center justify-between">
              {/* Timeline Connector Line */}
              <div className="absolute top-5 left-6 right-6 h-1 bg-[var(--color-border)] -z-0">
                <div
                  className="h-full bg-[var(--color-ember)] transition-all duration-500 ease-out"
                  style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                />
              </div>

              {/* Step Circles */}
              {TRACKING_STEPS.map((s) => {
                const isPassed = s.step < currentStep;
                const isCurrent = s.step === currentStep;
                const StepIcon = s.icon;

                return (
                  <div key={s.step} className="relative z-10 flex flex-col items-center text-center">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(s.step)}
                      aria-label={`Jump to ${s.title}`}
                      className={`flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 shadow-md ${
                        isCurrent
                          ? 'bg-[var(--color-ember)] text-white ring-4 ring-[rgba(255,90,31,0.25)] scale-110'
                          : isPassed
                          ? 'bg-[var(--color-ink)] text-white'
                          : 'bg-[var(--color-surface)] border-2 border-[var(--color-border)] text-[var(--color-muted)]'
                      }`}
                    >
                      <StepIcon size={18} strokeWidth={2.2} />
                    </button>
                    <span
                      className={`mt-3 text-xs font-bold max-w-[80px] sm:max-w-none ${
                        isCurrent
                          ? 'text-[var(--color-ember-text)]'
                          : isPassed
                          ? 'text-[var(--color-ink)]'
                          : 'text-[var(--color-muted)]'
                      }`}
                    >
                      {s.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Courier Card Simulation */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-ink)] text-white font-bold text-lg">
                EO
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ember-text)] block">
                  Simulated Dispatch
                </span>
                <span className="font-display font-bold text-base text-[var(--color-ink)]">
                  Emeka O. (Courier)
                </span>
                <span className="text-xs text-[var(--color-muted)] block">
                  Yamaha Thermal Bike · LAG-482-XY
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert('Demo notice: In production, this connects you directly with your courier via phone or in-app VoIP.')}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-xs font-semibold text-[var(--color-ink)] hover:bg-white transition-colors"
            >
              <Phone size={14} />
              <span>Contact Courier (Demo)</span>
            </button>
          </div>

          {/* Delivery Location & Order Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="rounded-2xl border border-[var(--color-border)] p-4 space-y-1">
              <span className="font-bold uppercase tracking-wider text-[var(--color-ink)] block text-[11px]">
                Delivering To
              </span>
              <p className="font-medium text-[var(--color-ink)]">
                {order.customer?.name || 'Customer'}
              </p>
              <p className="text-[var(--color-muted)]">
                {order.customer?.address || '14 Victoria Island, Lagos'}
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--color-border)] p-4 space-y-1">
              <span className="font-bold uppercase tracking-wider text-[var(--color-ink)] block text-[11px]">
                Order Content ({order.lines?.length || 0} items)
              </span>
              <p className="font-semibold text-[var(--color-ink)]">
                Total: {formatMoney(order.totalMinor)}
              </p>
              <p className="text-[var(--color-muted)] truncate">
                {order.lines?.map((l) => `${l.qty}× ${l.product.name}`).join(', ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
