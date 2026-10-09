import type { ReactNode } from 'react'

interface SeloProps {
  children: ReactNode
  /** Vermelho nas seções; amarelo para destacar algo sobre foto ou fundo vermelho. */
  cor?: 'vermelho' | 'sol'
  className?: string
}

/** Pílula em caixa alta usada acima dos títulos e como etiqueta sobre as fotos. */
export function Selo({ children, cor = 'vermelho', className = '' }: SeloProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-display text-[0.7rem] font-bold uppercase leading-none tracking-[0.12em] shadow-sm ${
        cor === 'vermelho' ? 'bg-vermelho-500/95 text-white' : 'bg-sol-500 text-carvao-950'
      } ${className}`}
    >
      {children}
    </span>
  )
}
