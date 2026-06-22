"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { courtService } from "@/services/court.service";
import { MainContainer } from "@/components/layout/main-container";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

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

  return (
    <MainContainer className="py-8">
      <div className="mb-4">
        <Link href={ROUTES.COURTS} className="text-sm text-muted-foreground hover:text-primary">
          &larr; Quay lại danh sách
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Court Image */}
        <div className="overflow-hidden rounded-xl bg-muted aspect-video lg:aspect-auto lg:h-[500px]">
          {court.imageUrl ? (
            <img
              src={court.imageUrl}
              alt={court.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              Chưa có hình ảnh
            </div>
          )}
        </div>

        {/* Court Details */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{court.name}</h1>
            <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {court.status === "ACTIVE" ? "Hoạt động" : "Bảo trì"}
            </div>
          </div>

          <div className="mt-6 flex items-baseline gap-2 border-b border-border pb-6">
            <span className="text-4xl font-extrabold text-foreground">
              {court.pricePerHour.toLocaleString("vi-VN")}đ
            </span>
            <span className="text-lg text-muted-foreground">/ giờ</span>
          </div>

          <div className="mt-6 prose prose-sm max-w-none text-muted-foreground">
            <h3 className="text-lg font-medium text-foreground">Mô tả chi tiết</h3>
            <p className="mt-2 whitespace-pre-line">{court.description || "Chưa có mô tả cho sân này."}</p>
          </div>

          <div className="mt-auto pt-8">
            <Button size="lg" className="w-full text-lg h-14" asChild>
              {/* Feature 3.3 will implement the actual booking flow. For now it goes to a placeholder or next step */}
              <Link href={`${ROUTES.COURTS}/${court.id}/book`}>
                Đặt sân ngay
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </MainContainer>
  );
}
