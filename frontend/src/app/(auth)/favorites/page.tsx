"use client";

import Link from "next/link";
import { MainContainer } from "@/components/layout/main-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { useFavoritesStore } from "@/stores/favorites.store";
import { Heart, MapPin, Star, Trash2 } from "lucide-react";

export default function FavoritesPage() {
  const { favorites, removeFavorite, clearFavorites } = useFavoritesStore();

  return (
    <MainContainer className="py-12">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-7 w-7 fill-red-500 text-red-500" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Sân yêu thích
            </h1>
          </div>
          <p className="text-slate-500">
            {favorites.length > 0
              ? `Bạn đang có ${favorites.length} sân trong danh sách yêu thích.`
              : "Chưa có sân nào trong danh sách yêu thích."}
          </p>
        </div>
        {favorites.length > 0 && (
          <Button
            variant="outline"
            className="text-red-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 self-start sm:self-auto"
            onClick={() => {
              if (confirm("Bạn có chắc muốn xóa tất cả yêu thích không?")) {
                clearFavorites();
              }
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Xóa tất cả
          </Button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 py-24 text-center dark:border-slate-800 dark:bg-slate-900/20">
          <Heart className="mx-auto h-14 w-14 text-slate-200 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Chưa có sân yêu thích nào
          </h3>
          <p className="mt-2 text-slate-500 max-w-sm mx-auto">
            Bấm vào biểu tượng ❤️ trên thẻ sân để thêm vào danh sách yêu thích của bạn.
          </p>
          <div className="mt-8">
            <Button asChild>
              <Link href={ROUTES.COURTS}>Khám phá sân Pickleball</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((court) => (
            <Card
              key={court.id}
              className="overflow-hidden flex flex-col transition-all hover:border-primary/50 hover:shadow-md"
            >
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
                {/* Remove from favorites button */}
                <button
                  onClick={() => removeFavorite(court.id)}
                  className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm transition-transform hover:scale-110"
                  title="Bỏ yêu thích"
                >
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                </button>
                <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  4.8 (120)
                </div>
              </div>

              <CardContent className="flex-1 p-4">
                <h3 className="text-lg font-semibold line-clamp-1 mb-2">{court.name}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mb-4 line-clamp-1">
                  <MapPin className="h-3 w-3 shrink-0" /> {court.address}
                </p>
                <div className="flex items-baseline gap-1 border-t pt-4">
                  <span className="text-xl font-bold text-primary">
                    {Number(court.pricePerHour).toLocaleString("vi-VN")}đ
                  </span>
                  <span className="text-sm text-muted-foreground">/ giờ</span>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button asChild className="w-full">
                  <Link href={`${ROUTES.COURTS}/${court.id}`}>
                    Xem chi tiết & Đặt sân
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </MainContainer>
  );
}
