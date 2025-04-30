"use client";

import React, { useRef, useEffect, useState } from "react";
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
  onClose: () => void;
}

export default function MapComponent({
  orderCoordinates,
  geocodedCoords,
  onClose,
}: CoOrdinates) {
  const mapRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const routingControl = useRef<L.Routing.Control | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const COST_PER_KM = 10; // ₹10 per km

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if (!mapRef.current || !orderCoordinates) return;

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, {
        center: [orderCoordinates.lat, orderCoordinates.lng],
        zoom: 15,
        zoomControl: false,
        dragging: true,
        scrollWheelZoom: true,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapInstance.current);
    }

    if (mapInstance.current) {
      const orderIcon = L.icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      const geoIcon = L.icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      L.marker([orderCoordinates.lat, orderCoordinates.lng], {
        icon: orderIcon,
      })
        .addTo(mapInstance.current)
        .bindPopup("Provided Coordinates");

      if (geocodedCoords) {
        L.marker([geocodedCoords.lat, geocodedCoords.lng], { icon: geoIcon })
          .addTo(mapInstance.current)
          .bindPopup("Geocoded Location");

        // Remove existing route if any
        if (routingControl.current) {
          mapInstance.current.removeControl(routingControl.current);
        }

        // Add new route

        routingControl.current = L.Routing.control({
          waypoints: [
            L.latLng(orderCoordinates.lat, orderCoordinates.lng),
            L.latLng(geocodedCoords.lat, geocodedCoords.lng),
          ],
          routeWhileDragging: false,
          addWaypoints: false, // Prevent user interaction
          fitSelectedRoutes: true, // Ensure the route fits in view
          show: false, // Hide route details
          lineOptions: {
            styles: [{ color: "blue", weight: 2 }],
            extendToWaypoints: true,
            missingRouteTolerance: 10,
          },
        }).addTo(mapInstance.current);

        routingControl.current.on("routesfound", function (e: any) {
          const route = e.routes[0];
          const distanceKm = route.summary.totalDistance / 1000;
          setDistance(distanceKm);
        });

        // Remove the unwanted control panel from the DOM
        const routingContainer = document.querySelector(
          ".leaflet-routing-container"
        );
        if (routingContainer) {
          routingContainer.remove();
        }
      }
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [orderCoordinates, geocodedCoords]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className="w-1/2 h-fit rounded-lg overflow-hidden mt-4 p-10 bg-white "
        ref={modalRef}
      >
        <div ref={mapRef} className="w-[40vw] h-96"></div>
        {distance !== null && (
          <div className="mt-2">
            <p>
              <strong>Distance:</strong> {distance.toFixed(2)} km
            </p>
            <p>
              <strong>Delivery Cost:</strong> ₹
              {(distance * COST_PER_KM).toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
