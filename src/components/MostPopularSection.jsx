import { useState, useMemo } from 'react';
import { Heart, Plus, Minus } from 'lucide-react';
import { PRODUCTS } from '../data/catalog.js';
import { useCart } from '../context/useCart.js';
import CulinaryPatternBg from './CulinaryPatternBg.jsx';

export default function MostPopularSection() {
  const { add } = useCart();
  const [activeTab, setActiveTab] = useState('all');
  const [quantities, setQuantities] = useState({});
  const [favorites, setFavorites] = useState({});

  const tabs = [
    { id: 'all', label: 'All Dishes' },
    { id: 'chicken', label: 'Jollof & Grills' },
    { id: 'burgers', label: 'Burgers' },
    { id: 'pizza', label: 'Pizza' },
    { id: 'pasta-noodles', label: 'Pasta & Ramen' },
    { id: 'sides', label: 'Sides & Dodo' },
  ];

  const filtered = useMemo(() => {
    if (activeTab === 'all') return PRODUCTS.slice(0, 8);
    return PRODUCTS.filter((p) => p.category === activeTab);
  }, [activeTab]);

  const handleQtyChange = (id, delta) => {
    setQuantities((prev) => {
      const current = prev[id] || 1;
      const next = Math.max(1, Math.min(20, current + delta));
      return { ...prev, [id]: next };
    });
  };

  const handleToggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddToCart = (product) => {
    const qty = quantities[product.id] || 1;
    for (let i = 0; i < qty; i++) {
      add(product.id);
    }
  };

  return (
    <section id="popular" className="relative py-14 md:py-20 bg-white border-b border-[#E8E6DF] overflow-hidden">
      {/* Subtle Hand-Drawn Culinary Pattern Background */}
      <CulinaryPatternBg opacity={0.035} color="#111111" />

      <div className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111111] tracking-tight">
            Most Popular <span className="text-[var(--color-ember)]">Products</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-lg">
            Cooked with authentic African firewood smoke, fresh herbs and premier ingredients
          </p>

          {/* Filter Tabs (matches reference layout) */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#111111] text-white shadow-xs'
                      : 'bg-[#F6F5F2] text-neutral-600 hover:text-black hover:bg-neutral-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 8 Product Cards Grid (4 columns x 2 rows) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {filtered.map((product) => {
            const qty = quantities[product.id] || 1;
            const isFav = Boolean(favorites[product.id]);

            return (
              <div
                key={product.id}
                className="bg-white rounded-[22px] p-4 flex flex-col justify-between border border-[#E8E6DF] shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group"
              >
                {/* Badge & Heart Icon */}
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="bg-[var(--color-ember)] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-2xs">
                    {product.discountBadge || 'POPULAR'}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleFavorite(product.id)}
                    aria-label="Favorite dish"
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                      isFav
                        ? 'text-red-500 bg-red-50'
                        : 'text-neutral-400 hover:text-red-500 bg-[#F6F5F2]'
                    }`}
                  >
                    <Heart size={15} className={isFav ? 'fill-red-500' : ''} />
                  </button>
                </div>

                {/* Food Image Container: Smoothly rounded corners with zero sharp edges */}
                <div className="relative w-full aspect-[4/3] rounded-[18px] overflow-hidden bg-[#F6F5F2] mb-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-[18px] group-hover:scale-106 transition-transform duration-500 select-none"
                    loading="lazy"
                  />
                </div>

                {/* Metadata */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-neutral-400">
                    {product.weight || '500g'}
                  </span>
                  <h3 className="text-sm font-extrabold text-[#111111] leading-snug line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Price in Naira */}
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-lg font-black text-[#111111] tabular-nums">
                      {product.formattedPrice}
                    </span>
                    {product.formattedOriginalPrice && (
                      <span className="text-xs font-semibold text-neutral-400 line-through tabular-nums">
                        {product.formattedOriginalPrice}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Row: Quantity Stepper & Add Button */}
                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-[#D1D1D6] bg-[#F6F5F2] text-[#111111]">
                    <button
                      type="button"
                      onClick={() => handleQtyChange(product.id, -1)}
                      className="w-5 h-5 flex items-center justify-center font-bold text-xs hover:text-black cursor-pointer"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="w-4 text-center font-bold text-xs tabular-nums">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQtyChange(product.id, 1)}
                      className="w-5 h-5 flex items-center justify-center font-bold text-xs hover:text-black cursor-pointer"
                    >
                      <Plus size={11} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    aria-label={`Add ${product.name} to cart`}
                    className="w-9 h-9 rounded-full bg-[var(--color-ember)] hover:bg-[#e04b14] active:scale-90 text-white flex items-center justify-center shadow-xs transition-all cursor-pointer"
                  >
                    <Plus size={16} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
