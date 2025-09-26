export default function AboutArgoSection() {
  return (
    <section id="about" className="py-20 sm:py-28 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-sky-100 to-indigo-100">
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    'radial-gradient(600px 300px at 20% 10%, rgba(2,132,199,.25), transparent), radial-gradient(600px 300px at 80% 90%, rgba(99,102,241,.25), transparent)',
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-slate-600 text-sm">
                  ARGO Float Diagram
                </span>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold mb-4">About the ARGO Program</h2>
            <p className="text-[--color-text-secondary] text-lg leading-relaxed">
              The ARGO program is a global array of thousands of robotic floats
              that drift with ocean currents and measure the temperature and
              salinity of the upper 2000 meters of the ocean. This data is
              critical for understanding and forecasting climate change, ocean
              health, and weather patterns, providing invaluable insights for
              scientists worldwide.
            </p>
            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-[--color-accent]"></span>{' '}
                Global coverage across all major basins
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-[--color-accent]"></span>{' '}
                Continuous temperature and salinity profiles
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-[--color-accent]"></span>{' '}
                Biogeochemical sensors on many floats
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-[--color-accent]"></span>{' '}
                Open data for research and operations
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
