import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const FAQ = () => {
  const faqs = [
    {
      question: 'Como funciona o primeiro contato?',
      answer: 'Uma conversa de 1 hora para entender o problema, o contexto e o impacto real no negócio. Se houver fit técnico e estratégico, elaboramos uma proposta específica. Não existe modelo de proposta padrão — cada engajamento é distinto.',
    },
    {
      question: 'Vocês substituem ou complementam a equipe interna?',
      answer: 'Depende do que o problema exige. Em alguns casos assumimos o desenvolvimento integralmente. Em outros, atuamos como liderança técnica junto a um time interno. O que não fazemos é body shop — não alocamos pessoas para trabalhar sob gestão de terceiros.',
    },
    {
      question: 'O que acontece quando algo quebra em produção?',
      answer: 'Respondemos. Em contratos de parceria contínua, temos SLA documentado e suporte 24/7 para sistemas críticos. Se o incidente foi causado por código que escrevemos, resolvemos sem negociação sobre custo adicional.',
    },
    {
      question: 'Vocês trabalham com qualquer stack?',
      answer: 'Não. Somos especialistas em PHP/Laravel, Go, MySQL, MongoDB, Redis e AWS. Se o seu stack é React Native, Flutter, .NET ou Java enterprise, não somos o fit certo — e vamos dizer isso na primeira conversa, não no meio do projeto.',
    },
    {
      question: 'Qual o prazo mínimo de engajamento?',
      answer: 'Não temos prazo mínimo fixo. Temos o prazo necessário para resolver o problema com rigor. Engajamentos abaixo de 30 dias raramente produzem resultado real em sistemas complexos — e preferimos não assumir o que não conseguimos fazer bem.',
    },
    {
      question: 'Quando você NÃO deve contratar a Neutrino?',
      answer: 'Se você precisa de um time grande para desenvolvimento rápido em larga escala, se o orçamento é limitado, se o problema é simples o suficiente para qualquer bom desenvolvedor resolver, ou se o stack está fora das nossas especialidades. Preferiamos recusar um projeto a entregar aquém do que prometemos.',
    },
  ];

  return (
    <section id="faq" className="relative py-24 sm:py-32 md:py-40 px-4 sm:px-6 md:px-12 bg-background">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-14 sm:mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-quantum mb-8">
            Perguntas Diretas
          </p>
          <h2 className="font-fraunces text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-[1.15] tracking-tight">
            Respostas sem evasiva.
          </h2>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-0 border-t border-border">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-border"
            >
              <AccordionTrigger className="text-left hover:no-underline py-7 hover:text-quantum transition-colors duration-200">
                <span className="font-semibold text-base sm:text-lg pr-6 text-foreground">
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-7 leading-relaxed text-sm sm:text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

      </div>
    </section>
  );
};
