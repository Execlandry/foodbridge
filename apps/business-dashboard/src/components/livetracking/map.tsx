import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

interface MapProps {
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
}

const MapComponent: React.FC<MapProps> = ({ start, end }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const routingControl = useRef<L.Routing.Control | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Cleanup existing map instance before creating a new one
    if (mapInstance.current) {
      mapInstance.current = null;
    }

    // Initialize map
    mapInstance.current = L.map(mapRef.current).setView([start.lat, start.lng], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapInstance.current);

    // Add Start Marker
    L.marker([start.lat, start.lng], {
      icon: L.icon({ 
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png', 
        iconSize: [25, 41] 
      })
    }).addTo(mapInstance.current);

    // Add End Marker
    L.marker([end.lat, end.lng], {
      icon: L.icon({ 
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png', 
        iconSize: [25, 41] 
      })
    }).addTo(mapInstance.current);

    // Remove previous routing control if exists
    if (routingControl.current) {
      try {
        mapInstance.current.removeControl(routingControl.current);
      } catch (error) {
        console.warn('Error removing routing control:', error);
      }
      routingControl.current = null;
    }

    // Add Routing Control without Itinerary
    routingControl.current = L.Routing.control({
      waypoints: [L.latLng(start.lat, start.lng), L.latLng(end.lat, end.lng)],
      routeWhileDragging: true,
      addWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
      // createMarker: () => null, // Prevent default markers
      
      lineOptions: { 
        styles: [{ color: 'blue', weight: 4 }],
        extendToWaypoints: true, 
        missingRouteTolerance: 10 
      }
      

    }).addTo(mapInstance.current);

    // Ensure the directions panel is hidden
    setTimeout(() => {
      document.querySelector('.leaflet-routing-container')?.remove();
    }, 100);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [start, end]);

  return (
    <div 
      ref={mapRef} 
      style={{ height: '500px', width: '100%', marginTop: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }} 
    />
  );
};

export default MapComponent;
