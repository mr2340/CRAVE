import { Smartphone, Download, Sparkles } from 'lucide-react';

export default function MobileAppBanner() {
  return (
    <section className="py-12 md:py-16 bg-white border-b border-[#E8E6DF]">
      <div className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="relative rounded-[32px] bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 text-white p-8 sm:p-12 md:p-16 overflow-hidden shadow-xl">
          {/* Background Ambient Glow & Leaf Particles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold tracking-wide uppercase backdrop-blur-xs">
                <Sparkles size={13} className="text-amber-300" />
                <span>FASTEST ORDERING IN NIGERIA</span>
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Download the CRAVE Mobile App
              </h2>

              <p className="text-sm sm:text-base text-emerald-100 max-w-lg leading-relaxed">
                Order your favorite Lagos culinary dishes with instant 1-tap reordering, live courier tracking from our kitchen to your door, and exclusive member discounts.
              </p>

              {/* App Store Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => alert('CRAVE iOS app demo link')}
                  className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-black text-white hover:bg-neutral-900 active:scale-95 transition-all shadow-md cursor-pointer border border-white/10"
                >
                  <Smartphone size={22} className="text-amber-300" />
                  <div className="text-left">
                    <p className="text-[10px] text-neutral-400 uppercase leading-none">Download on</p>
                    <p className="text-xs sm:text-sm font-extrabold leading-tight">App Store</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => alert('CRAVE Android app demo link')}
                  className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-black text-white hover:bg-neutral-900 active:scale-95 transition-all shadow-md cursor-pointer border border-white/10"
                >
                  <Download size={22} className="text-emerald-400" />
                  <div className="text-left">
                    <p className="text-[10px] text-neutral-400 uppercase leading-none">Get it on</p>
                    <p className="text-xs sm:text-sm font-extrabold leading-tight">Google Play</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Right Media: Mockup Phone with CRAVE App Food View */}
            <div className="lg:col-span-5 flex items-center justify-center relative">
              <div className="w-56 sm:w-64 bg-white rounded-[36px] p-3 shadow-2xl border-4 border-black/10 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                {/* Phone Speaker Notch */}
                <div className="w-20 h-3.5 bg-black rounded-full mx-auto mb-2" />

                {/* Inner App Preview */}
                <div className="bg-[#F6F5F2] rounded-[26px] p-3 space-y-2.5 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-[#111111]">CRAVE.</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>

                  <div className="w-full aspect-square rounded-2xl bg-white p-2 flex items-center justify-center shadow-xs">
                    <img
                      src="/images/dish-jollof-chicken.webp"
                      alt="CRAVE App dish"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <p className="text-xs font-black text-[#111111] leading-tight">Smoky Party Jollof</p>
                    <p className="text-xs font-bold text-[var(--color-ember)]">₦7,500</p>
                  </div>

                  <div className="w-full py-2 rounded-full bg-[var(--color-ember)] text-white text-[11px] font-extrabold text-center">
                    Order In 30 Mins
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
