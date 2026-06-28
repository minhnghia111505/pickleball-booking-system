"use client";

import { useAuthStore } from "@/stores/auth.store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, CalendarDays, Activity, LogOut, BarChart2, Settings } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils/cn";

const managerNav = [
  { href: ROUTES.MANAGER.DASHBOARD, label: "Tổng quan", icon: LayoutDashboard },
  { href: ROUTES.MANAGER.COURTS, label: "Quản lý Sân", icon: Activity },
  { href: ROUTES.MANAGER.BOOKINGS, label: "Đơn Đặt Sân", icon: CalendarDays },
  { href: "/manager/services", label: "Dịch vụ", icon: Activity },
  { href: "/manager/statistics", label: "Thống kê", icon: BarChart2 },
];

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) { router.push(ROUTES.LOGIN); return; }
    if (user?.role !== "ROLE_MANAGER" && user?.role !== "ROLE_SUPER_ADMIN") {
      router.push(ROUTES.HOME);
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated) return null;

  const handleLogout = () => { logout(); router.push(ROUTES.HOME); };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <aside className="w-64 hidden md:flex flex-col border-r border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800">
        {/* Brand */}
        <div className="flex h-16 items-center gap-3 px-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/30">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Manager Portal</p>
            <p className="text-xs text-slate-400 truncate max-w-[140px]">{user?.fullName}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {managerNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  active
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                )}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", active && "text-primary")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-1">
          <Link href="/manager/settings" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
            <Settings className="h-4 w-4" /> Cài đặt
          </Link>
          <button onClick={handleLogout} className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors">
            <LogOut className="h-4 w-4" /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
            {managerNav.find((n) => pathname.startsWith(n.href))?.label ?? "Dashboard"}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold">Chủ sân</span>
            <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              {user?.fullName?.charAt(0) ?? "M"}
            </div>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
