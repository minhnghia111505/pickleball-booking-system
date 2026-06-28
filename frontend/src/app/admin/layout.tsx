"use client";

import { useAuthStore } from "@/stores/auth.store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, Activity, Users, Building2, BarChart2, LogOut, Shield } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils/cn";

const adminNav = [
  { href: ROUTES.ADMIN.DASHBOARD, label: "Tổng quan", icon: LayoutDashboard },
  { href: ROUTES.ADMIN.CLUBS, label: "Câu lạc bộ", icon: Building2 },
  { href: ROUTES.ADMIN.COURTS, label: "Tất cả Sân", icon: Activity },
  { href: ROUTES.ADMIN.USERS, label: "Người dùng", icon: Users },
  { href: ROUTES.ADMIN.STATISTICS, label: "Thống kê", icon: BarChart2 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) { router.push(ROUTES.LOGIN); return; }
    if (user?.role !== "ROLE_SUPER_ADMIN") {
      router.push(ROUTES.HOME);
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated) return null;

  const handleLogout = () => { logout(); router.push(ROUTES.HOME); };

  return (
    <div className="flex min-h-screen" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" }}>
      {/* Sidebar */}
      <aside className="w-64 hidden md:flex flex-col bg-slate-900/60 backdrop-blur-xl border-r border-white/5">
        <div className="flex h-16 items-center gap-3 px-5 border-b border-white/5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-emerald-400 shadow-lg shadow-primary/40">
            <Shield className="h-5 w-5 text-slate-900 font-bold" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">Super Admin</p>
            <p className="text-xs text-slate-400 truncate max-w-[140px]">{user?.email}</p>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {adminNav.map((item) => {
            const active = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin/dashboard");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  active
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-slate-900/60 backdrop-blur-xl border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-white">
              {adminNav.find((n) => pathname.startsWith(n.href))?.label ?? "Super Admin"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full font-semibold border border-primary/20">Super Admin</span>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center text-slate-900 font-bold text-sm shadow-lg">
              {user?.fullName?.charAt(0) ?? "A"}
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
