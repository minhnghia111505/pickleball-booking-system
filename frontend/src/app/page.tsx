"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { MainContainer } from "@/components/layout/main-container";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { Activity, MapPin, Search, Building2, Star, Navigation } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { clubService } from "@/services/club.service";
import { courtService } from "@/services/court.service";

const CourtMap = dynamic(() => import("@/components/court/CourtMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[480px] items-center justify-center rounded-2xl border border-slate-100 bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-r-transparent" />
        <p className="text-sm text-slate-500">Đang tải bản đồ...</p>
      </div>
    </div>
  ),
});

export default function HomePage() {
  const { data: clubs, isLoading } = useQuery({
    queryKey: ["clubs-featured"],
    queryFn: () => clubService.getClubs({ size: 6 }),
  });

  const { data: courtsData } = useQuery({
    queryKey: ["courts-map-home"],
    queryFn: () => courtService.getCourts({ size: 100 }),
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#f9fafb]">
      {/* 1. HERO SECTION (Premium Dark Gradient) */}
      <section
        className="relative pt-24 pb-48 sm:pt-32 sm:pb-56 overflow-hidden text-white bg-slate-950"
        style={{ clipPath: 'ellipse(180% 100% at 50% 0%)' }}
      >
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-900 via-slate-950 to-primary/20" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 z-0" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3 z-0" />
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

      {/* 2. MAP SECTION */}
      <section className="-mt-20 sm:-mt-24 pb-12 relative z-20">
        <MainContainer>
          <div className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-100 p-8 sm:p-10 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🗺️</span>
                  <h2 className="text-2xl font-bold text-slate-900">Bản đồ Sân Pickleball</h2>
                </div>
                <p className="text-slate-500">Khám phá sân gần bạn nhất trên bản đồ tương tác</p>
              </div>
              <Button asChild variant="default" className="w-full sm:w-auto rounded-full font-semibold">
                <Link href={ROUTES.COURTS}>Xem tất cả sân</Link>
              </Button>
            </div>
            <CourtMap
              courts={(courtsData?.content ?? []).map((court) => ({
                id: court.id,
                name: court.name,
                address: court.address,
                pricePerHour: Number(court.pricePerHour),
                imageUrl: court.imageUrl,
                latitude: (court as any).latitude,
                longitude: (court as any).longitude,
                status: String(court.status),
              }))}
            />
          </div>
        </MainContainer>
      </section>

      {/* 3. DYNAMIC CLUBS SECTION */}
      <section className="pb-24 relative z-10" id="features">
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
                  <div key={club.id} className="flex flex-col rounded-xl bg-white p-5 border border-slate-100 hover:border-primary/30 hover:shadow-lg transition-all group">
                    <div className="flex gap-4 mb-4">
                      {club.logoUrl ? (
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100 shadow-sm border border-slate-200">
                          <img src={club.logoUrl} alt={club.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                        </div>
                      ) : (
                        <div className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[#f0fdf4] text-primary shadow-sm border border-primary/10">
                          <Building2 className="h-8 w-8" />
                        </div>
                      )}
                      <div className="flex flex-col justify-center">
                        <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">{club.name}</h3>
                        <div className="flex items-center gap-1 mt-1 text-sm font-medium">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-slate-700">{club.rating || "Chưa có"}</span>
                          {club.reviewsCount ? <span className="text-slate-500 font-normal">({club.reviewsCount})</span> : null}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed flex-1">{club.description || "Chưa có mô tả"}</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-xs text-slate-500 max-w-[70%]">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span className="line-clamp-1">{club.address}</span>
                      </div>
                      {club.googleMapUrl && (
                        <a href={club.googleMapUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-semibold text-primary bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-full transition-colors">
                          <Navigation className="h-3 w-3" />
                          Bản đồ
                        </a>
                      )}
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
