import { CATEGORIES, PRODUCTS } from '../data/catalog.js';

const categoryImages = {
  burgers: '/images/dish-smash-burger.webp',
  pizza: '/images/dish-margherita.webp',
  noodles: '/images/dish-chilli-ramen.webp',
  chicken: '/images/dish-honey-wings.webp',
  sides: '/images/dish-truffle-fries.webp',
  desserts: '/images/dish-lava-cake.webp',
  drinks: '/images/dish-hibiscus-cooler.webp',
};

export default function CategoryRow({ activeCategory, onSelectCategory }) {
  const totalCount = PRODUCTS.length;

  return (
    <div className="w-full overflow-x-auto overscroll-x-contain pb-2 scrollbar-none snap-x snap-mandatory">
      <ul
        role="group"
        aria-label="Dish categories"
        className="flex items-start gap-4 md:gap-5 lg:gap-6 min-w-max px-1"
      >
        {CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat.id;
          const isAll = cat.id === 'all';
          const imageSrc = categoryImages[cat.id];

          return (
            <li key={cat.id} className="snap-start list-none">
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelectCategory(cat.id)}
                className="flex flex-col items-center group cursor-pointer p-1 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink)]"
              >
                {/* Circle Container */}
                <div
                  className={`w-[72px] h-[72px] lg:w-[80px] lg:h-[80px] rounded-full transition-all duration-150 flex items-center justify-center overflow-hidden ${
                    isSelected
                      ? 'ring-3 ring-[var(--color-ember)] shadow-md'
                      : 'ring-3 ring-[var(--color-surface)] group-hover:ring-[var(--color-border)]'
                  }`}
                >
                  {isAll ? (
                    <div className="w-full h-full bg-[var(--color-panel)] flex items-center justify-center">
                      <span className="font-[var(--font-display)] font-extrabold text-2xl lg:text-3xl text-[var(--color-canvas)]">
                        {totalCount}
                      </span>
                    </div>
                  ) : (
                    <img
                      src={imageSrc}
                      alt=""
                      width={1200}
                      height={900}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                </div>

                {/* Label and Selected Dot */}
                <span
                  className={`mt-2 text-sm leading-tight transition-colors flex flex-col items-center ${
                    isSelected
                      ? 'font-semibold text-[var(--color-ink)]'
                      : 'font-medium text-[var(--color-muted)] group-hover:text-[var(--color-ink)]'
                  }`}
                >
                  {cat.label}
                  {/* Visual non-color indicator dot */}
                  <span
                    className={`block w-1 h-1 rounded-full mt-1 transition-opacity ${
                      isSelected
                        ? 'bg-[var(--color-ember)] opacity-100'
                        : 'opacity-0'
                    }`}
                    aria-hidden="true"
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
