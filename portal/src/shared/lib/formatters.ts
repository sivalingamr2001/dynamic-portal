// src/shared/utils/formatters.ts
export const formatCurrency = (value: number, currency = "USD", locale = "en-US"): string =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(value);

export const formatDate = (
  date: string | Date,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium" }
): string =>
  new Intl.DateTimeFormat("en-US", options).format(
    typeof date === "string" ? new Date(date) : date
  );

export const formatRelativeTime = (date: string | Date): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const seconds = diff / 1000;
  if (Math.abs(seconds) < 60) return rtf.format(-Math.round(seconds), "second");
  if (Math.abs(seconds) < 3600) return rtf.format(-Math.round(seconds / 60), "minute");
  if (Math.abs(seconds) < 86400) return rtf.format(-Math.round(seconds / 3600), "hour");
  return rtf.format(-Math.round(seconds / 86400), "day");
};

export const truncate = (str: string, length: number): string =>
  str.length > length ? `${str.slice(0, length)}…` : str;
