import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface ColunaRodapeProps {
  titulo: string
  /** Se informada, o título vira um link para essa página. */
  rota?: string
  className?: string
  children: ReactNode
}

export function ColunaRodape({ titulo, rota, className = '', children }: ColunaRodapeProps) {
  return (
    <div className={className}>
      <h2 className="mb-2 font-semibold text-white">
        {rota ? (
          <Link to={rota} className="transition-colors hover:text-trilha-500">
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
