"use client";

import { useEffect, useState } from "react";
import { MainContainer } from "@/components/layout/main-container";
import { useFavoritesStore } from "@/stores/favorites.store";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth.store";
import { HeartCrack, Heart, MapPin, Star } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";

export default function FavoritesPage() {
  const { favorites, syncFavorites, removeFavorite } = useFavoritesStore();
  const { user } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (user) {
      syncFavorites();
    }
  }, [user]);

  if (!isMounted) return null;

  return (
    <MainContainer className="py-12 min-h-[calc(100vh-4rem)]">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sân Yêu Thích</h1>
          <p className="text-muted-foreground mt-2">
            {user 
              ? `Bạn đang có ${favorites.length} sân trong danh sách yêu thích.`
              : "Các sân bạn đã thả tim trên thiết bị này. Đăng nhập để lưu vĩnh viễn!"}
          </p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-2xl bg-slate-50 dark:bg-slate-900/50">
          <HeartCrack className="h-16 w-16 text-slate-300 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Bạn chưa có sân yêu thích nào</h2>
          <p className="text-muted-foreground max-w-md mb-6">
            Hãy quay lại trang Danh sách sân hoặc Bản đồ để khám phá và lưu lại những sân bạn ưng ý nhất nhé.
          </p>
          <div className="flex gap-4">
            <Button asChild>
              <Link href={ROUTES.COURTS}>Tìm sân ngay</Link>
            </Button>
            {!user && (
              <Button asChild variant="outline">
                <Link href={ROUTES.LOGIN}>Đăng nhập</Link>
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((court) => (
            <Card
              key={court.id}
              className="overflow-hidden flex flex-col transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div className="aspect-video w-full overflow-hidden bg-muted relative group">
                <Link href={`${ROUTES.COURTS}/${court.id}`} className="block h-full w-full">
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
                </Link>
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
                <Link href={`${ROUTES.COURTS}/${court.id}`} className="hover:underline">
                  <h3 className="text-lg font-semibold line-clamp-1 mb-2 text-slate-900 dark:text-white">{court.name}</h3>
                </Link>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mb-4 line-clamp-1">
                  <MapPin className="h-3 w-3 shrink-0" /> {court.address}
                </p>
                <div className="flex items-baseline gap-1 border-t pt-4">
                  <span className="text-xl font-bold text-primary">
                    {court.pricePerHour.toLocaleString()}đ
                  </span>
                  <span className="text-sm text-muted-foreground">/giờ</span>
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
      )}
    </MainContainer>
  );
}
