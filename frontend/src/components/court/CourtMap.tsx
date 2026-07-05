"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { Star, Clock } from "lucide-react";

// Fix leaflet icon bug trong webpack/Next.js
const fixLeafletIcon = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
};

// Custom icon tùy chỉnh màu xanh primary
const createCustomIcon = (price: string) =>
  L.divIcon({
    className: "",
    html: `
      <div style="
        background: #16a34a;
        color: white;
        border: 2px solid white;
        border-radius: 20px;
        padding: 4px 10px;
        font-size: 12px;
        font-weight: 700;
        white-space: nowrap;
        box-shadow: 0 2px 8px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        gap: 3px;
      ">
        ${price}
      </div>
    `,
    iconAnchor: [40, 20],
    popupAnchor: [0, -22],
  });

// Component cuộn bản đồ về trung tâm khi danh sách thay đổi
function FitBoundsToMarkers({ courts }: { courts: CourtForMap[] }) {
  const map = useMap();
  useEffect(() => {
    const valid = courts.filter((c) => c.latitude != null && c.longitude != null);
    if (valid.length > 0) {
      const bounds = L.latLngBounds(valid.map((c) => [c.latitude!, c.longitude!]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [courts, map]);
  return null;
}

export interface CourtForMap {
  id: number;
  name: string;
  address: string;
  pricePerHour: number;
  imageUrl?: string;
  latitude?: number | null;
  longitude?: number | null;
  status?: string;
}

interface CourtMapProps {
  courts: CourtForMap[];
}

export default function CourtMap({ courts }: CourtMapProps) {
  useEffect(() => {
    fixLeafletIcon();
  }, []);

  const validCourts = courts.filter((c) => c.latitude != null && c.longitude != null);

  // Trung tâm mặc định: Hà Nội
  const defaultCenter: [number, number] = [21.0285, 105.8542];
  const defaultZoom = 12;

  if (validCourts.length === 0) {
    return (
      <div className="flex h-[600px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/20">
        <div className="text-center">
          <p className="text-lg font-bold text-slate-900 dark:text-white">Chưa có tọa độ sân</p>
          <p className="mt-2 text-sm text-slate-500 max-w-xs mx-auto">
            Các câu lạc bộ chưa được cập nhật tọa độ GPS. Vui lòng chạy script SQL hoặc liên hệ quản trị viên.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: "600px", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBoundsToMarkers courts={validCourts} />

        {validCourts.map((court) => (
          <Marker
            key={court.id}
            position={[court.latitude!, court.longitude!]}
            icon={createCustomIcon(
              new Intl.NumberFormat("vi-VN", { notation: "compact" }).format(court.pricePerHour) + "đ/h"
            )}
          >
            <Popup minWidth={220} maxWidth={280}>
              <div className="font-sans p-1">
                {court.imageUrl && (
                  <img
                    src={court.imageUrl}
                    alt={court.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                )}
                <h3 className="font-bold text-slate-900 text-sm leading-tight mb-1">{court.name}</h3>
                <p className="text-xs text-slate-500 mb-2 leading-snug">{court.address}</p>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>4.8</span>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      court.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {court.status === "ACTIVE" ? "Đang hoạt động" : "Bảo trì"}
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mb-3 border-t pt-2">
                  <span className="text-base font-extrabold text-green-600">
                    {new Intl.NumberFormat("vi-VN").format(court.pricePerHour)}đ
                  </span>
                  <span className="text-xs text-slate-500">/ giờ</span>
                </div>
                <Link
                  href={`${ROUTES.COURTS}/${court.id}`}
                  className="block w-full text-center bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                >
                  Xem chi tiết & Đặt sân →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
