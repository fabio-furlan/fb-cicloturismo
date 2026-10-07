import { Link } from 'react-router-dom'
import { ROTAS } from '@/constants/rotas'

export function Logo() {
  return (
    <Link to={ROTAS.inicio} className="flex items-center gap-2.5 text-white" aria-label="FB Cicloturismo, página inicial">
      {/* Roda de bicicleta que também lembra um sol */}
      <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0 text-amber-400" fill="none" stroke="currentColor" aria-hidden="true">
        <circle cx="16" cy="16" r="13" strokeWidth="2.5" />
        <circle cx="16" cy="16" r="2.5" fill="currentColor" stroke="none" />
        <path d="M16 3.5v25M3.5 16h25M7.2 7.2l17.6 17.6M24.8 7.2L7.2 24.8" strokeWidth="1.4" />
      </svg>
      <span className="whitespace-nowrap font-display text-lg leading-none tracking-tight sm:text-xl">
        <span className="font-extrabold">fb</span> <span className="font-medium">cicloturismo</span>
      </span>
    </Link>
  )
}
