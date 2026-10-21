import type { ButtonHTMLAttributes } from 'react'
import { Spinner } from '@/components/feedback/Spinner'
import { estiloBotao } from '@/components/ui/estilosBotao'
import { cn } from '@/utils/cn'

// No painel (fundo escuro), o secundário é o contorno claro da receita do site.
const variantes = { principal: 'principal', secundario: 'secundarioEscuro', perigo: 'perigo' } as const

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: keyof typeof variantes
  /** Mostra o spinner e desativa o botão enquanto a ação roda. */
  carregando?: boolean
}

export function Botao({ variante = 'principal', carregando = false, className, children, disabled, ...resto }: BotaoProps) {
  return (
    <button
      type="button"
      {...resto}
      disabled={disabled || carregando}
      aria-busy={carregando || undefined}
      className={cn(estiloBotao(variantes[variante]), className)}
    >
      {carregando && <Spinner tamanho="pequeno" cor="texto" />}
      {children}
    </button>
  )
}
