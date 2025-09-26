'use client';
import { useState, useEffect } from 'react';

export default function ProfilePlots({ queryData }) {
  const [plotData, setPlotData] = useState(null);
  const [selectedParameter, setSelectedParameter] = useState('temperature');
  const [selectedFloats, setSelectedFloats] = useState([]);

  const parameters = [
    { id: 'temperature', label: 'Temperature', unit: '°C', color: '#f97316' },
    { id: 'salinity', label: 'Salinity', unit: 'PSU', color: '#3b82f6' },
    { id: 'pressure', label: 'Pressure', unit: 'dbar', color: '#10b981' },
    { id: 'oxygen', label: 'Oxygen', unit: 'μmol/kg', color: '#8b5cf6' },
  ];

  useEffect(() => {
    if (queryData) {
      // Mock profile data
      const mockProfiles = [
        {
          floatId: '2901234',
          parameter: 'temperature',
          data: Array.from({ length: 50 }, (_, i) => ({
            depth: i * 10,
            value: 28 - i * 0.3 + Math.sin(i * 0.2) * 2,
          })),
        },
        {
          floatId: '2901235',
          parameter: 'temperature',
          data: Array.from({ length: 50 }, (_, i) => ({
            depth: i * 10,
            value: 27.5 - i * 0.25 + Math.sin(i * 0.15) * 1.5,
          })),
        },
      ];
      setPlotData(mockProfiles);
      setSelectedFloats(['2901234', '2901235']);
    }
  }, [queryData]);

  const handleFloatToggle = (floatId) => {
    setSelectedFloats((prev) =>
      prev.includes(floatId)
        ? prev.filter((id) => id !== floatId)
        : [...prev, floatId]
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Controls */}
      <div className="p-4 border-b border-[--color-border] bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Depth Profiles
          </h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Reset View
            </button>
            <button className="px-3 py-1 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600">
              Export Plot
            </button>
          </div>
        </div>

        {/* Parameter Selection */}
        <div className="flex gap-2 mb-4">
          {parameters.map((param) => (
            <button
              key={param.id}
              onClick={() => setSelectedParameter(param.id)}
              className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                selectedParameter === param.id
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}>
              {param.label} ({param.unit})
            </button>
          ))}
        </div>

        {/* Float Selection */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 mr-2">Show floats:</span>
          {plotData?.map((profile) => (
            <button
              key={profile.floatId}
              onClick={() => handleFloatToggle(profile.floatId)}
              className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                selectedFloats.includes(profile.floatId)
                  ? 'bg-orange-100 text-orange-800 border-orange-300'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}>
              {profile.floatId}
            </button>
          ))}
        </div>
      </div>

      {/* Plot Area */}
      <div className="flex-1 p-4">
        <div className="h-full bg-white rounded-lg border border-[--color-border] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Profile Plot
            </h4>
            <p className="text-sm text-[--color-text-secondary] mb-4">
              {selectedParameter.charAt(0).toUpperCase() +
                selectedParameter.slice(1)}{' '}
              vs Depth
            </p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>• Y-axis: Depth (m)</p>
              <p>
                • X-axis:{' '}
                {parameters.find((p) => p.id === selectedParameter)?.label} (
                {parameters.find((p) => p.id === selectedParameter)?.unit})
              </p>
              <p>• Multiple profiles can be overlaid for comparison</p>
            </div>

            {/* Mock plot visualization */}
            <div className="mt-6 w-80 h-48 mx-auto bg-gray-50 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
              <div className="text-gray-400 text-sm">
                Interactive Plotly.js Chart
                <br />
                <span className="text-xs">
                  (Depth profiles would render here)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
