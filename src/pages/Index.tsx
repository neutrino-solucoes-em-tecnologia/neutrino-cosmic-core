import { ParticleBackground } from '@/components/ParticleBackground';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Ecosystem3D } from '@/components/Ecosystem3D';
import { Architecture } from '@/components/Architecture';
import { Technology } from '@/components/Technology';
import { Team } from '@/components/Team';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      
      <main className="relative z-10">
        <Hero />
        <About />
        <Ecosystem3D />
        <Architecture />
        <Technology />
        <Team />
        <Contact />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
