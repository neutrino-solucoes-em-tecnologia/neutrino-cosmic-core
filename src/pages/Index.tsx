import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { Problems } from '@/components/Problems';
import { Cases } from '@/components/Cases';
import { Solutions } from '@/components/Solutions';
import { Team } from '@/components/Team';
import { FAQ } from '@/components/FAQ';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background">
      <Navigation />

      <main className="relative">
        <Hero />
        <Problems />
        <Cases />
        <Solutions />
        <Team />
        <FAQ />
        <Contact />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
