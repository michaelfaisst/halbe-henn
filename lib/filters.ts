import type { Stand, DayOfWeek } from "@/types/stand";

/**
 * Filters stands by selected days of week
 * A stand is included if it has at least one day that matches the selected days
 * @param stands - Array of stands to filter
 * @param selectedDays - Array of selected day numbers (1-6)
 * @returns Filtered array of stands
 */
export const filterStandsByDays = (
  stands: Stand[],
  selectedDays: DayOfWeek[]
): Stand[] => {
  // If no days selected, return empty array
  if (selectedDays.length === 0) {
    return [];
  }

  // Filter stands that have at least one day matching the selected days
  return stands.filter((stand) => {
    return stand.daysOfWeek.some((day) => selectedDays.includes(day));
  });
};

/**
 * Gets the default selected days (current day of week)
 * @param getCurrentDay - Function that returns current day (for testing)
 * @returns Array with current day of week
 */
export const getDefaultSelectedDays = (
  getCurrentDay: () => DayOfWeek
): DayOfWeek[] => {
  const currentDay = getCurrentDay();
  return [currentDay];
};
