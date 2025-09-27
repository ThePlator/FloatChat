'use client';
import { useState } from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import ChatSidebar from '../../components/dashboard/ChatSidebar';
import VisualizationPanel from '../../components/dashboard/VisualizationPanel';

export default function DashboardPage() {
  const [queryData, setQueryData] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false);

  const handleQuerySubmit = (query) => {
    // This would typically send the query to your backend
    console.log('Query submitted:', query);
    setQueryData({
      query: query,
      timestamp: new Date(),
      id: Date.now(),
    });
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setHasNewMessages(false);
    }
  };

  return (
    <div className="font-sans h-screen flex flex-col bg-gray-50 relative">
      {/* Header */}
      <DashboardHeader />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-auto">
        {/* Visualization Panel - Full Width */}
        <div className="flex-1 flex flex-col h-full">
          <VisualizationPanel queryData={queryData} />
        </div>
      </div>

      {/* Floating Chat Toggle Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-orange-300"
        title={isChatOpen ? 'Close Chat' : 'Open Chat Assistant'}>
        {isChatOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
        {/* Notification Badge */}
        {hasNewMessages && !isChatOpen && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            !
          </span>
        )}
      </button>

      {/* Floating Chat Window */}
      {isChatOpen && (
        <div className="fixed top-20 right-6 z-40 w-96 h-[calc(100vh-8rem)] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col animate-in slide-in-from-right-5 duration-300">
          {/* Chat Header with Close Button */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-orange-100 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="mr-2">🤖</span>
                  ARGO Data Assistant
                </h2>
                <p className="text-sm text-gray-600">
                  Ask me anything about ocean data
                </p>
              </div>
              <button
                onClick={toggleChat}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-white hover:shadow-sm">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Chat Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <ChatSidebar onQuerySubmit={handleQuerySubmit} />
          </div>
        </div>
      )}
    </div>
  );
}
