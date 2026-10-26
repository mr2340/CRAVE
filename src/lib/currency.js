export const CURRENCY = {
  code: 'NGN',
  symbol: '₦',
  locale: 'en-NG',
  minorUnitExponent: 2,
  fractionDigits: 0,
};

/**
 * Formats a monetary value into Nigerian Naira (₦).
 * Handles values in minor units (kobo, e.g. 650000 -> ₦6,500)
 * or major units (Naira, e.g. 6500 -> ₦6,500).
 *
 * @param {number} minorOrMajor
 * @returns {string}
 */
export function formatMoney(minorOrMajor) {
  if (minorOrMajor === undefined || minorOrMajor === null || isNaN(minorOrMajor)) {
    return '₦0';
  }

  // If value is in kobo minor units (e.g. >= 100,000 or fractional kobo)
  const naira = minorOrMajor >= 10000 ? minorOrMajor / 100 : minorOrMajor;

  return `₦${Math.round(naira).toLocaleString('en-US')}`;
}

export function formatNaira(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₦0';
  }
  return `₦${Math.round(amount).toLocaleString('en-US')}`;
}
