"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LivemapProps {
  location: {
    latitude: number;
    longitude: number;
  };
  deliverylocation: {
    latitude: number;
    longitude: number;
  } | null;
}

export default function Livemap({
  location,
  deliverylocation,
}: LivemapProps) {
  const deliveryboyicon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/9561/9561839.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  const usericon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/4821/4821951.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  const center = deliverylocation
    ? [deliverylocation.latitude, deliverylocation.longitude]
    : [location.latitude, location.longitude];

  return (
    <MapContainer
      center={center as [number, number]}
      zoom={15}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Customer Home */}
      <Marker
        position={[location.latitude, location.longitude]}
        icon={usericon}
      >
        <Popup>Customer Location</Popup>
      </Marker>

      {/* Delivery Boy */}
      {deliverylocation && (
        <>
          <Marker
            position={[
              deliverylocation.latitude,
              deliverylocation.longitude,
            ]}
            icon={deliveryboyicon}
          >
            <Popup>Delivery Boy</Popup>
          </Marker>

          <Polyline
            positions={[
              [deliverylocation.latitude, deliverylocation.longitude],
              [location.latitude, location.longitude],
            ]}
          />
        </>
      )}
    </MapContainer>
  );
}