"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Drumstick, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { DayOfWeek } from "@/types/stand";
import { formatDayName } from "@/lib/data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import { APP_VERSION } from "@/lib/version";

interface SideNavProps {
  selectedDays: DayOfWeek[];
  onDaysChange: (days: DayOfWeek[]) => void;
}

const ALL_DAYS: DayOfWeek[] = [1, 2, 3, 4, 5, 6];

export const SideNav = ({ selectedDays, onDaysChange }: SideNavProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isImpressumOpen, setIsImpressumOpen] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      // Trap focus within dialog when open
      const dialog = document.querySelector('[role="dialog"]');
      if (dialog) {
        const focusableElements = dialog.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        const handleTabKey = (e: KeyboardEvent) => {
          if (e.key !== "Tab") return;

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement?.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement?.focus();
            }
          }
        };

        window.addEventListener("keydown", handleTabKey);
        firstElement?.focus();

        return () => {
          window.removeEventListener("keydown", handleTabKey);
        };
      }
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleDayToggle = useCallback(
    (day: DayOfWeek) => {
      if (selectedDays.includes(day)) {
        onDaysChange(selectedDays.filter((d) => d !== day));
      } else {
        onDaysChange([...selectedDays, day]);
      }
    },
    [selectedDays, onDaysChange]
  );

  const handleImpressumClick = useCallback(() => {
    setIsOpen(false);
    setIsImpressumOpen(true);
  }, []);

  const handleToggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* Toggle Button - Always visible in top right */}
      <div className="absolute right-4 top-4 z-30 flex items-center gap-2 sm:right-6 sm:top-6">
        <ThemeToggle />
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full"
          onClick={handleToggleOpen}
          aria-label={isOpen ? "Navigation schließen" : "Navigation öffnen"}
          aria-expanded={isOpen}
          aria-controls="side-nav-dialog"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/20"
              onClick={handleClose}
              aria-hidden="true"
            />
            {/* Modal Dialog */}
            <motion.div
              id="side-nav-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="side-nav-title"
              aria-describedby="side-nav-description"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed right-2 top-2 z-50 w-[calc(100%-1rem)] max-w-sm rounded-lg bg-card p-4 shadow-xl sm:right-4 sm:top-4 sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button - Positioned inside dialog at top right */}
              <button
                onClick={handleClose}
                className="absolute right-2 top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Schließen"
              >
                <X className="h-5 w-5" />
              </button>
              {/* Header */}
              <div className="relative mb-4 pr-10 sm:mb-6">
                <div className="mb-4 flex items-center gap-4">
                  <Drumstick className="h-6 w-6 text-[#f08b8b] sm:h-7 sm:w-7" />
                  <h2
                    id="side-nav-title"
                    className="font-righteous text-2xl font-bold text-card-foreground sm:text-3xl"
                  >
                    Halbe Henn
                  </h2>
                </div>
                <p
                  id="side-nav-description"
                  className="mt-2 text-sm leading-relaxed text-muted-foreground"
                >
                  Auf dieser Karte siehst du übersichtlich wann und wo die
                  berühmten Hännile Stände in Vorarlberg anzutreffen sind.
                </p>
              </div>

              {/* Warning Message */}
              <div className="mb-4 flex gap-2 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20 sm:mb-6">
                <AlertTriangle
                  className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-500"
                  aria-hidden="true"
                />
                <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-200">
                  Wir sind in keinerlei Kontakt mit den Betreibern, die
                  Korrektheit der Daten ist also nicht gewährleistet. Außerdem
                  können wir euch nicht helfen wenn ihr einen Stand für eure
                  Firmenevents mieten wollt 🙈
                </p>
              </div>

              {/* Day Filters */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-card-foreground">
                  Tage filtern
                </h3>
                <div
                  className="grid grid-cols-2 gap-2"
                  role="group"
                  aria-label="Tage auswählen"
                >
                  {ALL_DAYS.map((day) => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        onClick={() => handleDayToggle(day)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleDayToggle(day);
                          }
                        }}
                        role="checkbox"
                        aria-checked={isSelected}
                        aria-label={`${formatDayName(day)} ${isSelected ? "ausgewählt" : "nicht ausgewählt"}`}
                        className={`relative flex h-auto min-h-[3rem] items-center justify-center rounded-lg px-3 py-2 text-xs font-normal uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                          isSelected
                            ? "bg-[#FF8A80] text-white"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        <span>{formatDayName(day)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

                {/* Divider */}
                <div className="-mx-4 my-4 border-t border-border sm:-mx-6 sm:my-6" />

                {/* Impressum Link & Version */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                  <button
                    onClick={handleImpressumClick}
                    className="text-sm text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    Impressum
                  </button>
                  <span
                    className="text-xs uppercase tracking-wide text-muted-foreground"
                    aria-label={`Version ${APP_VERSION}`}
                  >
                    Version {APP_VERSION}
                  </span>
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Impressum Dialog */}
      <Dialog open={isImpressumOpen} onOpenChange={setIsImpressumOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Impressum</DialogTitle>
            <DialogDescription>Angaben gemäß § 5 TMG</DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-2 text-sm">
            <p>
              <strong>Halbe Henn</strong>
            </p>
            <p>Standorte in Vorarlberg</p>
            <p className="mt-4 text-xs text-gray-500">
              Weitere Informationen folgen in Kürze.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
