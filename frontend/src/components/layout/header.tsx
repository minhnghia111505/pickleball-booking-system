"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants/routes";
import { MainContainer } from "@/components/layout/main-container";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard, Map, Heart, Home, Activity, Calendar } from "lucide-react";

function getRoleDashboardLink(role: string): { href: string; label: string } | null {
  switch (role) {
    case "ROLE_STAFF": return { href: ROUTES.STAFF.DASHBOARD, label: "Staff Dashboard" };
    case "ROLE_MANAGER": return { href: ROUTES.MANAGER.DASHBOARD, label: "Manager Dashboard" };
    case "ROLE_SUPER_ADMIN": return { href: ROUTES.ADMIN.DASHBOARD, label: "Admin Dashboard" };
    default: return null;
  }
}

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const isCustomerRole = !user?.role || user.role === "ROLE_USER";
  const dashboardLink = user ? getRoleDashboardLink(user.role) : null;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white">
      <MainContainer>
        <div className="flex h-14 items-center justify-between gap-4 sm:h-16">
          <Link
            href={ROUTES.HOME}
            className="text-xl font-black tracking-tight text-primary sm:text-2xl"
          >
            {siteConfig.name}
          </Link>

          {/* Nav — only show for customers */}
          {isCustomerRole && (
            <nav
              className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex"
              aria-label="Main navigation"
            >
              <Link href={ROUTES.HOME} className="flex items-center gap-1.5 transition-colors hover:text-foreground">
                <Home className="h-4 w-4" />
                Trang chủ
              </Link>
              <Link href={ROUTES.MAP} className="flex items-center gap-1.5 transition-colors hover:text-foreground">
                <Map className="h-4 w-4" />
                Bản đồ
              </Link>
              <Link href={ROUTES.COURTS} className="flex items-center gap-1.5 transition-colors hover:text-foreground">
                <Activity className="h-4 w-4" />
                Sân
              </Link>
              {isAuthenticated && (
                <>
                  <Link href={ROUTES.BOOKINGS} className="flex items-center gap-1.5 transition-colors hover:text-foreground">
                    <Calendar className="h-4 w-4" />
                    Lịch sử đặt sân
                  </Link>
                  <Link href={ROUTES.FAVORITES} className="flex items-center gap-1.5 transition-colors hover:text-foreground">
                    <Heart className="h-4 w-4" />
                    Yêu thích
                  </Link>
                </>
              )}
            </nav>
          )}

          {/* For staff/manager/admin: show dashboard link */}
          {dashboardLink && (
            <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
              <Link
                href={dashboardLink.href}
                className="flex items-center gap-1.5 text-primary font-semibold"
              >
                <LayoutDashboard className="h-4 w-4" />
                {dashboardLink.label}
              </Link>
            </nav>
          )}

          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="outline" className="gap-2">
                      {user.fullName}
                    </Button>
                  }
                />
                <DropdownMenuContent align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {dashboardLink && (
                      <DropdownMenuItem
                        render={<Link href={dashboardLink.href}>{dashboardLink.label}</Link>}
                      />
                    )}
                    {isCustomerRole && (
                      <>
                        <DropdownMenuItem
                          render={<Link href={ROUTES.BOOKINGS}>Lịch sử đặt sân</Link>}
                        />
                        <DropdownMenuItem
                          render={<Link href={ROUTES.FAVORITES} className="flex items-center gap-1.5"><Heart className="h-4 w-4 fill-red-500 text-red-500" />Yêu thích</Link>}
                        />
                      </>
                    )}
                    <DropdownMenuItem
                      render={<Link href="/profile">Hồ sơ cá nhân</Link>}
                    />
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-500">
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  href={ROUTES.LOGIN}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground",
                    "transition-colors hover:bg-muted hover:text-foreground"
                  )}
                >
                  Đăng nhập
                </Link>
                <Link
                  href={ROUTES.REGISTER}
                  className={cn(
                    "rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground",
                    "transition-opacity hover:opacity-90"
                  )}
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </MainContainer>
    </header>
  );
}
