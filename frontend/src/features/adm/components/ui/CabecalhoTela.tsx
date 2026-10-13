import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface CabecalhoTelaProps {
  titulo: ReactNode
  descricao?: ReactNode
  /** Link de volta para a lista de onde a tela foi aberta. */
  voltar?: { para: string; rotulo: string }
  /** Ação principal da tela, à direita do título. */
  acao?: ReactNode
  /** Ao lado do título, como o status de uma saída. */
  selo?: ReactNode
}

/** Título de cada tela do painel, com a descrição, o link de volta e a ação principal. */
export function CabecalhoTela({ titulo, descricao, voltar, acao, selo }: CabecalhoTelaProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {voltar && (
          <Link to={voltar.para} className="mb-2 inline-block text-sm font-semibold text-sol-400 hover:text-sol-500">
            ← {voltar.rotulo}
          </Link>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl font-black uppercase sm:text-4xl">{titulo}</h1>
          {selo}
        </div>
        {descricao && <p className="mt-1 text-cinza-400 tabular-nums">{descricao}</p>}
      </div>
      {acao}
    </div>
  )
}
