"use client";

import { LatLngExpression } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

type Props = {
  position: [number, number] | null;
};

function Mapview({ position }: Props) {
  if (!position) {
    return <div className="h-64 flex items-center justify-center">Loading map...</div>;
  }

  return (
    <div className="h-64 w-full rounded-xl overflow-hidden">
      <MapContainer
        center={position as LatLngExpression}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={position}>
          <Popup>Your selected location 📍</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default Mapview;