"use client";

import { useEffect, useState } from "react";
import { bookingService } from "@/services/booking.service";
import { Booking } from "@/types/booking.type";
import { toast } from "sonner";
import { CalendarDays, CheckCircle, XCircle, Clock, TrendingUp } from "lucide-react";
import { format } from "date-fns";

export default function StaffDashboardPage() {
  const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const today = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await bookingService.getClubBookings({ page: 0, size: 100 });
        const filtered = data.content.filter((b) => b.bookingDate === today);
        setTodayBookings(filtered);
      } catch {
        toast.error("Không thể tải dữ liệu");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [today]);

  const confirmed = todayBookings.filter((b) => b.bookingStatus === "CONFIRMED").length;
  const pending = todayBookings.filter((b) => b.bookingStatus === "PENDING").length;
  const cancelled = todayBookings.filter((b) => b.bookingStatus === "CANCELLED").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Tổng quan hôm nay</h1>
        <p className="text-sm text-slate-500 mt-1">{format(new Date(), "EEEE, dd/MM/yyyy")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Đã xác nhận", value: confirmed, icon: CheckCircle, color: "text-emerald-600 bg-emerald-50" },
          { label: "Chờ xử lý", value: pending, icon: Clock, color: "text-amber-600 bg-amber-50" },
          { label: "Đã hủy", value: cancelled, icon: XCircle, color: "text-red-600 bg-red-50" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <div className={`p-3 rounded-xl ${s.color}`}>
              <s.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">{s.label}</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-center gap-2 p-5 border-b border-slate-100 dark:border-slate-800">
          <CalendarDays className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-slate-800 dark:text-white">Đơn đặt hôm nay ({todayBookings.length})</h2>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-7 w-7 border-4 border-primary border-r-transparent rounded-full animate-spin" />
          </div>
        ) : todayBookings.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <TrendingUp className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p>Chưa có đơn nào hôm nay</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {todayBookings.slice(0, 10).map((b) => (
              <div key={b.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="font-medium text-slate-800 dark:text-white">{b.court.name}</p>
                  <p className="text-sm text-slate-500">{b.user.fullName} • {b.startTime.slice(0,5)} – {b.endTime.slice(0,5)}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  b.bookingStatus === "CONFIRMED" ? "bg-emerald-100 text-emerald-700" :
                  b.bookingStatus === "PENDING" ? "bg-amber-100 text-amber-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {b.bookingStatus === "CONFIRMED" ? "Xác nhận" : b.bookingStatus === "PENDING" ? "Chờ" : "Hủy"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
