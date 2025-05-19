import React, { useEffect, useRef, useState, useContext } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { XIcon } from "@heroicons/react/solid";
import blueicon from "./images/marker-icon-2x-blue.png";
import redicon from "./images/marker-icon-2x-red (1).png";
import './Orders'

interface OrderTrackingModalProps {
  order_id: string;
  onClose: () => void;
}

interface Coordinates {
  orderCoordinates: {
    lat: number;
    lng: number;
  };
  geocodedCoords: {
    lat: number;
    lng: number;
  };
}

const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order_id,
  onClose,
}) => {
  const [coordinates, setCoordinates] = useState<Coordinates>({
    orderCoordinates: { lat: 15.4909, lng: 73.8278 },
    geocodedCoords: { lat: 15.5439, lng: 73.755 },
  });

const [orderData, setorderData] = useState<any>(null);

const blueIcon = new L.Icon({
  iconUrl: blueicon,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

  useEffect(() => {
    FetchCurrentOrder();
  }, []);

  const FetchCurrentOrder = async () => {
    try {
      const res = await fetch("/api/delivery/");
      const data = await res.json();
      setorderData(data);
    } catch (error:any) {
      console.error("Failed to fetch businesses:", error);
      // setError(error)
    } 
  };

  const redIcon = new L.Icon({
    iconUrl: redicon,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Start polling
    intervalRef.current = window.setInterval(() => {
      FetchCurrentOrder();
    }, 10000);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [order_id]);

  const closeFunction = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    onClose();
  };

  useEffect(() => {
    if (orderData?.current_location) {
      if (orderData.order_status === "accepted") {
        setCoordinates({
          orderCoordinates: {
            lat: Number(orderData.current_location.lat),
            lng: Number(orderData.current_location.lng),
          },
          geocodedCoords: {
            lat: Number(orderData.order.business.latitude),
            lng: Number(orderData.order.business.longitude),
          },
        });
      } else if (orderData.order_status === "in_transit") {
        setCoordinates({
          orderCoordinates: {
            lat: Number(orderData.current_location.lat),
            lng: Number(orderData.current_location.lng),
          },
          geocodedCoords: {
            lat: Number(orderData.order.address.lat),
            lng: Number(orderData.order.address.long),
          },
        });
      }
      else {
        setCoordinates({
          orderCoordinates: {
            lat: Number(orderData.order.business.latitude),
            lng: Number(orderData.order.business.longitude),
          },
          geocodedCoords: {
            lat: Number(orderData.order.address.lat),
            lng: Number(orderData.order.address.long),
          },
        });
      }
    }
    console.log(orderData)
  }, [orderData]);

  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMap = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (leafletMap.current) {
      leafletMap.current.remove(); // destroy previous map instance
    }

    // Initialize map
    console.log(coordinates);
    leafletMap.current = L.map(mapRef.current).setView(
      [coordinates.orderCoordinates.lat, coordinates.orderCoordinates.lng],
      13
    );

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(leafletMap.current);

    // Add routing control
    const routingControl = L.Routing.control({
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
        styles: [{ color: "blue", weight: 4 }],
        extendToWaypoints: true,
        missingRouteTolerance: 10,
      },
      createMarker: (i: number, waypoint: any) => {
        return L.marker(waypoint.latLng, {
          icon: i === 0 ? blueIcon : redIcon,
        }).bindPopup(i === 0 ? "Driver" : "Delivery Location");
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
  }, [coordinates]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 opacity-100"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative bg-white shadow-xl transition-transform duration-300 scale-100"
        style={{
          width: "90vw",
          height: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button
          onClick={closeFunction}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Close map"
        >
          <XIcon className="text-gray-700" />
        </button>
        <div
          ref={mapRef}
          style={{ width: "90%", height: "90%" }}
          className="ledger-container"
        />
      </div>
    </div>
  );
};

export default OrderTrackingModal;
