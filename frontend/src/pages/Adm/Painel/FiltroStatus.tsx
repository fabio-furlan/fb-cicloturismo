import { ordemStatus, statusSaida, type ResumoSaida, type StatusSaida } from '@/features/adm'
import { cn } from '@/utils/cn'

interface FiltroStatusProps {
  saidas: ResumoSaida[]
  /** `''` mostra todas. */
  filtro: StatusSaida | ''
  aoMudar: (filtro: StatusSaida | '') => void
}

/** Um botão por status que tem alguma saída, com a quantidade de cada um. */
export function FiltroStatus({ saidas, filtro, aoMudar }: FiltroStatusProps) {
  return (
    <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filtrar por status">
      {(['', ...ordemStatus] as const).map((status) => {
        const quantidade = status ? saidas.filter((s) => s.status === status).length : saidas.length
        if (status && quantidade === 0) return null
        const ativo = filtro === status
        return (
          <button
            key={status || 'todas'}
            type="button"
            aria-pressed={ativo}
            onClick={() => aoMudar(status)}
            className={cn(
              'inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors',
              ativo ? 'border-vermelho-500 bg-vermelho-500 text-white' : 'border-white/15 hover:border-vermelho-500 hover:text-sol-400',
            )}
          >
            {status ? statusSaida[status].rotulo : 'Todas'}
            <span className={cn('rounded-full px-1.5 text-xs tabular-nums', ativo ? 'bg-carvao-950/15' : 'bg-white/10')}>{quantidade}</span>
          </button>
        )
      })}
    </div>
  )
}
