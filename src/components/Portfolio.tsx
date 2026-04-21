import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const verticals = [
  {
    company: 'Gluon Technologies',
    tagline: 'Produtividade SaaS para o mercado brasileiro.',
    market: 'SaaS Produtividade',
    sector: 'B2B · SMB',
    description:
      'Ferramentas de produtividade, marketing e gestão para pequenas e médias empresas. CRM, formulários inteligentes, gestão de projetos, suporte e estoque — suite completa com automação de IA.',
    products: '12 produtos',
    accentHsl: '245 58% 61%',
  },
  {
    company: 'Graviton Financial',
    tagline: 'Infraestrutura financeira para o ecossistema.',
    market: 'FinTech',
    sector: 'B2B · B2C',
    description:
      'Serviços financeiros digitais: conta digital completa, gateway de pagamento, contabilidade com Open Finance e Banking as a Service para outros produtos do ecossistema.',
    products: '4 produtos',
    accentHsl: '38 92% 50%',
  },
  {
    company: 'Photon Studios',
    tagline: 'Criação e monetização de conteúdo digital.',
    market: 'Media & Conteúdo',
    sector: 'B2C · AdSense',
    description:
      'Rede de sites de conteúdo, memoriais digitais perpétuos, hospedagem de podcast com IA e edição de áudio/vídeo. Monetização via anúncios, assinaturas e patrocínios.',
    products: '4 produtos',
    accentHsl: '24 95% 53%',
  },
  {
    company: 'Baryon Markets',
    tagline: 'Plataformas de compra, venda e comparação.',
    market: 'Marketplace',
    sector: 'B2C · Transacional',
    description:
      'Comparadores inteligentes de imóveis e veículos com IA, marketplace de freelancers, food delivery para cidades médias, plataforma white-label para criar marketplaces e gestão imobiliária.',
    products: '8 produtos',
    accentHsl: '174 62% 40%',
  },
  {
    company: 'Muon Services',
    tagline: 'Serviços profissionais para residências.',
    market: 'Serviços Residenciais',
    sector: 'B2C · Marketplace',
    description:
      'Marketplace de serviços domésticos: diaristas, limpeza especializada, serviços elétricos, hidráulicos e portaria virtual para condomínios. Modelo de comissão sobre transações.',
    products: '8 produtos',
    accentHsl: '84 50% 45%',
  },
  {
    company: 'Axion Talent',
    tagline: 'Recrutamento e gestão de pessoas com IA.',
    market: 'RH & Recrutamento',
    sector: 'B2B · HR Tech',
    description:
      'ATS white-label com triagem por IA para empresas de todos os portes, e HRMS cloud completo com folha de pagamento, férias, avaliações de desempenho e ponto eletrônico.',
    products: '2 produtos',
    accentHsl: '217 91% 60%',
  },
  {
    company: 'Charm Network',
    tagline: 'Conexões sociais especializadas.',
    market: 'Redes Sociais',
    sector: 'B2C · Social',
    description:
      'Dating app com matchmaking por IA em três vertentes (geral, LGBTQ+, 50+), rede social para pets e donos, e rede social de bairro — o Nextdoor brasileiro.',
    products: '3 produtos',
    accentHsl: '330 81% 60%',
  },
  {
    company: 'Quantum Labs',
    tagline: 'Inspeção técnica antes de qualquer compra.',
    market: 'Auditoria & Qualidade',
    sector: 'B2C · Serviço',
    description:
      'Laudo técnico de veículos antes da compra com IA e fotos, e auditoria de imóveis e construções com vistoria técnica profissional. Sinergia direta com Baryon Markets.',
    products: '2 produtos',
    accentHsl: '142 71% 45%',
  },
  {
    company: 'Lepton Industries',
    tagline: 'Produtos premium da flora brasileira.',
    market: 'Produtos Físicos',
    sector: 'D2C · E-commerce',
    description:
      'Cosméticos naturais com biotecnologia da flora brasileira e perfumes premium personalizados por algoritmo de preferências. Clube de assinaturas + e-commerce direto.',
    products: '2 produtos',
    accentHsl: '262 52% 65%',
  },
  {
    company: 'Neutrino GovTech',
    tagline: 'Digitalizar o setor público com soluções sérias.',
    market: 'B2G · Setor Público',
    sector: 'GovTech · SaaS',
    description:
      'Suite completa para municípios: portal de transparência, sistema de pregões eletrônicos (Lei 14.133), app de serviços ao cidadão, BI para gestão pública e plataforma de capacitação de servidores.',
    products: '6 produtos',
    accentHsl: '224 72% 40%',
  },
  {
    company: 'Medion Health',
    tagline: 'Gestão clínica especializada para cada segmento.',
    market: 'HealthTech · Clínicas',
    sector: 'B2B · Saúde',
    description:
      'Software de gestão para clínicas médicas, odontológicas, veterinárias, de fisioterapia, psicologia e farmácias. Prontuário digital, agendamento online, financeiro e compliance LGPD nativo.',
    products: '7 produtos',
    accentHsl: '170 88% 33%',
  },
  {
    company: 'QuarkCode',
    tagline: 'Fundações técnicas para quem não quer começar do zero.',
    market: 'Developer Tools',
    sector: 'B2D · Licenciamento',
    description:
      'Bases de código production-ready para empresas e times que precisam lançar rápido sem abrir mão de arquitetura sólida. Cada starter cobre um vertical específico — automotivo, saúde, RH, marketplace — com autenticação, multi-tenancy, billing e infraestrutura já resolvidos.',
    products: '37 starters',
    accentHsl: '191 100% 42%',
  },
];

export const Portfolio = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    slidesToScroll: 1,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section id="portfolio" className="relative py-16 sm:py-20 md:py-32 px-4 sm:px-6 md:px-12 bg-card overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-quantum mb-4">
              Ecossistema de Produtos
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-3">
              12 verticais. 54 SaaS. Um ecossistema.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Cada vertical é uma empresa independente, construída sobre a mesma infraestrutura técnica da Neutrino Labs.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="w-10 h-10 flex items-center justify-center border border-border hover:border-quantum/50 hover:bg-quantum/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" strokeWidth={1.5} />
            </button>
            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="w-10 h-10 flex items-center justify-center border border-border hover:border-quantum/50 hover:bg-quantum/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              aria-label="Próximo"
            >
              <ChevronRight className="w-5 h-5 text-foreground" strokeWidth={1.5} />
            </button>
            <span className="text-xs text-muted-foreground ml-2 tabular-nums">
              {selectedIndex + 1} / {verticals.length}
            </span>
          </div>
        </div>

        {/* Carousel */}
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-4 sm:gap-6">
            {verticals.map((vertical) => (
              <div
                key={vertical.company}
                className="flex-none w-[85vw] sm:w-[380px] lg:w-[360px]"
              >
                <div
                  className="group h-full bg-background border border-border transition-all duration-300 flex flex-col"
                  style={{
                    ['--hover-border' as string]: `hsl(${vertical.accentHsl} / 0.45)`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = `hsl(${vertical.accentHsl} / 0.45)`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = '';
                  }}
                >
                  {/* Accent top bar */}
                  <div
                    className="h-[3px] w-full"
                    style={{ backgroundColor: `hsl(${vertical.accentHsl})` }}
                  />

                  <div className="p-7 flex flex-col flex-1">
                    {/* Tags */}
                    <div className="flex items-center gap-2 mb-5 flex-wrap">
                      <span
                        className="text-[10px] font-bold uppercase tracking-[0.15em] px-2 py-1 border"
                        style={{
                          color: `hsl(${vertical.accentHsl})`,
                          borderColor: `hsl(${vertical.accentHsl} / 0.3)`,
                          backgroundColor: `hsl(${vertical.accentHsl} / 0.08)`,
                        }}
                      >
                        {vertical.market}
                      </span>
                      <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider">
                        {vertical.sector}
                      </span>
                    </div>

                    {/* Company name */}
                    <h3 className="text-2xl font-bold text-foreground mb-2 leading-tight">
                      {vertical.company}
                    </h3>

                    {/* Tagline */}
                    <p
                      className="text-sm font-medium mb-5 leading-snug"
                      style={{ color: `hsl(${vertical.accentHsl})` }}
                    >
                      {vertical.tagline}
                    </p>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                      {vertical.description}
                    </p>

                    {/* Footer */}
                    <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground/50 uppercase tracking-wider">
                        {vertical.products}
                      </span>
                      <div
                        className="w-6 h-[2px]"
                        style={{ backgroundColor: `hsl(${vertical.accentHsl} / 0.5)` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center gap-2 mt-8">
          {verticals.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-[2px] transition-all duration-300 ${
                index === selectedIndex
                  ? 'w-8 bg-quantum'
                  : 'w-4 bg-border hover:bg-muted-foreground/40'
              }`}
              aria-label={`Ir para vertical ${index + 1}`}
            />
          ))}
        </div>

        {/* Bottom stats */}
        <div className="mt-12 pt-10 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
          {[
            { value: '12', label: 'Verticais' },
            { value: '54', label: 'SaaS Products' },
            { value: '37', label: 'Laravel Starters' },
            { value: 'R$ 28M', label: 'ARR Projetado Ano 1' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
