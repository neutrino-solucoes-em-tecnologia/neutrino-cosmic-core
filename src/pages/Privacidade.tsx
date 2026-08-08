import { CONTACT, LEGAL, SITE } from '@/config/site'
import { Footer } from '@/site/Footer'
import { Navbar } from '@/site/Navbar'
import { useDocumentMeta } from '@/site/router'

/**
 * Política de privacidade.
 *
 * Curta porque é verdadeira: este site não tem formulário, não tem analytics,
 * não tem pixel e não grava cookie. A política anterior tinha 212 linhas
 * descrevendo tratamento de dado que o site não fazia — texto de template
 * descreve risco imaginário e esconde o real.
 *
 * A página de /cookies deixou de existir junto: não havia cookie a documentar.
 */
export function Privacidade() {
  useDocumentMeta(
    'Privacidade | Neutrino',
    'O que a Neutrino coleta neste site (nada) e como tratamos seus dados quando você entra em contato.',
  )

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[46rem] px-6 pb-24 pt-36 lg:px-12">
        <h1 className="text-balance text-[clamp(2rem,5.5vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.03em] text-event">
          Privacidade
        </h1>
        <p className="mt-6 text-[1.0625rem] leading-[1.7] text-body">
          Esta página descreve o tratamento real, não um modelo genérico. Onde a resposta é
          "nada", está escrito "nada".
        </p>

        <div className="mt-14 space-y-12">
          <section>
            <h2 className="text-[1.125rem] font-bold tracking-[-0.02em] text-event">
              O que este site coleta
            </h2>
            <p className="mt-4 text-[0.9375rem] leading-[1.75] text-body">
              Nada. Não há formulário, não há ferramenta de analytics, não há pixel de rede social
              e nenhum cookie é gravado, motivo pelo qual você também não viu banner de consentimento
              ao chegar. Todos os arquivos da página vêm deste domínio; nenhuma requisição sai para
              CDN, fonte remota ou serviço de terceiro. A seção{' '}
              <a href="/#esta-pagina" className="text-signal hover:text-signal-hi">
                Esta página
              </a>{' '}
              mede isso ao vivo no seu navegador, e o DevTools confirma.
            </p>
          </section>

          <section>
            <h2 className="text-[1.125rem] font-bold tracking-[-0.02em] text-event">
              Quando você entra em contato
            </h2>
            <p className="mt-4 text-[0.9375rem] leading-[1.75] text-body">
              Aí sim há dado, e ele é o que você mesmo escreveu: nome, e-mail ou telefone, e o que
              contou sobre o problema. Usamos isso apenas para responder e conduzir a conversa
              comercial, com base no legítimo interesse e nos tratativas preliminares de contrato
              (LGPD, art. 7º, incisos II e V). Não vendemos, não compartilhamos para publicidade e
              não alimentamos lista de disparo.
            </p>
            <p className="mt-4 text-[0.9375rem] leading-[1.75] text-body">
              A conversa iniciada por WhatsApp passa pela infraestrutura da Meta, sujeita à política
              de privacidade dela. Se preferir evitar isso, escreva por e-mail.
            </p>
          </section>

          <section>
            <h2 className="text-[1.125rem] font-bold tracking-[-0.02em] text-event">
              Seus direitos
            </h2>
            <p className="mt-4 text-[0.9375rem] leading-[1.75] text-body">
              Você pode pedir confirmação de tratamento, acesso, correção, portabilidade,
              anonimização ou eliminação dos seus dados, e revogar consentimento a qualquer momento
              (LGPD, art. 18). O pedido vai para{' '}
              <a
                href={`mailto:${LEGAL.privacyEmail}`}
                className="break-all text-signal hover:text-signal-hi"
              >
                {LEGAL.privacyEmail}
              </a>{' '}
              e é respondido em até quinze dias.
            </p>
          </section>

          <section>
            <h2 className="text-[1.125rem] font-bold tracking-[-0.02em] text-event">Controlador</h2>
            <p className="mt-4 text-[0.9375rem] leading-[1.75] text-body">
              {SITE.legalName}
              {LEGAL.cnpj ? `, CNPJ ${LEGAL.cnpj}` : ''}, {SITE.locality}/{SITE.region}, Brasil.
              Contato: {CONTACT.email}.
            </p>
            {!LEGAL.cnpj ? (
              <p className="mt-4 border-l-2 border-signal pl-4 text-[0.875rem] leading-[1.7] text-faint">
                O CNPJ ainda não está publicado aqui. A LGPD (art. 41) exige que o controlador seja
                publicamente identificável, então esta lacuna está declarada em vez de omitida, e
                precisa ser preenchida em <code className="text-body">src/config/site.ts</code>.
              </p>
            ) : null}
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
