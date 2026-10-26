import { MAX_LINE_QTY } from '../config/site.js';
import { PRODUCTS } from '../data/catalog.js';

const STORAGE_KEY = 'crave.cart.v1';
const ORDERS_KEY = 'crave.orders.v1';
const DEMO_USER_KEY = 'crave.user.v1';

const validProductIds = new Set(PRODUCTS.map((p) => p.id));

/**
 * Safely reads and validates cart from localStorage.
 * Returns {} on any error, invalid format, or corrupted data.
 * @returns {Record<string, number>}
 */
export function readCart() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { 'prawn-linguine': 1 };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { 'prawn-linguine': 1 };

    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object' || data.v !== 1 || !data.items || typeof data.items !== 'object') {
      return {};
    }

    const validItems = {};
    for (const [id, qty] of Object.entries(data.items)) {
      if (
        validProductIds.has(id) &&
        Number.isInteger(qty) &&
        qty >= 1 &&
        qty <= MAX_LINE_QTY
      ) {
        validItems[id] = qty;
      }
    }
    return validItems;
  } catch {
    return {};
  }
}

/**
 * Safely writes valid items to localStorage.
 * Swallows quota and private browsing errors silently.
 * @param {Record<string, number>} items
 */
export function writeCart(items) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    const validItems = {};
    for (const [id, qty] of Object.entries(items)) {
      if (
        validProductIds.has(id) &&
        Number.isInteger(qty) &&
        qty >= 1 &&
        qty <= MAX_LINE_QTY
      ) {
        validItems[id] = qty;
      }
    }

    const payload = JSON.stringify({
      v: 1,
      items: validItems,
    });
    window.localStorage.setItem(STORAGE_KEY, payload);
  } catch {
    // Failures swallowed silently per spec
  }
}

/**
 * Saves a demo order snapshot to localStorage.
 * @param {object} order
 */
export function saveOrder(order) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    const orders = raw ? JSON.parse(raw) : {};
    orders[order.number] = {
      ...order,
      savedAt: order.savedAt || new Date().toISOString(),
    };
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {
    // Failures swallowed silently
  }
}

/**
 * Retrieves a demo order by order ID (e.g. 'CRV-12345').
 * @param {string} orderId
 * @returns {object|null}
 */
export function getOrder(orderId) {
  if (!orderId || typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    if (!raw) return null;
    const orders = JSON.parse(raw);
    return orders[orderId] || null;
  } catch {
    return null;
  }
}

/**
 * Retrieves the most recent demo order.
 * @returns {object|null}
 */
export function getLatestOrder() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    if (!raw) return null;
    const orders = JSON.parse(raw);
    const list = Object.values(orders);
    if (list.length === 0) return null;
    list.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
    return list[0];
  } catch {
    return null;
  }
}

/**
 * Gets the simulated customer profile (if set for demo).
 * @returns {{ name: string, email: string, phone: string, address: string, isDemoLoggedIn: boolean }}
 */
export function getDemoUser() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { name: '', email: '', phone: '', address: '', isDemoLoggedIn: false };
  }

  try {
    const raw = window.localStorage.getItem(DEMO_USER_KEY);
    if (!raw) {
      return { name: '', email: '', phone: '', address: '', isDemoLoggedIn: false };
    }
    return JSON.parse(raw);
  } catch {
    return { name: '', email: '', phone: '', address: '', isDemoLoggedIn: false };
  }
}

/**
 * Sets the simulated customer profile.
 * @param {object} user
 */
export function setDemoUser(user) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
  } catch {
    // Storage quota errors ignored
  }
}
