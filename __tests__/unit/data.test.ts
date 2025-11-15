import { describe, it, expect, vi } from "vitest";
import {
  loadStands,
  getCurrentDayOfWeek,
  formatDayName,
  formatDaysOfWeek,
  getStandsCenter,
} from "@/lib/data";
import type { DayOfWeek, Stand } from "@/types/stand";

describe("loadStands", () => {
  it("should load stands data correctly", () => {
    const stands = loadStands();

    expect(stands).toBeInstanceOf(Array);
    expect(stands.length).toBeGreaterThan(0);

    // Verify structure of first stand
    const firstStand = stands[0];
    expect(firstStand).toHaveProperty("name");
    expect(firstStand).toHaveProperty("address");
    expect(firstStand).toHaveProperty("coordinates");
    expect(firstStand).toHaveProperty("daysOfWeek");

    expect(typeof firstStand.name).toBe("string");
    expect(typeof firstStand.address).toBe("string");
    expect(typeof firstStand.coordinates.lat).toBe("number");
    expect(typeof firstStand.coordinates.lng).toBe("number");
    expect(Array.isArray(firstStand.daysOfWeek)).toBe(true);
  });

  it("should validate all stands have valid coordinates", () => {
    const stands = loadStands();

    stands.forEach((stand) => {
      expect(stand.coordinates.lat).toBeGreaterThanOrEqual(-90);
      expect(stand.coordinates.lat).toBeLessThanOrEqual(90);
      expect(stand.coordinates.lng).toBeGreaterThanOrEqual(-180);
      expect(stand.coordinates.lng).toBeLessThanOrEqual(180);
      expect(!isNaN(stand.coordinates.lat)).toBe(true);
      expect(!isNaN(stand.coordinates.lng)).toBe(true);
    });
  });

  it("should validate all stands have valid days of week", () => {
    const stands = loadStands();

    stands.forEach((stand) => {
      expect(stand.daysOfWeek.length).toBeGreaterThan(0);
      stand.daysOfWeek.forEach((day) => {
        expect(day).toBeGreaterThanOrEqual(1);
        expect(day).toBeLessThanOrEqual(6);
        expect(Number.isInteger(day)).toBe(true);
      });
    });
  });

  it("should validate all stands have non-empty names and addresses", () => {
    const stands = loadStands();

    stands.forEach((stand) => {
      expect(stand.name.trim().length).toBeGreaterThan(0);
      expect(stand.address.trim().length).toBeGreaterThan(0);
    });
  });
});

describe("getCurrentDayOfWeek", () => {
  it("should return 1 for Monday", () => {
    const mockGetDay = vi.spyOn(Date.prototype, "getDay").mockReturnValue(1);

    const day = getCurrentDayOfWeek();
    expect(day).toBe(1);

    mockGetDay.mockRestore();
  });

  it("should return 2 for Tuesday", () => {
    const mockGetDay = vi.spyOn(Date.prototype, "getDay").mockReturnValue(2);

    const day = getCurrentDayOfWeek();
    expect(day).toBe(2);

    mockGetDay.mockRestore();
  });

  it("should return 6 for Saturday", () => {
    const mockGetDay = vi.spyOn(Date.prototype, "getDay").mockReturnValue(6);

    const day = getCurrentDayOfWeek();
    expect(day).toBe(6);

    mockGetDay.mockRestore();
  });

  it("should map Sunday (0) to Saturday (6)", () => {
    const mockGetDay = vi.spyOn(Date.prototype, "getDay").mockReturnValue(0);

    const day = getCurrentDayOfWeek();
    expect(day).toBe(6);

    mockGetDay.mockRestore();
  });

  it("should return a valid day of week (1-6)", () => {
    const day = getCurrentDayOfWeek();
    expect(day).toBeGreaterThanOrEqual(1);
    expect(day).toBeLessThanOrEqual(6);
  });
});

describe("formatDayName", () => {
  it("should format day 1 as Montag", () => {
    expect(formatDayName(1)).toBe("Montag");
  });

  it("should format day 2 as Dienstag", () => {
    expect(formatDayName(2)).toBe("Dienstag");
  });

  it("should format day 3 as Mittwoch", () => {
    expect(formatDayName(3)).toBe("Mittwoch");
  });

  it("should format day 4 as Donnerstag", () => {
    expect(formatDayName(4)).toBe("Donnerstag");
  });

  it("should format day 5 as Freitag", () => {
    expect(formatDayName(5)).toBe("Freitag");
  });

  it("should format day 6 as Samstag", () => {
    expect(formatDayName(6)).toBe("Samstag");
  });
});

describe("formatDaysOfWeek", () => {
  it("should format single day correctly", () => {
    expect(formatDaysOfWeek([1])).toBe("Montag");
    expect(formatDaysOfWeek([3])).toBe("Mittwoch");
    expect(formatDaysOfWeek([6])).toBe("Samstag");
  });

  it("should format multiple days correctly", () => {
    expect(formatDaysOfWeek([1, 3, 5])).toBe("Montag, Mittwoch, Freitag");
    expect(formatDaysOfWeek([2, 4, 6])).toBe("Dienstag, Donnerstag, Samstag");
  });

  it("should sort days before formatting", () => {
    expect(formatDaysOfWeek([5, 1, 3])).toBe("Montag, Mittwoch, Freitag");
    expect(formatDaysOfWeek([6, 2, 4])).toBe("Dienstag, Donnerstag, Samstag");
  });

  it("should handle consecutive days", () => {
    expect(formatDaysOfWeek([1, 2, 3])).toBe("Montag, Dienstag, Mittwoch");
    expect(formatDaysOfWeek([4, 5, 6])).toBe("Donnerstag, Freitag, Samstag");
  });

  it("should handle all days", () => {
    const allDays: DayOfWeek[] = [1, 2, 3, 4, 5, 6];
    expect(formatDaysOfWeek(allDays)).toBe(
      "Montag, Dienstag, Mittwoch, Donnerstag, Freitag, Samstag"
    );
  });

  it("should return empty string for empty array", () => {
    expect(formatDaysOfWeek([])).toBe("");
  });

  it("should handle duplicate days (if they exist)", () => {
    // This shouldn't happen in practice, but test the behavior
    expect(formatDaysOfWeek([1, 1, 3])).toBe("Montag, Montag, Mittwoch");
  });
});

describe("getStandsCenter", () => {
  it("should calculate center from multiple stands", () => {
    const stands: Stand[] = [
      {
        name: "Stand 1",
        address: "Address 1",
        coordinates: { lat: 47.0, lng: 9.0 },
        daysOfWeek: [1],
      },
      {
        name: "Stand 2",
        address: "Address 2",
        coordinates: { lat: 47.2, lng: 9.2 },
        daysOfWeek: [2],
      },
      {
        name: "Stand 3",
        address: "Address 3",
        coordinates: { lat: 47.4, lng: 9.4 },
        daysOfWeek: [3],
      },
    ];

    const center = getStandsCenter(stands);
    expect(center.lat).toBeCloseTo(47.2, 5);
    expect(center.lng).toBeCloseTo(9.2, 5);
  });

  it("should return the stand coordinates for a single stand", () => {
    const stands: Stand[] = [
      {
        name: "Stand 1",
        address: "Address 1",
        coordinates: { lat: 47.5, lng: 9.5 },
        daysOfWeek: [1],
      },
    ];

    const center = getStandsCenter(stands);
    expect(center.lat).toBe(47.5);
    expect(center.lng).toBe(9.5);
  });

  it("should return default center for empty array", () => {
    const center = getStandsCenter([]);
    expect(center.lat).toBe(47.225204);
    expect(center.lng).toBe(9.973051);
  });

  it("should calculate center from actual loaded stands", () => {
    const stands = loadStands();
    const center = getStandsCenter(stands);

    // Verify center is within reasonable bounds for Vorarlberg
    expect(center.lat).toBeGreaterThan(47);
    expect(center.lat).toBeLessThan(48);
    expect(center.lng).toBeGreaterThan(9);
    expect(center.lng).toBeLessThan(10);
  });
});
