"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";

// Fix Leaflet icon issue
const carIcon = new L.Icon({
  iconUrl: "/car-icon.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const bikeIcon = new L.Icon({
  iconUrl: "/bike-icon.png",
  iconSize: [35, 35],
  iconAnchor: [17, 17],
});

export default function LiveMap({ telemetry }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const [center, setCenter] = useState([12.9716, 77.5946]);
  const [autoCenter, setAutoCenter] = useState(true);

  useEffect(() => {
    if (!telemetry?.gps) return;

    const lat = telemetry.gps.lat;
    const lng = telemetry.gps.lng;

    const newPos = [lat, lng];

    // move marker smoothly
    if (markerRef.current) {
      markerRef.current.setLatLng(newPos);
    }

    // auto-center map
    if (autoCenter && mapRef.current) {
      mapRef.current.setView(newPos, 16, { animate: true });
    }
  }, [telemetry]);

  const icon = telemetry?.vehicleType === "bike" ? bikeIcon : carIcon;

  return (
    <div className="mt-4">
      {/* Auto-Center Toggle */}
      <button
        onClick={() => setAutoCenter(!autoCenter)}
        className="mb-2 px-3 py-1 bg-blue-600 text-white rounded"
      >
        Auto-Center: {autoCenter ? "ON" : "OFF"}
      </button>

      <MapContainer
        center={center}
        zoom={16}
        scrollWheelZoom={true}
        style={{ height: "400px", width: "100%", borderRadius: "12px" }}
        whenCreated={(map) => {
          mapRef.current = map;
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker
          position={center}
          icon={icon}
          ref={markerRef}
          rotationAngle={telemetry?.heading || 0}
          rotationOrigin="center"
        >
          <Popup>
            <b>{telemetry?.vehicleId}</b>
            <br />
            Speed: {telemetry?.speed?.toFixed(1)} km/h
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
