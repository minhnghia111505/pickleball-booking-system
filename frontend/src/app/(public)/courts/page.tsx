"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { courtService } from "@/services/court.service";
import { MainContainer } from "@/components/layout/main-container";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { clubService } from "@/services/club.service";
import { Star, MapPin, Coffee, Car, Heart, Navigation, Search, Building2, Wallet, ArrowDownAZ, SlidersHorizontal, X, Calendar, Clock, ArrowRight } from "lucide-react";
import { useFavoritesStore } from "@/stores/favorites.store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { ProvincePicker } from "@/components/ui/province-picker";

export default function CourtsPage() {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [clubId, setClubId] = useState<number | undefined>();
  const [priceRange, setPriceRange] = useState<string>("all");
  const [sort, setSort] = useState<string>("id,asc");
  const [page, setPage] = useState(0);

  // Advanced Filter states
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const [filterStartTime, setFilterStartTime] = useState("");
  const [filterEndTime, setFilterEndTime] = useState("");
  const [filterRadius, setFilterRadius] = useState<number>(0);
  const [userLat, setUserLat] = useState<number | undefined>();
  const [userLng, setUserLng] = useState<number | undefined>();
  const [isLocating, setIsLocating] = useState(false);
  const [locationMode, setLocationMode] = useState<"area" | "distance">("area");
  const [filterProvince, setFilterProvince] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");

  const handleGetLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLat(position.coords.latitude);
          setUserLng(position.coords.longitude);
          if (filterRadius === 0) setFilterRadius(5); // Default 5km
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Không thể lấy vị trí. Vui lòng kiểm tra quyền truy cập vị trí của trình duyệt.");
          setIsLocating(false);
        }
      );
    } else {
      alert("Trình duyệt của bạn không hỗ trợ lấy vị trí.");
      setIsLocating(false);
    }
  };

  const { data: clubs } = useQuery({
    queryKey: ["clubs"],
    queryFn: () => clubService.getClubs({ size: 100 }),
  });

  const getPriceParams = () => {
    switch (priceRange) {
      case "under_100": return { maxPrice: 100000 };
      case "100_200": return { minPrice: 100000, maxPrice: 200000 };
      case "over_200": return { minPrice: 200000 };
      default: return {};
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["courts", searchTerm, clubId, priceRange, sort, page, filterDate, filterStartTime, filterEndTime, filterRadius, userLat, userLng, filterProvince, filterDistrict],
    queryFn: () =>
      courtService.getCourts({
        search: searchTerm,
        clubId,
        ...getPriceParams(),
        sort,
        page,
        size: 9,
        date: filterDate || undefined,
        startTime: filterStartTime ? filterStartTime + ":00" : undefined,
        endTime: filterEndTime ? filterEndTime + ":00" : undefined,
        userLat,
        userLng,
        radiusInKm: filterRadius > 0 ? filterRadius : undefined,
        province: filterProvince || undefined,
        district: filterDistrict || undefined,
      }),
  });

  return (
    <MainContainer className="py-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Danh sách sân Pickleball</h1>
        <p className="text-muted-foreground">
          Khám phá và đặt ngay sân Pickleball phù hợp với bạn.
        </p>
      </div>

      {/* Modern Filter Section */}
      <div className="mb-8 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 z-0 pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Input with Filter Button */}
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Tìm kiếm sân..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(0);
                }}
                className="pl-9 h-11 bg-slate-50 border-slate-200 focus-visible:ring-primary/20 dark:bg-slate-950/50"
              />
            </div>
            <Button 
              variant="outline" 
              className={`h-11 px-3 border-slate-200 bg-slate-50 dark:bg-slate-950/50 ${showAdvancedFilter || filterDate || filterRadius > 0 ? 'bg-primary/10 border-primary/30 text-primary' : 'text-slate-500'}`}
              onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* Club Filter */}
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full flex items-center justify-between h-11 pl-9 pr-4 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-slate-950/50 dark:border-slate-800 transition-colors">
                <span className="truncate">
                  {clubId ? clubs?.content.find((c: any) => c.id === clubId)?.name || "Tất cả câu lạc bộ" : "Tất cả câu lạc bộ"}
                </span>
                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-[200px]">
                <DropdownMenuItem onClick={() => { setClubId(undefined); setPage(0); }}>
                  Tất cả câu lạc bộ
                </DropdownMenuItem>
                {clubs?.content.map((c: any) => (
                  <DropdownMenuItem key={c.id} onClick={() => { setClubId(c.id); setPage(0); }}>
                    {c.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Price Filter */}
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full flex items-center justify-between h-11 pl-9 pr-4 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-slate-950/50 dark:border-slate-800 transition-colors">
                <span className="truncate">
                  {priceRange === "under_100" ? "Dưới 100.000đ/h" :
                   priceRange === "100_200" ? "100.000đ - 200.000đ/h" :
                   priceRange === "over_200" ? "Trên 200.000đ/h" : "Mọi mức giá"}
                </span>
                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-[200px]">
                <DropdownMenuItem onClick={() => { setPriceRange("all"); setPage(0); }}>Mọi mức giá</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setPriceRange("under_100"); setPage(0); }}>Dưới 100.000đ/h</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setPriceRange("100_200"); setPage(0); }}>100.000đ - 200.000đ/h</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setPriceRange("over_200"); setPage(0); }}>Trên 200.000đ/h</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Sort Filter */}
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full flex items-center justify-between h-11 pl-9 pr-4 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-slate-950/50 dark:border-slate-800 transition-colors">
                <span className="truncate">
                  {sort === "pricePerHour,asc" ? "Giá: Thấp đến Cao" :
                   sort === "pricePerHour,desc" ? "Giá: Cao đến Thấp" : "Sắp xếp mặc định"}
                </span>
                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-[200px]">
                <DropdownMenuItem onClick={() => { setSort("id,asc"); setPage(0); }}>Sắp xếp mặc định</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSort("pricePerHour,asc"); setPage(0); }}>Giá: Thấp đến Cao</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSort("pricePerHour,desc"); setPage(0); }}>Giá: Cao đến Thấp</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ArrowDownAZ className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Advanced Filter Panel */}
        {showAdvancedFilter && (
          <div className="relative z-10 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                Bộ lọc chi tiết
              </h3>
              <Button variant="ghost" size="sm" className="h-8 text-slate-500" onClick={() => {
                setFilterDate("");
                setFilterStartTime("");
                setFilterEndTime("");
                setFilterRadius(0);
                setUserLat(undefined);
                setUserLng(undefined);
                setFilterProvince("");
                setFilterDistrict("");
                setPage(0);
              }}>
                <X className="h-3.5 w-3.5 mr-1" />
                Xóa bộ lọc
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50/50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              {/* Date & Time */}
              <div className="space-y-3 flex flex-col h-full">
                <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5 h-[26px]">
                  <Calendar className="h-3.5 w-3.5"/> Ngày chơi & Khung giờ
                </label>
                
                <div className="flex-1 flex flex-col justify-center bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Ngày mong muốn</label>
                    <div className="relative">
                      <DatePicker 
                        date={filterDate ? new Date(filterDate) : undefined}
                        setDate={(d) => {
                          if (d) {
                            const yyyy = d.getFullYear();
                            const mm = String(d.getMonth() + 1).padStart(2, '0');
                            const dd = String(d.getDate()).padStart(2, '0');
                            setFilterDate(`${yyyy}-${mm}-${dd}`);
                          } else {
                            setFilterDate("");
                          }
                          setPage(0);
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Khung giờ (Từ - Đến)</label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <TimePicker 
                          time={filterStartTime}
                          setTime={(time) => { setFilterStartTime(time); setPage(0); }}
                          placeholder="Từ (vd: 07:00)"
                          className="w-full"
                        />
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-300" />
                      <div className="relative flex-1">
                        <TimePicker 
                          time={filterEndTime}
                          setTime={(time) => { setFilterEndTime(time); setPage(0); }}
                          placeholder="Đến (vd: 09:00)"
                          minTime={filterStartTime}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-1.5 mt-1 bg-amber-50 dark:bg-amber-500/10 p-2.5 rounded-lg border border-amber-100 dark:border-amber-500/20">
                    <Star className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5 fill-amber-500/20" />
                    <p className="text-[10px] text-amber-700 dark:text-amber-400 leading-relaxed font-medium">Hệ thống sẽ chỉ hiển thị những sân ĐANG TRỐNG trong đúng khung giờ này.</p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-3 md:col-span-2 flex flex-col h-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5"/> Khu vực & Khoảng cách
                  </label>
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 w-full sm:w-fit shadow-inner">
                    <button 
                      type="button"
                      onClick={() => { setLocationMode("area"); setUserLat(undefined); setUserLng(undefined); setFilterRadius(0); setPage(0); }} 
                      className={`flex-1 sm:flex-none flex items-center justify-center text-[11px] px-3 py-1.5 rounded-md transition-all duration-200 ${locationMode === 'area' ? 'bg-white dark:bg-slate-950 shadow text-primary font-semibold' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                      <Building2 className="h-3 w-3 mr-1.5" />
                      Khu Vực
                    </button>
                    <button 
                      type="button"
                      onClick={() => { setLocationMode("distance"); setFilterProvince(""); setFilterDistrict(""); setPage(0); }}
                      className={`flex-1 sm:flex-none flex items-center justify-center text-[11px] px-3 py-1.5 rounded-md transition-all duration-200 ${locationMode === 'distance' ? 'bg-white dark:bg-slate-950 shadow text-primary font-semibold' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                      <Navigation className="h-3 w-3 mr-1.5" />
                      Khoảng Cách
                    </button>
                  </div>
                </div>
                
                {locationMode === 'area' ? (
                  <div className="flex flex-col sm:flex-row gap-4 flex-1 items-center bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="w-full sm:flex-1 space-y-1.5">
                      <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Tỉnh/Thành phố</label>
                      <ProvincePicker 
                        province={filterProvince}
                        setProvince={(p) => { setFilterProvince(p); setPage(0); }}
                      />
                    </div>
                    <div className="w-full sm:flex-1 space-y-1.5">
                      <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Quận/Huyện/Xã</label>
                      <Input 
                        placeholder="VD: Cầu Giấy" 
                        value={filterDistrict}
                        onChange={(e) => { setFilterDistrict(e.target.value); setPage(0); }}
                        className="h-10 text-sm bg-slate-50 dark:bg-slate-900 border-transparent focus-visible:bg-white dark:focus-visible:bg-slate-950 focus-visible:ring-primary/30 transition-all"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col justify-center">
                    {!userLat ? (
                      <div className="flex flex-col items-center justify-center h-full min-h-[104px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                        <p className="text-xs text-slate-500 mb-3">Cho phép truy cập vị trí để tìm sân gần bạn</p>
                        <Button size="sm" onClick={handleGetLocation} disabled={isLocating} className="h-8 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary">
                          <Navigation className={`h-3.5 w-3.5 mr-1.5 ${isLocating ? 'animate-spin' : ''}`} />
                          {isLocating ? 'Đang định vị...' : 'Bật vị trí GPS'}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4 bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 h-full min-h-[104px] flex flex-col justify-center shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Đã xác định vị trí
                          </div>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10" onClick={() => {
                            setUserLat(undefined); setUserLng(undefined); setFilterRadius(0); setPage(0);
                          }}>Hủy định vị</Button>
                        </div>
                        
                        <div className="space-y-3 mt-1">
                          <div className="flex justify-between text-xs items-center">
                            <span className="text-slate-500 dark:text-slate-400">Bán kính tìm kiếm:</span>
                            <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded text-sm">{filterRadius} km</span>
                          </div>
                          <div className="relative flex items-center pt-1">
                            <input 
                              type="range" 
                              min="1" 
                              max="50" 
                              value={filterRadius}
                              onChange={(e) => { setFilterRadius(Number(e.target.value)); setPage(0); }}
                              className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all"
                            />
                          </div>
                          <div className="flex justify-between text-[10px] font-medium text-slate-400">
                            <span>1 km</span>
                            <span>50 km</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      {data && !isLoading && (
        <p className="text-sm text-slate-500 mb-5">
          Tìm thấy <span className="font-semibold text-slate-900 dark:text-white">{data.totalElements}</span> sân phù hợp
        </p>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted" />
              <CardContent className="p-4 space-y-2">
                <div className="h-4 w-2/3 bg-muted rounded" />
                <div className="h-4 w-1/2 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">
          Có lỗi xảy ra khi tải danh sách sân.
        </div>
      ) : data?.content.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          Không tìm thấy sân nào phù hợp với bộ lọc.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data?.content.map((court) => (
              <Card key={court.id} className="overflow-hidden flex flex-col transition-all hover:border-primary/50 hover:shadow-md">
                <div className="aspect-video w-full overflow-hidden bg-muted relative group">
                  <Link href={`${ROUTES.COURTS}/${court.id}`} className="block h-full w-full">
                    {court.imageUrl ? (
                      <img
                        src={court.imageUrl}
                        alt={court.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-secondary text-secondary-foreground">
                        Không có ảnh
                      </div>
                    )}
                  </Link>
                  <div className="absolute top-2 right-2 flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(court);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm transition-transform hover:scale-110"
                      title={isFavorite(court.id) ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
                    >
                      <Heart
                        className={`h-4 w-4 transition-colors ${
                          isFavorite(court.id)
                            ? "fill-red-500 text-red-500"
                            : "text-slate-500"
                        }`}
                      />
                    </button>
                    <div className="rounded-full bg-background/90 px-2 py-1 text-xs font-semibold backdrop-blur-sm">
                      {court.status === "ACTIVE" ? (
                        <span className="text-green-600">Đang hoạt động</span>
                      ) : (
                        <span className="text-orange-600">Bảo trì</span>
                      )}
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {court.rating ? `${court.rating} (${court.reviewsCount || 0})` : "Chưa đánh giá"}
                  </div>
                </div>

                <CardContent className="flex-1 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Link href={`${ROUTES.COURTS}/${court.id}`} className="hover:underline flex-1">
                      <h3 className="text-lg font-semibold line-clamp-1 text-slate-900 dark:text-white">{court.name}</h3>
                    </Link>
                  </div>

                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3 line-clamp-1">
                    <MapPin className="h-3 w-3" /> {court.address}
                  </p>

                  <div className="flex items-center gap-3 text-muted-foreground mb-4">
                    {court.googleMapUrl && (
                      <a href={court.googleMapUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-semibold text-primary bg-primary/5 hover:bg-primary/10 px-2 py-1 rounded-full transition-colors" onClick={(e) => e.stopPropagation()}>
                        <Navigation className="h-3 w-3" />
                        Xem bản đồ
                      </a>
                    )}
                    <div className="flex items-center gap-1 text-xs" title="Bãi đỗ xe">
                      <Car className="h-4 w-4" />
                    </div>
                    <div className="flex items-center gap-1 text-xs" title="Canteen">
                      <Coffee className="h-4 w-4" />
                    </div>
                    <div className="flex items-center gap-1 text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                      Sân trong nhà
                    </div>
                  </div>

                  <div className="mt-auto flex items-baseline gap-1 border-t pt-4">
                    <span className="text-xl font-bold text-primary">
                      {court.pricePerHour.toLocaleString("vi-VN")}đ
                    </span>
                    <span className="text-sm text-muted-foreground">/ giờ</span>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <Button asChild className="w-full">
                    <Link href={`${ROUTES.COURTS}/${court.id}`}>Xem chi tiết & Đặt sân</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                Trước
              </Button>
              <div className="flex items-center px-4 font-medium">
                Trang {page + 1} / {data.totalPages}
              </div>
              <Button
                variant="outline"
                disabled={data.last}
                onClick={() => setPage((p) => p + 1)}
              >
                Sau
              </Button>
            </div>
          )}
        </>
      )}
    </MainContainer>
  );
}
