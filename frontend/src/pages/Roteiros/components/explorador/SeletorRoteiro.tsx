import { IndicadorNivel } from '@/components/ui/IndicadorNivel'
import type { Roteiro } from '@/types/roteiro'
import { formatarData } from '@/utils/formatacao'

interface SeletorRoteiroProps {
  roteiros: Roteiro[]
  selecionadoId: string
  aoSelecionar: (id: string) => void
}

export function SeletorRoteiro({ roteiros, selecionadoId, aoSelecionar }: SeletorRoteiroProps) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0" role="group" aria-label="Escolha um roteiro">
      <div className="flex min-w-max gap-3 sm:grid sm:min-w-0 sm:grid-cols-2 lg:grid-cols-3">
        {roteiros.map((roteiro) => {
          const ativo = roteiro.id === selecionadoId
          return (
            <button
              key={roteiro.id}
              type="button"
              aria-pressed={ativo}
              onClick={() => aoSelecionar(roteiro.id)}
              className={`w-64 rounded-xl border p-4 text-left transition-colors sm:w-auto ${
                ativo ? 'border-vermelho-500 bg-vermelho-500/15' : 'border-white/10 hover:border-white/25 hover:bg-white/[0.04]'
              }`}
            >
              <span className="block font-display text-lg font-extrabold leading-tight">{roteiro.nome}</span>
              <span className="mt-2 flex items-center justify-between gap-3 text-sm text-cinza-400">
                <IndicadorNivel nivel={roteiro.nivel} className={ativo ? 'text-sol-500' : ''} />
                <span>Saída {formatarData(roteiro.saidas[0].data)}</span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
