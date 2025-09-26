export default function GlossarySection() {
  return (
    <section id="glossary" className="py-10 border-t border-[--color-border]">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
        Acronyms & Glossary
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-[--color-border] bg-white hover:shadow-sm transition-all">
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="font-semibold text-slate-900">ARGO</dt>
              <dd className="text-[--color-text-secondary]">
                A global array of autonomous floats measuring the upper ocean.
              </dd>
            </div>
            <hr className="border-t border-[--color-border]" />
            <div>
              <dt className="font-semibold text-slate-900">BGC</dt>
              <dd className="text-[--color-text-secondary]">
                Biogeochemical parameters measured by some floats (e.g., oxygen,
                nitrate, pH).
              </dd>
            </div>
            <hr className="border-t border-[--color-border]" />
            <div>
              <dt className="font-semibold text-slate-900">CTD</dt>
              <dd className="text-[--color-text-secondary]">
                Conductivity–Temperature–Depth instrumentation for ocean
                profiling.
              </dd>
            </div>
            <hr className="border-t border-[--color-border]" />
            <div>
              <dt className="font-semibold text-slate-900">NetCDF</dt>
              <dd className="text-[--color-text-secondary]">
                Network Common Data Form; a self-describing, array-oriented data
                format.
              </dd>
            </div>
          </dl>
        </div>
        <div className="p-4 rounded-xl border border-[--color-border] bg-white hover:shadow-sm transition-all">
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="font-semibold text-slate-900">Salinity</dt>
              <dd className="text-[--color-text-secondary]">
                A measure of dissolved salts in seawater, commonly PSU or
                PSS-78.
              </dd>
            </div>
            <hr className="border-t border-[--color-border]" />
            <div>
              <dt className="font-semibold text-slate-900">RAG</dt>
              <dd className="text-[--color-text-secondary]">
                Retrieval Augmented Generation; combines LLMs with relevant
                external data.
              </dd>
            </div>
            <hr className="border-t border-[--color-border]" />
            <div>
              <dt className="font-semibold text-slate-900">GDAC</dt>
              <dd className="text-[--color-text-secondary]">
                Global Data Assembly Center; official ARGO data distribution
                hubs.
              </dd>
            </div>
            <hr className="border-t border-[--color-border]" />
            <div>
              <dt className="font-semibold text-slate-900">Isopycnal</dt>
              <dd className="text-[--color-text-secondary]">
                A surface of constant density in the ocean; used to compare
                water masses.
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <p className="mt-4 text-xs text-[--color-text-secondary]">
        For official definitions and standards, refer to the ARGO user manuals
        and the NetCDF conventions.
      </p>
    </section>
  );
}
