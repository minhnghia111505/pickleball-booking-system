"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/axios";
import { Activity, CalendarDays, DollarSign, Users, TrendingUp, ArrowUpRight } from "lucide-react";

interface Stats {
  summary?: { totalBookings: number; confirmedBookings: number; cancelledBookings: number; totalRevenue: number };
  topCourts?: { courtName: string; bookingCount: number; revenue: number }[];
  topUsers?: { userName: string; bookingCount: number; totalSpent: number }[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.get("/statistics/dashboard?days=30") as any;
        setStats(res.data);
      } catch { /* no-op */ } finally { setIsLoading(false); }
    };
    load();
  }, []);

  const cards = [
    { label: "Tổng đơn (30 ngày)", value: stats?.summary?.totalBookings, icon: CalendarDays, gradient: "from-blue-500 to-blue-600" },
    { label: "Đã xác nhận", value: stats?.summary?.confirmedBookings, icon: Activity, gradient: "from-emerald-500 to-emerald-600" },
    { label: "Doanh thu (30 ngày)", value: stats?.summary?.totalRevenue != null ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(stats.summary.totalRevenue) : null, icon: DollarSign, gradient: "from-primary to-emerald-400" },
    { label: "Đã hủy", value: stats?.summary?.cancelledBookings, icon: TrendingUp, gradient: "from-red-500 to-red-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Hệ Thống</h1>
        <p className="text-slate-400 text-sm mt-1">Thống kê toàn nền tảng - 30 ngày qua</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card) => (
          <div key={card.label} className="relative overflow-hidden rounded-2xl bg-slate-800/50 border border-white/5 p-5 backdrop-blur-sm">
            <div className={`absolute top-3 right-3 p-2.5 rounded-xl bg-gradient-to-br ${card.gradient} opacity-90`}>
              <card.icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-sm text-slate-400 font-medium">{card.label}</p>
            <p className="text-2xl font-bold text-white mt-2">{isLoading ? "..." : (card.value ?? "—")}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Courts */}
        <div className="bg-slate-800/50 border border-white/5 rounded-2xl backdrop-blur-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <h2 className="font-semibold text-white flex items-center gap-2"><Activity className="h-5 w-5 text-primary" /> Top Sân</h2>
          </div>
          {isLoading ? (
            <div className="py-10 flex justify-center"><div className="h-6 w-6 border-4 border-primary border-r-transparent rounded-full animate-spin" /></div>
          ) : !stats?.topCourts?.length ? (
            <div className="py-10 text-center text-slate-500">Chưa có dữ liệu</div>
          ) : stats.topCourts.map((c, i) => (
            <div key={i} className="flex items-center justify-between px-6 py-3.5 border-b border-white/5 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-slate-600 w-5">#{i+1}</span>
                <div>
                  <p className="font-medium text-white text-sm">{c.courtName}</p>
                  <p className="text-xs text-slate-500">{c.bookingCount} lượt</p>
                </div>
              </div>
              <p className="text-primary font-bold text-sm">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(c.revenue)}</p>
            </div>
          ))}
        </div>

        {/* Top Users */}
        <div className="bg-slate-800/50 border border-white/5 rounded-2xl backdrop-blur-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <h2 className="font-semibold text-white flex items-center gap-2"><Users className="h-5 w-5 text-blue-400" /> Top Khách hàng</h2>
          </div>
          {isLoading ? (
            <div className="py-10 flex justify-center"><div className="h-6 w-6 border-4 border-primary border-r-transparent rounded-full animate-spin" /></div>
          ) : !stats?.topUsers?.length ? (
            <div className="py-10 text-center text-slate-500">Chưa có dữ liệu</div>
          ) : stats.topUsers.map((u, i) => (
            <div key={i} className="flex items-center justify-between px-6 py-3.5 border-b border-white/5 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-slate-600 w-5">#{i+1}</span>
                <div>
                  <p className="font-medium text-white text-sm">{u.userName}</p>
                  <p className="text-xs text-slate-500">{u.bookingCount} đơn</p>
                </div>
              </div>
              <p className="text-blue-400 font-bold text-sm">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(u.totalSpent)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
