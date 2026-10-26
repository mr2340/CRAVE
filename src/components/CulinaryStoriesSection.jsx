import { ArrowRight, Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react';
import CulinaryPatternBg from './CulinaryPatternBg.jsx';

export default function CulinaryStoriesSection() {
  const blogs = [
    {
      title: 'The Secrets of Authentic Lagos Firewood Party Jollof',
      excerpt:
        'Why charcoal firewood smoke, tatashe reductions, and slow caramelization create the distinct Nigerian party jollof aroma.',
      date: 'Oct 22, 2026',
      author: 'Chef Tunde',
      image: '/images/news-woodfire-hearth.jpg',
      readTime: '4 min read',
    },
    {
      title: 'From Farm to Kitchen: Partnering With Accredited African Farmers',
      excerpt:
        'How our direct partnerships with local growers deliver morning-picked fresh herbs, ripe plum tomatoes, and seasonal produce.',
      date: 'Oct 18, 2026',
      author: 'CRAVE Sourcing',
      image: '/images/news-farm-harvest.jpg',
      readTime: '5 min read',
    },
    {
      title: 'From Hibiscus Flowers to Zobo: West African Botanical Mixology',
      excerpt:
        'Exploring the botanical heritage of dried Nigerian hibiscus calyces infused with fresh crushed ginger and citrus peel.',
      date: 'Oct 12, 2026',
      author: 'Craft Bar',
      image: '/images/news-botanical-harvest.jpg',
      readTime: '3 min read',
    },
  ];

  return (
    <section id="blog" className="relative py-14 md:py-20 bg-[#F6F5F2] border-b border-[#E8E6DF] overflow-hidden">
      {/* Subtle Hand-Drawn Culinary Pattern Background */}
      <CulinaryPatternBg opacity={0.04} color="#111111" />

      <div className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111111] tracking-tight">
              Latest News & <span className="text-[var(--color-ember)]">Culinary Stories</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Explore culinary craft insights, artisan recipes, and food culture from our Lagos chefs
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Previous story"
              className="w-9 h-9 rounded-full border border-[#E8E6DF] bg-white text-neutral-700 hover:text-black flex items-center justify-center shadow-2xs cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              aria-label="Next story"
              className="w-9 h-9 rounded-full border border-[#E8E6DF] bg-white text-neutral-700 hover:text-black flex items-center justify-center shadow-2xs cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* 3 Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((b, idx) => (
            <article
              key={idx}
              className="bg-white rounded-[26px] overflow-hidden border border-[#E8E6DF] shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Media Container: Full-bleed editorial photograph with rounded top */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-[26px] bg-[#F6F5F2]">
                <img
                  src={b.image}
                  alt={b.title}
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* Body */}
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[11px] font-bold text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} /> {b.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User size={13} /> {b.author}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-[#111111] leading-snug group-hover:text-[var(--color-ember)] transition-colors">
                    {b.title}
                  </h3>

                  <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2">
                    {b.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-neutral-400">
                    {b.readTime}
                  </span>
                  <a
                    href="#popular"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-ember)] hover:underline"
                  >
                    <span>Read Story</span>
                    <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-8">
          <span className="w-6 h-2 rounded-full bg-[var(--color-ember)]" />
          <span className="w-2 h-2 rounded-full bg-neutral-300" />
          <span className="w-2 h-2 rounded-full bg-neutral-300" />
        </div>
      </div>
    </section>
  );
}
