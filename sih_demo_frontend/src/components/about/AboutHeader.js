export default function AboutHeader() {
  return (
    <header className="bg-[#F8FAFC] border-b border-[--color-border]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
        <p className="text-sm text-[--color-text-secondary] mb-2">About</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Learn more about QuARGO
        </h1>
        <p className="mt-3 text-[--color-text-secondary] max-w-2xl">
          Supporting information for users who want a deeper understanding of
          the project, data, and how to get the most out of the platform.
        </p>
      </div>
    </header>
  );
}
