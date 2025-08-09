import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Extracts initials from a full name
 * @param {string} fullName - The full name to extract initials from
 * @returns {string} The initials (first and last character of first and last name parts)
 */
export function getInitials(fullName) {
  if (!fullName || typeof fullName !== 'string') return '';
  
  const nameParts = fullName.trim().split(/\s+/);
  if (nameParts.length === 0) return '';
  
  const firstInitial = nameParts[0].charAt(0).toUpperCase();
  
  // If there's only one part, return its first character
  if (nameParts.length === 1) return firstInitial;
  
  // Otherwise, get the first character of the last part
  const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
  
  return `${firstInitial}${lastInitial}`;
}
