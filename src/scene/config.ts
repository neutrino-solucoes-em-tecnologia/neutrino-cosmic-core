/**
 * Parâmetros da cena — o detector.
 *
 * Ver DESIGN.md § "A cena (gramática)". As cores aqui espelham os tokens de
 * `src/index.css`: canvas não lê variável CSS, e resolver via getComputedStyle
 * a cada frame custa layout. Se um valor mudar lá, muda aqui.
 */
export const SCENE = {
  /** Passo da grade hexagonal de sensores, em CSS px. */
  step: 28,

  /**
   * Sensor em repouso.
   *
   * Estava em 0.07 com passo de 34px, e o resultado na tela era metade do hero
   * em preto liso: a grade não se lia como instrumentação, se lia como nada.
   * A correção é densidade e presença, não brilho — o repouso continua discreto,
   * mas agora existe.
   */
  sensorRadius: 1.15,
  sensorRgb: '255,255,255',
  sensorAlpha: 0.115,
  /** Amplitude da variação de brilho entre sensores: dá textura ao repouso. */
  sensorJitter: 0.5,

  /**
   * Sensor aceso.
   *
   * Duas cores, não uma: o sensor sobe de Cherenkov claro para o branco do
   * evento conforme a casca passa exatamente por cima dele. É o que o DESIGN.md
   * chama de "pico raro" — sem isso o anel inteiro tinha o mesmo azul médio e
   * simplesmente não se destacava da grade em repouso.
   */
  litColor: '255,176,32',
  peakColor: '242,245,249',
  litRadius: 2.4,
  /** Halo do sensor aceso — segundo círculo, alpha baixo. Não é sombra. */
  haloRadius: 9,
  haloAlpha: 0.14,

  /** A casca luminosa do anel. */
  ringColor: '255,176,32',
  ringAlpha: 0.32,
  ringSpeed: 340,
  ringThickness: 90,
  /** O anel some antes de cruzar a tela inteira — o evento é local. */
  ringMaxRadius: 760,

  /** Deriva do centro: a partícula segue viagem enquanto o cone se abre. */
  driftSpeed: 40,

  /** Decaimento do sensor aceso, em ms. */
  decay: 900,

  /**
   * Contagem de fundo — sensores que disparam sozinhos, sem evento.
   *
   * Todo detector real registra eventos espúrios: ruído térmico, raio cósmico,
   * decaimento no próprio vidro da fotomultiplicadora. Aqui isso resolve um
   * problema de composição: entre um anel e outro a cena ficava completamente
   * parada, e uma tela imóvel lê como imagem de fundo em vez de instrumento
   * ligado. São poucos disparos por segundo, fracos e dispersos — movimento
   * contínuo que não disputa atenção com o texto ao lado.
   */
  noiseRate: 5,
  noiseMin: 0.18,
  noiseMax: 0.42,

  /**
   * Intervalo entre eventos, em ms. Sorteado, nunca cadenciado: cadência lê
   * como animação em loop.
   *
   * A raridade continua sendo a mensagem, mas 7–13s era raridade demais: quem
   * chegava na página via uma tela parada e ia embora sem nunca saber que ali
   * havia um detector. Um evento precisa acontecer dentro da atenção de quem
   * está lendo a headline.
   */
  gapMin: 4200,
  gapMax: 8000,

  /** Teto de densidade de pixel — acima de 2 não se ganha nada visível. */
  maxDpr: 2,
} as const
