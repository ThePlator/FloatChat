'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import all Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), {
  ssr: false,
});
const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
);

// Create a separate component for the map to ensure it only renders on client
function InteractiveMap({ mapData, onFloatSelect }) {
  const [Leaflet, setLeaflet] = useState(null);
  const [isLeafletReady, setIsLeafletReady] = useState(false);

  useEffect(() => {
    // Dynamically import Leaflet to ensure it's available
    import('leaflet').then((L) => {
      setLeaflet(L.default);
      // Add a small delay to ensure CSS is loaded
      setTimeout(() => {
        setIsLeafletReady(true);
      }, 100);
    });
  }, []);

  if (typeof window === 'undefined' || !Leaflet || !isLeafletReady) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">🗺️</span>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            Loading Map Components...
          </h4>
          <p className="text-sm text-[--color-text-secondary]">
            Initializing interactive map
          </p>
        </div>
      </div>
    );
  }

  // Create custom icon for ARGO floats
  const createFloatIcon = (status) => {
    const iconHtml = `
      <div style="
        width: 28px; 
        height: 28px; 
        background-color: ${
          status === 'active'
            ? '#10b981'
            : status === 'maintenance'
            ? '#f59e0b'
            : '#ef4444'
        };
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: white;
        font-weight: bold;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: transform 0.2s ease;
      " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
        🌊
      </div>
    `;

    return Leaflet.divIcon({
      html: iconHtml,
      className: 'custom-float-icon',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -14],
    });
  };

  return (
    <MapContainer
      center={[0, 0]} // Center on world view
      zoom={2}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
      whenReady={() => {
        console.log('Map is ready');
      }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Render ARGO Float Markers */}
      {mapData?.map((float) => (
        <div key={float.id}>
          <Marker
            position={[float.lat, float.lon]}
            icon={createFloatIcon(float.status)}
            eventHandlers={{
              click: () => onFloatSelect(float),
            }}>
            <Popup>
              <div className="p-3">
                <h4 className="font-semibold text-sm mb-2">{float.name}</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ocean:</span>
                    <span className="font-medium text-blue-600">
                      {float.ocean}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span>
                      {float.lat.toFixed(3)}°, {float.lon.toFixed(3)}°
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Temperature:</span>
                    <span className="font-semibold text-blue-600">
                      {float.temperature}°C
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Salinity:</span>
                    <span className="font-semibold text-green-600">
                      {float.salinity} PSU
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Depth:</span>
                    <span>{float.depth}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        float.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : float.status === 'maintenance'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                      {float.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Update:</span>
                    <span>{float.date}</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>

          {/* Render trajectory as polyline */}
          <Polyline
            positions={float.trajectory}
            color={
              float.status === 'active'
                ? '#10b981'
                : float.status === 'maintenance'
                ? '#f59e0b'
                : '#ef4444'
            }
            weight={2}
            opacity={0.7}
          />
        </div>
      ))}
    </MapContainer>
  );
}

export default function MapView({ queryData }) {
  const [mapData, setMapData] = useState(null);
  const [selectedFloat, setSelectedFloat] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Load mock ARGO float data from various oceans worldwide
    const mockFloats = [
      // Pacific Ocean floats
      {
        id: '2901234',
        name: 'ARGO Float 2901234',
        lat: 35.5,
        lon: -150.0,
        temperature: 22.3,
        salinity: 34.8,
        depth: 1200,
        date: '2024-01-15',
        status: 'active',
        ocean: 'North Pacific',
        trajectory: [
          [35.5, -150.0],
          [35.6, -149.8],
          [35.7, -149.6],
          [35.8, -149.4],
          [35.9, -149.2],
        ],
        measurements: {
          temperature: [22.3, 21.8, 21.2, 20.7, 20.1],
          salinity: [34.8, 34.9, 35.0, 35.1, 35.2],
          pressure: [1200, 1400, 1600, 1800, 2000],
        },
      },
      {
        id: '2901235',
        name: 'ARGO Float 2901235',
        lat: -25.0,
        lon: -110.0,
        temperature: 18.7,
        salinity: 35.1,
        depth: 1500,
        date: '2024-01-14',
        status: 'active',
        ocean: 'South Pacific',
        trajectory: [
          [-25.0, -110.0],
          [-24.8, -109.8],
          [-24.6, -109.6],
          [-24.4, -109.4],
          [-24.2, -109.2],
        ],
        measurements: {
          temperature: [18.7, 18.2, 17.8, 17.3, 16.9],
          salinity: [35.1, 35.2, 35.3, 35.4, 35.5],
          pressure: [1500, 1700, 1900, 2100, 2300],
        },
      },
      // Atlantic Ocean floats
      {
        id: '2901236',
        name: 'ARGO Float 2901236',
        lat: 40.0,
        lon: -50.0,
        temperature: 15.2,
        salinity: 35.4,
        depth: 1800,
        date: '2024-01-13',
        status: 'active',
        ocean: 'North Atlantic',
        trajectory: [
          [40.0, -50.0],
          [40.1, -49.8],
          [40.2, -49.6],
          [40.3, -49.4],
          [40.4, -49.2],
        ],
        measurements: {
          temperature: [15.2, 14.8, 14.4, 14.0, 13.6],
          salinity: [35.4, 35.5, 35.6, 35.7, 35.8],
          pressure: [1800, 2000, 2200, 2400, 2600],
        },
      },
      {
        id: '2901237',
        name: 'ARGO Float 2901237',
        lat: -30.0,
        lon: -20.0,
        temperature: 19.8,
        salinity: 34.9,
        depth: 1000,
        date: '2024-01-12',
        status: 'maintenance',
        ocean: 'South Atlantic',
        trajectory: [
          [-30.0, -20.0],
          [-29.8, -19.8],
          [-29.6, -19.6],
          [-29.4, -19.4],
        ],
        measurements: {
          temperature: [19.8, 19.4, 19.0, 18.6],
          salinity: [34.9, 35.0, 35.1, 35.2],
          pressure: [1000, 1200, 1400, 1600],
        },
      },
      // Indian Ocean floats
      {
        id: '2901238',
        name: 'ARGO Float 2901238',
        lat: -15.0,
        lon: 70.0,
        temperature: 26.5,
        salinity: 35.2,
        depth: 800,
        date: '2024-01-11',
        status: 'active',
        ocean: 'Indian Ocean',
        trajectory: [
          [-15.0, 70.0],
          [-14.8, 70.2],
          [-14.6, 70.4],
          [-14.4, 70.6],
          [-14.2, 70.8],
        ],
        measurements: {
          temperature: [26.5, 26.0, 25.5, 25.0, 24.5],
          salinity: [35.2, 35.3, 35.4, 35.5, 35.6],
          pressure: [800, 1000, 1200, 1400, 1600],
        },
      },
      {
        id: '2901239',
        name: 'ARGO Float 2901239',
        lat: 5.0,
        lon: 85.0,
        temperature: 28.9,
        salinity: 34.7,
        depth: 600,
        date: '2024-01-10',
        status: 'active',
        ocean: 'Indian Ocean',
        trajectory: [
          [5.0, 85.0],
          [5.1, 85.2],
          [5.2, 85.4],
          [5.3, 85.6],
          [5.4, 85.8],
        ],
        measurements: {
          temperature: [28.9, 28.4, 27.9, 27.4, 26.9],
          salinity: [34.7, 34.8, 34.9, 35.0, 35.1],
          pressure: [600, 800, 1000, 1200, 1400],
        },
      },
      {
        id: '2901242',
        name: 'ARGO Float 2901242',
        lat: -5.0,
        lon: 95.0,
        temperature: 29.2,
        salinity: 34.6,
        depth: 900,
        date: '2024-01-07',
        status: 'active',
        ocean: 'Indian Ocean',
        trajectory: [
          [-5.0, 95.0],
          [-4.8, 95.2],
          [-4.6, 95.4],
          [-4.4, 95.6],
          [-4.2, 95.8],
        ],
        measurements: {
          temperature: [29.2, 28.8, 28.4, 28.0, 27.6],
          salinity: [34.6, 34.7, 34.8, 34.9, 35.0],
          pressure: [900, 1100, 1300, 1500, 1700],
        },
      },
      {
        id: '2901243',
        name: 'ARGO Float 2901243',
        lat: 10.0,
        lon: 75.0,
        temperature: 27.8,
        salinity: 35.0,
        depth: 1100,
        date: '2024-01-06',
        status: 'active',
        ocean: 'Indian Ocean',
        trajectory: [
          [10.0, 75.0],
          [10.2, 75.2],
          [10.4, 75.4],
          [10.6, 75.6],
          [10.8, 75.8],
        ],
        measurements: {
          temperature: [27.8, 27.3, 26.8, 26.3, 25.8],
          salinity: [35.0, 35.1, 35.2, 35.3, 35.4],
          pressure: [1100, 1300, 1500, 1700, 1900],
        },
      },
      {
        id: '2901244',
        name: 'ARGO Float 2901244',
        lat: -25.0,
        lon: 45.0,
        temperature: 23.1,
        salinity: 35.3,
        depth: 1400,
        date: '2024-01-05',
        status: 'maintenance',
        ocean: 'Indian Ocean',
        trajectory: [
          [-25.0, 45.0],
          [-24.8, 45.2],
          [-24.6, 45.4],
          [-24.4, 45.6],
        ],
        measurements: {
          temperature: [23.1, 22.6, 22.1, 21.6],
          salinity: [35.3, 35.4, 35.5, 35.6],
          pressure: [1400, 1600, 1800, 2000],
        },
      },
      {
        id: '2901245',
        name: 'ARGO Float 2901245',
        lat: 0.0,
        lon: 65.0,
        temperature: 29.5,
        salinity: 34.5,
        depth: 750,
        date: '2024-01-04',
        status: 'active',
        ocean: 'Indian Ocean',
        trajectory: [
          [0.0, 65.0],
          [0.2, 65.2],
          [0.4, 65.4],
          [0.6, 65.6],
          [0.8, 65.8],
        ],
        measurements: {
          temperature: [29.5, 29.0, 28.5, 28.0, 27.5],
          salinity: [34.5, 34.6, 34.7, 34.8, 34.9],
          pressure: [750, 950, 1150, 1350, 1550],
        },
      },
      {
        id: '2901246',
        name: 'ARGO Float 2901246',
        lat: -20.0,
        lon: 105.0,
        temperature: 24.8,
        salinity: 35.1,
        depth: 1200,
        date: '2024-01-03',
        status: 'active',
        ocean: 'Indian Ocean',
        trajectory: [
          [-20.0, 105.0],
          [-19.8, 105.2],
          [-19.6, 105.4],
          [-19.4, 105.6],
          [-19.2, 105.8],
        ],
        measurements: {
          temperature: [24.8, 24.3, 23.8, 23.3, 22.8],
          salinity: [35.1, 35.2, 35.3, 35.4, 35.5],
          pressure: [1200, 1400, 1600, 1800, 2000],
        },
      },
      // Arctic Ocean float
      {
        id: '2901240',
        name: 'ARGO Float 2901240',
        lat: 75.0,
        lon: -150.0,
        temperature: -1.2,
        salinity: 32.1,
        depth: 400,
        date: '2024-01-09',
        status: 'active',
        ocean: 'Arctic Ocean',
        trajectory: [
          [75.0, -150.0],
          [75.1, -149.8],
          [75.2, -149.6],
          [75.3, -149.4],
        ],
        measurements: {
          temperature: [-1.2, -1.5, -1.8, -2.1],
          salinity: [32.1, 32.2, 32.3, 32.4],
          pressure: [400, 600, 800, 1000],
        },
      },
      // Southern Ocean float
      {
        id: '2901241',
        name: 'ARGO Float 2901241',
        lat: -60.0,
        lon: 0.0,
        temperature: 2.1,
        salinity: 34.5,
        depth: 2000,
        date: '2024-01-08',
        status: 'active',
        ocean: 'Southern Ocean',
        trajectory: [
          [-60.0, 0.0],
          [-59.8, 0.2],
          [-59.6, 0.4],
          [-59.4, 0.6],
          [-59.2, 0.8],
        ],
        measurements: {
          temperature: [2.1, 1.8, 1.5, 1.2, 0.9],
          salinity: [34.5, 34.6, 34.7, 34.8, 34.9],
          pressure: [2000, 2200, 2400, 2600, 2800],
        },
      },
    ];
    setMapData(mockFloats);
  }, []);

  useEffect(() => {
    // Set client-side flag to prevent hydration mismatch
    setIsClient(true);
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Map Controls */}
      <div className="p-4 border-b border-[--color-border] bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              ARGO Float Locations
            </h3>
            <p className="text-sm text-[--color-text-secondary]">
              {mapData
                ? `${mapData.length} floats displayed`
                : 'No data loaded'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={() => {
                // Reset view to center on world view
                const map = document.querySelector('.leaflet-container');
                if (map && map._leaflet_id) {
                  map._leaflet_map.setView([0, 0], 2);
                }
              }}>
              Reset View
            </button>
            <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Toggle Trajectories
            </button>
            <button className="px-3 py-1 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600">
              Export Map
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        {isClient && mapData ? (
          <InteractiveMap mapData={mapData} onFloatSelect={setSelectedFloat} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🗺️</span>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                {isClient ? 'Loading Interactive Map...' : 'Preparing Map...'}
              </h4>
              <p className="text-sm text-[--color-text-secondary] mb-4">
                {isClient
                  ? 'Preparing ARGO float data visualization'
                  : 'Initializing map components'}
              </p>
              <div className="text-xs text-gray-500">
                <p>• Click on floats to see details</p>
                <p>• Drag to pan, scroll to zoom</p>
                <p>• Trajectories shown as lines</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Float Details Panel */}
      {selectedFloat && (
        <div className="absolute top-4 right-4 w-80 bg-white rounded-lg shadow-lg border border-[--color-border] p-4 z-50">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-semibold text-gray-900">
              {selectedFloat.name}
            </h4>
            <button
              onClick={() => setSelectedFloat(null)}
              className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Ocean:</span>
              <span className="font-semibold text-blue-600">
                {selectedFloat.ocean}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-mono text-xs">
                  {selectedFloat.lat.toFixed(3)}°,{' '}
                  {selectedFloat.lon.toFixed(3)}°
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Depth:</span>
                <span>{selectedFloat.depth}m</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Temperature:</span>
                <span className="font-semibold text-blue-600">
                  {selectedFloat.temperature}°C
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Salinity:</span>
                <span className="font-semibold text-green-600">
                  {selectedFloat.salinity} PSU
                </span>
              </div>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedFloat.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                {selectedFloat.status}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Last Update:</span>
              <span>{selectedFloat.date}</span>
            </div>

            {/* Measurement Preview */}
            <div className="border-t pt-2">
              <h5 className="font-medium text-gray-700 mb-2">
                Recent Measurements
              </h5>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Temp Range:</span>
                  <span>
                    {Math.min(
                      ...selectedFloat.measurements.temperature
                    ).toFixed(1)}
                    °C -{' '}
                    {Math.max(
                      ...selectedFloat.measurements.temperature
                    ).toFixed(1)}
                    °C
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Salinity Range:</span>
                  <span>
                    {Math.min(...selectedFloat.measurements.salinity).toFixed(
                      1
                    )}{' '}
                    -{' '}
                    {Math.max(...selectedFloat.measurements.salinity).toFixed(
                      1
                    )}{' '}
                    PSU
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Depth Range:</span>
                  <span>
                    {Math.min(...selectedFloat.measurements.pressure)}m -{' '}
                    {Math.max(...selectedFloat.measurements.pressure)}m
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button className="flex-1 px-3 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 text-sm">
              View Profile
            </button>
            <button className="flex-1 px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm">
              Download Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
