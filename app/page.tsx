"use client";

import { useState, useEffect } from "react";
import { MapComponent } from "@/components/Map";
import { SideNav } from "@/components/SideNav";
import { loadStands } from "@/lib/data";
import { filterStandsByDays, getDefaultSelectedDays } from "@/lib/filters";
import { getCurrentDayOfWeek } from "@/lib/data";
import type { Stand, DayOfWeek } from "@/types/stand";

export default function Home() {
  const [allStands, setAllStands] = useState<Stand[]>([]);
  // Initialize with default selected days (current day) using lazy initializer
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(() =>
    getDefaultSelectedDays(getCurrentDayOfWeek)
  );
  const [filteredStands, setFilteredStands] = useState<Stand[]>([]);

  // Load stands on mount
  useEffect(() => {
    try {
      const stands = loadStands();
      setAllStands(stands);
    } catch (error) {
      console.error("Failed to load stands:", error);
    }
  }, []);

  // Filter stands when selected days change
  useEffect(() => {
    if (allStands.length > 0 && selectedDays.length > 0) {
      const filtered = filterStandsByDays(allStands, selectedDays);
      setFilteredStands(filtered);
    } else {
      setFilteredStands([]);
    }
  }, [allStands, selectedDays]);

  return (
    <main className="relative h-screen w-full overflow-x-hidden">
      <MapComponent stands={filteredStands} />
      <SideNav selectedDays={selectedDays} onDaysChange={setSelectedDays} />
    </main>
  );
}
