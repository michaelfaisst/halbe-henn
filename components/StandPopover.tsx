"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Stand, DayOfWeek } from "@/types/stand";
import { formatDayName } from "@/lib/data";
import { Check, X } from "lucide-react";
import type { ReactNode } from "react";

interface StandPopoverProps {
  stand: Stand;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ALL_DAYS: DayOfWeek[] = [1, 2, 3, 4, 5, 6];

export const StandPopover = ({
  stand,
  children,
  open,
  onOpenChange,
}: StandPopoverProps) => {
  const isDayAvailable = (day: DayOfWeek) => stand.daysOfWeek.includes(day);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-80 p-5"
        side="top"
        align="center"
        sideOffset={8}
        role="dialog"
        aria-labelledby={`stand-${stand.name}-title`}
        aria-describedby={`stand-${stand.name}-description`}
      >
        <div>
          <h3
            id={`stand-${stand.name}-title`}
            className="mb-2 text-lg font-bold leading-none tracking-tight"
          >
            {stand.name}
          </h3>
          <p
            id={`stand-${stand.name}-description`}
            className="mb-4 text-sm text-muted-foreground"
          >
            {stand.address}
          </p>
          <div
            className="-mx-6 my-4 border-t border-border"
            aria-hidden="true"
          />

          <div className="space-y-1">
            <h4 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
              Verfügbare Tage
            </h4>
            <div className="space-y-1.5" role="list">
              {ALL_DAYS.map((day) => {
                const available = isDayAvailable(day);
                return (
                  <div
                    key={day}
                    className="flex items-center gap-2 text-sm"
                    role="listitem"
                  >
                    {available ? (
                      <Check
                        className="h-4 w-4 text-green-600"
                        aria-label="Verfügbar"
                      />
                    ) : (
                      <X
                        className="h-4 w-4 text-muted-foreground/40"
                        aria-label="Nicht verfügbar"
                      />
                    )}
                    <span
                      className={
                        available
                          ? "text-foreground/80"
                          : "text-muted-foreground/40"
                      }
                    >
                      {formatDayName(day)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
