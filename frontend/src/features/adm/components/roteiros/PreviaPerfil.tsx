import { formatarNumero } from '@/utils/formatacao'

const LARGURA = 300
const ALTURA = 60

/** Miniatura do perfil altimétrico, para o ADM conferir as altitudes coladas antes de salvar. */
export function PreviaPerfil({ altitudes }: { altitudes: number[] }) {
  if (altitudes.length < 2) return null
  const minima = Math.min(...altitudes)
  const maxima = Math.max(...altitudes)
  const faixa = maxima - minima || 1
  const pontos = altitudes
    .map((a, i) => `${(i / (altitudes.length - 1)) * LARGURA},${ALTURA - 2 - ((a - minima) / faixa) * (ALTURA - 6)}`)
    .join(' ')

  return (
    <figure className="mt-3">
      <svg
        viewBox={`0 0 ${LARGURA} ${ALTURA}`}
        className="h-24 w-full rounded-xl bg-carvao-950/60"
        preserveAspectRatio="none"
        role="img"
        aria-label="Prévia do perfil altimétrico"
      >
        <polyline
          points={`0,${ALTURA} ${pontos} ${LARGURA},${ALTURA}`}
          fill="color-mix(in oklab, var(--color-vermelho-500) 25%, transparent)"
          stroke="none"
        />
        <polyline points={pontos} fill="none" stroke="var(--color-vermelho-500)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <figcaption className="mt-1 text-xs text-cinza-400 tabular-nums">
        {altitudes.length} pontos · de {formatarNumero(minima)} a {formatarNumero(maxima)} m
      </figcaption>
    </figure>
  )
}
