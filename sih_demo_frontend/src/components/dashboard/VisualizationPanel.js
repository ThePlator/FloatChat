'use client';
import { useState } from 'react';
import MapView from './MapView';
import ProfilePlots from './ProfilePlots';
import TimeSeries from './TimeSeries';
import DataTable from './DataTable';

export default function VisualizationPanel({ queryData }) {
  const [activeTab, setActiveTab] = useState('map');

  const tabs = [
    { id: 'map', label: '🗺️ Map View', component: MapView },
    { id: 'profiles', label: '📊 Profile Plots', component: ProfilePlots },
    { id: 'timeseries', label: '📈 Time-Series', component: TimeSeries },
    { id: 'table', label: '📋 Data Table', component: DataTable },
  ];

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Tab Navigation */}
      <div className="border-b border-[--color-border] flex-shrink-0">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-[--color-text-secondary] hover:text-gray-700 hover:border-gray-300'
              }`}>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto min-h-0">
        {ActiveComponent && <ActiveComponent queryData={queryData} />}
      </div>
    </div>
  );
}
