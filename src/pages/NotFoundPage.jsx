import { Link } from 'react-router-dom';
import { UtensilsCrossed, ArrowRight } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <main id="main-content" className="w-full bg-[var(--color-canvas)] py-20 min-h-[70vh] flex items-center justify-center">
      <div className="mx-auto max-w-md px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-ember-text)] mx-auto mb-4 border border-[var(--color-border)]">
          <UtensilsCrossed size={32} />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-[var(--color-ink)]">
          Page Not Found (404)
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          The page you are looking for doesn’t exist or has moved. Let’s get you back to the CRAVE menu.
        </p>
        <div className="mt-6">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105"
          >
            <span>Explore Menu</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}
