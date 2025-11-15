/**
 * Day of week representation
 * 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday
 */
export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Geographic coordinates for a stand location
 */
export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Stand location data structure
 */
export interface Stand {
  name: string;
  address: string;
  coordinates: Coordinates;
  daysOfWeek: DayOfWeek[];
}

/**
 * Raw stand data from JSON (before validation)
 */
export interface RawStand {
  name: unknown;
  address: unknown;
  coordinates: unknown;
  daysOfWeek: unknown;
}
