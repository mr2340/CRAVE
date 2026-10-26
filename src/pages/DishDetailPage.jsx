import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Flame, ShieldAlert, Check, Plus, Minus, ShoppingBag } from 'lucide-react';
import { PRODUCTS } from '../data/catalog.js';
import { formatMoney } from '../lib/currency.js';
import { useCart } from '../context/useCart.js';
import FoodCard from '../components/FoodCard.jsx';
import QuantityControl from '../components/QuantityControl.jsx';

export default function DishDetailPage() {
  const { slug } = useParams();
  const { add, increment, decrement, qtyOf } = useCart();

  // Find product matching slug or id
  const product = useMemo(() => {
    return PRODUCTS.find((p) => (p.slug || p.id) === slug) || null;
  }, [slug]);

  // Selected add-ons state (for demo customization)
  const [selectedAddons, setSelectedAddons] = useState([]);

  // Live cart quantity of this base dish
  const inCartQty = product ? qtyOf(product.id) : 0;

  // Related products from the same category or featured items
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const sameCategory = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id);
    if (sameCategory.length >= 3) return sameCategory.slice(0, 3);
    const others = PRODUCTS.filter((p) => p.id !== product.id && !sameCategory.includes(p));
    return [...sameCategory, ...others].slice(0, 3);
  }, [product]);

  // Calculate customized price if add-ons are toggled
  const addonsTotalMinor = useMemo(() => {
    return selectedAddons.reduce((sum, addon) => sum + addon.priceMinor, 0);
  }, [selectedAddons]);

  const finalPriceMinor = product ? product.priceMinor + addonsTotalMinor : 0;

  const toggleAddon = (addon) => {
    setSelectedAddons((prev) =>
      prev.some((a) => a.name === addon.name)
        ? prev.filter((a) => a.name !== addon.name)
        : [...prev, addon]
    );
  };

  if (!product) {
    return (
      <main id="main-content" className="w-full bg-[var(--color-canvas)] py-20 min-h-[70vh] flex items-center justify-center">
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-ember-text)] mx-auto mb-4 border border-[var(--color-border)]">
            <ShieldAlert size={32} />
          </div>
          <h1 className="font-display text-2xl font-bold text-[var(--color-ink)]">
            Dish Not Found
          </h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            We couldn&apos;t locate this dish. It may have been renamed or rotated out of our seasonal menu.
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

  return (
    <main id="main-content" className="w-full bg-[var(--color-canvas)] py-8 md:py-12">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[var(--color-muted)]">
          <Link to="/" className="hover:text-[var(--color-ink)] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/menu" className="hover:text-[var(--color-ink)] transition-colors">
            Menu
          </Link>
          <span>/</span>
          <Link
            to={`/menu?category=${product.category}`}
            className="capitalize hover:text-[var(--color-ink)] transition-colors"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="font-medium text-[var(--color-ink)] truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-ink)] hover:text-[var(--color-ember-text)] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Full Menu</span>
          </Link>
        </div>

        {/* Dish Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Big Photography */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-[var(--color-panel)] border border-[var(--color-border)] shadow-xl">
              <img
                src={product.image}
                alt={product.imageAlt}
                width={1200}
                height={900}
                loading="eager"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              {product.featured && (
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-ember)] px-3 py-1 text-xs font-bold text-white shadow-md">
                  <Flame size={13} />
                  <span>CRAVE Signature</span>
                </div>
              )}
            </div>

            {/* Quick Metrics (Prep Time, Calories, Dietary Pills) */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {product.prepTime && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs font-medium text-[var(--color-ink)]">
                  <Clock size={13} className="text-[var(--color-muted)]" />
                  <span>Prep: {product.prepTime}</span>
                </span>
              )}

              {product.calories && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs font-medium text-[var(--color-ink)]">
                  <Flame size={13} className="text-[var(--color-muted)]" />
                  <span>{product.calories}</span>
                </span>
              )}

              {product.dietary?.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-1 text-xs font-medium text-[var(--color-muted)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Culinary Details & Order Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--color-ember-text)]">
                {product.category}
              </span>
              <h1 className="mt-1 font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--color-ink)] tracking-tight">
                {product.name}
              </h1>

              {/* Price display */}
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-[var(--color-ember-text)] tabular-nums">
                  {formatMoney(finalPriceMinor)}
                </span>
                {addonsTotalMinor > 0 && (
                  <span className="text-xs text-[var(--color-muted)]">
                    (Includes {formatMoney(addonsTotalMinor)} add-ons)
                  </span>
                )}
              </div>
            </div>

            {/* Long Culinary Description */}
            <p className="text-sm sm:text-base leading-relaxed text-[var(--color-muted)]">
              {product.longDesc || product.desc}
            </p>

            {/* Ingredients Breakdown */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink)]">
                  Ingredients & Seasoning
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[var(--color-muted)]">
                  {product.ingredients.map((ing) => (
                    <li key={ing} className="flex items-center gap-2">
                      <Check size={14} className="text-[var(--color-ember-text)] shrink-0" />
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Optional Customizations / Add-ons */}
            {product.customizations && product.customizations.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink)]">
                  Customize Your Dish
                </h3>
                <div className="space-y-2">
                  {product.customizations.map((addon) => {
                    const isSelected = selectedAddons.some((a) => a.name === addon.name);
                    return (
                      <button
                        key={addon.name}
                        type="button"
                        onClick={() => toggleAddon(addon)}
                        className={`w-full flex items-center justify-between rounded-xl border p-3 text-xs transition-colors text-left ${
                          isSelected
                            ? 'border-[var(--color-ember)] bg-[rgba(255,90,31,0.06)] text-[var(--color-ink)]'
                            : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:border-[var(--color-ink)]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`flex h-4 w-4 items-center justify-center rounded border ${
                              isSelected
                                ? 'border-[var(--color-ember)] bg-[var(--color-ember)] text-white'
                                : 'border-[var(--color-border)] bg-white'
                            }`}
                          >
                            {isSelected && <Check size={12} strokeWidth={3} />}
                          </div>
                          <span className="font-medium text-[var(--color-ink)]">{addon.name}</span>
                        </div>
                        <span className="font-semibold text-[var(--color-ember-text)] tabular-nums">
                          +{formatMoney(addon.priceMinor)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add to Cart Actions */}
            <div className="pt-2 border-t border-[var(--color-border)] space-y-3">
              {inCartQty === 0 ? (
                <button
                  type="button"
                  onClick={() => add(product.id)}
                  className="w-full h-14 rounded-full bg-[var(--color-ink)] text-white font-semibold text-base shadow-xl hover:bg-[var(--color-ink-hover)] transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag size={20} />
                  <span>Add to Order · {formatMoney(finalPriceMinor)}</span>
                </button>
              ) : (
                <div className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                  <div>
                    <span className="block text-xs font-semibold text-[var(--color-ink)]">
                      In Your Cart
                    </span>
                    <span className="text-xs text-[var(--color-muted)]">
                      {inCartQty} in order ({formatMoney(product.priceMinor * inCartQty)})
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => decrement(product.id)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] hover:bg-[var(--color-canvas)] text-[var(--color-ink)]"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-base font-bold tabular-nums min-w-[20px] text-center">
                      {inCartQty}
                    </span>
                    <button
                      type="button"
                      onClick={() => increment(product.id)}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-ink)] text-white hover:bg-[var(--color-ink-hover)]"
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-[var(--color-muted)] px-1">
                <span>Flat delivery: ₦1,500</span>
                <span>Estimated arrival: 25–35 mins</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Dishes Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[var(--color-border)]">
            <div className="mb-6">
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--color-ember-text)]">
                Complete Your Feast
              </span>
              <h2 className="mt-1 font-display text-2xl font-bold text-[var(--color-ink)]">
                Dishes often paired together
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relProduct) => (
                <FoodCard
                  key={relProduct.id}
                  product={relProduct}
                  control={<QuantityControl product={relProduct} />}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
