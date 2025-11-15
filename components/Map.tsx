"use client";

import { useEffect, useState } from "react";
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
      } catch (error) {
        console.error("Failed to load stands:", error);
      }
    }
    setIsLoading(false);
  }, [propsStands]);

  // Update stands when propsStands changes
  useEffect(() => {
    if (propsStands !== undefined) {
      setStands(propsStands);
    }
  }, [propsStands]);

  const mapboxToken = env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  if (!mapboxToken) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-lg text-red-500">
          Mapbox access token is missing. Please set
          NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in your environment variables.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-10 flex items-center justify-center bg-background/80"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Spinner className="h-8 w-8" />
            </motion.div>
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
              onMove={(evt) => setViewState(evt.viewState)}
              mapboxAccessToken={mapboxToken}
              style={{ width: "100%", height: "100%" }}
              mapStyle={
                theme === "dark"
                  ? "mapbox://styles/mapbox/dark-v11"
                  : "mapbox://styles/mapbox/light-v11"
              }
            >
              <AnimatePresence initial={false}>
                {stands.map((stand) => {
                  // Use stable key based on stand properties (no index)
                  const standId = `${stand.name}-${stand.coordinates.lat}-${stand.coordinates.lng}`;
                  const isOpen = openPopoverId === standId;

                  return (
                    <Marker
                      key={standId}
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
                        <StandPopover
                          stand={stand}
                          open={isOpen}
                          onOpenChange={(open) => {
                            setOpenPopoverId(open ? standId : null);
                          }}
                        >
                          <div className="h-4 w-4 cursor-pointer rounded-full border-2 border-white bg-red-500 shadow-lg transition-transform hover:scale-125" />
                        </StandPopover>
                      </motion.div>
                    </Marker>
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
