"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MainContainer } from "@/components/layout/main-container";
import { courtService } from "@/services/court.service";
import { bookingService } from "@/services/booking.service";
import { Court } from "@/types/court.type";
import { CourtScheduleSlot } from "@/types/booking.type";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { clubService } from "@/services/club.service";
import { Calendar as CalendarIcon, Clock, ArrowRight, MapPin, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/stores/auth.store";

const GENERATE_SLOTS = () => {
  const slots = [];
  for (let i = 6; i <= 21; i++) {
    const start = `${i.toString().padStart(2, "0")}:00:00`;
    const end = `${(i + 1).toString().padStart(2, "0")}:00:00`;
    slots.push({ start, end, label: `${i}:00 - ${i + 1}:00` });
  }
  return slots;
};

export default function BookCourtPage() {
  const params = useParams();
  const router = useRouter();
  const courtId = Number(params?.id);
  const { user } = useAuthStore();

  const [court, setCourt] = useState<Court | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [bookedSlots, setBookedSlots] = useState<CourtScheduleSlot[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<{ start: string; end: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = GENERATE_SLOTS();

  useEffect(() => {
    if (!courtId) return;
    const fetchCourt = async () => {
      try {
        const data = await courtService.getCourtById(courtId);
        setCourt(data);
      } catch (error) {
        toast.error("Không tìm thấy thông tin sân");
        router.push(ROUTES.COURTS);
      }
    };
    fetchCourt();
  }, [courtId, router]);

  useEffect(() => {
    if (!courtId) return;
    const fetchSchedule = async () => {
      try {
        setIsLoading(true);
        const schedule = await bookingService.getCourtSchedule(courtId, selectedDate);
        setBookedSlots(schedule.slots || []);
        setSelectedSlots([]); // reset slots on date change
      } catch (error) {
        toast.error("Lỗi khi tải lịch sân");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchedule();
  }, [courtId, selectedDate]);

  const isSlotBooked = (startTime: string) => {
    return bookedSlots.some(
      (slot) => 
        slot.bookingStatus !== "CANCELLED" && 
        slot.startTime.startsWith(startTime.slice(0, 5))
    );
  };

  const isSlotSelected = (startTime: string) => {
    return selectedSlots.some((slot) => slot.start === startTime);
  };

  const isSlotPassed = (startTime: string) => {
    const now = new Date();
    const today = format(now, "yyyy-MM-dd");
    if (selectedDate < today) return true;
    if (selectedDate === today) {
      const currentHour = now.getHours();
      const slotHour = parseInt(startTime.split(":")[0], 10);
      // Disable if the slot's starting hour has already passed or is the current hour
      return slotHour <= currentHour;
    }
    return false;
  };

  const toggleSlotSelection = (slot: { start: string; end: string }) => {
    setSelectedSlots((prev) => {
      const exists = prev.some((s) => s.start === slot.start);
      if (exists) {
        return prev.filter((s) => s.start !== slot.start);
      } else {
        return [...prev, slot];
      }
    });
  };

  const [selectedServices, setSelectedServices] = useState<{ [key: number]: number }>({});

  const { data: services } = useQuery({
    queryKey: ["club-services", court?.clubId],
    queryFn: () => clubService.getClubServices(court!.clubId!),
    enabled: !!court?.clubId,
  });

  const handleServiceChange = (serviceId: number, delta: number) => {
    setSelectedServices(prev => {
      const current = prev[serviceId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [serviceId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [serviceId]: next };
    });
  };

  const calculateServicesTotal = () => {
    if (!services) return 0;
    return Object.entries(selectedServices).reduce((total, [id, qty]) => {
      const service = services.find(s => s.id === Number(id));
      return total + (service ? service.price * qty : 0);
    }, 0);
  };

  const totalAmount = (selectedSlots.length * (court?.pricePerHour || 0)) + calculateServicesTotal();

  const handleBook = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để đặt sân");
      router.push("/login");
      return;
    }
    
    if (selectedSlots.length === 0) return;
    try {
      setIsSubmitting(true);
      const servicesPayload = Object.entries(selectedServices).map(([serviceId, quantity]) => ({
        serviceId: Number(serviceId),
        quantity,
      }));

      const bookingRequests = selectedSlots.map((slot) => ({
        courtId,
        bookingDate: selectedDate,
        startTime: slot.start,
        endTime: slot.end,
        services: servicesPayload,
      }));

      await bookingService.createBulkBookings({ bookings: bookingRequests });
      toast.success("Đặt sân thành công!");
      router.push(ROUTES.BOOKINGS);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Đặt sân thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!court) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
      </div>
    );
  }

  return (
    <MainContainer className="py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Đặt sân</h1>
        <p className="text-slate-500 mt-2">Chọn thời gian và dịch vụ để đặt sân {court.name}</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Selection */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Sơ đồ sân & Bảng giá (Court Layout & Pricing) */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 dark:text-white">
              <MapPin className="h-5 w-5 text-primary" /> Thông tin sân
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">Sơ đồ mặt bằng</h3>
                <div className="aspect-video bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center dark:bg-slate-900 dark:border-slate-800">
                  {/* Placeholder for actual image */}
                  <div className="text-center text-slate-400 p-4">
                    <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Hình ảnh sơ đồ sân</p>
                    <p className="text-xs mt-1">(Sẽ cập nhật sau)</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">Bảng giá</h3>
                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 h-full dark:bg-slate-900 dark:border-slate-800">
                  <div className="flex justify-between border-b border-slate-200 pb-2 mb-2 dark:border-slate-700">
                    <span className="text-sm font-medium dark:text-slate-300">Giá mặc định:</span>
                    <span className="text-sm font-bold text-primary">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(court.pricePerHour)} / Giờ
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-start gap-1 mt-3">
                    <Info className="h-3 w-3 mt-0.5 shrink-0" />
                    <p>Bảng giá có thể thay đổi tùy thuộc vào khung giờ và ngày lễ tết theo quy định của Câu lạc bộ.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Date Selection */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 dark:text-white">
              <CalendarIcon className="h-5 w-5 text-primary" /> Chọn ngày
            </h2>
            <div className="flex items-center gap-4">
              <input 
                type="date" 
                value={selectedDate}
                min={format(new Date(), "yyyy-MM-dd")}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
              />
            </div>
          </div>

          {/* Time Selection */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 dark:text-white">
                <Clock className="h-5 w-5 text-primary" /> Chọn khung giờ
              </h2>
              {/* Legends */}
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded border border-slate-200 bg-white dark:bg-slate-800"></div>Trống</div>
                <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded border border-primary bg-primary/10"></div>Đang chọn</div>
                <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-900"></div>Đã đặt</div>
                <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded border border-slate-200 bg-slate-200 opacity-50 dark:bg-slate-700"></div>Đã qua</div>
              </div>
            </div>
            {isLoading ? (
              <div className="flex h-32 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {timeSlots.map((slot) => {
                  const booked = isSlotBooked(slot.start);
                  const passed = isSlotPassed(slot.start);
                  const selected = isSlotSelected(slot.start);
                  const disabled = booked || passed;
                  return (
                    <button
                      key={slot.start}
                      disabled={disabled}
                      onClick={() => toggleSlotSelection(slot)}
                      className={cn(
                        "rounded-lg border p-3 text-center transition-all",
                        passed
                          ? "cursor-not-allowed border-slate-200 bg-slate-200/50 text-slate-400 opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-600"
                          : booked
                            ? "cursor-not-allowed border-red-200 bg-red-50 text-red-400 line-through dark:border-red-900/50 dark:bg-red-950 dark:text-red-500"
                            : selected
                              ? "border-primary bg-primary/10 text-primary font-bold ring-1 ring-primary shadow-sm"
                              : "border-slate-200 hover:border-primary hover:bg-primary/5 hover:text-primary bg-white dark:bg-slate-950 dark:border-slate-700 dark:text-slate-300 dark:hover:border-primary"
                      )}
                    >
                      {slot.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          {/* Services Selection */}
          {services && services.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 dark:text-white">
                <span className="text-xl">🥤</span> Chọn Dịch vụ đi kèm
              </h2>
              <div className="space-y-4">
                {services.map(service => (
                  <div key={service.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">{service.name}</h3>
                      <p className="text-sm text-slate-500">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() => handleServiceChange(service.id, -1)}
                        disabled={!selectedServices[service.id]}
                      >
                        -
                      </Button>
                      <span className="w-4 text-center font-medium">
                        {selectedServices[service.id] || 0}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() => handleServiceChange(service.id, 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h2 className="text-xl font-bold mb-6 pb-4 border-b border-slate-100 dark:border-slate-800 dark:text-white">
              Thông tin thanh toán
            </h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <p className="text-sm text-slate-500">Tiền sân ({selectedSlots.length} giờ)</p>
                <p className="font-semibold dark:text-white">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedSlots.length * court.pricePerHour)}
                </p>
              </div>
              
              {calculateServicesTotal() > 0 && (
                <div className="flex justify-between">
                  <p className="text-sm text-slate-500">Dịch vụ đi kèm</p>
                  <p className="font-semibold dark:text-white">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateServicesTotal())}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <p className="text-sm text-slate-500">Tổng cộng</p>
                <p className="text-2xl font-bold text-primary">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
                </p>
              </div>
            </div>

            <Button 
              className="w-full font-semibold text-primary-foreground h-12"
              disabled={selectedSlots.length === 0 || isSubmitting}
              onClick={handleBook}
            >
              {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt sân"} 
              {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </MainContainer>
  );
}

