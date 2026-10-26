import LandingHero from '../components/LandingHero.jsx';
import ValuePropsStrip from '../components/ValuePropsStrip.jsx';
import HottestCategories from '../components/HottestCategories.jsx';
import PromoFeatureBanners from '../components/PromoFeatureBanners.jsx';
import BestSellingSection from '../components/BestSellingSection.jsx';
import FarmersAndChefsStory from '../components/FarmersAndChefsStory.jsx';
import MostPopularSection from '../components/MostPopularSection.jsx';
import StatsCounterStrip from '../components/StatsCounterStrip.jsx';
import CustomerReviewsSection from '../components/CustomerReviewsSection.jsx';
import MobileAppBanner from '../components/MobileAppBanner.jsx';
import CulinaryStoriesSection from '../components/CulinaryStoriesSection.jsx';

/**
 * Editorial & Commercial Landing Page for CRAVE (Lagos, Nigeria)
 *
 * Implements the exact structure and visual hierarchy of the reference design:
 * 1. LandingHero - Circular hero plate presentation with discount badge & headline
 * 2. ValuePropsStrip - 4 horizontal value proposition cards
 * 3. HottestCategories - "Browse Our Hottest Categories" pastel cards carousel
 * 4. PromoFeatureBanners - 3 distinct promotional banners (Dark, Cream, Ember)
 * 5. BestSellingSection - "Best Selling Products" with Naira pricing & stepper controls
 * 6. FarmersAndChefsStory - Accredited African farmers & master chefs story split banner
 * 7. MostPopularSection - "Most Popular Products" tabbed 8-card grid
 * 8. StatsCounterStrip - Full-width dark metric stats strip (15,000+ Foodies, etc.)
 * 9. CustomerReviewsSection - "Why Customers Love Us?" 5-star reviews with Lagos locations
 * 10. MobileAppBanner - "Download CRAVE Mobile App" banner with app mockup
 * 11. CulinaryStoriesSection - "Latest News & Culinary Stories" blog cards
 * 12. PartnerLogosStrip - Accredited brand partners strip
 */
export default function HomePage() {
  return (
    <main id="main-content" className="w-full">
      {/* 1. Hero Section */}
      <LandingHero />

      {/* 2. Value Proposition 4-Feature Strip */}
      <ValuePropsStrip />

      {/* 3. Browse Our Hottest Categories */}
      <HottestCategories />

      {/* 4. Three Promo Feature Banners */}
      <PromoFeatureBanners />

      {/* 5. Best Selling Products Carousel */}
      <BestSellingSection />

      {/* 6. Accredited Farmers & Master Chefs Section */}
      <FarmersAndChefsStory />

      {/* 7. Most Popular Products Tabbed Grid */}
      <MostPopularSection />

      {/* 8. Dark Metric Stats Counter Strip */}
      <StatsCounterStrip />

      {/* 9. Why Customers Love Us? Testimonials */}
      <CustomerReviewsSection />

      {/* 10. Mobile App Download Banner */}
      <MobileAppBanner />

      {/* 11. Latest News & Culinary Stories */}
      <CulinaryStoriesSection />
    </main>
  );
}
