'use client';
import { useState, useEffect } from 'react';

// TimeSeriesChart Component for rendering time series data
function TimeSeriesChart({ data, parameter, parameters }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  
  if (!data || data.length === 0) return null;

  const paramInfo = parameters.find(p => p.id === parameter);
  
  // Calculate chart dimensions and scaling
  const chartWidth = 700;
  const chartHeight = 300;
  const margin = { top: 20, right: 60, bottom: 60, left: 80 };
  const plotWidth = chartWidth - margin.left - margin.right;
  const plotHeight = chartHeight - margin.top - margin.bottom;

  // Convert dates and find min/max values
  const dates = data.map(d => new Date(d.date).getTime());
  const values = data.map(d => d.value);
  
  const minDate = Math.min(...dates);
  const maxDate = Math.max(...dates);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  
  // Add padding to ranges
  const dateRange = maxDate - minDate;
  const valueRange = maxValue - minValue;
  const datePadding = dateRange * 0.02;
  const valuePadding = valueRange * 0.1;
  
  const scaledMinDate = minDate - datePadding;
  const scaledMaxDate = maxDate + datePadding;
  const scaledMinValue = minValue - valuePadding;
  const scaledMaxValue = maxValue + valuePadding;

  // Scale functions
  const scaleX = (timestamp) => margin.left + ((timestamp - scaledMinDate) / (scaledMaxDate - scaledMinDate)) * plotWidth;
  const scaleY = (value) => margin.top + plotHeight - ((value - scaledMinValue) / (scaledMaxValue - scaledMinValue)) * plotHeight;

  // Create line path
  const linePath = data.map(d => `${scaleX(new Date(d.date).getTime())},${scaleY(d.value)}`).join(' ');

  return (
    <div className="w-full">
      <svg width={chartWidth} height={chartHeight} className="border rounded-lg bg-gray-50">
        {/* Grid lines */}
        <defs>
          <pattern id="timegrid" width="100" height="40" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width={plotWidth} height={plotHeight} x={margin.left} y={margin.top} fill="url(#timegrid)" />
        
        {/* Time series line */}
        <polyline
          points={linePath}
          fill="none"
          stroke="#f97316"
          strokeWidth="3"
          opacity="0.8"
        />
        
        {/* Data points */}
        {data.map((point, index) => (
          <circle
            key={index}
            cx={scaleX(new Date(point.date).getTime())}
            cy={scaleY(point.value)}
            r="4"
            fill="#f97316"
            stroke="white"
            strokeWidth="2"
            opacity="0.9"
            onMouseEnter={(e) => {
              const rect = e.target.getBoundingClientRect();
              setHoveredPoint({
                ...point,
                x: rect.left + rect.width / 2,
                y: rect.top - 10
              });
            }}
            onMouseLeave={() => setHoveredPoint(null)}
          />
        ))}
        
        {/* Axes */}
        <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + plotHeight} stroke="#374151" strokeWidth="2" />
        <line x1={margin.left} y1={margin.top + plotHeight} x2={margin.left + plotWidth} y2={margin.top + plotHeight} stroke="#374151" strokeWidth="2" />
        
        {/* Y-axis labels (Parameter values) */}
        {(() => {
          const numTicks = 5;
          const tickValues = [];
          for (let i = 0; i <= numTicks; i++) {
            const value = scaledMinValue + (i / numTicks) * (scaledMaxValue - scaledMinValue);
            tickValues.push(value);
          }
          return tickValues.map((value, index) => (
            <g key={index}>
              <line x1={margin.left - 5} y1={scaleY(value)} x2={margin.left} y2={scaleY(value)} stroke="#374151" strokeWidth="1" />
              <text x={margin.left - 10} y={scaleY(value) + 4} textAnchor="end" fontSize="12" fill="#374151">
                {value.toFixed(1)}
              </text>
            </g>
          ));
        })()}
        
        {/* X-axis labels (Dates) */}
        {(() => {
          const numTicks = 6;
          const tickDates = [];
          for (let i = 0; i <= numTicks; i++) {
            const date = new Date(scaledMinDate + (i / numTicks) * (scaledMaxDate - scaledMinDate));
            tickDates.push(date);
          }
          return tickDates.map((date, index) => (
            <g key={index}>
              <line x1={scaleX(date.getTime())} y1={margin.top + plotHeight} x2={scaleX(date.getTime())} y2={margin.top + plotHeight + 5} stroke="#374151" strokeWidth="1" />
              <text x={scaleX(date.getTime())} y={margin.top + plotHeight + 20} textAnchor="middle" fontSize="11" fill="#374151">
                {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </text>
            </g>
          ));
        })()}
        
        {/* Axis labels */}
        <text x={margin.left + plotWidth / 2} y={chartHeight - 10} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#374151">
          Date
        </text>
        <text x={20} y={margin.top + plotHeight / 2} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#374151" transform={`rotate(-90, 20, ${margin.top + plotHeight / 2})`}>
          {paramInfo?.label} ({paramInfo?.unit})
        </text>
        
        {/* Trend line (simple linear regression) */}
        {data.length > 1 && (() => {
          const n = data.length;
          const sumX = data.reduce((sum, d, i) => sum + i, 0);
          const sumY = data.reduce((sum, d) => sum + d.value, 0);
          const sumXY = data.reduce((sum, d, i) => sum + i * d.value, 0);
          const sumXX = data.reduce((sum, d, i) => sum + i * i, 0);
          
          const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
          const intercept = (sumY - slope * sumX) / n;
          
          const startY = intercept;
          const endY = intercept + slope * (n - 1);
          
          return (
            <line
              x1={scaleX(new Date(data[0].date).getTime())}
              y1={scaleY(startY)}
              x2={scaleX(new Date(data[data.length - 1].date).getTime())}
              y2={scaleY(endY)}
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.7"
            />
          );
        })()}
      </svg>
      
      {/* Tooltip */}
      {hoveredPoint && (
        <div 
          className="absolute bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-10 pointer-events-none"
          style={{
            left: hoveredPoint.x || 0,
            top: hoveredPoint.y || 0,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="text-sm">
            <div className="font-semibold text-gray-900">
              {new Date(hoveredPoint.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div className="mt-1">
              <span className="font-medium">{paramInfo?.label}:</span> {hoveredPoint.value.toFixed(2)} {paramInfo?.unit}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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

  const availableFloats = [
    { id: '2901234', name: 'Float 2901234', ocean: 'North Pacific' },
    { id: '2901235', name: 'Float 2901235', ocean: 'South Pacific' },
    { id: '2901236', name: 'Float 2901236', ocean: 'North Atlantic' },
    { id: '2901237', name: 'Float 2901237', ocean: 'South Atlantic' },
    { id: '2901238', name: 'Float 2901238', ocean: 'Indian Ocean' },
    { id: '2901239', name: 'Float 2901239', ocean: 'Indian Ocean' },
    { id: '2901242', name: 'Float 2901242', ocean: 'Indian Ocean' },
    { id: '2901243', name: 'Float 2901243', ocean: 'Indian Ocean' },
    { id: '2901244', name: 'Float 2901244', ocean: 'Indian Ocean' },
    { id: '2901245', name: 'Float 2901245', ocean: 'Indian Ocean' },
    { id: '2901246', name: 'Float 2901246', ocean: 'Indian Ocean' },
    { id: '2901240', name: 'Float 2901240', ocean: 'Arctic Ocean' },
    { id: '2901241', name: 'Float 2901241', ocean: 'Southern Ocean' },
  ];

  useEffect(() => {
    // Generate comprehensive time series data
    const generateTimeSeriesData = (floatId, parameter, timeRange) => {
      const floatInfo = availableFloats.find((f) => f.id === floatId);
      if (!floatInfo) return [];

      // Determine number of data points based on time range
      let dataPoints;
      let daysBack;
      switch (timeRange) {
        case '1week':
          dataPoints = 7;
          daysBack = 7;
          break;
        case '1month':
          dataPoints = 30;
          daysBack = 30;
          break;
        case '3months':
          dataPoints = 90;
          daysBack = 90;
          break;
        case '6months':
          dataPoints = 180;
          daysBack = 180;
          break;
        case '1year':
          dataPoints = 365;
          daysBack = 365;
          break;
        case 'all':
          dataPoints = 730;
          daysBack = 730;
          break;
        default:
          dataPoints = 30;
          daysBack = 30;
      }

      const data = [];
      const baseValues = {
        2901234: { temp: 22.3, sal: 34.8, press: 1200, oxy: 220 }, // North Pacific
        2901235: { temp: 18.7, sal: 35.1, press: 1500, oxy: 240 }, // South Pacific
        2901236: { temp: 15.2, sal: 35.4, press: 1800, oxy: 260 }, // North Atlantic
        2901237: { temp: 19.8, sal: 34.9, press: 1000, oxy: 230 }, // South Atlantic
        2901238: { temp: 26.5, sal: 35.2, press: 800, oxy: 210 }, // Indian Ocean
        2901239: { temp: 28.9, sal: 34.7, press: 600, oxy: 200 }, // Indian Ocean
        2901242: { temp: 29.2, sal: 34.6, press: 900, oxy: 205 }, // Indian Ocean
        2901243: { temp: 27.8, sal: 35.0, press: 1100, oxy: 215 }, // Indian Ocean
        2901244: { temp: 23.1, sal: 35.3, press: 1400, oxy: 235 }, // Indian Ocean
        2901245: { temp: 29.5, sal: 34.5, press: 750, oxy: 195 }, // Indian Ocean
        2901246: { temp: 24.8, sal: 35.1, press: 1200, oxy: 225 }, // Indian Ocean
        2901240: { temp: -1.2, sal: 32.1, press: 400, oxy: 280 }, // Arctic Ocean
        2901241: { temp: 2.1, sal: 34.5, press: 2000, oxy: 290 }, // Southern Ocean
      };

      const base = baseValues[floatId] || baseValues['2901238'];

      for (let i = 0; i < dataPoints; i++) {
        const daysAgo = (dataPoints - 1 - i) * (daysBack / dataPoints);
        const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

        let value;
        const seasonalVariation =
          Math.sin((date.getMonth() / 12) * 2 * Math.PI) * 0.5;
        const dailyVariation =
          Math.sin((date.getDate() / 30) * 2 * Math.PI) * 0.1;
        const randomNoise = (Math.random() - 0.5) * 0.3;

        switch (parameter) {
          case 'temperature':
            value =
              base.temp + seasonalVariation + dailyVariation + randomNoise;
            break;
          case 'salinity':
            value =
              base.sal +
              seasonalVariation * 0.1 +
              dailyVariation * 0.05 +
              randomNoise * 0.1;
            break;
          case 'pressure':
            value = base.press + seasonalVariation * 10 + randomNoise * 5;
            break;
          case 'oxygen':
            value =
              base.oxy +
              seasonalVariation * 20 +
              dailyVariation * 5 +
              randomNoise * 10;
            break;
          default:
            value = 25 + Math.random() * 10;
        }

        data.push({
          date: date.toISOString().split('T')[0],
          value: parseFloat(value.toFixed(2)),
          timestamp: date.getTime(),
        });
      }

      return data;
    };

    const mockData = {
      floatId: selectedFloat,
      parameter: selectedParameter,
      timeRange: timeRange,
      data: generateTimeSeriesData(selectedFloat, selectedParameter, timeRange),
      floatInfo: availableFloats.find((f) => f.id === selectedFloat),
    };
    setTimeSeriesData(mockData);
  }, [selectedParameter, selectedFloat, timeRange]);

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
              {availableFloats.map((float) => (
                <option key={float.id} value={float.id}>
                  {float.name} ({float.ocean})
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
              <div className="mb-4 p-4 bg-gray-50 rounded-lg text-sm">
                <div className="mb-3">
                  <h5 className="font-semibold text-gray-900 mb-1">
                    {timeSeriesData.floatInfo?.name} -{' '}
                    {timeSeriesData.floatInfo?.ocean}
                  </h5>
                  <p className="text-xs text-gray-600">
                    {parameters.find((p) => p.id === selectedParameter)?.label}{' '}
                    Time Series
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                  <div>
                    <span className="text-gray-600">Data Points:</span>
                    <span className="ml-2 font-medium">
                      {timeSeriesData.data.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Date Range:</span>
                    <span className="ml-2 font-medium text-xs">
                      {timeSeriesData.data[0]?.date} to{' '}
                      {
                        timeSeriesData.data[timeSeriesData.data.length - 1]
                          ?.date
                      }
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Min Value:</span>
                    <span className="ml-2 font-medium text-orange-600">
                      {Math.min(
                        ...timeSeriesData.data.map((d) => d.value)
                      ).toFixed(2)}{' '}
                      {parameters.find((p) => p.id === selectedParameter)?.unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Max Value:</span>
                    <span className="ml-2 font-medium text-blue-600">
                      {Math.max(
                        ...timeSeriesData.data.map((d) => d.value)
                      ).toFixed(2)}{' '}
                      {parameters.find((p) => p.id === selectedParameter)?.unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Average:</span>
                    <span className="ml-2 font-medium">
                      {(
                        timeSeriesData.data.reduce(
                          (sum, d) => sum + d.value,
                          0
                        ) / timeSeriesData.data.length
                      ).toFixed(2)}{' '}
                      {parameters.find((p) => p.id === selectedParameter)?.unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Std Dev:</span>
                    <span className="ml-2 font-medium">
                      {Math.sqrt(
                        timeSeriesData.data.reduce((sum, d) => {
                          const avg =
                            timeSeriesData.data.reduce(
                              (s, x) => s + x.value,
                              0
                            ) / timeSeriesData.data.length;
                          return sum + Math.pow(d.value - avg, 2);
                        }, 0) / timeSeriesData.data.length
                      ).toFixed(2)}{' '}
                      {parameters.find((p) => p.id === selectedParameter)?.unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Trend:</span>
                    <span className="ml-2 font-medium text-green-600">
                      {timeSeriesData.data.length > 1
                        ? timeSeriesData.data[timeSeriesData.data.length - 1]
                            .value > timeSeriesData.data[0].value
                          ? '↗ Increasing'
                          : '↘ Decreasing'
                        : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Time Range:</span>
                    <span className="ml-2 font-medium">
                      {timeRange === 'all'
                        ? '2 Years'
                        : timeRange === '1year'
                        ? '1 Year'
                        : timeRange === '6months'
                        ? '6 Months'
                        : timeRange === '3months'
                        ? '3 Months'
                        : timeRange === '1month'
                        ? '1 Month'
                        : '1 Week'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Time Series Chart */}
            {timeSeriesData && (
              <div className="mt-6">
                <TimeSeriesChart 
                  data={timeSeriesData.data}
                  parameter={selectedParameter}
                  parameters={parameters}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
