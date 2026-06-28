"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MainContainer } from "@/components/layout/main-container";
import { courtService } from "@/services/court.service";
import { bookingService } from "@/services/booking.service";
import { Court } from "@/types/court.type";
import { CourtScheduleSlot } from "@/types/booking.type";
import { useQuery } from "@tanstack/react-query";
import { format, addDays } from "date-fns";
import { clubService } from "@/services/club.service";
import { Calendar as CalendarIcon, Clock, ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils/cn";

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

  const [court, setCourt] = useState<Court | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookedSlots, setBookedSlots] = useState<CourtScheduleSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{ start: string; end: string } | null>(null);
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
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        const schedule = await bookingService.getCourtSchedule(courtId, dateStr);
        setBookedSlots(schedule.slots || []);
        setSelectedSlot(null); // reset slot on date change
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

  const totalAmount = (selectedSlot ? (court?.pricePerHour || 0) : 0) + calculateServicesTotal();

  const handleBook = async () => {
    if (!selectedSlot) return;
    try {
      setIsSubmitting(true);
      const servicesPayload = Object.entries(selectedServices).map(([serviceId, quantity]) => ({
        serviceId: Number(serviceId),
        quantity,
      }));

      await bookingService.createBooking({
        courtId,
        bookingDate: format(selectedDate, "yyyy-MM-dd"),
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
        services: servicesPayload,
      });
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
          {/* Date Selection */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 dark:text-white">
              <CalendarIcon className="h-5 w-5 text-primary" /> Chọn ngày
            </h2>
            <div className="flex flex-wrap gap-3">
              {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
                const date = addDays(new Date(), offset);
                const isSelected = format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
                return (
                  <button
                    key={offset}
                    onClick={() => setSelectedDate(date)}
                    className={cn(
                      "flex flex-col items-center justify-center rounded-xl border p-3 transition-all",
                      isSelected 
                        ? "border-primary bg-primary text-primary-foreground shadow-md" 
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-primary/50 hover:bg-primary/5 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                    )}
                  >
                    <span className="text-xs uppercase">{format(date, "EEE")}</span>
                    <span className="text-xl font-bold mt-1">{format(date, "dd")}</span>
                    <span className="text-xs">{format(date, "MM/yyyy")}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Selection */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 dark:text-white">
              <Clock className="h-5 w-5 text-primary" /> Chọn khung giờ
            </h2>
            {isLoading ? (
              <div className="flex h-32 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {timeSlots.map((slot) => {
                  const booked = isSlotBooked(slot.start);
                  const selected = selectedSlot?.start === slot.start;
                  return (
                    <button
                      key={slot.start}
                      disabled={booked}
                      onClick={() => setSelectedSlot(slot)}
                      className={cn(
                        "rounded-lg border p-3 text-center transition-all",
                        booked
                          ? "cursor-not-allowed border-slate-100 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-600"
                          : selected
                            ? "border-primary bg-primary/10 text-primary font-bold ring-1 ring-primary"
                            : "border-slate-200 hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-300 dark:hover:border-primary"
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
                <p className="text-sm text-slate-500">Tiền sân ({selectedSlot ? "1 giờ" : "0 giờ"})</p>
                <p className="font-semibold dark:text-white">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedSlot ? court.pricePerHour : 0)}
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
              disabled={!selectedSlot || isSubmitting}
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
