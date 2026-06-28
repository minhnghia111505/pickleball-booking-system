"use client";

import Link from "next/link";
import { MainContainer } from "@/components/layout/main-container";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { Activity, Calendar, Trophy, MapPin, Users, Search, Map, Building2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { clubService } from "@/services/club.service";

export default function HomePage() {
  const { data: clubs, isLoading } = useQuery({
    queryKey: ["clubs-featured"],
    queryFn: () => clubService.getClubs({ size: 6 }),
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#f9fafb]">
      {/* 1. HERO SECTION (Dark Mode Vibe with Neon Green Gradient) */}
      <section 
        className="relative pt-24 pb-48 sm:pt-32 sm:pb-56 bg-slate-950 overflow-hidden text-white"
        style={{ clipPath: 'ellipse(180% 100% at 50% 0%)' }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/30 via-slate-950 to-slate-950" />
        <MainContainer className="relative z-10">
          <div className="max-w-2xl animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="mb-6 text-5xl">🏓</div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.15] mb-6">
              Đặt Sân Pickleball tại Việt Nam
            </h1>
            <p className="max-w-xl text-lg sm:text-xl text-slate-200 mb-10 leading-relaxed">
              Tìm và đặt sân pickleball trên hệ thống của chúng tôi. Xem giá thuê, lịch trống theo thời gian thực, đặt sân online nhanh chóng chỉ trong vài giây.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button asChild size="lg" className="h-12 w-full sm:w-auto rounded-lg px-8 text-base font-semibold bg-white text-primary hover:bg-slate-100 shadow-md">
                <Link href={ROUTES.COURTS}>
                  <Search className="mr-2 h-5 w-5" />
                  Tìm sân ngay
                </Link>
              </Button>
            </div>
          </div>
        </MainContainer>
      </section>

      {/* 2. DYNAMIC CLUBS SECTION */}
      <section className="-mt-20 sm:-mt-24 pb-24 relative z-20" id="features">
        <MainContainer>
          <div className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-100 p-8 sm:p-10 mb-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-100 pb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">⚡</span>
                  <h2 className="text-2xl font-bold text-slate-900">Danh sách Câu Lạc Bộ Nổi Bật</h2>
                </div>
                <p className="text-slate-500">Tìm kiếm các câu lạc bộ gần bạn nhất</p>
              </div>
              <Button asChild variant="default" className="w-full sm:w-auto rounded-full font-semibold">
                <Link href={ROUTES.COURTS}>Xem tất cả sân</Link>
              </Button>
            </div>
            
            {/* Dynamic Cards */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clubs?.content?.map((club: any) => (
                  <div key={club.id} className="flex flex-col rounded-xl bg-white p-6 border border-slate-100 hover:border-primary/30 hover:shadow-md transition-all">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#f0fdf4] text-primary">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{club.name}</h3>
                    <p className="text-sm text-slate-600 mb-2 line-clamp-2">{club.description || "Chưa có mô tả"}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-auto pt-4 border-t border-slate-100">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{club.address}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </MainContainer>
      </section>

      {/* 4. SIMPLE FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-12 mt-auto">
        <MainContainer className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-xl font-bold text-primary">
            <Activity className="h-6 w-6" />
            PickleballBooking
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} PickleballBooking. Đã đăng ký bản quyền.
          </p>
          <div className="flex gap-4 text-sm font-medium text-slate-600">
            <Link href="#" className="hover:text-primary transition-colors">Điều khoản</Link>
            <Link href="#" className="hover:text-primary transition-colors">Bảo mật</Link>
            <Link href="#" className="hover:text-primary transition-colors">Liên hệ</Link>
          </div>
        </MainContainer>
      </footer>
    </div>
  );
}
