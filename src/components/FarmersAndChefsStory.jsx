import { ArrowRight, CheckCircle2, Flame, Award } from 'lucide-react';
import CulinaryPatternBg from './CulinaryPatternBg.jsx';

export default function FarmersAndChefsStory() {
  const points = [
    'Hand-selected organic Nigerian plum tomatoes & tatashe peppers',
    'Charcoal firewood smoke infused into every pot of party jollof',
    '48-hour slow-fermented Italian Neapolitan sourdough crusts',
    'Ethically sourced halal prime chuck beef and poultry',
  ];

  return (
    <section id="story" className="relative py-14 md:py-20 bg-white border-b border-[#E8E6DF] overflow-hidden">
      {/* Subtle Hand-Drawn Culinary Pattern Background */}
      <CulinaryPatternBg opacity={0.035} color="#111111" />

      <div className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Media Column: Circular Splashed Fresh Harvest & Culinary Craft */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Ambient Background Glow */}
            <div className="absolute w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

            {/* Circular Image Container */}
            <div className="relative w-72 sm:w-96 md:w-[440px] aspect-square rounded-full bg-[#F6F5F2] p-4 shadow-xl border-4 border-white overflow-hidden flex items-center justify-center">
              <img
                src="/images/kitchen-craft.webp"
                alt="Chef preparing fresh ingredients and charcoal grilled dishes"
                className="w-full h-full object-cover rounded-full"
                loading="lazy"
              />
            </div>

            {/* Overlaid Float Badge: Master Chefs */}
            <div className="absolute -bottom-3 right-6 bg-[#111111] text-white p-3.5 rounded-2xl shadow-xl border border-white/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-ember)] flex items-center justify-center text-white shrink-0">
                <Award size={20} />
              </div>
              <div>
                <p className="text-xs font-black text-white leading-tight">Master Culinary Chefs</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">Lagos Kitchen Collective</p>
              </div>
            </div>
          </div>

          {/* Right Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-ember-text)] bg-[#FFF4EE] px-3.5 py-1.5 rounded-full border border-[var(--color-ember)]/20">
              <Flame size={14} className="text-[var(--color-ember)]" />
              <span>CRAFTED IN LAGOS, NIGERIA</span>
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#111111] tracking-tight leading-[1.12]">
              We Believe In Working With Local African Farmers & Master Chefs
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              At CRAVE, we honour the vibrant food traditions of Nigeria while pushing global culinary boundaries. Every grain of rice, cut of prime beef, and sprig of garden basil is selected daily from local accredited markets and farms.
            </p>

            {/* Feature Points Checklist */}
            <div className="space-y-3 pt-1">
              {points.map((pt, i) => (
                <div key={i} className="flex items-center gap-3 text-xs sm:text-sm text-neutral-800 font-semibold">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-3">
              <a
                href="#popular"
                className="inline-flex items-center gap-2.5 h-12 px-7 rounded-full bg-[var(--color-ember)] hover:bg-[#e04b14] active:scale-95 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer"
              >
                <span>Explore Our Kitchen Craft</span>
                <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
