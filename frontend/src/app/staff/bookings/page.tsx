"use client";

import { useEffect, useState } from "react";
import { bookingService } from "@/services/booking.service";
import { Booking } from "@/types/booking.type";
import { toast } from "sonner";
import { format } from "date-fns";
import { Search, CheckCircle, XCircle } from "lucide-react";

export default function StaffBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const data = await bookingService.getClubBookings({ page: 0, size: 200 });
      setBookings(data.content);
    } catch {
      toast.error("Không thể tải danh sách đơn đặt sân");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id: number) => {
    if (!confirm("Bạn có chắc muốn hủy đơn này?")) return;
    try {
      await bookingService.cancelBooking(id);
      toast.success("Đã hủy đơn đặt sân");
      fetchBookings();
    } catch {
      toast.error("Không thể hủy đơn");
    }
  };

  const filtered = bookings.filter((b) =>
    b.court.name.toLowerCase().includes(search.toLowerCase()) ||
    b.user.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      CONFIRMED: "bg-emerald-100 text-emerald-700",
      PENDING: "bg-amber-100 text-amber-700",
      CANCELLED: "bg-red-100 text-red-700",
      COMPLETED: "bg-slate-100 text-slate-600",
    };
    const labelMap: Record<string, string> = {
      CONFIRMED: "Xác nhận", PENDING: "Chờ xử lý", CANCELLED: "Đã hủy", COMPLETED: "Hoàn thành",
    };
    return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${map[status] ?? "bg-slate-100 text-slate-600"}`}>{labelMap[status] ?? status}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Quản lý Đơn Đặt Sân</h1>
          <p className="text-sm text-slate-500 mt-1">Tất cả đơn đặt của cơ sở</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo sân hoặc khách hàng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-700"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="h-7 w-7 border-4 border-primary border-r-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-5 py-3 font-semibold">#</th>
                  <th className="px-5 py-3 font-semibold">Khách hàng</th>
                  <th className="px-5 py-3 font-semibold">Sân</th>
                  <th className="px-5 py-3 font-semibold">Ngày</th>
                  <th className="px-5 py-3 font-semibold">Giờ</th>
                  <th className="px-5 py-3 font-semibold">Trạng thái</th>
                  <th className="px-5 py-3 font-semibold">Thanh toán</th>
                  <th className="px-5 py-3 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="py-12 text-center text-slate-400">Không có đơn nào</td></tr>
                ) : filtered.map((b) => (
                  <tr key={b.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-3 font-mono text-slate-400">#{b.id}</td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-800 dark:text-white">{b.user.fullName}</p>
                      <p className="text-slate-400">{b.user.email}</p>
                    </td>
                    <td className="px-5 py-3 font-medium text-slate-700 dark:text-slate-300">{b.court.name}</td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{format(new Date(b.bookingDate), "dd/MM/yyyy")}</td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{b.startTime.slice(0,5)}–{b.endTime.slice(0,5)}</td>
                    <td className="px-5 py-3">{statusBadge(b.bookingStatus)}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${b.paymentStatus === "PAID" ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-500"}`}>
                        {b.paymentStatus === "PAID" ? "Đã TT" : "Chưa TT"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {b.bookingStatus !== "CANCELLED" && b.bookingStatus !== "COMPLETED" && (
                        <button onClick={() => handleCancel(b.id)} className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium">
                          <XCircle className="h-4 w-4" /> Hủy
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
