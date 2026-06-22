"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { courtService } from "@/services/court.service";
import { MainContainer } from "@/components/layout/main-container";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function CourtsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["courts", searchTerm, page],
    queryFn: () => courtService.getCourts({ search: searchTerm, page, size: 9 }),
  });

  return (
    <MainContainer className="py-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Danh sách sân Pickleball</h1>
        <p className="text-muted-foreground">
          Khám phá và đặt ngay sân Pickleball phù hợp với bạn.
        </p>
      </div>

      <div className="mb-8 max-w-md">
        <Input
          type="search"
          placeholder="Tìm kiếm sân..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
          className="bg-background"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted" />
              <CardContent className="p-4 space-y-2">
                <div className="h-4 w-2/3 bg-muted rounded" />
                <div className="h-4 w-1/2 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">
          Có lỗi xảy ra khi tải danh sách sân.
        </div>
      ) : data?.content.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          Không tìm thấy sân nào.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data?.content.map((court) => (
            <Card key={court.id} className="overflow-hidden flex flex-col transition-colors hover:border-primary/50">
              <div className="aspect-video w-full overflow-hidden bg-muted relative">
                {court.imageUrl ? (
                  <img
                    src={court.imageUrl}
                    alt={court.name}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-secondary text-secondary-foreground">
                    Không có ảnh
                  </div>
                )}
                <div className="absolute top-2 right-2 rounded-full bg-background/90 px-2 py-1 text-xs font-semibold backdrop-blur-sm">
                  {court.status === "ACTIVE" ? (
                    <span className="text-green-600">Đang hoạt động</span>
                  ) : (
                    <span className="text-orange-600">Bảo trì</span>
                  )}
                </div>
              </div>
              
              <CardContent className="flex-1 p-4">
                <h3 className="text-lg font-semibold line-clamp-1">{court.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {court.description || "Chưa có mô tả."}
                </p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-primary">
                    {court.pricePerHour.toLocaleString("vi-VN")}đ
                  </span>
                  <span className="text-sm text-muted-foreground">/ giờ</span>
                </div>
              </CardContent>
              
              <CardFooter className="p-4 pt-0">
                <Button asChild className="w-full">
                  <Link href={`${ROUTES.COURTS}/${court.id}`}>Xem chi tiết</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Trước
          </Button>
          <div className="flex items-center px-4">
            Trang {page + 1} / {data.totalPages}
          </div>
          <Button
            variant="outline"
            disabled={data.last}
            onClick={() => setPage((p) => p + 1)}
          >
            Sau
          </Button>
        </div>
      )}
    </MainContainer>
  );
}
