import React, { useState, useMemo } from 'react';
import { Clock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface TimePickerProps {
  time: string;
  setTime: (time: string) => void;
  placeholder?: string;
  className?: string;
  minTime?: string;
}

// Generate time slots every 30 minutes from 05:00 to 23:00
const TIME_SLOTS = Array.from({ length: 37 }).map((_, i) => {
  const hours = Math.floor(i / 2) + 5;
  const minutes = i % 2 === 0 ? "00" : "30";
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
});

export function TimePicker({ time, setTime, placeholder = "Chọn giờ", className, minTime }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const availableSlots = useMemo(() => {
    if (!minTime) return TIME_SLOTS;
    return TIME_SLOTS.filter(slot => slot > minTime);
  }, [minTime]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger 
        className={`flex items-center h-10 w-full rounded-md border border-transparent bg-slate-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-900 transition-all cursor-pointer ${className}`}
      >
        <Clock className="mr-2 h-4 w-4 text-slate-400" />
        <span className={time ? "text-slate-900 dark:text-slate-100" : "text-slate-500"}>
          {time || placeholder}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="w-[180px] p-2 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xl z-50 max-h-[300px] overflow-y-auto custom-scrollbar"
      >
        <div className="grid grid-cols-2 gap-1">
          {availableSlots.map((slot) => (
            <button
              key={slot}
              onClick={() => {
                setTime(slot);
                setIsOpen(false);
              }}
              className={`px-2 py-1.5 text-xs rounded-md transition-colors ${
                time === slot 
                  ? "bg-primary text-primary-foreground font-medium shadow-sm" 
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
        
        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-full text-[11px] text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={() => {
              setTime("");
              setIsOpen(false);
            }}
          >
            Xóa lựa chọn
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
