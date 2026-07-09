// ============================================================
// src/utils/formatDate.js — Date Formatting Utility
//
// Provides helpers to parse and display ISO 8601 date strings
// in a user-friendly Indonesian locale format.
//
// React Native does not include the `date-fns` or `moment`
// libraries by default. We use the built-in `Intl.DateTimeFormat`
// API to avoid adding extra dependencies and keeping the bundle
// size lean for Expo Go.
// ============================================================

/**
 * formatDate(isoString)
 *
 * Converts an ISO date string to a long-form Indonesian date.
 *
 * Examples:
 *   formatDate("2024-07-15")  → "15 Juli 2024"
 *   formatDate("2024-01-01")  → "1 Januari 2024"
 *
 * @param {string} isoString — ISO 8601 date string (YYYY-MM-DD).
 * @returns {string} Human-readable date string in Bahasa Indonesia.
 */
export const formatDate = (isoString) => {
  if (!isoString) return "Tanggal tidak tersedia";

  // Append T00:00:00 to avoid timezone offset issues.
  // Without this, "2024-07-15" may parse as July 14 in UTC-offset zones.
  const date = new Date(`${isoString}T00:00:00`);

  if (isNaN(date.getTime())) return "Tanggal tidak valid";

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

/**
 * formatDateShort(isoString)
 *
 * Converts an ISO date string to a compact format.
 * Used in list items (TransactionCard) where space is limited.
 *
 * Examples:
 *   formatDateShort("2024-07-15")  → "15 Jul 2024"
 *
 * @param {string} isoString
 * @returns {string}
 */
export const formatDateShort = (isoString) => {
  if (!isoString) return "-";

  const date = new Date(`${isoString}T00:00:00`);

  if (isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

/**
 * getTodayISO()
 *
 * Returns the current local date as an ISO 8601 string (YYYY-MM-DD).
 * Used to pre-fill the date field in the AddTransaction form.
 *
 * @returns {string} Today's date in "YYYY-MM-DD" format.
 */
export const getTodayISO = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * getCurrentMonthYear()
 *
 * Returns the current month and year as an object.
 * Used by the Dashboard to pass to `getMonthlyTotal()`.
 *
 * @returns {{ year: number, month: number }}
 */
export const getCurrentMonthYear = () => {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1, // getMonth() is 0-indexed
  };
};
