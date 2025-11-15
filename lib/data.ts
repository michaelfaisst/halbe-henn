import type { Stand, RawStand, DayOfWeek, Coordinates } from "@/types/stand";
import standsData from "@/data/stands.json";

/**
 * Validates if a value is a valid day of week (1-6)
 */
const isValidDayOfWeek = (value: unknown): value is DayOfWeek => {
  return typeof value === "number" && value >= 1 && value <= 6;
};

/**
 * Validates if a value is a valid coordinates object
 */
const isValidCoordinates = (value: unknown): value is Coordinates => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const coords = value as Record<string, unknown>;
  return (
    typeof coords.lat === "number" &&
    typeof coords.lng === "number" &&
    !isNaN(coords.lat) &&
    !isNaN(coords.lng)
  );
};

/**
 * Validates if a value is a valid stand object
 */
const isValidStand = (value: unknown): value is Stand => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const stand = value as RawStand;

  // Validate name
  if (typeof stand.name !== "string" || stand.name.trim().length === 0) {
    return false;
  }

  // Validate address
  if (typeof stand.address !== "string" || stand.address.trim().length === 0) {
    return false;
  }

  // Validate coordinates
  if (!isValidCoordinates(stand.coordinates)) {
    return false;
  }

  // Validate daysOfWeek
  if (!Array.isArray(stand.daysOfWeek) || stand.daysOfWeek.length === 0) {
    return false;
  }

  // Validate each day in the array
  if (!stand.daysOfWeek.every(isValidDayOfWeek)) {
    return false;
  }

  return true;
};

/**
 * Loads and validates stand data from JSON file
 * @returns Array of validated Stand objects
 * @throws Error if data is invalid or cannot be loaded
 */
export const loadStands = (): Stand[] => {
  try {
    if (!Array.isArray(standsData)) {
      throw new Error("Stands data must be an array");
    }

    if (standsData.length === 0) {
      throw new Error("Stands data array is empty");
    }

    const validatedStands: Stand[] = [];

    for (let i = 0; i < standsData.length; i++) {
      const rawStand = standsData[i];
      if (!isValidStand(rawStand)) {
        throw new Error(
          `Invalid stand data at index ${i}: ${JSON.stringify(rawStand)}`
        );
      }
      validatedStands.push(rawStand);
    }

    return validatedStands;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load stands data: ${error.message}`);
    }
    throw new Error("Failed to load stands data: Unknown error");
  }
};

/**
 * Gets the current day of week (1-6, where 1=Monday, 6=Saturday)
 * Note: JavaScript's getDay() returns 0-6 (0=Sunday, 6=Saturday)
 * @returns Day of week number (1-6)
 */
export const getCurrentDayOfWeek = (): DayOfWeek => {
  const day = new Date().getDay();
  // Convert: Sunday (0) -> 6, Monday (1) -> 1, ..., Saturday (6) -> 6
  // Since we only support Monday-Saturday, we map Sunday to Saturday
  if (day === 0) {
    return 6; // Sunday maps to Saturday
  }
  return day as DayOfWeek;
};

/**
 * Day names mapping (German)
 */
const DAY_NAMES: Record<DayOfWeek, string> = {
  1: "Montag",
  2: "Dienstag",
  3: "Mittwoch",
  4: "Donnerstag",
  5: "Freitag",
  6: "Samstag",
};

/**
 * Formats a day number to its name (German)
 * @param day - Day of week number (1-6)
 * @returns Day name (e.g., "Montag")
 */
export const formatDayName = (day: DayOfWeek): string => {
  return DAY_NAMES[day];
};

/**
 * Formats an array of day numbers to a readable string (German)
 * @param days - Array of day numbers (1-6)
 * @returns Formatted string (e.g., "Montag, Mittwoch, Freitag")
 */
export const formatDaysOfWeek = (days: DayOfWeek[]): string => {
  if (days.length === 0) {
    return "";
  }

  // Sort days to ensure consistent ordering
  const sortedDays = [...days].sort((a, b) => a - b);

  return sortedDays.map(formatDayName).join(", ");
};

/**
 * Calculates the center point (centroid) of all stand locations
 * @param stands - Array of stands
 * @returns Center coordinates, or default Vorarlberg center if no stands
 */
export const getStandsCenter = (stands: Stand[]): Coordinates => {
  if (stands.length === 0) {
    // Default to Vorarlberg center if no stands
    return { lat: 47.225204, lng: 9.973051 };
  }

  // Calculate average of all coordinates
  const sumLat = stands.reduce((sum, stand) => sum + stand.coordinates.lat, 0);
  const sumLng = stands.reduce((sum, stand) => sum + stand.coordinates.lng, 0);

  return {
    lat: sumLat / stands.length,
    lng: sumLng / stands.length,
  };
};
