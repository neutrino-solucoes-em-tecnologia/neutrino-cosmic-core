import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { Problems } from '@/components/Problems';
import { Solutions } from '@/components/Solutions';
import { Methodology } from '@/components/Methodology';
import { TechStack } from '@/components/TechStack';
import { WhyNeutrino } from '@/components/WhyNeutrino';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="relative min-h-screen bg-white">
      <Navigation />
      
      <main className="relative">
        <Hero />
        <Problems />
        <Solutions />
        <Methodology />
        <TechStack />
        <WhyNeutrino />
        <Contact />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
