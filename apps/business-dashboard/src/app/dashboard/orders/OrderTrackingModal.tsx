import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { XIcon } from "@heroicons/react/solid";
import blueicon from "./images/marker-icon-2x-blue.png";
import redicon from "./images/marker-icon-2x-red (1).png";

interface OrderTrackingModalProps {
  order_id: string;
  onClose: () => void;
}

interface Coordinates {
  orderCoordinates: { lat: number; lng: number };
  geocodedCoords: { lat: number; lng: number };
}

const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order_id,
  onClose,
}) => {
  const [coordinates, setCoordinates] = useState<Coordinates>({
    orderCoordinates: { lat: 15.4909, lng: 73.8278 },
    geocodedCoords: { lat: 15.5439, lng: 73.755 },
  });

  const [orderData, setOrderData] = useState<any>(null);

  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const intervalRef = useRef<number | null>(null);

  const blueIcon = new L.Icon({
    iconUrl: blueicon,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const redIcon = new L.Icon({
    iconUrl: redicon,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  useEffect(() => {
    fetchCurrentOrder();
  }, []);

  useEffect(() => {
    intervalRef.current = window.setInterval(fetchCurrentOrder, 10000);
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, [order_id]);

  const fetchCurrentOrder = async () => {
    try {
      const res = await fetch(`/api/order/${order_id}`);
      const data = await res.json();
      setOrderData(data);
    } catch (err) {
      console.error("Error fetching order:", err);
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // Fix: fully clean up existing map instance
    if (leafletMap.current) {
      leafletMap.current.off(); // remove listeners
      leafletMap.current.remove(); // destroy map
      leafletMap.current = null; // clear ref
    }

    leafletMap.current = L.map(mapRef.current).setView(
      [coordinates.orderCoordinates.lat, coordinates.orderCoordinates.lng],
      13
    );

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(leafletMap.current);

    // Add routing control
    L.Routing.control({
      waypoints: [
        L.latLng(
          coordinates.orderCoordinates.lat,
          coordinates.orderCoordinates.lng
        ),
        L.latLng(
          coordinates.geocodedCoords.lat,
          coordinates.geocodedCoords.lng
        ),
      ],
      lineOptions: {
        styles: [{ color: "#22c55e", weight: 4 }],
      },
      createMarker: (i, wp) =>
        L.marker(wp.latLng, {
          icon: i === 0 ? blueIcon : redIcon,
        }).bindPopup(i === 0 ? "Driver Location" : "Destination"),
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
    } as any).addTo(leafletMap.current);

    return () => {
      if (leafletMap.current) {
        leafletMap.current.off();
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, [coordinates]);

  const handleClose = () => {
    if (intervalRef.current !== null) clearInterval(intervalRef.current);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-white rounded-xl shadow-2xl border border-green-100 w-[92vw] h-[88vh] flex items-center justify-center transition-transform duration-300">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400"
          aria-label="Close map"
        >
          <XIcon className="w-5 h-5 text-gray-700" />
        </button>

        <div
          ref={mapRef}
          className="w-[95%] h-[90%] rounded-md border border-green-200 shadow-inner"
        />
      </div>
    </div>
  );
};

export default OrderTrackingModal;
