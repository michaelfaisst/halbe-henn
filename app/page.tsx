"use client";

import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { Drumstick } from "lucide-react";
import { SideNav } from "@/components/SideNav";
import { loadStands } from "@/lib/data";
import { filterStandsByDays, getDefaultSelectedDays } from "@/lib/filters";
import { getCurrentDayOfWeek } from "@/lib/data";
import { Spinner } from "@/components/ui/spinner";
import type { Stand, DayOfWeek } from "@/types/stand";

// Dynamically import Map component to reduce initial bundle size
const MapComponent = dynamic(() => import("@/components/Map").then((mod) => ({ default: mod.MapComponent })), {
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="h-8 w-8" />
        <p className="text-sm text-muted-foreground">Karte wird geladen...</p>
      </div>
    </div>
  ),
  ssr: false,
});

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
    <main className="relative h-screen w-full overflow-x-hidden" role="main">
      {/* Header - Top Left */}
      <div className="absolute left-4 top-4 z-30 flex h-10 items-center gap-4 sm:left-6 sm:top-6 sm:h-auto">
        <Drumstick className="h-6 w-6 shrink-0 text-[#f08b8b] sm:h-7 sm:w-7" />
        <h1 className="font-righteous text-2xl font-bold leading-none text-card-foreground sm:text-3xl">
          Halbe Henn
        </h1>
      </div>
      <Suspense
        fallback={
          <div className="flex h-screen w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Spinner className="h-8 w-8" />
              <p className="text-sm text-muted-foreground">Karte wird geladen...</p>
            </div>
          </div>
        }
      >
        <MapComponent stands={filteredStands} />
      </Suspense>
      <SideNav selectedDays={selectedDays} onDaysChange={setSelectedDays} />
    </main>
  );
}
