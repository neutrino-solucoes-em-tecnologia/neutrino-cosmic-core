/**
 * Fonte única de tudo que aponta para fora da página.
 *
 * Um endereço de contato repetido em cinco componentes vira cinco endereços
 * diferentes na primeira vez que muda. Nada aqui pode ser reescrito inline.
 */

export const SITE = {
  name: 'Neutrino',
  legalName: 'Neutrino Soluções em Tecnologia',
  domain: 'https://neutrino.dev.br',
  locality: 'Curitiba',
  region: 'PR',
  country: 'BR',
  foundingYear: '2020',
} as const

/**
 * Contato.
 *
 * O e-mail fica visível na página inteira, em texto, clicável. Comprador
 * sênior não preenche formulário de cinco campos — e o formulário que estava
 * aqui não enviava para lugar nenhum: chamava `toast.success` e limpava o
 * estado, descartando silenciosamente todo lead que chegou desde que subiu.
 */
export const CONTACT = {
  email: 'neutrino@neutrino.dev.br',
  /** Formato internacional, só dígitos: 55 + DDD + número. */
  whatsapp: '5541999214248',
  phoneDisplay: '+55 41 99921-4248',
  linkedin: 'https://www.linkedin.com/company/neutrino-solu%C3%A7%C3%B5es-em-tecnologia/',
} as const

/** Abertura de conversa no WhatsApp, já preenchida do lado do visitante. */
export function whatsappUrl(
  message = 'Tenho um sistema em produção com um problema que não estamos conseguindo resolver.',
): string {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`
}

/** Abertura por e-mail, com assunto — mesma conversa, outro canal. */
export function mailtoUrl(subject = 'Diagnóstico'): string {
  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}`
}

/**
 * Dados de registro exigidos nas páginas legais.
 *
 * ⚠️ PENDENTE — o CNPJ é obrigatório na política de privacidade: a LGPD (art. 41)
 * exige que o controlador seja publicamente identificável e contactável. Enquanto
 * estiver vazio, a página legal declara a lacuna em vez de fingir conformidade.
 */
export const LEGAL = {
  cnpj: '',
  privacyEmail: 'neutrino@neutrino.dev.br',
} as const

/**
 * Navegação.
 *
 * Quatro itens, todos apontando para seção que existe. O rodapé anterior
 * linkava #methodology, #tech e #why — âncoras de componentes que não eram
 * renderizados em página nenhuma, então o clique não fazia nada.
 */
export const NAV = [
  { label: 'Sistemas', href: '/sistemas' },
  { label: 'Engenharia', href: '#dominios' },
  { label: 'Como trabalhamos', href: '#metodo' },
  { label: 'Quando nos procurar', href: '#quando-chamar' },
] as const
