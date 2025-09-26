'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function DashboardHeader() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Simulate connection status check
    const checkConnection = () => {
      // In a real app, this would ping your backend
      setIsConnected(true);
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-saturate-180 backdrop-blur-[6px] bg-white/80 border-b border-[--color-border]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            Q
          </div>
          <div className="text-xl font-bold tracking-tight">QuARGO</div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm text-[--color-text-secondary]">
          <Link href="/" className="hover:text-slate-900">
            Home
          </Link>
          <Link href="/about" className="hover:text-slate-900">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
            <span className="text-sm text-[--color-text-secondary]">
              {isConnected ? 'LLM Connected' : 'LLM Disconnected'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">U</span>
            </div>
            <span className="text-sm text-[--color-text-secondary]">User</span>
          </div>
        </div>
      </div>
    </header>
  );
}
