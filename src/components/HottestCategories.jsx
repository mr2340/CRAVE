import { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import CulinaryPatternBg from './CulinaryPatternBg.jsx';

export default function HottestCategories() {
  const [swiper, setSwiper] = useState(null);

  const categoryCards = [
    {
      id: 'chicken',
      name: 'Jollof & Grills',
      count: '2 Items',
      image: '/images/dish-jollof-chicken.webp',
      bg: '#FFF4EE',
      accent: '#FF5A1F',
    },
    {
      id: 'burgers',
      name: 'Artisan Burgers',
      count: '2 Items',
      image: '/images/dish-smash-burger.webp',
      bg: '#FEF9C3',
      accent: '#CA8A04',
    },
    {
      id: 'pasta-noodles',
      name: 'Pasta & Ramen',
      count: '2 Items',
      image: '/images/dish-prawn-linguine.webp',
      bg: '#EFF6FF',
      accent: '#2563EB',
    },
    {
      id: 'pizza',
      name: 'Wood-Fired Pizza',
      count: '2 Items',
      image: '/images/dish-margherita.webp',
      bg: '#F0FDF4',
      accent: '#16A34A',
    },
    {
      id: 'sides',
      name: 'Sides & Dodo',
      count: '2 Items',
      image: '/images/dish-dodo-bites.webp',
      bg: '#FAF5FF',
      accent: '#9333EA',
    },
    {
      id: 'drinks',
      name: 'Zobo & Drinks',
      count: '1 Item',
      image: '/images/dish-hibiscus-cooler.webp',
      bg: '#FFF1F2',
      accent: '#E11D48',
    },
    {
      id: 'chicken-wings',
      name: 'Smoked Wings',
      count: '1 Item',
      image: '/images/dish-honey-wings.webp',
      bg: '#FFF7ED',
      accent: '#EA580C',
    },
    {
      id: 'desserts',
      name: 'Lava Cakes',
      count: '1 Item',
      image: '/images/dish-lava-cake.webp',
      bg: '#FDF2F8',
      accent: '#DB2777',
    },
  ];

  return (
    <section id="categories" className="relative py-12 md:py-16 bg-white border-b border-[#E8E6DF] overflow-hidden">
      {/* Subtle Culinary Pattern Background */}
      <CulinaryPatternBg opacity={0.035} color="#111111" />

      <div className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
              Browse Our Hottest <span className="text-[var(--color-ember)]">Categories</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Handcrafted delicacies prepared to perfection by culinary masters in Lagos
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--color-ember)] text-white text-xs font-bold hover:bg-[#e04b14] transition-colors"
            >
              <span>See All</span>
              <ArrowRight size={13} />
            </Link>

            {/* Slider arrows controlling Swiper */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => swiper?.slidePrev()}
                aria-label="Previous categories"
                className="w-9 h-9 rounded-full border border-[#E8E6DF] bg-white text-neutral-700 hover:text-black hover:border-black flex items-center justify-center transition-colors cursor-pointer active:scale-95 shadow-2xs"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => swiper?.slideNext()}
                aria-label="Next categories"
                className="w-9 h-9 rounded-full border border-[#E8E6DF] bg-white text-neutral-700 hover:text-black hover:border-black flex items-center justify-center transition-colors cursor-pointer active:scale-95 shadow-2xs"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Swiper Auto-looping Carousel */}
        <Swiper
          modules={[Autoplay, Navigation]}
          onSwiper={setSwiper}
          loop={true}
          autoplay={{
            delay: 2400,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={700}
          slidesPerView={2}
          spaceBetween={14}
          breakpoints={{
            480: { slidesPerView: 3, spaceBetween: 16 },
            768: { slidesPerView: 4, spaceBetween: 18 },
            1024: { slidesPerView: 5, spaceBetween: 20 },
            1280: { slidesPerView: 6, spaceBetween: 22 },
          }}
          className="categories-swiper !pb-2"
        >
          {categoryCards.map((cat, idx) => (
            <SwiperSlide key={`${cat.id}-${idx}`}>
              <Link
                to="/dashboard"
                className="w-full rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1 active:scale-98 border border-black/5 group cursor-pointer block"
                style={{ backgroundColor: cat.bg }}
              >
                {/* Circular Dish Cutout */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-white/90 p-1.5 flex items-center justify-center shadow-xs mb-3 group-hover:scale-105 transition-transform duration-300 mx-auto">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-full"
                    loading="lazy"
                  />
                </div>

                {/* Title & Count */}
                <h3 className="text-xs sm:text-sm font-extrabold text-[#111111] leading-tight">
                  {cat.name}
                </h3>
                <span className="text-[11px] font-semibold text-neutral-500 mt-0.5 block">
                  {cat.count}
                </span>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
