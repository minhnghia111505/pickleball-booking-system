"use client";

import { useEffect, useRef } from "react";
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
    html: `
      <div style="
        background: ${selected ? "#dc2626" : "#16a34a"};
        color: white;
        border: 2.5px solid white;
        border-radius: 20px;
        padding: 5px 11px;
        font-size: 12px;
        font-weight: 700;
        white-space: nowrap;
        box-shadow: ${selected ? "0 4px 16px rgba(220,38,38,0.5)" : "0 2px 8px rgba(0,0,0,0.3)"};
        transform: ${selected ? "scale(1.15)" : "scale(1)"};
        transition: all 0.2s;
      ">${price}</div>
    `,
    iconAnchor: [40, 20],
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

export interface CourtMapPoint {
  id: number;
  name: string;
  address?: string;
  pricePerHour: number;
  imageUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status?: string;
}

interface CourtMapPanelProps {
  courts: CourtMapPoint[];
  selectedCourt: CourtMapPoint | null;
  onCourtSelect: (court: CourtMapPoint) => void;
}

export default function CourtMapPanel({ courts, selectedCourt, onCourtSelect }: CourtMapPanelProps) {
  useEffect(() => {
    fixLeafletIcon();
  }, []);

  const valid = courts.filter((c) => c.latitude != null && c.longitude != null);

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
