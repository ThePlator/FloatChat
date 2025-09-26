'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
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
          <a href="#features" className="hover:text-slate-900">
            Features
          </a>
          <a href="#how" className="hover:text-slate-900">
            How It Works
          </a>
          <a href="#about" className="hover:text-slate-900">
            About
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <button className="hidden md:inline-flex items-center rounded-md border border-[--color-border] px-4 py-2 text-sm font-medium hover:bg-slate-50">
            Contact
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-md bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-[#333333] shadow-sm">
            Launch Dashboard
          </Link>
          <button
            aria-label="Open menu"
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-md border border-[--color-border]"
            onClick={() => setOpen((v) => !v)}>
            <span className="i-heroicons-bars-3 w-5 h-5">≡</span>
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-[--color-border] bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex flex-col gap-4 text-sm">
            <a href="#features" onClick={() => setOpen(false)} className="py-1">
              Features
            </a>
            <a href="#how" onClick={() => setOpen(false)} className="py-1">
              How It Works
            </a>
            <a href="#about" onClick={() => setOpen(false)} className="py-1">
              About
            </a>
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="py-2 rounded-md bg-slate-900 text-white text-center">
              Launch Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
