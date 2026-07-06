"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";

const fixLeafletIcon = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
};

const createPricePin = (price: string, selected: boolean) =>
  L.divIcon({
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 36],
    html: `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));
        transform: ${selected ? "scale(1.2) translateY(-4px)" : "scale(1)"};
        transition: all 0.2s;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 64 64">
          <g transform="rotate(35 32 32)">
            <rect x="28" y="42" width="8" height="20" rx="2" fill="#1f2937" />
            <path d="M 28 46 L 36 44 M 28 51 L 36 49 M 28 56 L 36 54" stroke="#374151" stroke-width="2" />
            <rect x="16" y="4" width="32" height="40" rx="14" fill="#111827" />
            <rect x="18" y="6" width="28" height="36" rx="12" fill="${selected ? '#dc2626' : '#16a34a'}" />
            <circle cx="32" cy="24" r="8" fill="${selected ? '#b91c1c' : '#15803d'}" />
            <circle cx="32" cy="24" r="5" fill="${selected ? '#991b1b' : '#166534'}" />
          </g>
          <circle cx="14" cy="48" r="8" fill="#a3e635" stroke="#111827" stroke-width="1.5" />
          <circle cx="11" cy="45" r="1.5" fill="#3f6212"/>
          <circle cx="16" cy="46" r="1.5" fill="#3f6212"/>
          <circle cx="13.5" cy="49" r="1.5" fill="#3f6212"/>
          <circle cx="10" cy="49" r="1" fill="#3f6212"/>
          <circle cx="16.5" cy="50" r="1" fill="#3f6212"/>
        </svg>
      </div>
    `,
  });

function FitBounds({ courts }: { courts: CourtMapPoint[] }) {
  const map = useMap();
  const fitted = useRef(false);
  useEffect(() => {
    if (fitted.current) return;
    const valid = courts.filter((c) => c.latitude != null && c.longitude != null);
    if (valid.length > 0) {
      const bounds = L.latLngBounds(valid.map((c) => [c.latitude!, c.longitude!]));
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
      fitted.current = true;
    }
  }, [courts, map]);
  return null;
}

function PanToSelected({ court }: { court: CourtMapPoint | null }) {
  const map = useMap();
  useEffect(() => {
    if (court?.latitude && court?.longitude) {
      map.panTo([court.latitude, court.longitude], { animate: true });
    }
  }, [court, map]);
  return null;
}

function LocateControl() {
  const map = useMap();
  const [loading, setLoading] = useState(false);

  const handleLocate = () => {
    setLoading(true);
    map.locate({ setView: true, maxZoom: 14 });
    map.once("locationfound", (e) => {
      setLoading(false);
      // Tạo marker vị trí hiện tại
      const userIcon = L.divIcon({
        className: "",
        html: `<div style="width: 20px; height: 20px; background-color: #3b82f6; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
      L.marker(e.latlng, { icon: userIcon }).addTo(map).bindPopup("Bạn đang ở đây!").openPopup();
    });
    map.once("locationerror", () => {
      setLoading(false);
      alert("Không thể lấy vị trí của bạn. Vui lòng kiểm tra quyền truy cập vị trí trên trình duyệt.");
    });
  };

  return (
    <div className="leaflet-bottom leaflet-right" style={{ bottom: '60px', right: '10px' }}>
      <div className="leaflet-control leaflet-bar shadow-md">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleLocate();
          }}
          title="Vị trí của tôi"
          className="flex h-10 w-10 items-center justify-center bg-white hover:bg-slate-50 transition-colors"
          style={{ border: 'none', cursor: 'pointer', fontSize: '20px' }}
        >
          {loading ? "⏳" : "📍"}
        </button>
      </div>
    </div>
  );
}

export interface CourtMapPoint {
  id: number;
  name: string;
  address?: string;
  pricePerHour: number;
  imageUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status?: string;
  rating?: number | null;
  reviewsCount?: number | null;
  googleMapUrl?: string | null;
}

interface CourtMapPanelProps {
  courts: CourtMapPoint[];
  selectedCourt: CourtMapPoint | null;
  onCourtSelect: (court: CourtMapPoint) => void;
}

export default function CourtMapPanel({ courts, selectedCourt, onCourtSelect }: CourtMapPanelProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    fixLeafletIcon();
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const valid = courts.filter((c) => c.latitude != null && c.longitude != null);

  if (!isMounted) {
    return <div style={{ height: "100%", width: "100%", backgroundColor: "#f1f5f9" }} />;
  }

  return (
    <MapContainer
      center={[21.0285, 105.8542]}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocateControl />
      <FitBounds courts={valid} />
      <PanToSelected court={selectedCourt} />

      {valid.map((court) => (
        <Marker
          key={court.id}
          position={[court.latitude!, court.longitude!]}
          icon={createPricePin(
            new Intl.NumberFormat("vi-VN", { notation: "compact" }).format(court.pricePerHour) + "đ/h",
            selectedCourt?.id === court.id
          )}
          eventHandlers={{ click: () => onCourtSelect(court) }}
        />
      ))}
    </MapContainer>
  );
}
