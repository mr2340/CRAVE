import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import MobileNav from './components/MobileNav.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import { ScrollToTop } from './components/ScrollToTop.jsx';

import HomePage from './pages/HomePage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import DishDetailPage from './pages/DishDetailPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderReceiptPage from './pages/OrderReceiptPage.jsx';
import OrderTrackingPage from './pages/OrderTrackingPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function AppLayout() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] flex flex-col justify-between">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--color-ink)] focus:text-white focus:rounded-[var(--radius-control)] focus:shadow-lg focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[var(--color-ink)]"
      >
        Skip to main content
      </a>

      {!isDashboard && <Header />}

      <div className="flex-1">
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<HomePage />} />

          {/* Interactive Mobile Food Delivery Dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Product Detail, Cart, and Checkout */}
          <Route path="/menu/:slug" element={<DishDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order/:id/receipt" element={<OrderReceiptPage />} />
          <Route path="/track/:id" element={<OrderTrackingPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      {!isDashboard && <Footer />}
      {!isDashboard && <MobileNav />}
      <CartDrawer />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppLayout />
      </BrowserRouter>
    </CartProvider>
  );
}
