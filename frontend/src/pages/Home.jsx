import BloodParticles from '../components/BloodParticles';
import HeroSection from '../components/HeroSection';
import TrustedLogos from '../components/TrustedLogos';
import StatsSection from '../components/StatsSection';
import FeaturesSection from '../components/FeaturesSection';
import HowItWorks from '../components/HowItWorks';
import EmergencyFeed from '../components/EmergencyFeed';
import MapPreview from '../components/MapPreview';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <BloodParticles />
      <HeroSection />
      <TrustedLogos />
      <StatsSection />
      <FeaturesSection />
      <HowItWorks />
      <EmergencyFeed />
      <MapPreview />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}
