import { Navigation } from '@/components/Navigation';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Founder } from '@/components/Founder';
import { Architecture } from '@/components/Architecture';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="relative min-h-screen">
      <Navigation />
      <ParticleBackground />
      
      <main className="relative z-10">
        <Hero />
        <About />
        <Founder />
        <Architecture />
        <Contact />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
