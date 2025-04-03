import React, { useState } from 'react';
import MapComponent from './map';

interface Route {
  name: string;
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
}

const routes: Route[] = [
  { name: 'Panjim → Margao', start: { lat: 15.4968, lng: 73.8278 }, end: { lat: 15.2832, lng: 73.9862 } },
  { name: 'Vasco da Gama → Mapusa', start: { lat: 15.3840, lng: 73.8441 }, end: { lat: 15.5916, lng: 73.8089 } },
  { name: 'Candolim → Calangute', start: { lat: 15.5112, lng: 73.7678 }, end: { lat: 15.5400, lng: 73.7550 } },
  { name: 'Panjim → Vasco da Gama', start: { lat: 15.4968, lng: 73.8278 }, end: { lat: 15.3840, lng: 73.8441 } },
  { name: 'Margao → Palolem', start: { lat: 15.2832, lng: 73.9862 }, end: { lat: 15.0120, lng: 74.0232 } },
  { name: 'Mapusa → Baga Beach', start: { lat: 15.5916, lng: 73.8089 }, end: { lat: 15.5524, lng: 73.7516 } },
  { name: 'Siolim → Arambol Beach', start: { lat: 15.6151, lng: 73.7642 }, end: { lat: 15.6868, lng: 73.7040 } },
  { name: 'Panjim → Old Goa', start: { lat: 15.4968, lng: 73.8278 }, end: { lat: 15.5036, lng: 73.9126 } },
  { name: 'Colva Beach → Betalbatim Beach', start: { lat: 15.2793, lng: 73.9235 }, end: { lat: 15.2996, lng: 73.9196 } },
  { name: 'Dona Paula → Bambolim Beach', start: { lat: 15.4661, lng: 73.8013 }, end: { lat: 15.4595, lng: 73.8571 } },
];

const App: React.FC = () => {
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Select a Route in Goa</h2>
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
        {routes.map((route, index) => (
          <button
            key={index}
            onClick={() => setSelectedRoute(route)}
            style={{
              padding: '10px 15px',
              border: 'none',
              borderRadius: '5px',
              backgroundColor: selectedRoute?.name === route.name ? '#007BFF' : '#555',
              color: 'white',
              cursor: 'pointer',
              transition: 'background 0.3s',
            }}
          >
            {route.name}
          </button>
        ))}
      </div>

      {selectedRoute && (
        <div style={{ marginTop: '20px' }}>
          <h3>{selectedRoute.name}</h3>
          <MapComponent start={selectedRoute.start} end={selectedRoute.end} />
        </div>
      )}
    </div>
  );
};

export default App;
