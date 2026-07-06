import React, { useState, useMemo } from 'react';
import { MapPin, Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProvincePickerProps {
  province: string;
  setProvince: (province: string) => void;
  placeholder?: string;
  className?: string;
}

const PROVINCES = [
  "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Cần Thơ", "Hải Phòng",
  "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước", "Bình Thuận", "Cà Mau", "Cao Bằng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Tĩnh", "Hải Dương", "Hậu Giang", "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
];

export function ProvincePicker({ province, setProvince, placeholder = "Tất cả khu vực", className }: ProvincePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredProvinces = useMemo(() => {
    if (!search) return PROVINCES;
    const lowerSearch = search.toLowerCase();
    return PROVINCES.filter(p => p.toLowerCase().includes(lowerSearch));
  }, [search]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger 
        className={`flex items-center h-10 w-full rounded-md border border-transparent bg-slate-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-900 transition-all cursor-pointer justify-between ${className}`}
      >
        <div className="flex items-center truncate">
          <MapPin className="mr-2 h-4 w-4 text-slate-400 shrink-0" />
          <span className={`truncate ${province ? "text-slate-900 dark:text-slate-100" : "text-slate-500"}`}>
            {province || placeholder}
          </span>
        </div>
        <svg className="w-4 h-4 text-slate-400 shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="start" 
        className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[220px] p-2 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xl z-50 flex flex-col"
      >
        <div className="px-2 pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-950 z-10">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Tìm tên tỉnh..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-xs bg-slate-50 dark:bg-slate-900 border-transparent focus-visible:ring-1"
              onKeyDown={(e) => { e.stopPropagation() }}
            />
          </div>
        </div>
        
        <div className="max-h-[240px] overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-0.5">
          <button
            onClick={() => {
              setProvince("");
              setIsOpen(false);
            }}
            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
              !province 
                ? "bg-primary/10 text-primary font-medium" 
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Tất cả khu vực
          </button>
          
          {filteredProvinces.length === 0 ? (
            <div className="px-3 py-4 text-center text-xs text-slate-500">
              Không tìm thấy tỉnh nào.
            </div>
          ) : (
            filteredProvinces.map((p) => (
              <button
                key={p}
                onClick={() => {
                  setProvince(p);
                  setIsOpen(false);
                  setSearch("");
                }}
                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                  province === p 
                    ? "bg-primary text-primary-foreground font-medium shadow-sm" 
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {p}
              </button>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
