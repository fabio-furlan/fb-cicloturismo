import { Link } from 'react-router-dom'
import { IconeUsuario } from '@/components/icones'
import { ROTAS } from '@/constants/rotas'

interface AcessoContaProps {
  onClick?: () => void
  /** No menu do celular, o botão ocupa a largura toda. */
  larguraTotal?: boolean
}

/** Entrada da área do cliente: botão "Entrar". */
export function AcessoConta({ onClick, larguraTotal = false }: AcessoContaProps) {
  return (
    <Link
      to={ROTAS.minhaConta}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-trilha-500 font-semibold text-mata-950 transition duration-200 hover:-translate-y-px hover:bg-trilha-400 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
        larguraTotal ? 'w-full py-3 text-base' : 'px-6 py-2 text-sm'
      }`}
    >
      <IconeUsuario className="h-4 w-4" />
      Entrar
    </Link>
  )
}
