import type { ReactNode } from 'react'

interface CartaoProps {
  titulo?: string
  /** Botões ou informações à direita do título. */
  acoes?: ReactNode
  children: ReactNode
}

/** Bloco do painel com título opcional: agrupa um formulário ou uma lista. */
export function Cartao({ titulo, acoes, children }: CartaoProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-carvao-800/60 p-5 sm:p-6">
      {(titulo || acoes) && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          {titulo && <h2 className="font-display text-xl font-extrabold uppercase">{titulo}</h2>}
          {acoes}
        </div>
      )}
      {children}
    </section>
  )
}
