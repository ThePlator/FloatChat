import { PointerHighlight } from '@/components/ui/pointer-highlight';

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="max-w-2xl mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Powerful features
          </h2>
          <p className="mt-3 text-[--color-text-secondary]">
            Everything you need to explore ARGO data conversationally and
            visually.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-[--color-border] bg-[--color-card] p-6 shadow-sm">
            <div className="h-40 w-full rounded-xl bg-linear-to-r from-blue-200 to-sky-200" />
            <div className="mx-auto mt-4 max-w-lg text-base font-bold tracking-tight md:text-base text-slate-900">
              <PointerHighlight
                rectangleClassName="bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 leading-loose"
                pointerClassName="text-yellow-500 h-3 w-3"
                containerClassName="inline-block mr-1">
                <span className="relative z-10">Natural Language</span>
              </PointerHighlight>
              query to ask complex questions in plain English.
            </div>
            <p className="mt-4 text-sm text-[--color-text-secondary]">
              Ask anything about ARGO data without code or technical jargon.
            </p>
          </div>

          <div className="rounded-2xl border border-[--color-border] bg-[--color-card] p-6 shadow-sm">
            <div className="h-40 w-full rounded-xl bg-linear-to-r from-blue-200 to-purple-200" />
            <div className="mx-auto mt-4 max-w-lg text-base font-bold tracking-tight md:text-base text-slate-900">
              Explore
              <PointerHighlight
                rectangleClassName="bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 leading-loose"
                pointerClassName="text-blue-500 h-3 w-3"
                containerClassName="inline-block mx-1">
                <span className="relative z-10">interactive maps</span>
              </PointerHighlight>
              with geospatial visualizations.
            </div>
            <p className="mt-4 text-sm text-[--color-text-secondary]">
              Visualize float trajectories and data points on a dynamic globe.
            </p>
          </div>

          <div className="rounded-2xl border border-[--color-border] bg-[--color-card] p-6 shadow-sm">
            <div className="h-40 w-full rounded-xl bg-linear-45 from-green-200 to-yellow-200" />
            <div className="mx-auto mt-4 max-w-lg text-base font-bold tracking-tight md:text-base text-slate-900">
              Generate
              <PointerHighlight
                rectangleClassName="bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700 leading-loose"
                pointerClassName="text-green-500 h-3 w-3"
                containerClassName="inline-block ml-1">
                <span className="relative z-10">rich profile plots</span>
              </PointerHighlight>
              and export data easily.
            </div>
            <p className="mt-4 text-sm text-[--color-text-secondary]">
              Compare temperature, salinity, BGC profiles, and export to
              CSV/NetCDF.
            </p>
          </div>

          <div className="rounded-2xl border border-[--color-border] bg-[--color-card] p-6 shadow-sm">
            <div className="h-40 w-full rounded-xl bg-linear-to-r from-orange-200 to-rose-200" />
            <div className="mx-auto mt-4 max-w-lg text-base font-bold tracking-tight md:text-base text-slate-900">
              <PointerHighlight
                rectangleClassName="bg-rose-100 dark:bg-rose-900 border-rose-300 dark:border-rose-700 leading-loose"
                pointerClassName="text-rose-500 h-3 w-3"
                containerClassName="inline-block mr-1">
                <span className="relative z-10">one‑click export</span>
              </PointerHighlight>
              to CSV and NetCDF formats.
            </div>
            <p className="mt-4 text-sm text-[--color-text-secondary]">
              Seamlessly download curated datasets for offline analysis and
              sharing.
            </p>
          </div>

          <div className="rounded-2xl border border-[--color-border] bg-[--color-card] p-6 shadow-sm">
            <div className="h-40 w-full rounded-xl bg-linear-to-r from-indigo-200 to-cyan-200" />
            <div className="mx-auto mt-4 max-w-lg text-base font-bold tracking-tight md:text-base text-slate-900">
              Built‑in
              <PointerHighlight
                rectangleClassName="bg-indigo-100 dark:bg-indigo-900 border-indigo-300 dark:border-indigo-700 leading-loose"
                pointerClassName="text-indigo-500 h-3 w-3"
                containerClassName="inline-block mx-1">
                <span className="relative z-10">collaboration</span>
              </PointerHighlight>
              for teams.
            </div>
            <p className="mt-4 text-sm text-[--color-text-secondary]">
              Share queries, charts, and insights with teammates effortlessly.
            </p>
          </div>

          <div className="rounded-2xl border border-[--color-border] bg-[--color-card] p-6 shadow-sm">
            <div className="h-40 w-full rounded-xl bg-linear-to-r from-slate-200 to-gray-200" />
            <div className="mx-auto mt-4 max-w-lg text-base font-bold tracking-tight md:text-base text-slate-900">
              Real‑time
              <PointerHighlight
                rectangleClassName="bg-neutral-200 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 leading-loose"
                pointerClassName="text-neutral-600 h-3 w-3"
                containerClassName="inline-block ml-1">
                <span className="relative z-10">alerts</span>
              </PointerHighlight>
              and monitoring.
            </div>
            <p className="mt-4 text-sm text-[--color-text-secondary]">
              Set thresholds to get notified on significant changes in ARGO
              data.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
