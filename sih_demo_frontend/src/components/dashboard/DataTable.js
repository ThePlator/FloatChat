'use client';
import { useState, useEffect } from 'react';

// TemperatureChart Component for temperature distribution
function TemperatureChart({ data }) {
  if (!data || data.length === 0) return null;

  const temperatures = data.map((row) => row.temperature);
  const minTemp = Math.min(...temperatures);
  const maxTemp = Math.max(...temperatures);

  // Create histogram bins
  const numBins = 8;
  const binSize = (maxTemp - minTemp) / numBins;
  const bins = Array(numBins).fill(0);

  temperatures.forEach((temp) => {
    const binIndex = Math.min(
      Math.floor((temp - minTemp) / binSize),
      numBins - 1
    );
    bins[binIndex]++;
  });

  const maxCount = Math.max(...bins);

  return (
    <div className="h-24">
      <svg width="100%" height="100%" className="border rounded">
        {bins.map((count, index) => {
          const x = (index / numBins) * 100;
          const width = (1 / numBins) * 100;
          const height = (count / maxCount) * 80;
          const y = 80 - height;

          return (
            <rect
              key={index}
              x={`${x}%`}
              y={y}
              width={`${width}%`}
              height={height}
              fill="#f97316"
              opacity="0.7"
              stroke="#fff"
              strokeWidth="1"
            />
          );
        })}
      </svg>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{minTemp.toFixed(1)}°C</span>
        <span>{maxTemp.toFixed(1)}°C</span>
      </div>
    </div>
  );
}

// StatusChart Component for status overview
function StatusChart({ data }) {
  if (!data || data.length === 0) return null;

  const statusCounts = data.reduce((acc, row) => {
    acc[row.status] = (acc[row.status] || 0) + 1;
    return acc;
  }, {});

  const total = data.length;
  const colors = {
    active: '#22c55e',
    maintenance: '#f59e0b',
    offline: '#ef4444',
  };

  return (
    <div className="h-24 flex items-center">
      <svg width="100%" height="100%" className="border rounded">
        {(() => {
          let currentAngle = 0;
          return Object.entries(statusCounts).map(([status, count]) => {
            const percentage = (count / total) * 100;
            const angle = (count / total) * 360;

            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle += angle;

            // Calculate arc path for pie slice
            const centerX = 50;
            const centerY = 50;
            const radius = 35;

            const startX =
              centerX + radius * Math.cos(((startAngle - 90) * Math.PI) / 180);
            const startY =
              centerY + radius * Math.sin(((startAngle - 90) * Math.PI) / 180);
            const endX =
              centerX + radius * Math.cos(((endAngle - 90) * Math.PI) / 180);
            const endY =
              centerY + radius * Math.sin(((endAngle - 90) * Math.PI) / 180);

            const largeArcFlag = angle > 180 ? 1 : 0;

            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${startX} ${startY}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              'Z',
            ].join(' ');

            return (
              <path
                key={status}
                d={pathData}
                fill={colors[status] || '#6b7280'}
                stroke="#fff"
                strokeWidth="2"
              />
            );
          });
        })()}
      </svg>
      <div className="ml-4 space-y-1">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="flex items-center text-xs">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: colors[status] || '#6b7280' }}
            />
            <span className="text-gray-600">
              {status}: {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DataTable({ queryData }) {
  const [tableData, setTableData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filterText, setFilterText] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    // Generate comprehensive oceanographic data
    const generateTableData = () => {
      const floatInfo = {
        2901234: {
          ocean: 'North Pacific',
          baseLat: 35.5,
          baseLon: -150.0,
          baseTemp: 22.3,
          baseSal: 34.8,
        },
        2901235: {
          ocean: 'South Pacific',
          baseLat: -25.0,
          baseLon: -110.0,
          baseTemp: 18.7,
          baseSal: 35.1,
        },
        2901236: {
          ocean: 'North Atlantic',
          baseLat: 40.0,
          baseLon: -50.0,
          baseTemp: 15.2,
          baseSal: 35.4,
        },
        2901237: {
          ocean: 'South Atlantic',
          baseLat: -30.0,
          baseLon: -20.0,
          baseTemp: 19.8,
          baseSal: 34.9,
        },
        2901238: {
          ocean: 'Indian Ocean',
          baseLat: -15.0,
          baseLon: 70.0,
          baseTemp: 26.5,
          baseSal: 35.2,
        },
        2901239: {
          ocean: 'Indian Ocean',
          baseLat: 5.0,
          baseLon: 85.0,
          baseTemp: 28.9,
          baseSal: 34.7,
        },
        2901242: {
          ocean: 'Indian Ocean',
          baseLat: -5.0,
          baseLon: 95.0,
          baseTemp: 29.2,
          baseSal: 34.6,
        },
        2901243: {
          ocean: 'Indian Ocean',
          baseLat: 10.0,
          baseLon: 75.0,
          baseTemp: 27.8,
          baseSal: 35.0,
        },
        2901244: {
          ocean: 'Indian Ocean',
          baseLat: -25.0,
          baseLon: 45.0,
          baseTemp: 23.1,
          baseSal: 35.3,
        },
        2901245: {
          ocean: 'Indian Ocean',
          baseLat: 0.0,
          baseLon: 65.0,
          baseTemp: 29.5,
          baseSal: 34.5,
        },
        2901246: {
          ocean: 'Indian Ocean',
          baseLat: -20.0,
          baseLon: 105.0,
          baseTemp: 24.8,
          baseSal: 35.1,
        },
        2901240: {
          ocean: 'Arctic Ocean',
          baseLat: 75.0,
          baseLon: -150.0,
          baseTemp: -1.2,
          baseSal: 32.1,
        },
        2901241: {
          ocean: 'Southern Ocean',
          baseLat: -60.0,
          baseLon: 0.0,
          baseTemp: 2.1,
          baseSal: 34.5,
        },
      };

      const mockData = [];
      const allFloatIds = Object.keys(floatInfo);

      // Generate data for each float over multiple days
      allFloatIds.forEach((floatId, floatIndex) => {
        const info = floatInfo[floatId];

        // Generate 5-10 records per float
        const recordsPerFloat = 5 + Math.floor(Math.random() * 6);

        for (let i = 0; i < recordsPerFloat; i++) {
          const daysAgo = i * 2 + floatIndex; // Stagger the dates
          const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

          // Add realistic drift to position
          const latDrift = (Math.random() - 0.5) * 0.5;
          const lonDrift = (Math.random() - 0.5) * 0.5;

          // Add realistic variations to measurements
          const tempVariation = (Math.random() - 0.5) * 2;
          const salVariation = (Math.random() - 0.5) * 0.2;
          const pressureVariation = (Math.random() - 0.5) * 50;
          const oxygenVariation = (Math.random() - 0.5) * 30;

          // Calculate depth based on pressure (roughly 1m per dbar)
          const pressure = 500 + Math.random() * 1500 + pressureVariation;
          const depth = Math.round(pressure);

          mockData.push({
            id: mockData.length + 1,
            floatId: floatId,
            ocean: info.ocean,
            date: date.toISOString().split('T')[0],
            latitude: parseFloat((info.baseLat + latDrift).toFixed(4)),
            longitude: parseFloat((info.baseLon + lonDrift).toFixed(4)),
            temperature: parseFloat((info.baseTemp + tempVariation).toFixed(2)),
            salinity: parseFloat((info.baseSal + salVariation).toFixed(2)),
            pressure: parseFloat(pressure.toFixed(1)),
            depth: depth,
            oxygen: parseFloat((200 + oxygenVariation).toFixed(1)),
            chlorophyll: parseFloat((0.1 + Math.random() * 0.5).toFixed(3)),
            turbidity: parseFloat((0.05 + Math.random() * 0.1).toFixed(3)),
            ph: parseFloat((8.0 + (Math.random() - 0.5) * 0.4).toFixed(2)),
            status:
              Math.random() > 0.15
                ? 'active'
                : Math.random() > 0.5
                ? 'maintenance'
                : 'offline',
            lastTransmission: new Date(
              Date.now() - Math.random() * 6 * 60 * 60 * 1000
            ).toISOString(),
            batteryLevel: Math.floor(20 + Math.random() * 80),
            cycleNumber: Math.floor(1 + Math.random() * 500),
          });
        }
      });

      return mockData.sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    const mockData = generateTableData();
    setTableData(mockData);
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredData.map((row) => row.id));
    }
  };

  const filteredData = tableData.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig.key) {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleExport = (format) => {
    const dataToExport =
      selectedRows.length > 0
        ? tableData.filter((row) => selectedRows.includes(row.id))
        : filteredData;

    if (format === 'csv') {
      const csvContent = [
        Object.keys(dataToExport[0]).join(','),
        ...dataToExport.map((row) => Object.values(row).join(',')),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'argo_data.csv';
      a.click();
    } else if (format === 'netcdf') {
      // Mock NetCDF export
      alert('NetCDF export would be implemented here');
    }
  };

  const columns = [
    { key: 'floatId', label: 'Float ID' },
    { key: 'ocean', label: 'Ocean' },
    { key: 'date', label: 'Date' },
    { key: 'latitude', label: 'Latitude' },
    { key: 'longitude', label: 'Longitude' },
    { key: 'temperature', label: 'Temperature (°C)' },
    { key: 'salinity', label: 'Salinity (PSU)' },
    { key: 'pressure', label: 'Pressure (dbar)' },
    { key: 'depth', label: 'Depth (m)' },
    { key: 'oxygen', label: 'Oxygen (μmol/kg)' },
    { key: 'chlorophyll', label: 'Chlorophyll (mg/m³)' },
    { key: 'turbidity', label: 'Turbidity (NTU)' },
    { key: 'ph', label: 'pH' },
    { key: 'batteryLevel', label: 'Battery (%)' },
    { key: 'cycleNumber', label: 'Cycle #' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-white">
      {/* Controls */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-white to-orange-50 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Ocean Data Explorer
              </h3>
              <p className="text-xs text-gray-600">
                Comprehensive ARGO float measurements
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('csv')}
              className="px-3 py-1.5 text-xs bg-white border border-orange-200 rounded-md hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 shadow-sm font-medium text-gray-700">
              <svg
                className="w-3 h-3 inline mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              CSV
            </button>
            <button
              onClick={() => handleExport('netcdf')}
              className="px-3 py-1.5 text-xs bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-all duration-200 shadow-md hover:shadow-lg font-medium">
              <svg
                className="w-3 h-3 inline mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                />
              </svg>
              NetCDF
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search ocean data..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="pl-8 pr-3 py-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-xs bg-white shadow-sm transition-all duration-200 w-64"
                />
              </div>
              <div className="flex items-center space-x-1 px-2 py-1.5 bg-orange-100 rounded-md">
                <svg
                  className="w-4 h-4 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span className="text-xs font-medium text-orange-800">
                  {filteredData.length} of {tableData.length} records
                </span>
              </div>
            </div>
          </div>

          {/* Summary Statistics */}
          {filteredData.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-3 bg-gradient-to-r from-white to-orange-50 rounded-lg border border-orange-100 shadow-sm">
              <div className="text-center p-2 bg-white rounded-md shadow-sm border border-blue-100">
                <div className="flex items-center justify-center mb-1">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="text-lg font-bold text-blue-600">
                  {new Set(filteredData.map((row) => row.ocean)).size}
                </div>
                <div className="text-xs text-gray-600 font-medium">Oceans</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm border border-green-100">
                <div className="flex items-center justify-center mb-2">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
                <div className="text-lg font-bold text-green-600">
                  {new Set(filteredData.map((row) => row.floatId)).size}
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  Active Floats
                </div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm border border-orange-100">
                <div className="flex items-center justify-center mb-2">
                  <svg
                    className="w-5 h-5 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="text-lg font-bold text-orange-600">
                  {filteredData.filter((row) => row.status === 'active').length}
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  Active Status
                </div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm border border-red-100">
                <div className="flex items-center justify-center mb-2">
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                    />
                  </svg>
                </div>
                <div className="text-lg font-bold text-red-600">
                  {Math.round(
                    (filteredData.reduce(
                      (sum, row) => sum + row.temperature,
                      0
                    ) /
                      filteredData.length) *
                      10
                  ) / 10}
                  °C
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  Avg Temp
                </div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm border border-purple-100">
                <div className="flex items-center justify-center mb-2">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div className="text-lg font-bold text-purple-600">
                  {Math.round(
                    filteredData.reduce(
                      (sum, row) => sum + row.batteryLevel,
                      0
                    ) / filteredData.length
                  )}
                  %
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  Avg Battery
                </div>
              </div>
            </div>
          )}

          {/* Mini Visualizations */}
          {filteredData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-gradient-to-r from-white to-orange-50 rounded-lg border border-orange-100 shadow-sm mt-3">
              {/* Temperature Distribution */}
              <div className="bg-white rounded-md p-3 shadow-sm border border-red-100">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-1 bg-red-100 rounded">
                    <svg
                      className="w-4 h-4 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                      />
                    </svg>
                  </div>
                  <h5 className="text-sm font-semibold text-gray-900">
                    Temperature Distribution
                  </h5>
                </div>
                <TemperatureChart data={filteredData} />
              </div>

              {/* Status Overview */}
              <div className="bg-white rounded-md p-3 shadow-sm border border-green-100">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-1 bg-green-100 rounded">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h5 className="text-sm font-semibold text-gray-900">
                    Float Status Overview
                  </h5>
                </div>
                <StatusChart data={filteredData} />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 px-2">
          <div className="flex items-center gap-3">
            {selectedRows.length > 0 && (
              <div className="flex items-center space-x-2 px-3 py-2 bg-orange-100 rounded-lg border border-orange-200">
                <svg
                  className="w-4 h-4 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm font-medium text-orange-800">
                  {selectedRows.length} selected
                </span>
                <button
                  onClick={() => setSelectedRows([])}
                  className="text-xs text-orange-600 hover:text-orange-700 font-medium underline">
                  Clear
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredData.length)} of{' '}
              {filteredData.length} results
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto relative scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 min-h-0">
        {/* Left Scroll Indicator */}
        <div className="absolute top-0 left-0 bg-gradient-to-r from-white to-transparent w-8 h-full pointer-events-none z-10 opacity-0 hover:opacity-100 transition-opacity">
          <div className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-400 text-xs">
            ←
          </div>
        </div>

        {/* Right Scroll Indicator */}
        <div className="absolute top-0 right-0 bg-gradient-to-l from-white to-transparent w-8 h-full pointer-events-none z-10 opacity-0 hover:opacity-100 transition-opacity">
          <div className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-400 text-xs">
            →
          </div>
        </div>

        <div className="min-w-max">
          <table className="min-w-max divide-y divide-gray-200 bg-white shadow-sm">
            <thead className="bg-gradient-to-r from-gray-50 to-orange-50 sticky top-0 border-b-2 border-orange-200">
              <tr>
                <th className="px-6 py-3 text-left w-12">
                  <input
                    type="checkbox"
                    checked={
                      selectedRows.length === filteredData.length &&
                      filteredData.length > 0
                    }
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                </th>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-orange-100 transition-all duration-200 whitespace-nowrap border-r border-gray-200 last:border-r-0 ${
                      column.key === 'floatId'
                        ? 'min-w-[100px]'
                        : column.key === 'ocean'
                        ? 'min-w-[120px]'
                        : column.key === 'date'
                        ? 'min-w-[100px]'
                        : column.key === 'latitude' ||
                          column.key === 'longitude'
                        ? 'min-w-[90px]'
                        : column.key === 'temperature' ||
                          column.key === 'salinity'
                        ? 'min-w-[100px]'
                        : column.key === 'pressure' || column.key === 'depth'
                        ? 'min-w-[90px]'
                        : column.key === 'oxygen'
                        ? 'min-w-[110px]'
                        : column.key === 'chlorophyll'
                        ? 'min-w-[110px]'
                        : column.key === 'turbidity'
                        ? 'min-w-[90px]'
                        : column.key === 'ph'
                        ? 'min-w-[60px]'
                        : column.key === 'batteryLevel'
                        ? 'min-w-[90px]'
                        : column.key === 'cycleNumber'
                        ? 'min-w-[80px]'
                        : column.key === 'status'
                        ? 'min-w-[90px]'
                        : 'min-w-[80px]'
                    }`}
                    onClick={() => handleSort(column.key)}>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">{column.label}</span>
                      {sortConfig.key === column.key && (
                        <span className="text-orange-600 font-bold text-sm">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedData.map((row) => (
                <tr
                  key={row.id}
                  className={`hover:bg-orange-50 cursor-pointer transition-all duration-200 border-l-4 ${
                    selectedRows.includes(row.id)
                      ? 'bg-orange-50 border-l-orange-500 shadow-sm'
                      : 'border-l-transparent hover:border-l-orange-300'
                  }`}
                  onClick={() => handleSelectRow(row.id)}>
                  <td className="px-6 py-4 whitespace-nowrap w-12">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleSelectRow(row.id)}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${
                        column.key === 'floatId'
                          ? 'min-w-[100px]'
                          : column.key === 'ocean'
                          ? 'min-w-[120px]'
                          : column.key === 'date'
                          ? 'min-w-[100px]'
                          : column.key === 'latitude' ||
                            column.key === 'longitude'
                          ? 'min-w-[90px]'
                          : column.key === 'temperature' ||
                            column.key === 'salinity'
                          ? 'min-w-[100px]'
                          : column.key === 'pressure' || column.key === 'depth'
                          ? 'min-w-[90px]'
                          : column.key === 'oxygen'
                          ? 'min-w-[110px]'
                          : column.key === 'chlorophyll'
                          ? 'min-w-[110px]'
                          : column.key === 'turbidity'
                          ? 'min-w-[90px]'
                          : column.key === 'ph'
                          ? 'min-w-[60px]'
                          : column.key === 'batteryLevel'
                          ? 'min-w-[90px]'
                          : column.key === 'cycleNumber'
                          ? 'min-w-[80px]'
                          : column.key === 'status'
                          ? 'min-w-[90px]'
                          : 'min-w-[80px]'
                      }`}>
                      {column.key === 'status' ? (
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${
                            row[column.key] === 'active'
                              ? 'bg-green-100 text-green-800'
                              : row[column.key] === 'maintenance'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                          {row[column.key]}
                        </span>
                      ) : column.key === 'ocean' ? (
                        <span className="text-blue-600 font-medium text-xs">
                          {row[column.key]}
                        </span>
                      ) : column.key === 'latitude' ||
                        column.key === 'longitude' ? (
                        row[column.key].toFixed(4)
                      ) : column.key === 'temperature' ||
                        column.key === 'salinity' ||
                        column.key === 'ph' ? (
                        row[column.key].toFixed(2)
                      ) : column.key === 'pressure' ||
                        column.key === 'depth' ||
                        column.key === 'oxygen' ||
                        column.key === 'turbidity' ||
                        column.key === 'chlorophyll' ? (
                        row[column.key].toFixed(1)
                      ) : column.key === 'batteryLevel' ? (
                        <span
                          className={`font-medium ${
                            row[column.key] > 50
                              ? 'text-green-600'
                              : row[column.key] > 20
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}>
                          {row[column.key]}%
                        </span>
                      ) : column.key === 'cycleNumber' ? (
                        <span className="font-mono text-sm">
                          {row[column.key]}
                        </span>
                      ) : (
                        row[column.key]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-orange-200 bg-gradient-to-r from-white to-orange-50">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-white border border-orange-200 rounded-md hover:bg-orange-50 hover:border-orange-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-medium text-xs">Previous</span>
          </button>

          <div className="flex items-center space-x-1 px-3 py-1.5 bg-orange-100 rounded-md border border-orange-200">
            <svg
              className="w-3 h-3 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="text-xs font-semibold text-orange-800">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-white border border-orange-200 rounded-md hover:bg-orange-50 hover:border-orange-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm">
            <span className="font-medium text-xs">Next</span>
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
