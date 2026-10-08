import type { ReactNode } from 'react'

interface ColunaRodapeProps {
  titulo: string
  children: ReactNode
}

export function ColunaRodape({ titulo, children }: ColunaRodapeProps) {
  return (
    <div>
      <h2 className="mb-4 font-semibold text-white">{titulo}</h2>
      {children}
    </div>
  )
}
