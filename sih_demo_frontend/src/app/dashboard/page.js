'use client';
import { useState } from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import ChatSidebar from '../../components/dashboard/ChatSidebar';
import VisualizationPanel from '../../components/dashboard/VisualizationPanel';

export default function DashboardPage() {
  const [queryData, setQueryData] = useState(null);

  const handleQuerySubmit = (query) => {
    // This would typically send the query to your backend
    console.log('Query submitted:', query);
    setQueryData({
      query: query,
      timestamp: new Date(),
      id: Date.now(),
    });
  };

  return (
    <div className="font-sans h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <DashboardHeader />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Sidebar */}
        <div className="w-80 flex-shrink-0">
          <ChatSidebar onQuerySubmit={handleQuerySubmit} />
        </div>

        {/* Visualization Panel */}
        <div className="flex-1 flex flex-col">
          <VisualizationPanel queryData={queryData} />
        </div>
      </div>
    </div>
  );
}
