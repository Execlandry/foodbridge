"use client";

import React, { useRef, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import redicon from "./images/marker-icon-2x-red (1).png"
import blueicon from "./images/marker-icon-2x-blue.png"


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
        iconUrl: redicon,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      const geoIcon = L.icon({
        iconUrl: blueicon,
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

        if (routingControl.current) {
          mapInstance.current.removeControl(routingControl.current);
        }

        routingControl.current = L.Routing.control({
          waypoints: [
            L.latLng(orderCoordinates.lat, orderCoordinates.lng),
            L.latLng(geocodedCoords.lat, geocodedCoords.lng),
          ],
          router: L.Routing.osrmv1({
            serviceUrl: "https://router.project-osrm.org/route/v1",
            profile: "car",
          }),
          routeWhileDragging: false,
          addWaypoints: false,
          fitSelectedRoutes: true,
          show: false,
          lineOptions: {
            styles: [{ color: "blue", weight: 2 }],
            extendToWaypoints: true,
            missingRouteTolerance: 10,
          },
        }).addTo(mapInstance.current);

        // Remove the routing control panel from the DOM
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
        className="w-1/2 h-fit rounded-lg overflow-hidden mt-4 p-10 bg-white"
        ref={modalRef}
      >
        <div ref={mapRef} className="w-[40vw] h-96"></div>
      </div>
    </div>
  );
}
