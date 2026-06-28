"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/axios";
import { Activity, CalendarDays, DollarSign, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

interface DashboardStats {
  summary?: {
    totalBookings: number;
    confirmedBookings: number;
    cancelledBookings: number;
    totalRevenue: number;
  };
  topCourts?: { courtName: string; bookingCount: number; revenue: number }[];
}

export default function ManagerDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.get("/statistics/dashboard?days=30") as any;
        setStats(res.data);
      } catch {
        // silently fail, stats not available
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const cards = [
    {
      label: "Tổng đơn (30 ngày)", 
      value: stats?.summary?.totalBookings ?? "—", 
      icon: CalendarDays, 
      color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Đơn đã xác nhận", 
      value: stats?.summary?.confirmedBookings ?? "—", 
      icon: Activity, 
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      label: "Doanh thu (30 ngày)", 
      value: stats?.summary?.totalRevenue != null
        ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(stats.summary.totalRevenue)
        : "—", 
      icon: DollarSign, 
      color: "text-primary bg-primary/10",
    },
    {
      label: "Đã hủy", 
      value: stats?.summary?.cancelledBookings ?? "—", 
      icon: TrendingUp, 
      color: "text-red-500 bg-red-50 dark:bg-red-900/20",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tổng quan</h1>
          <p className="text-slate-500 text-sm mt-1">Thống kê 30 ngày gần nhất</p>
        </div>
        <Link href={ROUTES.MANAGER.COURTS} className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
          + Thêm sân mới
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card) => (
          <div key={card.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex items-center gap-4 shadow-sm">
            <div className={`p-3 rounded-xl ${card.color}`}>
              <card.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">{card.label}</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{isLoading ? "..." : card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Top Courts */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-slate-800 dark:text-white">Sân được đặt nhiều nhất</h2>
        </div>
        {isLoading ? (
          <div className="py-12 flex justify-center"><div className="h-6 w-6 border-4 border-primary border-r-transparent rounded-full animate-spin" /></div>
        ) : !stats?.topCourts?.length ? (
          <div className="py-12 text-center text-slate-400">Chưa có dữ liệu</div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {stats.topCourts.map((c, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold text-slate-300 dark:text-slate-600 w-6">#{i + 1}</span>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-white">{c.courtName}</p>
                    <p className="text-sm text-slate-500">{c.bookingCount} lượt đặt</p>
                  </div>
                </div>
                <p className="text-primary font-bold">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(c.revenue)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
