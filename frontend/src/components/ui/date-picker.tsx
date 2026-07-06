import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

const MONTHS = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
];

const DAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export function DatePicker({ date, setDate, placeholder = "Chọn ngày", className }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Current view state
  const [viewDate, setViewDate] = useState(date || new Date());
  
  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleSelectDate = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    // adjust local timezone offset so standard formatting YYYY-MM-DD works if needed
    setDate(newDate);
    setIsOpen(false);
  };

  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    
    const days = [];
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    // Actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  }, [currentYear, currentMonth]);

  const isSelected = (day: number) => {
    if (!date) return false;
    return date.getDate() === day && 
           date.getMonth() === currentMonth && 
           date.getFullYear() === currentYear;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && 
           today.getMonth() === currentMonth && 
           today.getFullYear() === currentYear;
  };

  const formatDate = (d: Date) => {
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger 
        className={`flex items-center h-10 w-full rounded-md border border-transparent bg-slate-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-900 transition-all cursor-pointer ${className}`}
      >
        <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
        <span className={date ? "text-slate-900 dark:text-slate-100" : "text-slate-500"}>
          {date ? formatDate(date) : placeholder}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[280px] p-3 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xl z-50">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {MONTHS[currentMonth]} {currentYear}
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {DAYS.map(day => (
            <div key={day} className="text-[10px] font-medium text-slate-400 uppercase">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div key={index} className="h-8 w-8 flex items-center justify-center">
              {day ? (
                <button
                  onClick={() => handleSelectDate(day)}
                  className={`h-8 w-8 rounded-full text-xs transition-colors flex items-center justify-center
                    ${isSelected(day) 
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm" 
                      : isToday(day)
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }
                  `}
                >
                  {day}
                </button>
              ) : null}
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-[11px] text-slate-500"
            onClick={() => {
              setDate(undefined);
              setIsOpen(false);
            }}
          >
            Xóa
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-[11px] text-primary bg-primary/5 hover:bg-primary/10"
            onClick={() => {
              setDate(new Date());
              setIsOpen(false);
            }}
          >
            Hôm nay
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
