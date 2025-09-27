'use client';
import { useState, useEffect } from 'react';

// ProfileChart Component for rendering depth profiles
function ProfileChart({ data, parameter, parameters }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!data || data.length === 0) return null;

  const paramInfo = parameters.find((p) => p.id === parameter);

  // Calculate chart dimensions and scaling
  const chartWidth = 600;
  const chartHeight = 400;
  const margin = { top: 20, right: 60, bottom: 60, left: 80 };
  const plotWidth = chartWidth - margin.left - margin.right;
  const plotHeight = chartHeight - margin.top - margin.bottom;

  // Find min/max values for scaling
  const allValues = data.flatMap((profile) => profile.data.map((d) => d.value));
  const allDepths = data.flatMap((profile) => profile.data.map((d) => d.depth));

  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const maxDepth = Math.max(...allDepths);
  const minDepth = Math.min(...allDepths);

  // Add padding to ranges
  const valueRange = maxValue - minValue;
  const depthRange = maxDepth - minDepth;
  const valuePadding = valueRange * 0.05;
  const depthPadding = depthRange * 0.05;

  const scaledMinValue = minValue - valuePadding;
  const scaledMaxValue = maxValue + valuePadding;
  const scaledMinDepth = minDepth - depthPadding;
  const scaledMaxDepth = maxDepth + depthPadding;

  // Scale functions
  const scaleX = (value) =>
    margin.left +
    ((value - scaledMinValue) / (scaledMaxValue - scaledMinValue)) * plotWidth;
  const scaleY = (depth) =>
    margin.top +
    ((depth - scaledMinDepth) / (scaledMaxDepth - scaledMinDepth)) * plotHeight;

  // Color palette for different floats
  const colors = [
    '#ef4444',
    '#f97316',
    '#eab308',
    '#22c55e',
    '#06b6d4',
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
    '#84cc16',
    '#f59e0b',
  ];

  return (
    <div className="w-full h-full">
      <svg
        width={chartWidth}
        height={chartHeight}
        className="border rounded-lg bg-gray-50">
        {/* Grid lines */}
        <defs>
          <pattern
            id="grid"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse">
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect
          width={plotWidth}
          height={plotHeight}
          x={margin.left}
          y={margin.top}
          fill="url(#grid)"
        />

        {/* Plot profiles */}
        {data.map((profile, profileIndex) => {
          const color = colors[profileIndex % colors.length];
          const points = profile.data
            .map((d) => `${scaleX(d.value)},${scaleY(d.depth)}`)
            .join(' ');

          return (
            <g key={profile.floatId}>
              {/* Profile line */}
              <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="2"
                opacity="0.8"
              />

              {/* Data points */}
              {profile.data.map((point, pointIndex) => (
                <circle
                  key={pointIndex}
                  cx={scaleX(point.value)}
                  cy={scaleY(point.depth)}
                  r="3"
                  fill={color}
                  stroke="white"
                  strokeWidth="1"
                  opacity="0.9"
                  onMouseEnter={() =>
                    setHoveredPoint({
                      ...point,
                      floatId: profile.floatId,
                      ocean: profile.ocean,
                      color,
                    })
                  }
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}
            </g>
          );
        })}

        {/* Axes */}
        <line
          x1={margin.left}
          y1={margin.top}
          x2={margin.left}
          y2={margin.top + plotHeight}
          stroke="#374151"
          strokeWidth="2"
        />
        <line
          x1={margin.left}
          y1={margin.top + plotHeight}
          x2={margin.left + plotWidth}
          y2={margin.top + plotHeight}
          stroke="#374151"
          strokeWidth="2"
        />

        {/* Y-axis labels (Depth) */}
        {[0, 500, 1000, 1500, 2000].map((depth) => {
          if (depth >= scaledMinDepth && depth <= scaledMaxDepth) {
            return (
              <g key={depth}>
                <line
                  x1={margin.left - 5}
                  y1={scaleY(depth)}
                  x2={margin.left}
                  y2={scaleY(depth)}
                  stroke="#374151"
                  strokeWidth="1"
                />
                <text
                  x={margin.left - 10}
                  y={scaleY(depth) + 4}
                  textAnchor="end"
                  fontSize="12"
                  fill="#374151">
                  {depth}
                </text>
              </g>
            );
          }
          return null;
        })}

        {/* X-axis labels (Parameter values) */}
        {(() => {
          const numTicks = 6;
          const tickValues = [];
          for (let i = 0; i <= numTicks; i++) {
            const value =
              scaledMinValue +
              (i / numTicks) * (scaledMaxValue - scaledMinValue);
            tickValues.push(value);
          }
          return tickValues.map((value, index) => (
            <g key={index}>
              <line
                x1={scaleX(value)}
                y1={margin.top + plotHeight}
                x2={scaleX(value)}
                y2={margin.top + plotHeight + 5}
                stroke="#374151"
                strokeWidth="1"
              />
              <text
                x={scaleX(value)}
                y={margin.top + plotHeight + 20}
                textAnchor="middle"
                fontSize="12"
                fill="#374151">
                {value.toFixed(1)}
              </text>
            </g>
          ));
        })()}

        {/* Axis labels */}
        <text
          x={margin.left + plotWidth / 2}
          y={chartHeight - 10}
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          fill="#374151">
          {paramInfo?.label} ({paramInfo?.unit})
        </text>
        <text
          x={20}
          y={margin.top + plotHeight / 2}
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          fill="#374151"
          transform={`rotate(-90, 20, ${margin.top + plotHeight / 2})`}>
          Depth (m)
        </text>

        {/* Legend */}
        <g
          transform={`translate(${margin.left + plotWidth - 150}, ${
            margin.top + 20
          })`}>
          <rect
            x="0"
            y="0"
            width="140"
            height={data.length * 20 + 10}
            fill="white"
            stroke="#d1d5db"
            strokeWidth="1"
            rx="4"
          />
          {data.map((profile, index) => (
            <g
              key={profile.floatId}
              transform={`translate(10, ${15 + index * 20})`}>
              <circle
                cx="5"
                cy="5"
                r="5"
                fill={colors[index % colors.length]}
              />
              <text x="15" y="8" fontSize="11" fill="#374151">
                {profile.floatId} ({profile.ocean})
              </text>
            </g>
          ))}
        </g>
      </svg>

      {/* Tooltip */}
      {hoveredPoint && (
        <div
          className="absolute bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-10 pointer-events-none"
          style={{
            left: hoveredPoint.x || 0,
            top: hoveredPoint.y || 0,
            transform: 'translate(-50%, -100%)',
          }}>
          <div className="text-sm">
            <div className="font-semibold text-gray-900">
              {hoveredPoint.floatId}
            </div>
            <div className="text-gray-600">{hoveredPoint.ocean}</div>
            <div className="mt-1">
              <span className="font-medium">{paramInfo?.label}:</span>{' '}
              {hoveredPoint.value.toFixed(2)} {paramInfo?.unit}
            </div>
            <div>
              <span className="font-medium">Depth:</span> {hoveredPoint.depth}m
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
    // Load comprehensive profile data for all floats and parameters
    const generateProfileData = (floatId, parameter, oceanType) => {
      const profiles = {
        2901234: { ocean: 'North Pacific', lat: 35.5, lon: -150.0 },
        2901235: { ocean: 'South Pacific', lat: -25.0, lon: -110.0 },
        2901236: { ocean: 'North Atlantic', lat: 40.0, lon: -50.0 },
        2901237: { ocean: 'South Atlantic', lat: -30.0, lon: -20.0 },
        2901238: { ocean: 'Indian Ocean', lat: -15.0, lon: 70.0 },
        2901239: { ocean: 'Indian Ocean', lat: 5.0, lon: 85.0 },
        2901242: { ocean: 'Indian Ocean', lat: -5.0, lon: 95.0 },
        2901243: { ocean: 'Indian Ocean', lat: 10.0, lon: 75.0 },
        2901244: { ocean: 'Indian Ocean', lat: -25.0, lon: 45.0 },
        2901245: { ocean: 'Indian Ocean', lat: 0.0, lon: 65.0 },
        2901246: { ocean: 'Indian Ocean', lat: -20.0, lon: 105.0 },
        2901240: { ocean: 'Arctic Ocean', lat: 75.0, lon: -150.0 },
        2901241: { ocean: 'Southern Ocean', lat: -60.0, lon: 0.0 },
      };

      const floatInfo = profiles[floatId];
      if (!floatInfo) return [];

      const depthLevels = 100;
      const data = [];

      for (let i = 0; i < depthLevels; i++) {
        const depth = i * 20; // 0 to 2000m in 20m increments

        let value;
        switch (parameter) {
          case 'temperature':
            // Temperature decreases with depth, varies by ocean
            const surfaceTemp =
              floatInfo.ocean === 'Arctic Ocean'
                ? -1.2
                : floatInfo.ocean === 'Southern Ocean'
                ? 2.1
                : floatInfo.ocean.includes('Pacific')
                ? 20
                : floatInfo.ocean.includes('Atlantic')
                ? 17
                : floatInfo.ocean === 'Indian Ocean'
                ? 28
                : 25;
            value = surfaceTemp - depth * 0.015 + Math.sin(depth * 0.01) * 0.5;
            break;

          case 'salinity':
            // Salinity generally increases with depth
            const surfaceSalinity =
              floatInfo.ocean === 'Arctic Ocean'
                ? 32.1
                : floatInfo.ocean === 'Southern Ocean'
                ? 34.5
                : floatInfo.ocean.includes('Pacific')
                ? 34.8
                : floatInfo.ocean.includes('Atlantic')
                ? 35.4
                : floatInfo.ocean === 'Indian Ocean'
                ? 35.0
                : 35.0;
            value =
              surfaceSalinity + depth * 0.0008 + Math.sin(depth * 0.005) * 0.1;
            break;

          case 'pressure':
            // Pressure increases linearly with depth (1 dbar per meter)
            value = depth + Math.random() * 0.1;
            break;

          case 'oxygen':
            // Oxygen decreases with depth due to biological consumption
            const surfaceO2 = 250 + Math.random() * 50;
            value =
              surfaceO2 * Math.exp(-depth / 1000) + Math.sin(depth * 0.02) * 10;
            break;

          default:
            value = Math.random() * 100;
        }

        data.push({ depth, value: parseFloat(value.toFixed(2)) });
      }

      return data;
    };

    const mockProfiles = [];
    const allFloats = [
      '2901234',
      '2901235',
      '2901236',
      '2901237',
      '2901238',
      '2901239',
      '2901242',
      '2901243',
      '2901244',
      '2901245',
      '2901246',
      '2901240',
      '2901241',
    ];
    const allParameters = ['temperature', 'salinity', 'pressure', 'oxygen'];

    // Generate data for all float-parameter combinations
    allFloats.forEach((floatId) => {
      allParameters.forEach((parameter) => {
        mockProfiles.push({
          floatId,
          parameter,
          data: generateProfileData(floatId, parameter),
          ocean:
            floatId.startsWith('290123') &&
            ['8', '9'].includes(floatId.slice(-1))
              ? 'Indian Ocean'
              : floatId === '2901234'
              ? 'North Pacific'
              : floatId === '2901235'
              ? 'South Pacific'
              : floatId === '2901236'
              ? 'North Atlantic'
              : floatId === '2901237'
              ? 'South Atlantic'
              : floatId === '2901240'
              ? 'Arctic Ocean'
              : floatId === '2901241'
              ? 'Southern Ocean'
              : 'Indian Ocean',
          lastUpdate: new Date(
            Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split('T')[0],
        });
      });
    });

    setPlotData(mockProfiles);
    setSelectedFloats(['2901238', '2901239', '2901242']); // Default to Indian Ocean floats
  }, []);

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
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 mr-2">Show floats:</span>
            {plotData
              ?.filter(
                (profile, index, self) =>
                  index === self.findIndex((p) => p.floatId === profile.floatId)
              )
              .map((profile) => (
                <button
                  key={profile.floatId}
                  onClick={() => handleFloatToggle(profile.floatId)}
                  className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                    selectedFloats.includes(profile.floatId)
                      ? 'bg-orange-100 text-orange-800 border-orange-300'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}>
                  {profile.floatId} ({profile.ocean})
                </button>
              ))}
          </div>

          {/* Profile Statistics */}
          {plotData && selectedParameter && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {
                    plotData.filter(
                      (p) =>
                        p.parameter === selectedParameter &&
                        selectedFloats.includes(p.floatId)
                    ).length
                  }
                </div>
                <div className="text-xs text-gray-600">Active Profiles</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {plotData
                    .filter(
                      (p) =>
                        p.parameter === selectedParameter &&
                        selectedFloats.includes(p.floatId)
                    )
                    .reduce(
                      (max, profile) =>
                        Math.max(max, ...profile.data.map((d) => d.depth)),
                      0
                    )}
                  m
                </div>
                <div className="text-xs text-gray-600">Max Depth</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {Math.min(
                    ...plotData
                      .filter(
                        (p) =>
                          p.parameter === selectedParameter &&
                          selectedFloats.includes(p.floatId)
                      )
                      .flatMap((profile) => profile.data.map((d) => d.value))
                  ).toFixed(1)}
                  {parameters.find((p) => p.id === selectedParameter)?.unit}
                </div>
                <div className="text-xs text-gray-600">Min Value</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {Math.max(
                    ...plotData
                      .filter(
                        (p) =>
                          p.parameter === selectedParameter &&
                          selectedFloats.includes(p.floatId)
                      )
                      .flatMap((profile) => profile.data.map((d) => d.value))
                  ).toFixed(1)}
                  {parameters.find((p) => p.id === selectedParameter)?.unit}
                </div>
                <div className="text-xs text-gray-600">Max Value</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Plot Area */}
      <div className="flex-1 p-4">
        <div className="h-full bg-white rounded-lg border border-[--color-border]">
          {/* Chart Header */}
          <div className="p-4 border-b border-gray-200">
            <h4 className="text-lg font-medium text-gray-900 mb-1">
              {parameters.find((p) => p.id === selectedParameter)?.label} vs
              Depth
            </h4>
            <p className="text-sm text-gray-600">
              {selectedFloats.length} profile
              {selectedFloats.length !== 1 ? 's' : ''} from{' '}
              {
                new Set(
                  plotData
                    ?.filter(
                      (p) =>
                        selectedFloats.includes(p.floatId) &&
                        p.parameter === selectedParameter
                    )
                    .map((p) => p.ocean)
                ).size
              }{' '}
              ocean
              {new Set(
                plotData
                  ?.filter(
                    (p) =>
                      selectedFloats.includes(p.floatId) &&
                      p.parameter === selectedParameter
                  )
                  .map((p) => p.ocean)
              ).size !== 1
                ? 's'
                : ''}
            </p>
          </div>

          {/* Interactive Chart */}
          <div className="p-4 h-full">
            {plotData && selectedFloats.length > 0 ? (
              <div className="h-full">
                <ProfileChart
                  data={plotData.filter(
                    (p) =>
                      p.parameter === selectedParameter &&
                      selectedFloats.includes(p.floatId)
                  )}
                  parameter={selectedParameter}
                  parameters={parameters}
                />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    No Profiles Selected
                  </h4>
                  <p className="text-sm text-gray-600">
                    Select one or more floats to display depth profiles
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
