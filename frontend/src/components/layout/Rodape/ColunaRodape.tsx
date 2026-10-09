import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useVoltarAoTopoNaMesmaPagina } from '@/hooks/useRolagemAoTopo'

interface ColunaRodapeProps {
  titulo: string
  /** Se informada, o título vira um link para essa página. */
  rota?: string
  className?: string
  children: ReactNode
}

export function ColunaRodape({ titulo, rota, className = '', children }: ColunaRodapeProps) {
  const voltarAoTopo = useVoltarAoTopoNaMesmaPagina()

  return (
    <div className={className}>
      <h2 className="mb-3 font-display text-xs font-extrabold uppercase tracking-[0.14em] text-white">
        {rota ? (
          <Link to={rota} onClick={voltarAoTopo(rota)} className="-my-3 inline-flex py-3 transition-colors hover:text-sol-500">
            {titulo}
          </Link>
        ) : (
          titulo
        )}
      </h2>
      {children}
    </div>
  )
}
