"use client";

import { useState, useEffect } from "react";
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

  const handleDayToggle = (day: DayOfWeek) => {
    if (selectedDays.includes(day)) {
      onDaysChange(selectedDays.filter((d) => d !== day));
    } else {
      onDaysChange([...selectedDays, day]);
    }
  };

  const handleImpressumClick = () => {
    setIsOpen(false);
    setIsImpressumOpen(true);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* Toggle Button - Always visible in top right */}
      <div className="absolute right-6 top-6 z-30 flex gap-2">
        <ThemeToggle />
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Navigation öffnen"
        >
          <Menu className="h-5 w-5" />
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
              onClick={() => setIsOpen(false)}
            />
            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed right-4 top-4 z-50 w-full max-w-sm rounded-lg bg-card p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button - Positioned inside dialog at top right */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-2 top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                aria-label="Schließen"
              >
                <X className="h-5 w-5" />
              </button>
              {/* Header */}
              <div className="relative mb-6 pr-10">
                <div className="mb-4 flex items-center gap-2">
                  <Drumstick className="h-7 w-7 text-[#f08b8b]" />
                  <h2 className="text-3xl font-bold tracking-tighter text-card-foreground">
                    Halbe Henn
                  </h2>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Auf dieser Karte siehst du übersichtlich wann und wo die
                  berühmten Hännile Stände in Vorarlberg anzutreffen sind.
                </p>
              </div>

              {/* Warning Message */}
              <div className="mb-6 flex gap-2 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
                <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-500" />
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
                <div className="grid grid-cols-2 gap-2">
                  {ALL_DAYS.map((day) => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        onClick={() => handleDayToggle(day)}
                        className={`relative flex h-auto min-h-[3rem] items-center justify-center rounded-lg px-3 py-2 text-xs font-normal uppercase transition-colors ${
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
              <div className="-mx-6 my-6 border-t border-border" />

              {/* Impressum Link */}
              <div className="flex items-center">
                <button
                  onClick={handleImpressumClick}
                  className="text-sm text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
                >
                  Impressum
                </button>
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
