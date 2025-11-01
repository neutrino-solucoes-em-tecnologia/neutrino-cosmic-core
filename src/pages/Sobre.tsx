import { ParticleBackground } from '@/components/ParticleBackground';
import { About } from '@/components/About';
import { Founder } from '@/components/Founder';
import { Footer } from '@/components/Footer';

const Sobre = () => {
  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      
      <main className="relative z-10">
        <About />
        <Founder />
      </main>

      <Footer />
    </div>
  );
};

export default Sobre;