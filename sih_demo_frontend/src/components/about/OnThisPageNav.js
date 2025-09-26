'use client';
import { useEffect, useState } from 'react';

const links = [
  { id: 'overview', label: 'Project Overview' },
  { id: 'sources', label: 'Data Sources' },
  { id: 'guide', label: 'User Guide' },
  { id: 'glossary', label: 'Acronyms & Glossary' },
];

export default function OnThisPageNav() {
  const [active, setActive] = useState('overview');

  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { root: null, threshold: 0.25 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="On this page"
      className="mb-10 sticky top-16 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-y border-[--color-border] py-3">
      <ul className="flex flex-wrap gap-2 text-sm">
        {links.map((l) => (
          <li key={l.id}>
            <a
              href={`#${l.id}`}
              className={`px-3 py-1 rounded-full border transition-colors ${
                active === l.id
                  ? 'border-[--color-accent] text-[--color-accent] bg-[--color-accent-light]'
                  : 'border-[--color-border] hover:bg-slate-50'
              }`}>
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
