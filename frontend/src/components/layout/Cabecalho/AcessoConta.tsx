import { Link } from 'react-router-dom'
import { IconeUsuario } from '@/components/icones'
import { estiloBotao } from '@/components/ui/estilosBotao'
import { ROTAS } from '@/constants/rotas'
import { cn } from '@/utils/cn'

interface AcessoContaProps {
  onClick?: () => void
  /** No menu do celular, o botão ocupa a largura toda. */
  larguraTotal?: boolean
}

/** Entrada da área do cliente: botão "Entrar", vermelho. */
export function AcessoConta({ onClick, larguraTotal = false }: AcessoContaProps) {
  return (
    <Link to={ROTAS.minhaConta} onClick={onClick} className={cn(estiloBotao('principal', 'compacto'), larguraTotal && 'w-full')}>
      <IconeUsuario className="h-4 w-4" />
      Entrar
    </Link>
  )
}
