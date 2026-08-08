/**
 * Marca em texto puro — sem arquivo de imagem, sem requisição, escala perfeita
 * em qualquer densidade e continua legível com CSS desabilitado.
 *
 * O ponto final em Cherenkov é a única vez que a cor aparece na barra: um
 * evento registrado, na escala da tipografia.
 */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span
      className={`text-[1.05rem] font-extrabold uppercase tracking-[0.16em] text-event ${className}`}
    >
      Neutrino<span className="text-signal">.</span>
    </span>
  )
}
