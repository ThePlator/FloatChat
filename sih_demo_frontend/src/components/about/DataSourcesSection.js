export default function DataSourcesSection() {
  return (
    <section id="sources" className="py-10 border-t border-[--color-border]">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
        Data Sources
      </h2>
      <p className="text-[--color-text-secondary] leading-relaxed">
        QuARGO utilizes observational datasets produced by the international
        ARGO program and partner archives. Depending on the query, we may fetch
        core T/S profiles or biogeochemical extensions.
      </p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-[--color-border] bg-white hover:shadow-md hover:-translate-y-0.5 transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-sky-400 to-indigo-500 text-white flex items-center justify-center text-xs">
              ↗
            </div>
            <h3 className="font-semibold text-slate-900">Primary portals</h3>
          </div>
          <ul className="mt-2 list-disc list-inside text-sm text-[--color-text-secondary] space-y-1">
            <li>
              Official ARGO Program —{' '}
              <a
                href="https://argo.ucsd.edu"
                target="_blank"
                rel="noreferrer"
                className="underline">
                argo.ucsd.edu
              </a>
            </li>
            <li>
              Global Data Assembly Centers (GDAC): IFREMER &amp; FNMOC —
              <a
                href="https://www.usgodae.org/argo/argo.html"
                target="_blank"
                rel="noreferrer"
                className="underline">
                {' '}
                USGODAE
              </a>
            </li>
            <li>
              Argo Data Selection Tools —
              <a
                href="https://www.argo.org.cn"
                target="_blank"
                rel="noreferrer"
                className="underline">
                {' '}
                National Argo (examples)
              </a>
            </li>
          </ul>
        </div>
        <div className="p-4 rounded-xl border border-[--color-border] bg-white hover:shadow-md hover:-translate-y-0.5 transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-orange-400 to-rose-500 text-white flex items-center justify-center text-xs">
              ⚙
            </div>
            <h3 className="font-semibold text-slate-900">Coverage & filters</h3>
          </div>
          <ul className="mt-2 list-disc list-inside text-sm text-[--color-text-secondary] space-y-1">
            <li>Date range: ~2000–present (updated daily)</li>
            <li>Regions: global oceans; filter by basin/lat-lon/polygon</li>
            <li>
              Parameters: temperature, salinity, pressure; BGC where available
            </li>
          </ul>
        </div>
      </div>
      <p className="mt-4 text-xs text-[--color-text-secondary]">
        Notes: Availability and cadence vary by float and deployment. Always
        consult official documentation for the most current guidance.
      </p>
    </section>
  );
}
