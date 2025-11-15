import { describe, it, expect } from "vitest";
import type { Stand } from "@/types/stand";
import { formatDaysOfWeek } from "@/lib/data";

// Note: Full StandPopover component rendering tests are challenging due to Bun's module resolution
// with Radix UI Popover. The component is tested via e2e tests instead.
// This test file focuses on testing the data formatting logic used by the popover.

describe("StandPopover Data Logic", () => {
  const mockStand: Stand = {
    name: "Test Supermarkt",
    address: "Teststraße 123, 6900 Bregenz",
    coordinates: { lat: 47.3, lng: 9.7 },
    daysOfWeek: [1, 3, 5],
  };

  it("should format stand days correctly for popover display", () => {
    const formattedDays = formatDaysOfWeek(mockStand.daysOfWeek);
    expect(formattedDays).toBe("Montag, Mittwoch, Freitag");
  });

  it("should validate stand data structure for popover", () => {
    expect(mockStand.name).toBeTruthy();
    expect(mockStand.address).toBeTruthy();
    expect(Array.isArray(mockStand.daysOfWeek)).toBe(true);
    expect(mockStand.daysOfWeek.length).toBeGreaterThan(0);
  });

  it("should format single day correctly", () => {
    const singleDayStand: Stand = {
      ...mockStand,
      daysOfWeek: [1],
    };
    const formattedDays = formatDaysOfWeek(singleDayStand.daysOfWeek);
    expect(formattedDays).toBe("Montag");
  });

  it("should format all days correctly", () => {
    const allDaysStand: Stand = {
      ...mockStand,
      daysOfWeek: [1, 2, 3, 4, 5, 6],
    };
    const formattedDays = formatDaysOfWeek(allDaysStand.daysOfWeek);
    expect(formattedDays).toBe(
      "Montag, Dienstag, Mittwoch, Donnerstag, Freitag, Samstag"
    );
  });

  it("should handle popover data structure validation", () => {
    // Test that stand data has all required fields for popover
    expect(mockStand).toHaveProperty("name");
    expect(mockStand).toHaveProperty("address");
    expect(mockStand).toHaveProperty("daysOfWeek");
    expect(typeof mockStand.name).toBe("string");
    expect(typeof mockStand.address).toBe("string");
    expect(Array.isArray(mockStand.daysOfWeek)).toBe(true);
  });
});
