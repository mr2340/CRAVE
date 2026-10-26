import {
  useReducer,
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import {
  cartReducer,
  getCartLines,
  getItemCount,
  getSubtotalMinor,
  getDeliveryMinor,
  getTotalMinor,
} from '../lib/cart.js';
import { readCart, writeCart, saveOrder } from '../lib/storage.js';
import { ETA_TEXT, MAX_LINE_QTY } from '../config/site.js';
import { PRODUCTS } from '../data/catalog.js';

const productMap = new Map(PRODUCTS.map((p) => [p.id, p]));

import { CartContext } from './cartContextInstance.js';

export function CartProvider({ children }) {
  // Synchronous hydration from storage
  const [state, dispatch] = useReducer(cartReducer, null, () => ({
    items: readCart(),
  }));

  // Drawer and confirmation UI state
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState('cart'); // 'cart' | 'confirmation'
  const [lastOrder, setLastOrder] = useState(null);

  // Announcer message state
  const [announcement, setAnnouncement] = useState('');
  const announcerTimeoutRef = useRef(null);

  // Focus restoration trigger element
  const openerRef = useRef(null);

  // Persistence: write items on change (skip first mount)
  const isHydratedRef = useRef(false);
  useEffect(() => {
    if (!isHydratedRef.current) {
      isHydratedRef.current = true;
      return;
    }
    writeCart(state.items);
  }, [state.items]);

  // Derived values
  const lines = useMemo(() => getCartLines(state.items), [state.items]);
  const itemCount = useMemo(() => getItemCount(state.items), [state.items]);
  const subtotalMinor = useMemo(() => getSubtotalMinor(lines), [lines]);
  const deliveryMinor = useMemo(() => getDeliveryMinor(subtotalMinor), [subtotalMinor]);
  const totalMinor = useMemo(() => getTotalMinor(subtotalMinor, deliveryMinor), [subtotalMinor, deliveryMinor]);

  const announce = useCallback((message) => {
    if (announcerTimeoutRef.current) {
      clearTimeout(announcerTimeoutRef.current);
    }
    setAnnouncement(message);
    announcerTimeoutRef.current = setTimeout(() => {
      setAnnouncement('');
    }, 1000);
  }, []);

  const qtyOf = useCallback(
    (id) => state.items[id] || 0,
    [state.items]
  );

  const add = useCallback(
    (id) => {
      const product = productMap.get(id);
      const name = product ? product.name : 'Item';
      const currentQty = state.items[id] || 0;
      if (currentQty >= MAX_LINE_QTY) {
        announce('Maximum of 20 per dish.');
        return;
      }
      dispatch({ type: 'ADD', payload: id });
      const newTotalItems = itemCount + 1;
      const countStr = newTotalItems === 1 ? '1 item' : `${newTotalItems} items`;
      announce(`${name} added. ${countStr} in cart.`);
    },
    [state.items, itemCount, announce]
  );

  const increment = useCallback(
    (id) => {
      const product = productMap.get(id);
      const name = product ? product.name : 'Item';
      const currentQty = state.items[id] || 0;
      if (currentQty >= MAX_LINE_QTY) {
        announce('Maximum of 20 per dish.');
        return;
      }
      dispatch({ type: 'INCREMENT', payload: id });
      const newTotalItems = itemCount + 1;
      const countStr = newTotalItems === 1 ? '1 item' : `${newTotalItems} items`;
      announce(`${name} quantity increased. ${countStr} in cart.`);
    },
    [state.items, itemCount, announce]
  );

  const decrement = useCallback(
    (id) => {
      const product = productMap.get(id);
      const name = product ? product.name : 'Item';
      const currentQty = state.items[id] || 0;
      dispatch({ type: 'DECREMENT', payload: id });
      const newTotalItems = Math.max(0, itemCount - 1);
      if (currentQty <= 1) {
        if (newTotalItems === 0) {
          announce(`${name} removed. Cart is empty.`);
        } else {
          const countStr = newTotalItems === 1 ? '1 item' : `${newTotalItems} items`;
          announce(`${name} removed. ${countStr} in cart.`);
        }
      } else {
        const countStr = newTotalItems === 1 ? '1 item' : `${newTotalItems} items`;
        announce(`${name} quantity decreased. ${countStr} in cart.`);
      }
    },
    [state.items, itemCount, announce]
  );

  const remove = useCallback(
    (id) => {
      const product = productMap.get(id);
      const name = product ? product.name : 'Item';
      const removedQty = state.items[id] || 0;
      dispatch({ type: 'REMOVE', payload: id });
      const newTotalItems = Math.max(0, itemCount - removedQty);
      if (newTotalItems === 0) {
        announce(`${name} removed. Cart is empty.`);
      } else {
        const countStr = newTotalItems === 1 ? '1 item' : `${newTotalItems} items`;
        announce(`${name} removed. ${countStr} in cart.`);
      }
    },
    [state.items, itemCount, announce]
  );

  const openCart = useCallback((triggerEl = null) => {
    if (triggerEl && typeof triggerEl.focus === 'function') {
      openerRef.current = triggerEl;
    } else if (typeof document !== 'undefined' && document.activeElement) {
      openerRef.current = document.activeElement;
    }
    setIsOpen(true);
  }, []);

  const finishOrder = useCallback(() => {
    setLastOrder(null);
    setView('cart');
  }, []);

  const requestClose = useCallback(() => {
    setIsOpen(false);
    if (view === 'confirmation') {
      finishOrder();
    }
    if (openerRef.current && typeof openerRef.current.focus === 'function') {
      openerRef.current.focus();
    }
  }, [view, finishOrder]);

  const placeOrder = useCallback((customDetails = null) => {
    if (lines.length === 0) return null;

    // Generate local order number: CRV- + 5 random digits
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `CRV-${randomDigits}`;

    const snapshot = {
      number: orderNumber,
      lines: [...lines],
      subtotalMinor,
      deliveryMinor,
      totalMinor,
      etaText: ETA_TEXT,
      createdAt: new Date().toISOString(),
      customer: customDetails || {
        name: 'Guest Diner',
        phone: '+234 800 000 0000',
        email: 'guest@crave.demo',
        address: '14 Victoria Island, Lagos, Nigeria',
        instructions: 'Please call when arriving at the security gate.'
      }
    };

    saveOrder(snapshot);
    setLastOrder(snapshot);
    dispatch({ type: 'CLEAR' });
    setView('confirmation');
    announce('Order placed. This is a demonstration.');
    return snapshot;
  }, [lines, subtotalMinor, deliveryMinor, totalMinor, announce]);

  const value = useMemo(
    () => ({
      items: state.items,
      lines,
      itemCount,
      subtotalMinor,
      deliveryMinor,
      totalMinor,
      qtyOf,
      add,
      increment,
      decrement,
      remove,
      isOpen,
      view,
      lastOrder,
      openCart,
      requestClose,
      placeOrder,
      finishOrder,
    }),
    [
      state.items,
      lines,
      itemCount,
      subtotalMinor,
      deliveryMinor,
      totalMinor,
      qtyOf,
      add,
      increment,
      decrement,
      remove,
      isOpen,
      view,
      lastOrder,
      openCart,
      requestClose,
      placeOrder,
      finishOrder,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      {/* Announcer live region for screen readers */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
    </CartContext.Provider>
  );
}
