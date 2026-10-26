import { CATEGORIES } from '../data/catalog.js';

const categoryLabelMap = new Map(CATEGORIES.map((c) => [c.id, c.label]));

/**
 * Normalizes text for search: lowercase, NFKD normalization, strip diacritics, trim.
 * @param {string} s
 * @returns {string}
 */
export function normalize(s) {
  if (!s) return '';
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim();
}

/**
 * Filter products by category and query string.
 * Category and query combine with AND.
 * Every token in query must match (AND across tokens).
 * Empty/whitespace query matches everything.
 * Result order = catalog order.
 * @param {Array<import('../data/catalog.js').Product>} products
 * @param {string} categoryId
 * @param {string} query
 * @returns {Array<import('../data/catalog.js').Product>}
 */
export function filterProducts(products, categoryId = 'all', query = '') {
  const tokens = normalize(query).split(/\s+/).filter(Boolean);

  return products.filter((p) => {
    const matchesCategory = categoryId === 'all' || p.category === categoryId;
    if (!matchesCategory) return false;

    if (tokens.length === 0) return true;

    const catLabel = categoryLabelMap.get(p.category) || p.category;
    const searchable = normalize(`${p.name} ${p.desc} ${catLabel}`);

    return tokens.every((token) => searchable.includes(token));
  });
}
