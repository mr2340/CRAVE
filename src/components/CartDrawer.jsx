import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/useCart.js';
import ExpandedCartModal from './ExpandedCartModal.jsx';
import OrderConfirmation from './OrderConfirmation.jsx';

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    isOpen,
    requestClose,
    lines,
    increment,
    decrement,
    remove,
    subtotalMinor,
    deliveryMinor,
    totalMinor,
    view,
    lastOrder,
    finishOrder,
  } = useCart();

  if (view === 'confirmation') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
        <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl overflow-hidden">
          <OrderConfirmation
            lastOrder={lastOrder}
            onBackToMenu={() => {
              finishOrder();
              navigate('/');
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <ExpandedCartModal
      isOpen={isOpen}
      onClose={requestClose}
      lines={lines}
      increment={increment}
      decrement={decrement}
      remove={remove}
      subtotalMinor={subtotalMinor}
      deliveryMinor={deliveryMinor}
      totalMinor={totalMinor}
      onNext={() => {
        requestClose();
        navigate('/checkout');
      }}
    />
  );
}
