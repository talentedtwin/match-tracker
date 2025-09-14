// Date formatting utilities for consistent date display across the app

/**
 * Formats an ISO date string to dd-mm-yyyy hh:mm format
 * @param dateString - ISO date string (e.g., "2025-09-14T10:30:00.000Z")
 * @returns Formatted date string (e.g., "14-09-2025 10:30")
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

/**
 * Formats an ISO date string to dd-mm-yyyy format (date only)
 * @param dateString - ISO date string (e.g., "2025-09-14T10:30:00.000Z")
 * @returns Formatted date string (e.g., "14-09-2025")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

/**
 * Formats an ISO date string to hh:mm format (time only)
 * @param dateString - ISO date string (e.g., "2025-09-14T10:30:00.000Z")
 * @returns Formatted time string (e.g., "10:30")
 */
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};
