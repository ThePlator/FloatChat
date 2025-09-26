import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import HowItWorksSection from '../components/HowItWorksSection';
import AboutArgoSection from '../components/AboutArgoSection';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="font-sans">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <AboutArgoSection />
      </main>
      <Footer />
    </div>
  );
}
