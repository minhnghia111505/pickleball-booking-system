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
import { clubService } from "@/services/club.service";
import { Star, MapPin, Coffee, Car, Heart } from "lucide-react";
import { useFavoritesStore } from "@/stores/favorites.store";

export default function CourtsPage() {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [clubId, setClubId] = useState<number | undefined>();
  const [priceRange, setPriceRange] = useState<string>("all");
  const [sort, setSort] = useState<string>("id,asc");
  const [page, setPage] = useState(0);

  const { data: clubs } = useQuery({
    queryKey: ["clubs"],
    queryFn: () => clubService.getClubs({ size: 100 }),
  });

  const getPriceParams = () => {
    switch (priceRange) {
      case "under_100": return { maxPrice: 100000 };
      case "100_200": return { minPrice: 100000, maxPrice: 200000 };
      case "over_200": return { minPrice: 200000 };
      default: return {};
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["courts", searchTerm, clubId, priceRange, sort, page],
    queryFn: () =>
      courtService.getCourts({
        search: searchTerm,
        clubId,
        ...getPriceParams(),
        sort,
        page,
        size: 9,
      }),
  });

  return (
    <MainContainer className="py-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Danh sách sân Pickleball</h1>
        <p className="text-muted-foreground">
          Khám phá và đặt ngay sân Pickleball phù hợp với bạn.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <select
          className="bg-background border rounded-md px-3 py-2 text-sm w-full"
          value={clubId || ""}
          onChange={(e) => {
            setClubId(e.target.value ? Number(e.target.value) : undefined);
            setPage(0);
          }}
        >
          <option value="">Tất cả câu lạc bộ</option>
          {clubs?.content.map((c: any) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          className="bg-background border rounded-md px-3 py-2 text-sm w-full"
          value={priceRange}
          onChange={(e) => {
            setPriceRange(e.target.value);
            setPage(0);
          }}
        >
          <option value="all">Mọi mức giá</option>
          <option value="under_100">Dưới 100.000đ/h</option>
          <option value="100_200">100.000đ - 200.000đ/h</option>
          <option value="over_200">Trên 200.000đ/h</option>
        </select>

        <select
          className="bg-background border rounded-md px-3 py-2 text-sm w-full"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(0);
          }}
        >
          <option value="id,asc">Sắp xếp mặc định</option>
          <option value="pricePerHour,asc">Giá: Thấp đến Cao</option>
          <option value="pricePerHour,desc">Giá: Cao đến Thấp</option>
        </select>
      </div>

      {/* Results count */}
      {data && !isLoading && (
        <p className="text-sm text-slate-500 mb-5">
          Tìm thấy <span className="font-semibold text-slate-900 dark:text-white">{data.totalElements}</span> sân phù hợp
        </p>
      )}

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
          Không tìm thấy sân nào phù hợp với bộ lọc.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data?.content.map((court) => (
              <Card key={court.id} className="overflow-hidden flex flex-col transition-all hover:border-primary/50 hover:shadow-md">
                <div className="aspect-video w-full overflow-hidden bg-muted relative group">
                  {court.imageUrl ? (
                    <img
                      src={court.imageUrl}
                      alt={court.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-secondary text-secondary-foreground">
                      Không có ảnh
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(court);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm transition-transform hover:scale-110"
                      title={isFavorite(court.id) ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
                    >
                      <Heart
                        className={`h-4 w-4 transition-colors ${
                          isFavorite(court.id)
                            ? "fill-red-500 text-red-500"
                            : "text-slate-500"
                        }`}
                      />
                    </button>
                    <div className="rounded-full bg-background/90 px-2 py-1 text-xs font-semibold backdrop-blur-sm">
                      {court.status === "ACTIVE" ? (
                        <span className="text-green-600">Đang hoạt động</span>
                      ) : (
                        <span className="text-orange-600">Bảo trì</span>
                      )}
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    4.8 (120)
                  </div>
                </div>

                <CardContent className="flex-1 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold line-clamp-1 flex-1">{court.name}</h3>
                  </div>

                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3 line-clamp-1">
                    <MapPin className="h-3 w-3" /> {court.address}
                  </p>

                  <div className="flex items-center gap-3 text-muted-foreground mb-4">
                    <div className="flex items-center gap-1 text-xs" title="Bãi đỗ xe">
                      <Car className="h-4 w-4" />
                    </div>
                    <div className="flex items-center gap-1 text-xs" title="Canteen">
                      <Coffee className="h-4 w-4" />
                    </div>
                    <div className="flex items-center gap-1 text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                      Sân trong nhà
                    </div>
                  </div>

                  <div className="mt-auto flex items-baseline gap-1 border-t pt-4">
                    <span className="text-xl font-bold text-primary">
                      {court.pricePerHour.toLocaleString("vi-VN")}đ
                    </span>
                    <span className="text-sm text-muted-foreground">/ giờ</span>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <Button asChild className="w-full">
                    <Link href={`${ROUTES.COURTS}/${court.id}`}>Xem chi tiết & Đặt sân</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

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
              <div className="flex items-center px-4 font-medium">
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
        </>
      )}
    </MainContainer>
  );
}
