export default function UserGuideSection() {
  return (
    <section id="guide" className="py-10 border-t border-[--color-border]">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
        User Guide
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h3 className="font-semibold text-slate-900">Formulating queries</h3>
          <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              'Start with a goal: e.g., “Show temperature profiles near 30°N, 140°W in 2022.”',
              'Specify region (lat/lon or area), time period, and variables.',
              'Use comparison language for multi-set analysis: “Compare 2010 vs 2020.”',
              'Ask follow-ups to refine: “Filter for depths above 1000 m.”',
            ].map((text, i) => (
              <li
                key={i}
                className="p-4 rounded-xl border border-[--color-border] bg-white hover:shadow-sm transition-all">
                <span className="inline-flex items-center justify-center h-6 w-6 text-xs rounded-full bg-[--color-accent-light] text-[--color-accent] mr-2 align-middle">
                  {i + 1}
                </span>
                <span className="text-sm text-[--color-text-secondary] align-middle">
                  {text}
                </span>
              </li>
            ))}
          </ul>

          <h3 className="mt-6 font-semibold text-slate-900">
            Using the dashboard
          </h3>
          <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              'Map: pan/zoom, draw selection boxes, and inspect individual floats.',
              'Profiles: view temperature/salinity/BGC profiles; toggle overlays and units.',
              'Compare: select multiple results to generate side-by-side visualizations.',
              'Export: download subsets as CSV/ASCII/NetCDF for offline analysis.',
            ].map((text, i) => (
              <li
                key={i}
                className="p-4 rounded-xl border border-[--color-border] bg-white hover:shadow-sm transition-all">
                <span className="inline-flex items-center justify-center h-6 w-6 text-xs rounded-full bg-[--color-accent-light] text-[--color-accent] mr-2 align-middle">
                  {i + 1}
                </span>
                <span className="text-sm text-[--color-text-secondary] align-middle">
                  {text}
                </span>
              </li>
            ))}
          </ul>

          <h3 className="mt-6 font-semibold text-slate-900">
            Interpreting results
          </h3>
          <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              'Profiles are vertically referenced by pressure; check calibration flags.',
              'Geospatial visualizations display trajectories and profile locations.',
              'Quality flags indicate data status; apply filters for research-grade analyses.',
            ].map((text, i) => (
              <li
                key={i}
                className="p-4 rounded-xl border border-[--color-border] bg-white hover:shadow-sm transition-all">
                <span className="inline-flex items-center justify-center h-6 w-6 text-xs rounded-full bg-[--color-accent-light] text-[--color-accent] mr-2 align-middle">
                  {i + 1}
                </span>
                <span className="text-sm text-[--color-text-secondary] align-middle">
                  {text}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <aside className="lg:col-span-1">
          <div className="p-4 rounded-xl border border-[--color-border] bg-white">
            <h4 className="font-semibold text-slate-900">Tips</h4>
            <ul className="mt-2 list-disc list-inside text-sm text-[--color-text-secondary] space-y-1">
              <li>Be explicit about time ranges and depth/pressure levels.</li>
              <li>
                Use domain terms (e.g., “isopycnal”) when relevant; the model
                understands them.
              </li>
              <li>
                When in doubt, ask “What did you query?” to see provenance.
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
