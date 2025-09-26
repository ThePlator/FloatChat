import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative pt-28 sm:pt-36 pb-28 sm:pb-36 text-center overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(1200px 600px at 50% -10%, rgba(15, 23, 42, 0.06), transparent), radial-gradient(1000px 600px at 120% 10%, rgba(249, 115, 22, 0.08), transparent)',
        }}
      />
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-[--color-accent-light] text-[--color-accent] mb-6">
          <span className="h-2 w-2 rounded-full bg-[--color-accent]"></span>
          Now in preview — QuARGO for ARGO data
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-slate-900 to-slate-700 bg-clip-text text-transparent">
          Conversational AI for Ocean Data Exploration.
        </h1>
        <p className="text-lg text-[--color-text-secondary] max-w-3xl mx-auto mb-8">
          Leveraging AI to unlock insights from ARGO float data through natural
          language.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-xl bg-[--color-accent] text-white px-8 py-4 text-lg font-semibold shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:bg-[#EA580C]">
            Start Exploring
          </Link>
          <a
            href="#features"
            className="inline-flex items-center justify-center rounded-xl border border-[--color-border] px-8 py-4 text-lg font-semibold hover:bg-white/70">
            Learn more
          </a>
        </div>
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 text-left max-w-4xl mx-auto">
          <div className="p-4 rounded-xl border border-[--color-border] bg-white/70">
            <div className="text-2xl font-bold text-slate-900">3k+</div>
            <div className="text-sm text-[--color-text-secondary]">
              ARGO floats
            </div>
          </div>
          <div className="p-4 rounded-xl border border-[--color-border] bg-white/70">
            <div className="text-2xl font-bold text-slate-900">20M+</div>
            <div className="text-sm text-[--color-text-secondary]">
              Profiles indexed
            </div>
          </div>
          <div className="p-4 rounded-xl border border-[--color-border] bg-white/70">
            <div className="text-2xl font-bold text-slate-900">15+</div>
            <div className="text-sm text-[--color-text-secondary]">
              BGC parameters
            </div>
          </div>
          <div className="p-4 rounded-xl border border-[--color-border] bg-white/70">
            <div className="text-2xl font-bold text-slate-900">1-click</div>
            <div className="text-sm text-[--color-text-secondary]">
              Data export
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
