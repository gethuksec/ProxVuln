import { format, formatDistanceToNow, isBefore } from "date-fns";

/**
 * Format date ke format Indonesia
 */
export function formatDate(date: Date | string, formatStr: string = "dd MMMM yyyy"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, formatStr);
}

/**
 * Format date dengan waktu
 */
export function formatDateTime(date: Date | string): string {
  return formatDate(date, "dd MMMM yyyy, HH:mm");
}

/**
 * Hitung waktu tersisa sampai expiration
 */
export function getTimeUntilExpiration(expiresAt: Date): string {
  const now = new Date();
  if (isBefore(expiresAt, now)) {
    return "Kedaluwarsa";
  }
  return formatDistanceToNow(expiresAt, { addSuffix: true });
}

/**
 * Cek apakah date sudah expired
 */
export function isExpired(date: Date): boolean {
  return isBefore(date, new Date());
}

