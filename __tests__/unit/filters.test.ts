import { describe, it, expect } from "vitest";
import { filterStandsByDays, getDefaultSelectedDays } from "@/lib/filters";
import type { Stand, DayOfWeek } from "@/types/stand";

describe("filterStandsByDays", () => {
  const mockStands: Stand[] = [
    {
      name: "Stand 1",
      address: "Address 1",
      coordinates: { lat: 47.0, lng: 9.0 },
      daysOfWeek: [1, 3, 5], // Monday, Wednesday, Friday
    },
    {
      name: "Stand 2",
      address: "Address 2",
      coordinates: { lat: 47.1, lng: 9.1 },
      daysOfWeek: [2, 4], // Tuesday, Thursday
    },
    {
      name: "Stand 3",
      address: "Address 3",
      coordinates: { lat: 47.2, lng: 9.2 },
      daysOfWeek: [1, 2, 3, 4, 5, 6], // All days
    },
    {
      name: "Stand 4",
      address: "Address 4",
      coordinates: { lat: 47.3, lng: 9.3 },
      daysOfWeek: [6], // Saturday only
    },
  ];

  it("should filter stands by single day correctly", () => {
    const selectedDays: DayOfWeek[] = [1]; // Monday
    const filtered = filterStandsByDays(mockStands, selectedDays);

    expect(filtered).toHaveLength(2);
    expect(filtered[0]?.name).toBe("Stand 1");
    expect(filtered[1]?.name).toBe("Stand 3");
  });

  it("should filter stands by multiple days correctly", () => {
    const selectedDays: DayOfWeek[] = [1, 3, 5]; // Monday, Wednesday, Friday
    const filtered = filterStandsByDays(mockStands, selectedDays);

    expect(filtered).toHaveLength(2);
    expect(filtered[0]?.name).toBe("Stand 1");
    expect(filtered[1]?.name).toBe("Stand 3");
  });

  it("should filter stands by different days correctly", () => {
    const selectedDays: DayOfWeek[] = [2, 4]; // Tuesday, Thursday
    const filtered = filterStandsByDays(mockStands, selectedDays);

    expect(filtered).toHaveLength(2);
    expect(filtered[0]?.name).toBe("Stand 2");
    expect(filtered[1]?.name).toBe("Stand 3");
  });

  it("should return all stands when all days are selected", () => {
    const selectedDays: DayOfWeek[] = [1, 2, 3, 4, 5, 6];
    const filtered = filterStandsByDays(mockStands, selectedDays);

    expect(filtered).toHaveLength(4);
  });

  it("should return empty array when no days are selected", () => {
    const selectedDays: DayOfWeek[] = [];
    const filtered = filterStandsByDays(mockStands, selectedDays);

    expect(filtered).toHaveLength(0);
  });

  it("should filter stands by Saturday only correctly", () => {
    const selectedDays: DayOfWeek[] = [6]; // Saturday
    const filtered = filterStandsByDays(mockStands, selectedDays);

    expect(filtered).toHaveLength(2);
    expect(filtered[0]?.name).toBe("Stand 3");
    expect(filtered[1]?.name).toBe("Stand 4");
  });

  it("should handle empty stands array", () => {
    const selectedDays: DayOfWeek[] = [1];
    const filtered = filterStandsByDays([], selectedDays);

    expect(filtered).toHaveLength(0);
  });

  it("should filter stands that match any of the selected days", () => {
    // Stand 1 has [1, 3, 5], Stand 2 has [2, 4]
    // Selecting [1, 2] should return both Stand 1 and Stand 2
    const selectedDays: DayOfWeek[] = [1, 2];
    const filtered = filterStandsByDays(mockStands, selectedDays);

    expect(filtered).toHaveLength(3); // Stand 1, Stand 2, Stand 3
    const names = filtered.map((s) => s.name);
    expect(names).toContain("Stand 1");
    expect(names).toContain("Stand 2");
    expect(names).toContain("Stand 3");
  });
});

describe("getDefaultSelectedDays", () => {
  it("should return array with current day when getCurrentDay returns 1 (Monday)", () => {
    const mockGetCurrentDay = () => 1 as DayOfWeek;
    const result = getDefaultSelectedDays(mockGetCurrentDay);

    expect(result).toEqual([1]);
  });

  it("should return array with current day when getCurrentDay returns 3 (Wednesday)", () => {
    const mockGetCurrentDay = () => 3 as DayOfWeek;
    const result = getDefaultSelectedDays(mockGetCurrentDay);

    expect(result).toEqual([3]);
  });

  it("should return array with current day when getCurrentDay returns 6 (Saturday)", () => {
    const mockGetCurrentDay = () => 6 as DayOfWeek;
    const result = getDefaultSelectedDays(mockGetCurrentDay);

    expect(result).toEqual([6]);
  });

  it("should return array with single day for any valid day", () => {
    for (let day = 1; day <= 6; day++) {
      const mockGetCurrentDay = () => day as DayOfWeek;
      const result = getDefaultSelectedDays(mockGetCurrentDay);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(day);
    }
  });
});
