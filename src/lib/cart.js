import { DELIVERY_FEE_MINOR, MAX_LINE_QTY } from '../config/site.js';
import { PRODUCTS } from '../data/catalog.js';

const productMap = new Map(PRODUCTS.map((p) => [p.id, p]));

export const initialCartState = {
  items: {}, // { [productId]: quantity }
};

/**
 * Pure cart reducer.
 * @param {{ items: Record<string, number> }} state
 * @param {{ type: string, payload?: any }} action
 * @returns {{ items: Record<string, number> }}
 */
export function cartReducer(state, action) {
  const items = { ...state.items };

  switch (action.type) {
    case 'ADD': {
      const id = action.payload;
      if (!productMap.has(id)) return state;
      const currentQty = items[id] || 0;
      if (currentQty >= MAX_LINE_QTY) return state;
      items[id] = currentQty + 1;
      return { items };
    }

    case 'INCREMENT': {
      const id = action.payload;
      if (!items[id]) return state;
      if (items[id] >= MAX_LINE_QTY) return state;
      items[id] = items[id] + 1;
      return { items };
    }

    case 'DECREMENT': {
      const id = action.payload;
      if (!items[id]) return state;
      if (items[id] <= 1) {
        delete items[id];
      } else {
        items[id] = items[id] - 1;
      }
      return { items };
    }

    case 'REMOVE': {
      const id = action.payload;
      if (!items[id]) return state;
      delete items[id];
      return { items };
    }

    case 'CLEAR': {
      return { items: {} };
    }

    case 'HYDRATE': {
      const newItems = action.payload;
      if (!newItems || typeof newItems !== 'object') return state;
      const validItems = {};
      for (const [id, qty] of Object.entries(newItems)) {
        if (
          productMap.has(id) &&
          Number.isInteger(qty) &&
          qty >= 1 &&
          qty <= MAX_LINE_QTY
        ) {
          validItems[id] = qty;
        }
      }
      return { items: validItems };
    }

    default:
      return state;
  }
}

/**
 * Derives cart lines from items dictionary.
 * @param {Record<string, number>} items
 * @returns {Array<{ product: import('../data/catalog.js').Product, qty: number, lineTotalMinor: number }>}
 */
export function getCartLines(items) {
  const lines = [];
  for (const [id, qty] of Object.entries(items)) {
    const product = productMap.get(id);
    if (product && qty > 0) {
      lines.push({
        product,
        qty,
        lineTotalMinor: product.priceMinor * qty,
      });
    }
  }
  return lines;
}

/**
 * Total item count across all lines.
 * @param {Record<string, number>} items
 * @returns {number}
 */
export function getItemCount(items) {
  let count = 0;
  for (const qty of Object.values(items)) {
    count += qty;
  }
  return count;
}

/**
 * Calculates subtotal in integer minor units (kobo).
 * @param {Array<{ lineTotalMinor: number }>} lines
 * @returns {number}
 */
export function getSubtotalMinor(lines) {
  let subtotal = 0;
  for (const line of lines) {
    subtotal += line.lineTotalMinor;
  }
  return subtotal;
}

/**
 * Delivery fee in integer minor units.
 * For USD amounts (< 100000): flat $30.00 (3000 cents), free on orders >= $40.00 (4000 cents) matching video specs.
 * @param {number} subtotalMinor
 * @returns {number}
 */
export function getDeliveryMinor(subtotalMinor) {
  if (subtotalMinor <= 0) return 0;
  if (subtotalMinor < 100000) {
    return subtotalMinor >= 4000 ? 0 : 3000;
  }
  return subtotalMinor >= 1500000 ? 0 : DELIVERY_FEE_MINOR;
}

/**
 * Grand total in integer minor units (kobo).
 * @param {number} subtotalMinor
 * @param {number} deliveryMinor
 * @returns {number}
 */
export function getTotalMinor(subtotalMinor, deliveryMinor) {
  return subtotalMinor + deliveryMinor;
}
