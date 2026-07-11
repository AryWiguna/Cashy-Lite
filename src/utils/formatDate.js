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

export const getTodayISO = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getCurrentMonthYear = () => {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1, // getMonth() is 0-indexed
  };
};
