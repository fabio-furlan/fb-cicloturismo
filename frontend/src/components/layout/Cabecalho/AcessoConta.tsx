import { Link } from 'react-router-dom'
import { IconeUsuario } from '@/components/icones'
import { ROTAS } from '@/constants/rotas'

interface AcessoContaProps {
  onClick?: () => void
  /** No menu do celular, o botão ocupa a largura toda. */
  larguraTotal?: boolean
}

/** Entrada da área do cliente: botão "Entrar", em pílula vermelha. */
export function AcessoConta({ onClick, larguraTotal = false }: AcessoContaProps) {
  return (
    <Link
      to={ROTAS.minhaConta}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-vermelho-500 font-display font-bold uppercase tracking-[0.06em] text-white shadow-[0_6px_18px_-6px_rgb(200_16_46/0.7)] transition duration-200 hover:-translate-y-px hover:bg-vermelho-600 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
        larguraTotal ? 'w-full py-3 text-sm' : 'px-6 py-2.5 text-[0.8rem]'
      }`}
    >
      <IconeUsuario className="h-4 w-4" />
      Entrar
    </Link>
  )
}
