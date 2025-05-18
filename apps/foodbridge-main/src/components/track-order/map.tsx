import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

interface Coordinates {
  lat: number;
  lng: number;
}

interface MapProps {
  coordinates: Coordinates[];
}

const Map: React.FC<MapProps> = ({ coordinates }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const routingControlRefs = useRef<L.Routing.Control[]>([]);

  useEffect(() => {
    if (!leafletMapRef.current && mapRef.current) {
      const defaultIcon = L.icon({
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      L.Marker.prototype.options.icon = defaultIcon;

      const map = L.map(mapRef.current).setView([15.2993, 74.124], 10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      leafletMapRef.current = map;
    }

    const map = leafletMapRef.current;
    if (!map) return;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Remove existing routing controls
    routingControlRefs.current.forEach((ctrl) => {
      map.removeControl(ctrl);
    });
    routingControlRefs.current = [];

    // Add new markers
    coordinates.forEach((coord, index) => {
      L.marker([coord.lat, coord.lng])
        .addTo(map)
        .bindPopup(`Location ${index + 1}`);
    });

    // Create routes between points
    if (coordinates.length >= 2) {
      for (let i = 0; i < coordinates.length - 1; i++) {
        const control = L.Routing.control({
          waypoints: [
            L.latLng(coordinates[i].lat, coordinates[i].lng),
            L.latLng(coordinates[i + 1].lat, coordinates[i + 1].lng),
          ],
          routeWhileDragging: false,
          showAlternatives: false,
          fitSelectedRoutes: false,
          addWaypoints: false,
          lineOptions: {
            styles: [
              {
                color: i % 2 === 0 ? '#6366F1' : '#4F46E5',
                opacity: 0.8,
                weight: 6,
              },
            ],
          },
          createMarker: () => null,
        } as unknown as L.Routing.RoutingControlOptions);

        control.addTo(map); // ✅ This line makes the route visible
        routingControlRefs.current.push(control);
      }
    }

    // Fit map to bounds
    if (coordinates.length > 0) {
      const bounds = L.latLngBounds(
        coordinates.map((coord) => L.latLng(coord.lat, coord.lng))
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    // Cleanup on unmount
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [coordinates]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.invalidateSize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div ref={mapRef} className="h-full w-full z-0" />;
};

export default Map;
