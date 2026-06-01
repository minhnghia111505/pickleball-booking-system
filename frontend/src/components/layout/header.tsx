import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants/routes";
import { MainContainer } from "@/components/layout/main-container";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: ROUTES.HOME, label: "Trang chủ" },
  { href: ROUTES.COURTS, label: "Sân" },
  { href: ROUTES.BOOKINGS, label: "Đặt sân" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <MainContainer>
        <div className="flex h-14 items-center justify-between gap-4 sm:h-16">
          <Link
            href={ROUTES.HOME}
            className="text-lg font-semibold tracking-tight text-foreground sm:text-xl"
          >
            {siteConfig.name}
          </Link>

          <nav
            className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex"
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
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
          </div>
        </div>
      </MainContainer>
    </header>
  );
}
