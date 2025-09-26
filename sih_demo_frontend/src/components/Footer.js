import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-[#A0AEC0] py-14">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div className="flex items-center gap-3 text-white">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold">
              Q
            </div>
            <span className="font-semibold">QuARGO</span>
          </div>
          <nav className="flex gap-6">
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <a
              href="https://github.com/"
              className="hover:text-white transition-colors"
              target="_blank"
              rel="noreferrer">
              GitHub
            </a>
          </nav>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-sm">
          <p>© 2025 QuARGO. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Data acknowledgments to the ARGO program and its data providers.
          </p>
        </div>
      </div>
    </footer>
  );
}
