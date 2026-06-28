"use client";

import { useEffect, useState } from "react";
import { MainContainer } from "@/components/layout/main-container";
import { bookingService } from "@/services/booking.service";
import { Booking } from "@/types/booking.type";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, CheckCircle, XCircle, AlertCircle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const data = await bookingService.getMyBookings({ page: 0, size: 50 });
      setBookings(data.content);
    } catch (error) {
      toast.error("Không thể tải lịch sử đặt sân");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn hủy đặt sân này?")) return;
    try {
      await bookingService.cancelBooking(id);
      toast.success("Hủy đặt sân thành công");
      fetchBookings();
    } catch (error) {
      toast.error("Không thể hủy đặt sân");
    }
  };

  const handlePay = async (id: number) => {
    try {
      await bookingService.payBooking(id);
      toast.success("Thanh toán thành công (Mô phỏng)");
      fetchBookings();
    } catch (error) {
      toast.error("Thanh toán thất bại");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800"><CheckCircle className="h-3.5 w-3.5" /> Đã xác nhận</span>;
      case "PENDING":
        return <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800"><AlertCircle className="h-3.5 w-3.5" /> Chờ xử lý</span>;
      case "CANCELLED":
        return <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800"><XCircle className="h-3.5 w-3.5" /> Đã hủy</span>;
      default:
        return <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">{status}</span>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"><CreditCard className="h-3.5 w-3.5" /> Đã thanh toán</span>;
      case "PENDING":
        return <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800"><AlertCircle className="h-3.5 w-3.5" /> Chưa thanh toán</span>;
      default:
        return null;
    }
  };

  return (
    <MainContainer className="py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Lịch sử đặt sân</h1>
          <p className="text-slate-500 mt-2">Quản lý các lượt đặt sân và thanh toán của bạn</p>
        </div>
        <Button asChild className="font-semibold">
          <Link href={ROUTES.COURTS}>Đặt sân mới</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">Chưa có lịch sử đặt sân</h3>
          <p className="mt-1 text-slate-500">Bạn chưa đặt sân nào trên hệ thống.</p>
          <div className="mt-6">
            <Button asChild>
              <Link href={ROUTES.COURTS}>Tìm sân ngay</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
              <div className="border-b border-slate-100 bg-slate-50/50 p-4 sm:px-6 dark:border-slate-800 dark:bg-slate-900/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <span className="text-lg font-bold">#{booking.id}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{booking.court.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {booking.court.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {getStatusBadge(booking.bookingStatus)}
                    {getPaymentBadge(booking.paymentStatus)}
                  </div>
                </div>
              </div>
              
              <div className="p-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Ngày đặt</p>
                      <p className="text-sm text-slate-500">{format(new Date(booking.bookingDate), "dd/MM/yyyy")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Thời gian</p>
                      <p className="text-sm text-slate-500">
                        {booking.startTime.slice(0, 5)} - {booking.endTime.slice(0, 5)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 md:justify-end">
                    <div className="text-left md:text-right">
                      <p className="text-sm font-medium text-slate-500">Tổng tiền</p>
                      <p className="text-2xl font-bold text-primary">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                  {booking.paymentStatus === "PENDING" && booking.bookingStatus !== "CANCELLED" && (
                    <Button onClick={() => handlePay(booking.id)} className="font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
                      Thanh toán ngay
                    </Button>
                  )}
                  {booking.bookingStatus !== "CANCELLED" && booking.bookingStatus !== "COMPLETED" && (
                    <Button variant="outline" onClick={() => handleCancel(booking.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                      Hủy đặt sân
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </MainContainer>
  );
}
