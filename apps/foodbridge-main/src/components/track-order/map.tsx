// components/MapWithRoute.tsx
"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

interface CoOrdinates {
  orderCoordinates: {
    lat: number;
    lng: number;
  };
  geocodedCoords: {
    lat: number;
    lng: number;
  };
}

export default function MapWithRoute({
  orderCoordinates,
  geocodedCoords,
}: CoOrdinates) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMap = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (leafletMap.current) {
      leafletMap.current.remove(); // destroy previous map instance
    }

    // Initialize map
    leafletMap.current = L.map(mapRef.current).setView(
      [orderCoordinates.lat, orderCoordinates.lng],
      13
    );

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(leafletMap.current);

    // Add routing control
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(orderCoordinates.lat, orderCoordinates.lng),
        L.latLng(geocodedCoords.lat, geocodedCoords.lng),
      ],
      lineOptions: {
        styles: [{ color: "blue", weight: 4 }],
        extendToWaypoints: true,
        missingRouteTolerance: 10,
      },
      createMarker: (i: any, waypoint: any) => {
        return L.marker(waypoint.latLng).bindPopup(
          i === 0 ? "Driver" : "Delivery Location"
        );
      },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
    } as any); // cast as 'any' to suppress TS error

    routingControl.addTo(leafletMap.current);

    // Cleanup on unmount
    return () => {
      leafletMap.current?.remove();
    };
  }, [orderCoordinates, geocodedCoords]);

  return (
    <div
      ref={mapRef}
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    />
  );
}
