import { Users, Award, Sparkles, Star } from 'lucide-react';
import SectionWaveDivider from './SectionWaveDivider.jsx';
import CulinaryPatternBg from './CulinaryPatternBg.jsx';

export default function StatsCounterStrip() {
  const stats = [
    {
      icon: Users,
      value: '15,000+',
      label: 'Happy Lagos Foodies',
    },
    {
      icon: Award,
      value: '24+',
      label: 'Master Culinary Chefs',
    },
    {
      icon: Sparkles,
      value: '100%',
      label: 'Fresh Local Ingredients',
    },
    {
      icon: Star,
      value: '1,250+',
      label: '5-Star Reviews',
    },
  ];

  return (
    <div className="relative">
      {/* Top Wave Divider entering dark section */}
      <SectionWaveDivider fill="#141414" />

      <section className="relative bg-[#141414] text-white py-12 md:py-16 overflow-hidden">
        {/* Subtle Culinary Doodles Background Pattern */}
        <CulinaryPatternBg opacity={0.045} color="#FFFFFF" />

        <div className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {stats.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-[var(--color-ember)] shrink-0 shadow-sm">
                    <Icon size={22} strokeWidth={2.2} />
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tabular-nums tracking-tight">
                      {s.value}
                    </p>
                    <p className="text-xs sm:text-sm text-neutral-400 font-medium mt-1">
                      {s.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom Wave Divider exiting dark section */}
      <SectionWaveDivider fill="#141414" flip={true} />
    </div>
  );
}
