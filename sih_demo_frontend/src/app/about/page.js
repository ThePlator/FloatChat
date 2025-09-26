export const metadata = {
  title: 'About — QuARGO',
  description:
    "Learn about QuARGO's goals, technology stack, ARGO data sources, usage guide, and glossary.",
};

import AboutHeader from '../../components/about/AboutHeader';
import OnThisPageNav from '../../components/about/OnThisPageNav';
import OverviewSection from '../../components/about/OverviewSection';
import DataSourcesSection from '../../components/about/DataSourcesSection';
import UserGuideSection from '../../components/about/UserGuideSection';
import GlossarySection from '../../components/about/GlossarySection';

export default function AboutPage() {
  return (
    <div className="font-sans">
      <AboutHeader />
      <main className="max-w-7xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
        <OnThisPageNav />
        <OverviewSection />
        <DataSourcesSection />
        <UserGuideSection />
        <GlossarySection />
      </main>
    </div>
  );
}
