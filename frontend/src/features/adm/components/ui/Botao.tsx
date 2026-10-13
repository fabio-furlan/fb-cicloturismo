import type { ButtonHTMLAttributes } from 'react'
import { Spinner } from '@/components/feedback/Spinner'
import { cn } from '@/utils/cn'

const variantes = {
  principal: 'bg-vermelho-500 text-white hover:bg-vermelho-600',
  secundario: 'border border-creme-100/30 text-creme-100 hover:border-vermelho-500 hover:text-sol-400',
  perigo: 'border border-alerta-600 text-alerta-300 hover:bg-alerta-600 hover:text-white',
}

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
      className={cn(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        variantes[variante],
        className,
      )}
    >
      {carregando && <Spinner tamanho="pequeno" cor="texto" />}
      {children}
    </button>
  )
}
