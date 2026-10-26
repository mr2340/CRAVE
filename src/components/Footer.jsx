import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  ArrowUp,
  MessageCircle,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import SectionWaveDivider from './SectionWaveDivider.jsx';
import CulinaryPatternBg from './CulinaryPatternBg.jsx';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isJoined, setIsJoined] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsJoined(true);
      setTimeout(() => {
        setEmail('');
      }, 3500);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const neighborhoods = [
    'Victoria Island',
    'Ikoyi',
    'Lekki Phase 1 & 2',
    'Oniru',
    'Banana Island',
    'Ikeja GRA',
    'Maryland',
    'Maitama, Abuja',
  ];

  const quickLinks = [
    { label: 'Popular Food Catalog', path: '#popular' },
    { label: 'Best Selling Specialties', path: '#best-sellers' },
    { label: 'Party Jollof & Grills', path: '#popular' },
    { label: 'Artisan Smash Burgers', path: '#popular' },
    { label: 'Wood-Fired Pizza', path: '#popular' },
  ];

  const kitchenHubs = [
    { name: 'Island Central Hub', address: '18 Park Avenue, Victoria Island' },
    { name: 'Lekki Coastal Hearth', address: 'Admiralty Way, Lekki Phase 1' },
    { name: 'Mainland Firewood Studio', address: 'Isaac John St, Ikeja GRA' },
  ];

  return (
    <div className="relative">
      {/* Organic Wave Transition from light page content into dark footer */}
      <SectionWaveDivider fill="#0B0B0B" />

      <footer className="relative bg-[#0B0B0B] text-white pt-10 sm:pt-14 pb-10 overflow-hidden border-t border-white/5">
        {/* Subtle Culinary Doodles Background Pattern */}
        <CulinaryPatternBg opacity={0.04} color="#FFFFFF" />

        {/* Ambient Warm Ember Lighting in Footer */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[var(--color-ember)]/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-amber-500/5 blur-[100px] pointer-events-none" />

        <div className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          {/* Top Banner Row: Brand Wordmark & Live Hub Status */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-12 border-b border-white/10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link
                  to="/"
                  className="font-black text-3xl sm:text-4xl lg:text-5xl tracking-[-0.03em] text-white inline-block select-none"
                >
                  CRAVE<span className="text-[var(--color-ember)]">.</span>
                </Link>
                <span className="text-[11px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full uppercase tracking-wider">
                  Artisanal Cloud Kitchens
                </span>
              </div>
              <p className="text-sm sm:text-base text-neutral-400 font-medium tracking-tight">
                Crafted for those who truly taste. Firewood smoke & culinary soul in Lagos.
              </p>
            </div>

            {/* Live Operational Status Capsule */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2.5 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-xs font-semibold text-neutral-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>3 Hubs Kitchens Open Now</span>
                <span className="text-neutral-500">•</span>
                <span className="text-amber-300 font-bold">Avg. Prep 14m</span>
              </div>

              {/* Direct WhatsApp Concierge CTA */}
              <a
                href="https://wa.me/2348031234567?text=Hello%20CRAVE%2C%20I%20would%20like%20to%20place%20an%20artisan%20order"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-black border border-[#25D366]/40 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <MessageCircle size={15} />
                <span>Chef WhatsApp Concierge</span>
              </a>
            </div>
          </div>

          {/* Main Footer Content Grid: 4 Modern Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 py-12 border-b border-white/10">
            {/* Col 1: Kitchen Hubs & Physical Dispatch (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Flame size={14} className="text-[var(--color-ember)]" />
                <span>Lagos Cloud Kitchen Hubs</span>
              </h4>

              <div className="space-y-3 pt-1">
                {kitchenHubs.map((hub, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-colors"
                  >
                    <p className="text-xs font-bold text-white">{hub.name}</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5 flex items-center gap-1.5">
                      <MapPin size={12} className="text-[var(--color-ember)] shrink-0" />
                      <span>{hub.address}</span>
                    </p>
                  </div>
                ))}
              </div>

              {/* Direct Hotline & Operating Hours */}
              <div className="pt-2 flex flex-col gap-2 text-xs text-neutral-400">
                <div className="flex items-center gap-2 text-neutral-300">
                  <Phone size={13} className="text-[var(--color-ember)]" />
                  <a href="tel:+2348031234567" className="hover:text-white font-bold transition-colors">
                    +234 (0) 803 123 4567
                  </a>
                  <span>/</span>
                  <a href="tel:012345678" className="hover:text-white font-bold transition-colors">
                    01 234 5678
                  </a>
                </div>
                <div className="flex items-center gap-2 text-neutral-400 text-[11px]">
                  <Clock size={13} className="text-amber-400" />
                  <span>Mon – Sun: 10:00 AM – 11:30 PM (Daily Dispatch)</span>
                </div>
              </div>
            </div>

            {/* Col 2: Curated Culinary Menu (2.5 cols) */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
                Artisan Kitchen Menu
              </h4>
              <ul className="space-y-2.5 text-xs text-neutral-300">
                {quickLinks.map((item, idx) => (
                  <li key={idx}>
                    <a
                      href={item.path}
                      className="hover:text-[var(--color-ember)] flex items-center gap-2 group transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 group-hover:bg-[var(--color-ember)] transition-colors" />
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
                <li className="pt-2">
                  <a
                    href="#popular"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-white transition-colors"
                  >
                    <span>Full 12-Dish Catalog</span>
                    <ArrowRight size={13} />
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: The CRAVE Society / Modern Newsletter Club (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-[24px] bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 space-y-3 relative overflow-hidden">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-[var(--color-ember)]" />
                  <h4 className="text-sm font-black text-white tracking-tight">
                    Join The CRAVE Society
                  </h4>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Receive private tasting invites, secret firewood smokehouse drops, and a{' '}
                  <strong className="text-amber-300">₦2,000 welcome voucher</strong> on your first Lagos order.
                </p>

                {isJoined ? (
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-2.5 text-xs font-bold">
                    <CheckCircle2 size={16} />
                    <span>Welcome to the CRAVE Society! Check your inbox for your ₦2,000 code.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-1">
                    <div className="flex-1 bg-black/60 rounded-full border border-white/15 px-4 py-2.5 flex items-center focus-within:border-[var(--color-ember)] transition-colors">
                      <Mail size={14} className="text-neutral-500 shrink-0 mr-2.5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email for ₦2,000 voucher..."
                        className="w-full bg-transparent border-none outline-none text-xs text-white placeholder:text-neutral-500"
                      />
                    </div>
                    <button
                      type="submit"
                      aria-label="Join society"
                      className="h-10 px-5 rounded-full bg-[var(--color-ember)] hover:bg-[#e04b14] active:scale-95 text-white font-bold text-xs shrink-0 transition-all shadow-md cursor-pointer"
                    >
                      Claim
                    </button>
                  </form>
                )}

                <p className="text-[10px] text-neutral-500">
                  Zero spam. Curated culinary dispatches only. Unsubscribe at any time.
                </p>
              </div>

              {/* Lagos Delivery Neighborhoods Coverage Chips */}
              <div className="space-y-2 pt-1">
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Express Delivery Zones
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {neighborhoods.map((n, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium text-neutral-300 bg-white/5 border border-white/10 px-2.5 py-0.8 rounded-full"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Badges & Trust Ribbon */}
          <div className="py-6 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Secure Nigerian & Global Payments:
              </span>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-white/10 text-white font-black text-[11px] tracking-wider">
                  PAYSTACK
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white/10 text-amber-300 font-bold text-[11px]">
                  FLUTTERWAVE
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white/10 text-emerald-400 font-extrabold text-[11px]">
                  VERVE
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white/10 text-white font-bold text-[11px]">
                  MASTERCARD
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white/10 text-blue-400 font-black text-[11px]">
                  VISA
                </span>
              </div>
            </div>

            {/* Back to top magnetic pill */}
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition-colors cursor-pointer text-xs"
            >
              <span>Back to Top</span>
              <ArrowUp size={13} />
            </button>
          </div>

          {/* Bottom Copyright & Craftsmanship Declaration */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500 text-center sm:text-left">
            <p>
              © {new Date().getFullYear()} CRAVE Culinary Collective Ltd. Authentic Firewood Smoked Flavors · Lagos, Nigeria.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/" className="hover:text-neutral-300 transition-colors">
                Food Safety & Hygiene
              </Link>
              <span>•</span>
              <Link to="/" className="hover:text-neutral-300 transition-colors">
                Allergen Transparency
              </Link>
              <span>•</span>
              <Link to="/" className="hover:text-neutral-300 transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
