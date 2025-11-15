"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Stand, DayOfWeek } from "@/types/stand";
import { formatDayName } from "@/lib/data";
import { Check, X } from "lucide-react";

interface StandPopoverProps {
  stand: Stand;
  children: React.ReactNode;
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
      <PopoverContent className="w-80" side="top" align="center" sideOffset={8}>
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold leading-none">{stand.name}</h3>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{stand.address}</p>
          </div>
          <div className="space-y-1">
            <div className="space-y-0.5">
              {ALL_DAYS.map((day) => {
                const available = isDayAvailable(day);
                return (
                  <div key={day} className="flex items-center gap-2 text-sm">
                    {available ? (
                      <Check className="h-4 w-4 text-red-500" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground/50" />
                    )}
                    <span
                      className={
                        available
                          ? "text-foreground/80"
                          : "text-muted-foreground/60"
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
