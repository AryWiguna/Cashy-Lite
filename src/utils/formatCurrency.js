// ============================================================
// src/utils/formatCurrency.js — Currency Formatting Utility
//
// Provides a single function to format a numeric value into
// a human-readable Indonesian Rupiah (IDR) string.
//
// Why a utility? Formatting logic is centralized here so that
// ALL screens display amounts consistently. If the format
// needs to change (e.g., adding decimal places), only this
// file needs to be updated.
// ============================================================

/**
 * formatCurrency(amount)
 *
 * Formats a number into Indonesian Rupiah format.
 * Uses the built-in `Intl.NumberFormat` API which is available
 * in the JavaScriptCore (JSC) engine used by React Native.
 *
 * Examples:
 *   formatCurrency(25000)    → "Rp 25.000"
 *   formatCurrency(1500000)  → "Rp 1.500.000"
 *   formatCurrency(0)        → "Rp 0"
 *   formatCurrency(null)     → "Rp 0"
 *
 * @param {number|string|null} amount — The numeric value to format.
 * @returns {string} Formatted currency string with "Rp" prefix.
 */
export const formatCurrency = (amount) => {
  // Guard against null, undefined, or non-numeric values
  const numericAmount = parseFloat(amount) || 0;

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    // Remove decimal places — Rupiah doesn't use cents in practice
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount);
};

/**
 * formatCurrencyCompact(amount)
 *
 * Formats large amounts in a compact, abbreviated form.
 * Useful for smaller UI components where space is limited.
 *
 * Examples:
 *   formatCurrencyCompact(1500000)  → "Rp 1,5 jt"
 *   formatCurrencyCompact(25000)    → "Rp 25 rb"
 *
 * @param {number} amount
 * @returns {string}
 */
export const formatCurrencyCompact = (amount) => {
  const numericAmount = parseFloat(amount) || 0;

  if (numericAmount >= 1_000_000) {
    const millions = (numericAmount / 1_000_000).toFixed(1);
    return `Rp ${millions} jt`;
  }
  if (numericAmount >= 1_000) {
    const thousands = Math.round(numericAmount / 1_000);
    return `Rp ${thousands} rb`;
  }
  return `Rp ${numericAmount}`;
};
