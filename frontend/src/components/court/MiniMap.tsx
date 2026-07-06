"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
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

const customIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 6px 12px rgba(0,0,0,0.5));
      transform: translateY(-8px);
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 64 64">
        <g transform="rotate(35 32 32)">
          <rect x="28" y="42" width="8" height="20" rx="2" fill="#1f2937" />
          <path d="M 28 46 L 36 44 M 28 51 L 36 49 M 28 56 L 36 54" stroke="#374151" stroke-width="2" />
          <rect x="16" y="4" width="32" height="40" rx="14" fill="#111827" />
          <rect x="18" y="6" width="28" height="36" rx="12" fill="#e11d48" />
          <circle cx="32" cy="24" r="8" fill="#be123c" />
          <circle cx="32" cy="24" r="5" fill="#9f1239" />
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
  iconSize: [56, 56],
  iconAnchor: [28, 48],
});

export default function MiniMap({ lat, lng }: { lat: number; lng: number }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    fixLeafletIcon();
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) {
    return <div style={{ height: "100%", width: "100%", backgroundColor: "#f1f5f9" }} />;
  }

  return (
    <MapContainer
      key={`${lat}-${lng}`}
      center={[lat, lng]}
      zoom={15}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={customIcon} />
    </MapContainer>
  );
}
