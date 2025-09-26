'use client';
import { useState, useEffect } from 'react';

export default function MapView({ queryData }) {
  const [mapData, setMapData] = useState(null);
  const [selectedFloat, setSelectedFloat] = useState(null);

  useEffect(() => {
    // Simulate loading map data based on query
    if (queryData) {
      // Mock ARGO float data
      const mockFloats = [
        {
          id: '2901234',
          lat: 19.076,
          lon: 72.8777,
          temperature: 28.5,
          salinity: 35.2,
          date: '2024-01-15',
          status: 'active',
        },
        {
          id: '2901235',
          lat: 18.5204,
          lon: 73.8567,
          temperature: 27.8,
          salinity: 34.9,
          date: '2024-01-14',
          status: 'active',
        },
        {
          id: '2901236',
          lat: 17.385,
          lon: 78.4867,
          temperature: 29.1,
          salinity: 35.4,
          date: '2024-01-13',
          status: 'active',
        },
      ];
      setMapData(mockFloats);
    }
  }, [queryData]);

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
            <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Reset View
            </button>
            <button className="px-3 py-1 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600">
              Export Map
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative bg-gray-100">
        {/* Placeholder for actual map implementation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🗺️</span>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Interactive Map
            </h4>
            <p className="text-sm text-[--color-text-secondary] mb-4">
              This would display an interactive world map with ARGO float
              locations
            </p>
            <div className="text-xs text-gray-500">
              <p>• Click on floats to see details</p>
              <p>• Drag to pan, scroll to zoom</p>
              <p>• Trajectories shown as lines</p>
            </div>
          </div>
        </div>

        {/* Mock Float Markers */}
        {mapData && (
          <div className="absolute inset-0 pointer-events-none">
            {mapData.map((float, index) => (
              <div
                key={float.id}
                className="absolute w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-lg cursor-pointer pointer-events-auto transform -translate-x-2 -translate-y-2"
                style={{
                  left: `${20 + index * 15}%`,
                  top: `${30 + index * 10}%`,
                }}
                onClick={() => setSelectedFloat(float)}
                title={`Float ${float.id}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Float Details Panel */}
      {selectedFloat && (
        <div className="absolute top-4 right-4 w-80 bg-white rounded-lg shadow-lg border border-[--color-border] p-4">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-semibold text-gray-900">
              Float {selectedFloat.id}
            </h4>
            <button
              onClick={() => setSelectedFloat(null)}
              className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span>
                {selectedFloat.lat}°, {selectedFloat.lon}°
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Temperature:</span>
              <span>{selectedFloat.temperature}°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Salinity:</span>
              <span>{selectedFloat.salinity} PSU</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Update:</span>
              <span>{selectedFloat.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  selectedFloat.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                {selectedFloat.status}
              </span>
            </div>
          </div>
          <button className="w-full mt-3 px-3 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 text-sm">
            View Profile Data
          </button>
        </div>
      )}
    </div>
  );
}
