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
      <PopoverContent
        className="w-80 p-5"
        side="top"
        align="center"
        sideOffset={8}
      >
        <div>
          <h3 className="mb-2 text-lg font-bold leading-none tracking-tight">
            {stand.name}
          </h3>
          <p className="mb-4 text-sm text-gray-500">{stand.address}</p>
          <div className="-mx-6 my-4 border-t border-gray-100" />

          <div className="space-y-1">
            <div className="space-y-1.5">
              {ALL_DAYS.map((day) => {
                const available = isDayAvailable(day);
                return (
                  <div key={day} className="flex items-center gap-2 text-sm">
                    {available ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground/40" />
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
