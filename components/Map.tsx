"use client";

import {
  useEffect,
  useState,
  useCallback,
  useMemo,
  memo,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import Map, { Marker, ViewState } from "react-map-gl/mapbox";
import type { Stand } from "@/types/stand";
import { loadStands } from "@/lib/data";
import { env } from "@/env.mjs";
import { Spinner } from "@/components/ui/spinner";
import { StandPopover } from "@/components/StandPopover";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import "mapbox-gl/dist/mapbox-gl.css";

/**
 * Vorarlberg region bounds for initial map view
 * Calculated from actual stand coordinates to center the region properly
 */
const VORARLBERG_BOUNDS = {
  latitude: 47.225204,
  longitude: 9.973051,
  zoom: 9,
};

interface MapComponentProps {
  stands?: Stand[];
}

// Memoized marker component for performance
interface StandMarkerProps {
  stand: Stand;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const StandMarker = memo(
  ({ stand, isOpen, onOpenChange }: StandMarkerProps) => {
    const handleKeyDown = useCallback(
      (e: ReactKeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenChange(!isOpen);
        }
      },
      [isOpen, onOpenChange]
    );

    return (
      <Marker
        latitude={stand.coordinates.lat}
        longitude={stand.coordinates.lng}
        anchor="center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          <StandPopover stand={stand} open={isOpen} onOpenChange={onOpenChange}>
            <div
              role="button"
              tabIndex={0}
              aria-label={`Stand ${stand.name} öffnen`}
              onKeyDown={handleKeyDown}
              className="h-4 w-4 cursor-pointer rounded-full border-2 border-white bg-red-500 shadow-lg transition-transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            />
          </StandPopover>
        </motion.div>
      </Marker>
    );
  }
);

StandMarker.displayName = "StandMarker";

export const MapComponent = ({ stands: propsStands }: MapComponentProps) => {
  const { theme } = useTheme();
  const [stands, setStands] = useState<Stand[]>(propsStands ?? []);
  const [viewState, setViewState] = useState<ViewState>({
    latitude: VORARLBERG_BOUNDS.latitude,
    longitude: VORARLBERG_BOUNDS.longitude,
    zoom: VORARLBERG_BOUNDS.zoom,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  useEffect(() => {
    // Load stands if not provided as props
    if (!propsStands) {
      try {
        const loadedStands = loadStands();
        setStands(loadedStands);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load stands:", error);
        setIsLoading(false);
      }
    } else {
      // If stands are provided as props, we're not loading
      setIsLoading(false);
    }
  }, [propsStands]);

  // Update stands when propsStands changes
  useEffect(() => {
    if (propsStands !== undefined) {
      setStands(propsStands);
    }
  }, [propsStands]);

  // Handle keyboard navigation for closing popover
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape" && openPopoverId) {
        setOpenPopoverId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openPopoverId]);

  // Handle map movement
  const handleMapMove = useCallback((evt: { viewState: ViewState }) => {
    setViewState(evt.viewState);
  }, []);

  const handlePopoverChange = useCallback((standId: string | null) => {
    setOpenPopoverId(standId);
  }, []);

  // Memoize stand IDs to prevent unnecessary re-renders
  const standIds = useMemo(() => {
    return stands.map(
      (stand) =>
        `${stand.name}-${stand.coordinates.lat}-${stand.coordinates.lng}`
    );
  }, [stands]);

  const mapboxToken = env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  if (!mapboxToken) {
    return (
      <div
        className="flex h-screen w-full items-center justify-center"
        role="alert"
        aria-live="assertive"
      >
        <p className="text-lg text-red-500">
          Mapbox-Zugriffstoken fehlt. Bitte setzen Sie
          NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in Ihren Umgebungsvariablen.
        </p>
      </div>
    );
  }

  const showLoading = isLoading;

  return (
    <div
      className="relative h-screen w-full"
      role="application"
      aria-label="Karte mit Standorten"
    >
      <AnimatePresence mode="wait">
        {showLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80"
            role="status"
            aria-live="polite"
            aria-label="Karte wird geladen"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Spinner className="h-8 w-8" />
            </motion.div>
            <p className="mt-4 text-sm text-muted-foreground">
              Karte wird geladen...
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="map"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full w-full"
          >
            <Map
              {...viewState}
              onMove={handleMapMove}
              mapboxAccessToken={mapboxToken}
              style={{ width: "100%", height: "100%" }}
              mapStyle={
                theme === "dark"
                  ? "mapbox://styles/mapbox/dark-v11"
                  : "mapbox://styles/mapbox/light-v11"
              }
            >
              <AnimatePresence initial={false} mode="popLayout">
                {stands.map((stand, index) => {
                  const standId = standIds[index];
                  const isOpen = openPopoverId === standId;

                  return (
                    <StandMarker
                      key={standId}
                      stand={stand}
                      isOpen={isOpen}
                      onOpenChange={(open) =>
                        handlePopoverChange(open ? standId : null)
                      }
                    />
                  );
                })}
              </AnimatePresence>
            </Map>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
