'use client';
import { useState, useEffect } from 'react';

export default function TimeSeries({ queryData }) {
  const [timeSeriesData, setTimeSeriesData] = useState(null);
  const [selectedParameter, setSelectedParameter] = useState('temperature');
  const [selectedFloat, setSelectedFloat] = useState('2901234');
  const [timeRange, setTimeRange] = useState('1year');

  const parameters = [
    { id: 'temperature', label: 'Temperature', unit: '°C', color: '#f97316' },
    { id: 'salinity', label: 'Salinity', unit: 'PSU', color: '#3b82f6' },
    { id: 'pressure', label: 'Pressure', unit: 'dbar', color: '#10b981' },
    { id: 'oxygen', label: 'Oxygen', unit: 'μmol/kg', color: '#8b5cf6' },
  ];

  const timeRanges = [
    { id: '1week', label: '1 Week' },
    { id: '1month', label: '1 Month' },
    { id: '3months', label: '3 Months' },
    { id: '6months', label: '6 Months' },
    { id: '1year', label: '1 Year' },
    { id: 'all', label: 'All Time' },
  ];

  const availableFloats = ['2901234', '2901235', '2901236', '2901237'];

  useEffect(() => {
    if (queryData) {
      // Mock time series data
      const mockData = {
        floatId: selectedFloat,
        parameter: selectedParameter,
        timeRange: timeRange,
        data: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
          value: 28 + Math.sin(i * 0.3) * 3 + Math.random() * 0.5,
        })),
      };
      setTimeSeriesData(mockData);
    }
  }, [queryData, selectedParameter, selectedFloat, timeRange]);

  return (
    <div className="h-full flex flex-col">
      {/* Controls */}
      <div className="p-4 border-b border-[--color-border] bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Time Series Analysis
          </h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Reset View
            </button>
            <button className="px-3 py-1 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600">
              Export Data
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Float Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Float:
            </label>
            <select
              value={selectedFloat}
              onChange={(e) => setSelectedFloat(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm">
              {availableFloats.map((floatId) => (
                <option key={floatId} value={floatId}>
                  Float {floatId}
                </option>
              ))}
            </select>
          </div>

          {/* Parameter Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parameter:
            </label>
            <select
              value={selectedParameter}
              onChange={(e) => setSelectedParameter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm">
              {parameters.map((param) => (
                <option key={param.id} value={param.id}>
                  {param.label} ({param.unit})
                </option>
              ))}
            </select>
          </div>

          {/* Time Range Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Range:
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm">
              {timeRanges.map((range) => (
                <option key={range.id} value={range.id}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 p-4">
        <div className="h-full bg-white rounded-lg border border-[--color-border] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Time Series Plot
            </h4>
            <p className="text-sm text-[--color-text-secondary] mb-4">
              {parameters.find((p) => p.id === selectedParameter)?.label} over
              time for Float {selectedFloat}
            </p>

            {/* Data Summary */}
            {timeSeriesData && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm">
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div>
                    <span className="text-gray-600">Data Points:</span>
                    <span className="ml-2 font-medium">
                      {timeSeriesData.data.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Date Range:</span>
                    <span className="ml-2 font-medium">
                      {timeSeriesData.data[0]?.date} to{' '}
                      {
                        timeSeriesData.data[timeSeriesData.data.length - 1]
                          ?.date
                      }
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Min Value:</span>
                    <span className="ml-2 font-medium">
                      {Math.min(
                        ...timeSeriesData.data.map((d) => d.value)
                      ).toFixed(2)}{' '}
                      {parameters.find((p) => p.id === selectedParameter)?.unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Max Value:</span>
                    <span className="ml-2 font-medium">
                      {Math.max(
                        ...timeSeriesData.data.map((d) => d.value)
                      ).toFixed(2)}{' '}
                      {parameters.find((p) => p.id === selectedParameter)?.unit}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Mock chart visualization */}
            <div className="mt-6 w-96 h-48 mx-auto bg-gray-50 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
              <div className="text-gray-400 text-sm">
                Interactive Time Series Chart
                <br />
                <span className="text-xs">
                  (Plotly.js or ECharts would render here)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
