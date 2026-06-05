"use client";

import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { useEffect } from "react";
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

function RecenterMap({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView([latitude, longitude], map.getZoom(), {
      animate: true,
    });
  }, [latitude, longitude, map]);

  return null;
}

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

export default function Livemap({
  location,
  deliverylocation,
}: LivemapProps) {
  const center = deliverylocation
    ? [deliverylocation.latitude, deliverylocation.longitude]
    : [location.latitude, location.longitude];

  return (
    <MapContainer
      center={center as [number, number]}
      zoom={15}
      style={{ height: "500px", width: "100%" }}
    >
      <RecenterMap latitude={center[0]} longitude={center[1]} />

      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker
        position={[location.latitude, location.longitude]}
        icon={usericon}
        key={`customer-${location.latitude}-${location.longitude}`}
      >
        <Popup>Customer Location</Popup>
      </Marker>

      {deliverylocation && (
        <>
          <Marker
            position={[deliverylocation.latitude, deliverylocation.longitude]}
            icon={deliveryboyicon}
            key={`delivery-${deliverylocation.latitude}-${deliverylocation.longitude}`}
          >
            <Popup>Delivery Boy</Popup>
          </Marker>

          <Polyline
            key={`route-${deliverylocation.latitude}-${deliverylocation.longitude}-${location.latitude}-${location.longitude}`}
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
