import { Link } from 'react-router-dom'
import { IconeUsuario } from '@/components/icones'
import { ROTAS } from '@/constants/rotas'

interface BotaoMinhaContaProps {
  onClick?: () => void
  className?: string
}

/** Acesso à área do cliente (login, reservas e dados da conta). */
export function BotaoMinhaConta({ onClick, className = '' }: BotaoMinhaContaProps) {
  return (
    <Link
      to={ROTAS.minhaConta}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-areia-100/40 px-5 py-2.5 text-sm font-semibold text-areia-100 transition-colors hover:border-trilha-500 hover:text-trilha-500 ${className}`}
    >
      <IconeUsuario className="h-4 w-4" />
      Minha conta
    </Link>
  )
}
