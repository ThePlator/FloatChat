export default function OverviewSection() {
  return (
    <section
      id="overview"
      className="py-10 border-t border-[--color-border] first:border-t-0">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
        Project Overview
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <p className="text-[--color-text-secondary] leading-relaxed">
            QuARGO is a conversational interface for exploring ARGO float data.
            It lets users pose questions in natural language and instantly view
            results as maps, profile plots, and tables. Our motivation is to
            make high–value ocean observations more accessible for scientists,
            educators, and decision makers without requiring specialized coding
            skills.
          </p>
          <p className="text-[--color-text-secondary] leading-relaxed mt-4">
            The platform translates user intent into structured queries,
            retrieves the appropriate observations, and presents them in clear,
            interactive visualizations. Beyond discovery, users can export
            curated subsets of data for downstream analysis.
          </p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-[--color-border] bg-white hover:shadow-md hover:-translate-y-0.5 transition-all">
              <h3 className="font-semibold text-slate-900">Core goals</h3>
              <ul className="mt-2 list-disc list-inside text-sm text-[--color-text-secondary] space-y-1">
                <li>Lower the barrier to work with ARGO observations</li>
                <li>Provide trustworthy responses with clear provenance</li>
                <li>Offer fast visual analysis and export options</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl border border-[--color-border] bg-white hover:shadow-md hover:-translate-y-0.5 transition-all">
              <h3 className="font-semibold text-slate-900">Tech stack</h3>
              <ul className="mt-2 list-disc list-inside text-sm text-[--color-text-secondary] space-y-1">
                <li>
                  LLM + Retrieval Augmented Generation (RAG) for query
                  translation
                </li>
                <li>Embeddings over schema/docs for semantic grounding</li>
                <li>Datastores: PostgreSQL/Parquet-backed catalogs</li>
                <li>API & Orchestration: Next.js server routes</li>
                <li>Frontend: Next.js App Router + Tailwind CSS</li>
              </ul>
            </div>
          </div>
        </div>
        <aside className="lg:col-span-1">
          <div className="p-4 rounded-xl border border-[--color-border] bg-[#FFF7ED] hover:shadow-md transition-all">
            <h4 className="font-semibold text-[--color-accent]">
              What makes this different?
            </h4>
            <p className="mt-2 text-sm text-slate-700">
              QuARGO focuses on explainability and reproducibility: each
              response can reference the underlying data sources and query
              parameters, so you can trust, cite, and repeat results.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
