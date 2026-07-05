"use client";

import { useEffect, useState } from "react";
import { MainContainer } from "@/components/layout/main-container";
import { bookingService } from "@/services/booking.service";
import { Booking } from "@/types/booking.type";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, CheckCircle, XCircle, AlertCircle, CreditCard, ChevronRight, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

const TABS = [
  { id: "ALL", label: "Tất cả" },
  { id: "PENDING", label: "Chờ xử lý" },
  { id: "CONFIRMED", label: "Đã xác nhận" },
  { id: "COMPLETED", label: "Đã hoàn thành" },
  { id: "CANCELLED", label: "Đã hủy" },
];

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchBookings = async (statusTab: string, pageNum: number) => {
    try {
      setIsLoading(true);
      const params: any = { page: pageNum, size: 10 };
      if (statusTab !== "ALL") {
        params.status = statusTab;
      }
      const data = await bookingService.getMyBookings(params);
      setBookings(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error("Không thể tải lịch sử đặt sân");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(activeTab, page);
  }, [activeTab, page]);

  const handleCancel = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn hủy đặt sân này?")) return;
    try {
      await bookingService.cancelBooking(id);
      toast.success("Hủy đặt sân thành công");
      fetchBookings(activeTab, page);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể hủy đặt sân");
    }
  };

  const handlePay = async (id: number) => {
    try {
      await bookingService.payBooking(id);
      toast.success("Thanh toán thành công");
      fetchBookings(activeTab, page);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Thanh toán thất bại");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800"><CheckCircle className="h-4 w-4" /> Đã xác nhận</span>;
      case "COMPLETED":
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800"><Activity className="h-4 w-4" /> Đã hoàn thành</span>;
      case "PENDING":
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800"><AlertCircle className="h-4 w-4" /> Chờ xử lý</span>;
      case "CANCELLED":
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800"><XCircle className="h-4 w-4" /> Đã hủy</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800">{status}</span>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"><CreditCard className="h-4 w-4" /> Đã thanh toán</span>;
      case "PENDING":
      case "UNPAID":
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"><AlertCircle className="h-4 w-4" /> Chưa thanh toán</span>;
      case "REFUNDED":
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-800"><CheckCircle className="h-4 w-4" /> Đã hoàn tiền</span>;
      default:
        return null;
    }
  };

  return (
    <MainContainer className="py-12">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Đơn đặt sân của tôi</h1>
          <p className="text-slate-500 mt-2">Quản lý lịch sử và trạng thái các lượt đặt sân.</p>
        </div>
        <Button asChild className="font-semibold" size="lg">
          <Link href={ROUTES.COURTS}>Đặt sân mới ngay</Link>
        </Button>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
        <nav className="-mb-px flex space-x-8 min-w-max">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setPage(0);
              }}
              className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 py-20 text-center dark:border-slate-800 dark:bg-slate-900/20">
          <Calendar className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Không có đơn đặt sân nào</h3>
          <p className="mt-1 text-slate-500 max-w-sm mx-auto">Bạn chưa có đơn đặt sân nào trong trạng thái này. Hãy tìm sân và đặt ngay nhé!</p>
          <div className="mt-8">
            <Button asChild>
              <Link href={ROUTES.COURTS}>Khám phá sân Pickleball</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
              {/* Card Header */}
              <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3 sm:px-6 dark:border-slate-800 dark:bg-slate-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">Mã đơn: #{booking.id}</span>
                  <span className="text-slate-300 hidden sm:inline">|</span>
                  <span className="text-xs text-slate-500">Đặt ngày {format(new Date(booking.createdAt || booking.bookingDate), "dd/MM/yyyy HH:mm")}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {getStatusBadge(booking.bookingStatus)}
                  {getPaymentBadge(booking.paymentStatus)}
                </div>
              </div>
              
              {/* Card Body */}
              <div className="p-4 sm:p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                <div className="flex gap-4 items-start w-full md:w-auto">
                  <div className="hidden sm:flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MapPin className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white hover:text-primary transition-colors">
                      <Link href={`${ROUTES.COURTS}/${booking.court.id}`}>{booking.court.name}</Link>
                    </h3>
                    <p className="flex items-center gap-1.5 text-sm text-slate-500">
                      <MapPin className="h-4 w-4 shrink-0" />
                      {booking.court.address}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-700 dark:text-slate-300 pt-1">
                      <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                        <Calendar className="h-4 w-4 text-primary" />
                        {format(new Date(booking.bookingDate), "dd/MM/yyyy")}
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                        <Clock className="h-4 w-4 text-primary" />
                        {booking.startTime.slice(0, 5)} - {booking.endTime.slice(0, 5)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-left md:text-right w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                  <p className="text-sm font-medium text-slate-500 mb-1">Thành tiền</p>
                  <p className="text-2xl font-extrabold text-primary">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.totalAmount)}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="bg-slate-50/50 px-4 py-3 sm:px-6 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-end gap-3">
                {booking.paymentStatus === "UNPAID" && booking.bookingStatus !== "CANCELLED" && (
                  <Button onClick={() => handlePay(booking.id)} className="font-semibold px-8" size="sm">
                    Thanh toán ngay
                  </Button>
                )}
                {booking.bookingStatus !== "CANCELLED" && booking.bookingStatus !== "COMPLETED" && (
                  <Button variant="outline" onClick={() => handleCancel(booking.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200" size="sm">
                    Hủy đơn
                  </Button>
                )}
                <Button variant="ghost" size="sm" asChild className="hidden sm:flex text-slate-500">
                  <Link href={`${ROUTES.COURTS}/${booking.court.id}`}>
                    Xem chi tiết sân <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                Trước
              </Button>
              <div className="flex items-center px-4 font-medium">
                Trang {page + 1} / {totalPages}
              </div>
              <Button
                variant="outline"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Sau
              </Button>
            </div>
          )}
        </div>
      )}
    </MainContainer>
  );
}
