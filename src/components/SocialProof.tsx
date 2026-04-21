export const SocialProof = () => {
  const metrics = [
    { value: '47ms', label: 'p95 latency', context: 'Fintech Pix — 30k eventos/min' },
    { value: '99.94%', label: 'uptime', context: 'Biometria — 24 meses em produção' },
    { value: '94%', label: 'redução de latência', context: 'GovTech — 12s → 850ms' },
    { value: '73%', label: 'menos chamados', context: 'Retail — 50+ terminais' },
    { value: '68%', label: 'ganho em tempo', context: 'Industrial — gestão de EPIs' },
    { value: '< 2h', label: 'SLA de resposta', context: 'Incidentes críticos em produção' },
  ];

  const stack = ['PHP 8.3', 'Laravel', 'Go', 'MySQL', 'MongoDB', 'Redis', 'AWS', 'Kafka'];

  return (
    <section className="relative bg-secondary py-10 sm:py-12 px-4 sm:px-6 md:px-12 overflow-hidden">
      {/* Accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-quantum" />

      <div className="max-w-7xl mx-auto">

        {/* Metrics strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 mb-10 sm:mb-12 pb-10 sm:pb-12 border-b border-white/10">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-quantum leading-none">
                {metric.value}
              </div>
              <div className="text-xs font-semibold text-white uppercase tracking-wider">
                {metric.label}
              </div>
              <div className="text-xs text-white/40 leading-snug">
                {metric.context}
              </div>
            </div>
          ))}
        </div>

        {/* Tech stack strip */}
        <div className="flex flex-wrap items-center gap-x-6 sm:gap-x-8 gap-y-3">
          <span className="text-xs font-semibold text-white/40 uppercase tracking-[0.2em] whitespace-nowrap">
            Stack em produção
          </span>
          <div className="w-px h-4 bg-white/20 hidden sm:block" />
          {stack.map((tech) => (
            <span
              key={tech}
              className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-200"
            >
              {tech}
            </span>
          ))}
        </div>

      </div>
    </section>
  );
};
