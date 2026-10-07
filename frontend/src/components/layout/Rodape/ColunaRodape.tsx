import type { ReactNode } from 'react'

interface ColunaRodapeProps {
  titulo: string
  children: ReactNode
}

export function ColunaRodape({ titulo, children }: ColunaRodapeProps) {
  return (
    <div>
      <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-400">{titulo}</h2>
      {children}
    </div>
  )
}
