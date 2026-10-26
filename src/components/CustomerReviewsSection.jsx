import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css/bundle';
import CulinaryPatternBg from './CulinaryPatternBg.jsx';

export default function CustomerReviewsSection() {
  const [swiper, setSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const reviews = [
    {
      name: 'Babatunde Adeleke',
      location: 'Victoria Island, Lagos',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      stars: 5,
      quote:
        'The smoky party jollof tastes exactly like authentic firewood wedding jollof. The chicken is charred over charcoal to perfection with genuine suya spice!',
    },
    {
      name: 'Chioma Nnamdi',
      location: 'Lekki Phase 1, Lagos',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      stars: 5,
      quote:
        'Hands down the juiciest double smash burger in Lagos. The aged cheddar and house pickles are incredible, and delivery arrived piping hot in 25 minutes.',
    },
    {
      name: 'Femi Oladipo',
      location: 'Ikoyi, Lagos',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      stars: 5,
      quote:
        'The garlic tiger prawn linguine paired with the chilled hibiscus zobo cooler makes Friday night dinner at home feel like a Michelin-starred experience.',
    },
    {
      name: 'Amina Bello',
      location: 'Maitama, Abuja',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      stars: 5,
      quote:
        'The wood-fired pepperoni with hot habanero honey is a masterpiece. The blistered sourdough crust has incredible chew and leopard spotting.',
    },
    {
      name: 'Olumide Bakare',
      location: 'Ikeja GRA, Lagos',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
      stars: 5,
      quote:
        'Customer support and live kitchen tracking on WhatsApp and the web app is seamless. My whole family craves their weekend platters every Sunday!',
    },
    {
      name: 'Dr. Stephanie Eze',
      location: 'Banana Island, Lagos',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
      stars: 5,
      quote:
        'The molten lava cake with artisan bourbon vanilla cream was decadent. Uncompromising attention to quality, packaging, and presentation.',
    },
  ];

  return (
    <section id="reviews" className="relative py-14 md:py-20 bg-[#F6F5F2] border-b border-[#E8E6DF] overflow-hidden">
      {/* Subtle Hand-Drawn Culinary Pattern Background */}
      <CulinaryPatternBg opacity={0.04} color="#111111" />

      <div className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111111] tracking-tight">
              Why Customers <span className="text-[var(--color-ember)]">Love Us?</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Read real dining reviews from food enthusiasts across Lagos and Abuja
            </p>
          </div>

          {/* Slider Arrow Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => swiper?.slidePrev()}
              aria-label="Previous review"
              className="w-9 h-9 rounded-full border border-[#E8E6DF] bg-white text-neutral-700 hover:text-black hover:border-black flex items-center justify-center transition-colors cursor-pointer active:scale-95 shadow-2xs"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => swiper?.slideNext()}
              aria-label="Next review"
              className="w-9 h-9 rounded-full border border-[#E8E6DF] bg-white text-neutral-700 hover:text-black hover:border-black flex items-center justify-center transition-colors cursor-pointer active:scale-95 shadow-2xs"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Swiper Moving & Looping Testimonial Cards */}
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          onSwiper={setSwiper}
          onSlideChange={(s) => setActiveIndex(s.realIndex % 3)}
          loop={true}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={800}
          slidesPerView={1}
          spaceBetween={20}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
          }}
          className="reviews-swiper !pb-4"
        >
          {reviews.map((rev, idx) => (
            <SwiperSlide key={idx} className="h-auto">
              <div className="bg-white rounded-[26px] p-6 sm:p-7 border border-[#E8E6DF] shadow-[0_6px_24px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative h-full">
                <div className="space-y-4">
                  {/* Quote Icon & Stars */}
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-full bg-[#FFF4EE] text-[var(--color-ember)] flex items-center justify-center">
                      <Quote size={18} />
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: rev.stars }).map((_, i) => (
                        <Star key={i} size={15} className="fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed italic">
                    “{rev.quote}”
                  </p>
                </div>

                {/* Author Row */}
                <div className="pt-6 border-t border-neutral-100 flex items-center gap-3.5 mt-4">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-[var(--color-ember)] shadow-2xs"
                    loading="lazy"
                  />
                  <div>
                    <h4 className="text-sm font-black text-[#111111] leading-tight">
                      {rev.name}
                    </h4>
                    <p className="text-[11px] font-semibold text-neutral-400 mt-0.5">
                      {rev.location}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Dynamic Pagination Dots Indicator */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => swiper?.slideToLoop(i * 2)}
              aria-label={`Go to review group ${i + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === i ? 'w-8 bg-[var(--color-ember)]' : 'w-2.5 bg-neutral-300 hover:bg-neutral-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
