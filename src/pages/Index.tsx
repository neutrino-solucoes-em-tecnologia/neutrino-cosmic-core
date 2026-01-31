import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { Problems } from '@/components/Problems';
import { Cases } from '@/components/Cases';
import { Solutions } from '@/components/Solutions';
import { Process } from '@/components/Process';
import { Team } from '@/components/Team';
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
        <Cases />
        <Solutions />
        <Process />
        <Team />
        <TechStack />
        <WhyNeutrino />
        <Contact />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
