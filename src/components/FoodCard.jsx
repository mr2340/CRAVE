import { memo } from 'react';
import { Link } from 'react-router-dom';
import { formatMoney } from '../lib/currency.js';

function FoodCard({ product, control = null }) {
  const dishUrl = `/menu/${product.slug || product.id}`;

  return (
    <article className="food-card group bg-[var(--color-surface)] rounded-[var(--radius-card)] p-2.5 sm:p-3 border border-[var(--color-border)] shadow-[var(--shadow-card)] flex flex-col justify-between h-full transition-all duration-200 hover:shadow-lg hover:border-[var(--color-ink)]/20">
      <div>
        {/* 4:3 Image Container with Link */}
        <Link
          to={dishUrl}
          className="block relative aspect-[4/3] w-full rounded-[var(--radius-img)] overflow-hidden bg-[var(--color-panel)] mb-3 focus-visible:outline-2 focus-visible:outline-[var(--color-ember)]"
          aria-label={`View details for ${product.name}`}
        >
          <img
            src={product.image}
            alt={product.imageAlt}
            width={1200}
            height={900}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </Link>

        {/* Card Title (clamps to 2 lines) */}
        <h3 className="font-[var(--font-display)] font-bold text-[1.0625rem] leading-[1.25] tracking-[-0.01em] text-[var(--color-ink)] line-clamp-2 mb-1.5">
          <Link
            to={dishUrl}
            className="hover:text-[var(--color-ember-text)] transition-colors focus-visible:rounded"
          >
            {product.name}
          </Link>
        </h3>

        {/* Card Description (clamps to 2 lines with min-height for alignment) */}
        <p className="text-sm leading-[1.45] text-[var(--color-muted)] line-clamp-2 min-h-[2.625rem] mb-3">
          {product.desc}
        </p>
      </div>

      {/* Footer Row: Price (left) + Control (right) with fixed 44px height */}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)] min-h-[44px]">
        <span className="font-semibold text-base text-[var(--color-ember-text)] tabular-nums">
          {formatMoney(product.priceMinor)}
        </span>
        <div className="shrink-0 flex items-center justify-end h-11">
          {control}
        </div>
      </div>
    </article>
  );
}

export default memo(FoodCard);
