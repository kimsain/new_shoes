/**
 * Progress calculation utilities for D-day display
 */

// Maximum days for progress bar calculation (6 months)
const MAX_DAYS_FOR_PROGRESS = 180;

/**
 * Calculate progress percentage for D-day countdown
 * Used in ShoeCard and ShoeModal to display remaining certification time
 *
 * @param daysRemaining - Number of days until certification expires (null if unknown)
 * @returns Progress percentage (0-100)
 */
export function getProgressPercent(daysRemaining: number | null): number {
  if (daysRemaining === null) return 0;
  if (daysRemaining <= 0) return 0;
  return Math.min(100, (daysRemaining / MAX_DAYS_FOR_PROGRESS) * 100);
}
