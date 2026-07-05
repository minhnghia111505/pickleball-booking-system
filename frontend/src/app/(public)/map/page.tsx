"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { courtService } from "@/services/court.service";
import { ROUTES } from "@/constants/routes";
import { useFavoritesStore } from "@/stores/favorites.store";
import {
  MapPin,
  Search,
  Star,
  Heart,
  ChevronLeft,
  ExternalLink,
  X,
  Clock,
  Activity,
} from "lucide-react";
import type { CourtMapPoint } from "@/components/court/CourtMap";

const CourtMapPanel = dynamic(() => import("@/components/court/CourtMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-100">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-500 border-r-transparent" />
        <p className="text-sm text-slate-500">Đang tải bản đồ...</p>
      </div>
    </div>
  ),
});

export default function MapPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourt, setSelectedCourt] = useState<CourtMapPoint | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { isFavorite, toggleFavorite } = useFavoritesStore();

  const { data, isLoading } = useQuery({
    queryKey: ["courts-map-full"],
    queryFn: () => courtService.getCourts({ size: 100 }),
  });

  const allCourts: CourtMapPoint[] = (data?.content ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    address: c.address,
    pricePerHour: Number(c.pricePerHour),
    imageUrl: c.imageUrl,
    latitude: (c as any).latitude,
    longitude: (c as any).longitude,
    status: String(c.status),
  }));

  const filteredCourts = allCourts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.address ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCourt = (court: CourtMapPoint) => {
    setSelectedCourt(court);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50">
      {/* ===== PANEL TRÁI ===== */}
      <div className="flex w-[380px] shrink-0 flex-col border-r border-slate-200 bg-white shadow-md">

        {/* Header Panel */}
        <div className="border-b border-slate-100 p-4">
          <h1 className="mb-3 text-lg font-extrabold text-slate-900">
            🗺️ Bản đồ Sân Pickleball
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sân..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>

        {/* ===== DETAIL VIEW khi chọn 1 sân ===== */}
        {selectedCourt ? (
          <div className="flex flex-1 flex-col overflow-y-auto">
            {/* Back button */}
            <button
              onClick={() => setSelectedCourt(null)}
              className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Quay lại danh sách
            </button>

            {/* Court image */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-200">
              {selectedCourt.imageUrl ? (
                <img
                  src={selectedCourt.imageUrl}
                  alt={selectedCourt.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400 text-sm">
                  Không có ảnh
                </div>
              )}
              {/* Favorite button */}
              <button
                onClick={() => toggleFavorite(selectedCourt as any)}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow backdrop-blur-sm hover:scale-110 transition-transform"
              >
                <Heart
                  className={`h-5 w-5 ${
                    isFavorite(selectedCourt.id)
                      ? "fill-red-500 text-red-500"
                      : "text-slate-400"
                  }`}
                />
              </button>
              {/* Status badge */}
              <div className="absolute left-3 bottom-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    selectedCourt.status === "ACTIVE"
                      ? "bg-green-500 text-white"
                      : "bg-orange-500 text-white"
                  }`}
                >
                  {selectedCourt.status === "ACTIVE" ? "Đang hoạt động" : "Bảo trì"}
                </span>
              </div>
            </div>

            {/* Court info */}
            <div className="flex-1 p-5 space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 leading-snug">
                  {selectedCourt.name}
                </h2>
                {/* Mock rating */}
                <div className="mt-1.5 flex items-center gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <Star className="h-4 w-4 fill-yellow-200 text-yellow-400" />
                  <span className="ml-1 text-sm text-slate-500">4.8 (120 đánh giá)</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5 text-sm text-slate-600">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>{selectedCourt.address || "Chưa có địa chỉ"}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-600">
                  <Clock className="h-4 w-4 shrink-0 text-green-500" />
                  <span>06:00 – 22:00</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-600">
                  <Activity className="h-4 w-4 shrink-0 text-green-500" />
                  <span>Sân Pickleball tiêu chuẩn</span>
                </div>
              </div>

              {/* Price */}
              <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 flex items-baseline gap-1">
                <span className="text-2xl font-black text-green-600">
                  {Number(selectedCourt.pricePerHour).toLocaleString("vi-VN")}đ
                </span>
                <span className="text-sm text-green-700 font-medium">/ giờ</span>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col gap-2.5 pt-1">
                <Link
                  href={`${ROUTES.COURTS}/${selectedCourt.id}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 text-sm font-bold text-white hover:bg-green-600 transition-colors"
                >
                  Xem chi tiết & Đặt sân
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => toggleFavorite(selectedCourt as any)}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                    isFavorite(selectedCourt.id)
                      ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${isFavorite(selectedCourt.id) ? "fill-red-500" : ""}`}
                  />
                  {isFavorite(selectedCourt.id) ? "Bỏ yêu thích" : "Thêm yêu thích"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ===== LIST VIEW ===== */
          <div ref={listRef} className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {isLoading ? (
              <div className="flex justify-center py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-r-transparent" />
              </div>
            ) : filteredCourts.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                Không tìm thấy sân phù hợp
              </div>
            ) : (
              filteredCourts.map((court) => (
                <button
                  key={court.id}
                  onClick={() => handleSelectCourt(court)}
                  className={`flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-green-50 transition-colors ${
                    selectedCourt?.id === court.id ? "bg-green-50 border-l-4 border-l-green-500" : ""
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-200">
                    {court.imageUrl ? (
                      <img
                        src={court.imageUrl}
                        alt={court.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-300 text-xs">
                        🏟️
                      </div>
                    )}
                  </div>

                  {/* Text info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 line-clamp-1">{court.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500 line-clamp-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {court.address || "Chưa có địa chỉ"}
                    </p>
                    <p className="mt-1 text-xs font-bold text-green-600">
                      {Number(court.pricePerHour).toLocaleString("vi-VN")}đ/h
                    </p>
                  </div>

                  {/* Arrow */}
                  <ChevronLeft className="h-4 w-4 rotate-180 shrink-0 text-slate-300" />
                </button>
              ))
            )}
          </div>
        )}

        {/* Footer count */}
        {!selectedCourt && (
          <div className="border-t border-slate-100 px-4 py-2.5 text-xs text-slate-400">
            {filteredCourts.length} sân được tìm thấy
          </div>
        )}
      </div>

      {/* ===== PANEL PHẢI: BẢN ĐỒ ===== */}
      <div className="relative flex-1">
        {/* Close button khi đang chọn sân */}
        {selectedCourt && (
          <button
            onClick={() => setSelectedCourt(null)}
            className="absolute right-4 top-4 z-[1000] flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md hover:bg-slate-50"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        )}

        <CourtMapPanel
          courts={allCourts}
          selectedCourt={selectedCourt}
          onCourtSelect={handleSelectCourt}
        />
      </div>
    </div>
  );
}
