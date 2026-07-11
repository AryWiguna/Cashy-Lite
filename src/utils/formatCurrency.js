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
