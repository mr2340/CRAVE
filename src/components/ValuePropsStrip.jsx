import { Truck, ShieldCheck, Flame, Utensils } from 'lucide-react';

export default function ValuePropsStrip() {
  const props = [
    {
      icon: Utensils,
      title: 'Fresh Chef-Prepared',
      desc: 'Cooked fresh to order with local Nigerian produce',
    },
    {
      icon: Truck,
      title: 'Express 30-Min Delivery',
      desc: 'Piping hot across VI, Lekki, Ikoyi & Ikeja',
    },
    {
      icon: ShieldCheck,
      title: '100% Quality Guarantee',
      desc: 'Uncompromised artisan culinary standards',
    },
    {
      icon: Flame,
      title: 'Free Delivery over ₦15,000',
      desc: 'Complimentary dispatch for all group orders',
    },
  ];

  return (
    <section className="bg-white border-b border-[#E8E6DF] py-6 md:py-8">
      <div className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {props.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#F6F5F2] border border-[#E8E6DF] hover:shadow-xs transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-white border border-[#E8E6DF] flex items-center justify-center text-[var(--color-ember)] shrink-0 shadow-2xs">
                  <Icon size={20} strokeWidth={2.2} />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-[#111111] leading-tight">
                    {p.title}
                  </h3>
                  <p className="text-[11px] text-neutral-500 leading-tight mt-1">
                    {p.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
