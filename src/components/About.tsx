import { Shield, Zap, Globe, Lock } from 'lucide-react';

export const About = () => {
  const features = [
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade security with SOC 2 Type II, PCI DSS Level 1, and ISO 27001 certifications. Your data is protected by industry-leading encryption.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Process millions of transactions per second with 99.99% uptime. Built on resilient infrastructure that scales with your business.',
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Multi-currency support across 180+ countries. Compliant with local regulations and integrated with global payment networks.',
    },
    {
      icon: Lock,
      title: 'Regulatory Ready',
      description: 'Full compliance with GDPR, PSD2, Open Banking standards. We handle the complexity so you can focus on growth.',
    },
  ];

  return (
    <section id="about" className="relative py-32 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-6">
              About Neutrino
            </p>
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-8 leading-tight">
              Banking infrastructure for the modern economy
            </h2>
          </div>
          <div className="space-y-6">
            <p className="text-xl text-gray-600 leading-relaxed">
              Neutrino provides the complete banking infrastructure stack for fintech companies, 
              marketplaces, and platforms looking to embed financial services.
            </p>
            <p className="text-xl text-gray-600 leading-relaxed">
              Our APIs power payments, lending, accounts, and cards for thousands of businesses 
              processing billions in transactions annually.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((feature) => (
            <div key={feature.title} className="space-y-4">
              <div className="w-12 h-12 flex items-center justify-center">
                <feature.icon className="w-8 h-8 text-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
