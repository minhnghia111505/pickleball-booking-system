"use client";

import { useEffect, useState } from "react";
import { bookingService } from "@/services/booking.service";
import { Booking } from "@/types/booking.type";
import { toast } from "sonner";
import { format } from "date-fns";
import { Search, XCircle, CreditCard } from "lucide-react";

export default function ManagerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const data = await bookingService.getClubBookings({ page: 0, size: 200 });
      setBookings(data.content);
    } catch {
      toast.error("Không thể tải đơn đặt sân");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id: number) => {
    if (!confirm("Xác nhận hủy đơn này?")) return;
    try {
      await bookingService.cancelBooking(id);
      toast.success("Đã hủy đơn đặt sân");
      fetchBookings();
    } catch { toast.error("Không thể hủy"); }
  };

  const filtered = bookings.filter((b) =>
    b.court.name.toLowerCase().includes(search.toLowerCase()) ||
    b.user.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const statusClass: Record<string, string> = {
    CONFIRMED: "bg-emerald-100 text-emerald-700",
    PENDING: "bg-amber-100 text-amber-700",
    CANCELLED: "bg-red-100 text-red-700",
    COMPLETED: "bg-slate-100 text-slate-500",
  };
  const statusLabel: Record<string, string> = {
    CONFIRMED: "Xác nhận", PENDING: "Chờ xử lý", CANCELLED: "Đã hủy", COMPLETED: "Hoàn thành",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Quản lý Đơn Đặt Sân</h1>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sân, khách hàng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-700"
            />
          </div>
          <span className="text-sm text-slate-500">Tổng: {filtered.length} đơn</span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><div className="h-7 w-7 border-4 border-primary border-r-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/40 text-xs uppercase text-slate-500 border-b dark:border-slate-700">
                <tr>
                  {["#ID", "Khách hàng", "Sân", "Ngày", "Giờ", "Tiền", "Trạng thái", "TT"].map((h) => (
                    <th key={h} className="px-5 py-3 font-semibold">{h}</th>
                  ))}
                  <th className="px-5 py-3 font-semibold text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={9} className="py-12 text-center text-slate-400">Không có dữ liệu</td></tr>
                ) : filtered.map((b) => (
                  <tr key={b.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3 font-mono text-slate-400 text-xs">#{b.id}</td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-800 dark:text-white">{b.user.fullName}</p>
                      <p className="text-xs text-slate-400">{b.user.email}</p>
                    </td>
                    <td className="px-5 py-3 font-medium text-slate-700 dark:text-slate-300">{b.court.name}</td>
                    <td className="px-5 py-3 text-slate-500">{format(new Date(b.bookingDate), "dd/MM/yy")}</td>
                    <td className="px-5 py-3 text-slate-500">{b.startTime.slice(0,5)}–{b.endTime.slice(0,5)}</td>
                    <td className="px-5 py-3 text-primary font-semibold">
                      {new Intl.NumberFormat("vi-VN").format(b.totalAmount)}đ
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusClass[b.bookingStatus] ?? "bg-slate-100 text-slate-500"}`}>
                        {statusLabel[b.bookingStatus] ?? b.bookingStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${b.paymentStatus === "PAID" ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-400"}`}>
                        {b.paymentStatus === "PAID" ? "Đã TT" : "Chưa"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {b.bookingStatus !== "CANCELLED" && b.bookingStatus !== "COMPLETED" && (
                        <button onClick={() => handleCancel(b.id)} className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium">
                          <XCircle className="h-3.5 w-3.5" /> Hủy
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
