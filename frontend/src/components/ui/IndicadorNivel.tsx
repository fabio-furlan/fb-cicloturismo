import { niveis } from '@/config/niveis'
import type { Nivel } from '@/types/roteiro'

interface IndicadorNivelProps {
  nivel: Nivel
  className?: string
}

/** Nome do nível com três barras crescentes; as preenchidas mostram a dificuldade. */
export function IndicadorNivel({ nivel, className = '' }: IndicadorNivelProps) {
  const { nome, ordem } = niveis[nivel]

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 14 12" className="h-3 w-3.5" aria-hidden="true">
        {[1, 2, 3].map((barra) => (
          <rect
            key={barra}
            x={(barra - 1) * 5}
            y={12 - barra * 4}
            width="4"
            height={barra * 4}
            rx="0.5"
            className={barra <= ordem ? 'fill-current' : 'fill-current opacity-25'}
          />
        ))}
      </svg>
      {nome}
    </span>
  )
}
