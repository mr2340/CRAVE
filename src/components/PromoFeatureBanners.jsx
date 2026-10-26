import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PromoFeatureBanners() {
  const banners = [
    {
      badge: 'CHEF SPECIAL',
      title: 'Smoky Party Jollof & Grilled Thigh',
      desc: 'Cooked with firewood smoke & charcoal suya spice',
      price: '₦7,500',
      btnText: 'Order Now',
      image: '/images/dish-jollof-chicken.webp',
      bgClass: 'bg-[#141414] text-white',
      badgeClass: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      btnClass: 'bg-white text-black hover:bg-neutral-100',
    },
    {
      badge: 'POPULAR CRAVE',
      title: 'Double Prime Chuck Smash Burger',
      desc: 'Layered with aged Wisconsin cheddar & pickles',
      price: '₦6,500',
      btnText: 'Explore',
      image: '/images/dish-smash-burger.webp',
      bgClass: 'bg-[#F0FDF4] text-neutral-900 border border-emerald-100',
      badgeClass: 'bg-emerald-100 text-emerald-800',
      btnClass: 'bg-emerald-700 text-white hover:bg-emerald-800',
    },
    {
      badge: 'WOOD-FIRED',
      title: 'Artisan Pepperoni & Hot Honey Pizza',
      desc: 'Blistered sourdough crust with habanero wildflower honey',
      price: '₦8,500',
      btnText: 'Taste Now',
      image: '/images/dish-pepperoni.webp',
      bgClass: 'bg-[#FF5A1F] text-white',
      badgeClass: 'bg-white/20 text-white',
      btnClass: 'bg-white text-[#FF5A1F] hover:bg-neutral-100',
    },
  ];

  return (
    <section className="py-10 md:py-14 bg-white border-b border-[#E8E6DF]">
      <div className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {banners.map((b, idx) => (
            <div
              key={idx}
              className={`rounded-[26px] p-6 flex flex-col justify-between relative overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 min-h-[220px] ${b.bgClass}`}
            >
              <div className="relative z-10 max-w-[65%] space-y-2">
                <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${b.badgeClass}`}>
                  <Sparkles size={11} />
                  <span>{b.badge}</span>
                </span>
                <h3 className="text-base sm:text-lg font-black tracking-tight leading-snug">
                  {b.title}
                </h3>
                <p className="text-xs opacity-80 leading-relaxed line-clamp-2">
                  {b.desc}
                </p>
                <p className="text-base font-extrabold tabular-nums pt-1">
                  {b.price}
                </p>
              </div>

              {/* Action Button */}
              <div className="relative z-10 pt-4">
                <Link
                  to="/dashboard"
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer ${b.btnClass}`}
                >
                  <span>{b.btnText}</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              {/* Floating Image Thumbnail with Smooth Rounded Frame */}
              <div className="absolute -right-2 -bottom-2 w-32 sm:w-36 aspect-square rounded-2xl overflow-hidden shadow-md border-2 border-white/20 pointer-events-none">
                <img
                  src={b.image}
                  alt={b.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
