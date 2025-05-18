import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';


// Fix for Leaflet default marker icons

interface Coordinates{
  lat:number,
  lng:number
}


interface MapProps {
  coordinates: Coordinates[];
}

const Map: React.FC<MapProps> = ({ coordinates }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Only initialize the map if it hasn't been initialized yet
    if (!leafletMapRef.current && mapRef.current) {
      // Fix Leaflet's default icon issue
      const defaultIcon = L.icon({
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      
      L.Marker.prototype.options.icon = defaultIcon;

      // Create map
      const map = L.map(mapRef.current).setView([51.505, -0.09], 13);
      
      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      leafletMapRef.current = map;
    }

    // Update map with new coordinates
    if (leafletMapRef.current && coordinates.length > 0) {
      const map = leafletMapRef.current;
      
      // Clear existing layers
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Routing.Control) {
          map.removeLayer(layer);
        }
      });

      // Add markers for each coordinate
      coordinates.forEach((coord, index) => {
        const marker = L.marker([coord.lat, coord.lng])
          .addTo(map)
          .bindPopup(`Location ${index + 1}`);
      });

      // Create two separate routes if we have all three coordinates
      if (coordinates.length >= 3) {
        // First route: Location 1 to Location 2
        L.Routing.control({
          waypoints: [
            L.latLng(coordinates[0].lat, coordinates[0].lng),
            L.latLng(coordinates[1].lat, coordinates[1].lng)
          ],
          routeWhileDragging: false,
          showAlternatives: false,
          fitSelectedRoutes: true,
          lineOptions: {
            styles: [
              { color: '#6366F1', opacity: 0.8, weight: 6 }
            ]
          },
          createMarker: () => null // Don't create additional markers
        }).addTo(map);

        // Second route: Location 2 to Location 3
        L.Routing.control({
          waypoints: [
            L.latLng(coordinates[1].lat, coordinates[1].lng),
            L.latLng(coordinates[2].lat, coordinates[2].lng)
          ],
          routeWhileDragging: false,
          showAlternatives: false,
          fitSelectedRoutes: true,
          lineOptions: {
            styles: [
              { color: '#4F46E5', opacity: 0.8, weight: 6 } // Slightly different color for the second route
            
            ]
          },
          createMarker: () => null // Don't create additional markers
        }).addTo(map);
      }

      // Fit bounds to include all coordinates
      if (coordinates.length > 0) {
        const bounds = L.latLngBounds(coordinates.map(coord => L.latLng(coord.lat, coord.lng)));
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }

    // Cleanup
    return () => {
      if (leafletMapRef.current) {
        // We don't actually destroy the map here to prevent flickering on re-renders
        // The map will be properly destroyed when the component unmounts
      }
    };
  }, [coordinates]);

  // Handle map resize when window size changes
  useEffect(() => {
    const handleResize = () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.invalidateSize();
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // When component unmounts, destroy map
  useEffect(() => {
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  return <div ref={mapRef} className="h-full w-full z-0" />;
};

export default Map;