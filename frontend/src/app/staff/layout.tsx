"use client";

import { useAuthStore } from "@/stores/auth.store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, CalendarDays, Clock, LogOut, Activity } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils/cn";

const staffNav = [
  { href: ROUTES.STAFF.DASHBOARD, label: "Tổng quan", icon: LayoutDashboard },
  { href: ROUTES.STAFF.BOOKINGS, label: "Đơn đặt sân", icon: CalendarDays },
];

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
      return;
    }
    if (user?.role !== "ROLE_STAFF" && user?.role !== "ROLE_MANAGER" && user?.role !== "ROLE_SUPER_ADMIN") {
      router.push(ROUTES.HOME);
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    router.push(ROUTES.HOME);
  };

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="w-60 hidden md:flex flex-col bg-slate-900 text-white shadow-xl">
        <div className="flex h-16 items-center gap-3 px-5 border-b border-slate-700">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight">Staff Portal</p>
            <p className="text-xs text-slate-400">{user?.fullName}</p>
          </div>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {staffNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="h-14 bg-white border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Clock className="h-4 w-4" />
            <span>{new Date().toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{user?.fullName}</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Nhân viên</span>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
