"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { courtService } from "@/services/court.service";
import { MainContainer } from "@/components/layout/main-container";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { Star, MapPin, Coffee, Car, Wifi, ShieldCheck, CheckCircle2 } from "lucide-react";
import dynamic from "next/dynamic";

const MiniMap = dynamic(() => import("@/components/court/MiniMap"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400">
      Đang tải bản đồ...
    </div>
  ),
});

export default function CourtDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = parseInt(resolvedParams.id, 10);

  const { data: court, isLoading, error } = useQuery({
    queryKey: ["court", id],
    queryFn: () => courtService.getCourtById(id),
  });

  if (isLoading) {
    return (
      <MainContainer className="py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-[400px] bg-muted rounded-xl" />
          <div className="h-8 w-1/3 bg-muted rounded" />
          <div className="h-24 bg-muted rounded" />
        </div>
      </MainContainer>
    );
  }

  if (error || !court) {
    return (
      <MainContainer className="py-16 text-center">
        <h2 className="text-2xl font-bold">Không tìm thấy sân</h2>
        <p className="mt-2 text-muted-foreground">Sân bạn yêu cầu không tồn tại hoặc đã bị xoá.</p>
        <Button asChild className="mt-6">
          <Link href={ROUTES.COURTS}>Quay lại danh sách</Link>
        </Button>
      </MainContainer>
    );
  }

  // Mock Gallery
  const mockImages = [
    court.imageUrl || "https://images.unsplash.com/photo-1628260412297-a3377e45006f?q=80&w=1000",
    "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1000",
    "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=1000",
    "https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=1000",
  ];

  return (
    <MainContainer className="py-8 pb-32 lg:pb-12 relative">
      <div className="mb-4">
        <Link href={ROUTES.COURTS} className="text-sm text-muted-foreground hover:text-primary transition-colors">
          &larr; Quay lại danh sách
        </Link>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Left Column: Images & Info */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Gallery */}
          <div className="space-y-4">
            <div className="overflow-hidden rounded-xl bg-muted aspect-video w-full">
              <img
                src={mockImages[0]}
                alt={court.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {mockImages.slice(1).map((img, idx) => (
                <div key={idx} className="aspect-video rounded-lg overflow-hidden bg-muted">
                  <img src={img} alt="Gallery" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                </div>
              ))}
            </div>
          </div>

          {/* Description & Amenities */}
          <div className="space-y-8">
            <div className="prose prose-sm max-w-none text-muted-foreground">
              <h2 className="text-xl font-bold text-foreground mb-4">Về sân này</h2>
              <p className="whitespace-pre-line text-base">{court.description || "Chưa có mô tả chi tiết cho sân này."}</p>
            </div>

            <div className="border-t pt-8">
              <h2 className="text-xl font-bold text-foreground mb-6">Tiện ích đi kèm</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <Wifi className="h-5 w-5 text-primary" />
                  <span>Wifi miễn phí</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <Car className="h-5 w-5 text-primary" />
                  <span>Bãi để xe ô tô</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <Coffee className="h-5 w-5 text-primary" />
                  <span>Khu vực nghỉ ngơi</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <span>Tủ đồ bảo mật</span>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="border-t pt-8">
              <h2 className="text-xl font-bold text-foreground mb-6">Vị trí</h2>
              <div className="flex items-center gap-2 mb-4 text-slate-600 dark:text-slate-400">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>{court.address}</span>
              </div>
              <div className="aspect-[21/9] bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden relative border z-0">
                {(court as any).latitude && (court as any).longitude ? (
                  <MiniMap lat={(court as any).latitude} lng={(court as any).longitude} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-slate-400">
                     <p>Chưa có tọa độ bản đồ</p>
                  </div>
                )}
              </div>
            </div>

            {/* Rules */}
            <div className="border-t pt-8">
              <h2 className="text-xl font-bold text-foreground mb-4">Nội quy sân</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                  <span>Vui lòng mang giày thể thao đế bằng (non-marking) để bảo vệ mặt sân.</span>
                </li>
                <li className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                  <span>Không hút thuốc và mang đồ ăn thức uống có cồn vào khu vực sân thi đấu.</span>
                </li>
                <li className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                  <span>Khách hàng có thể hủy lịch trước 2 tiếng để được hoàn 100% chi phí.</span>
                </li>
              </ul>
            </div>

            {/* Reviews */}
            <div className="border-t pt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Đánh giá (120)</h2>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xl font-bold">4.8</span>
                </div>
              </div>
              <div className="space-y-6">
                {/* Mock Review */}
                <div className="border-b pb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold">A</div>
                    <div>
                      <p className="font-semibold text-sm">Anh Tuấn</p>
                      <p className="text-xs text-muted-foreground">Tháng trước</p>
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Sân rất mới, mặt sân nhám độ bám tốt. Nhân viên nhiệt tình hướng dẫn. Rất đáng tiền!</p>
                </div>
                <div className="pb-2">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold">B</div>
                    <div>
                      <p className="font-semibold text-sm">Bảo Ngọc</p>
                      <p className="text-xs text-muted-foreground">2 tuần trước</p>
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Sân có đèn chiếu sáng ban đêm cực kỳ rõ, bóng không bị chói. Bãi gửi xe rộng rãi an toàn.</p>
                </div>
                <Button variant="outline" className="w-full">Xem tất cả đánh giá</Button>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Sticky Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border bg-white p-6 shadow-xl dark:bg-slate-950 hidden lg:block">
            <h1 className="text-2xl font-bold tracking-tight mb-2">{court.name}</h1>
            <div className="flex items-center gap-2 mb-6">
              <div className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${court.status === "ACTIVE" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-orange-100 text-orange-700"}`}>
                {court.status === "ACTIVE" ? "Đang hoạt động" : "Bảo trì"}
              </div>
            </div>
            
            <div className="flex items-baseline gap-1 mb-6 pb-6 border-b">
              <span className="text-3xl font-bold text-primary">
                {court.pricePerHour.toLocaleString("vi-VN")}đ
              </span>
              <span className="text-muted-foreground">/ giờ</span>
            </div>

            <Button size="lg" className="w-full text-lg h-14" disabled={court.status !== "ACTIVE"} asChild>
              <Link href={`${ROUTES.COURTS}/${court.id}/book`}>
                Tiến hành Đặt sân
              </Link>
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-4">
              Bạn chưa bị trừ tiền cho đến khi xác nhận đơn hàng ở bước tiếp theo.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-slate-950 border-t shadow-[0_-10px_40px_rgba(0,0,0,0.1)] lg:hidden z-50 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Giá mỗi giờ</p>
          <p className="text-xl font-bold text-primary">{court.pricePerHour.toLocaleString("vi-VN")}đ</p>
        </div>
        <Button size="lg" disabled={court.status !== "ACTIVE"} asChild>
          <Link href={`${ROUTES.COURTS}/${court.id}/book`}>
            Đặt sân ngay
          </Link>
        </Button>
      </div>
    </MainContainer>
  );
}
