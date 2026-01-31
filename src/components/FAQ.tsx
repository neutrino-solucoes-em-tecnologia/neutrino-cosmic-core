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
      question: 'O que é a Neutrino?',
      answer: 'A Neutrino é uma holding tecnológica focada em investimentos estratégicos e gestão de portfólio de empresas inovadoras. Atuamos como parceiros de longo prazo, fornecendo recursos, expertise e governança para maximizar o potencial de crescimento de cada empresa.',
    },
    {
      question: 'Em quais setores a Neutrino atua?',
      answer: 'Nosso portfólio é diversificado, com foco em empresas de tecnologia, fintech, e-commerce, mobilidade, saúde digital e outros segmentos de alto crescimento. Buscamos empresas com potencial disruptivo e modelos de negócio escaláveis.',
    },
    {
      question: 'Como funciona o processo de investimento?',
      answer: 'Realizamos uma análise criteriosa de cada oportunidade, avaliando o modelo de negócio, equipe, mercado e potencial de crescimento. Após a aprovação, oferecemos não apenas capital, mas também suporte estratégico, operacional e acesso à nossa rede de parceiros.',
    },
    {
      question: 'Quais são os critérios para parceria?',
      answer: 'Buscamos empresas com modelo de negócio comprovado, equipe experiente e comprometida, mercado em crescimento e potencial de escalabilidade. Valorizamos empresas que compartilham nossos valores de inovação, excelência e crescimento sustentável.',
    },
    {
      question: 'Como entrar em contato?',
      answer: 'Você pode entrar em contato através do formulário neste site, enviando um e-mail para contato@neutrino.com.br ou através das nossas redes sociais. Nossa equipe responderá em até 48 horas úteis.',
    },
  ];

  return (
    <section id="faq" className="relative py-24 px-4 md:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-muted-foreground">
            Tire suas dúvidas sobre a Neutrino e como trabalhamos
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg px-6 data-[state=open]:shadow-lg transition-shadow"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="font-semibold text-lg pr-4">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground mb-4">
            Não encontrou o que procurava?
          </p>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-primary font-medium hover:underline"
          >
            Entre em contato conosco
          </button>
        </motion.div>
      </div>
    </section>
  );
};
