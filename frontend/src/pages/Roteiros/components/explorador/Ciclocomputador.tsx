import type { Roteiro } from '@/types/roteiro'
import { formatarNumero } from '@/utils/formatacao'
import { corDaFaixa, faixaDaInclinacao, type PontoRota } from '@/utils/rota'

interface CiclocomputadorProps {
  roteiro: Roteiro
  ponto: PontoRota
}

const decimal = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

/** Leitura do ponto atual da rota, no formato da tela de um GPS de bike. */
export function Ciclocomputador({ roteiro, ponto }: CiclocomputadorProps) {
  const cor = corDaFaixa(faixaDaInclinacao(ponto.inclinacao))
  const progresso = (ponto.km / roteiro.distanciaKm) * 100
  const inclinacao = Math.abs(ponto.inclinacao) < 0.05 ? 0 : ponto.inclinacao

  return (
    <div className="rounded-[1.75rem] border border-mata-600 bg-mata-950 p-2.5 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.7)]">
      <div className="rounded-[1.25rem] bg-mata-800 p-4 tabular-nums sm:p-5" aria-live="off">
        <div className="flex items-baseline justify-between text-sm">
          <span className="font-semibold">
            Dia {ponto.dia} de {roteiro.dias}
          </span>
          <span className="text-areia-400">{decimal.format(roteiro.distanciaKm - ponto.km)} km para o fim</span>
        </div>

        <div className="mt-3 border-y border-mata-600 py-3">
          <p className="text-sm text-areia-400">Inclinação</p>
          <p className="font-display text-5xl font-bold leading-none sm:text-7xl" style={{ color: cor }}>
            {inclinacao > 0 ? '+' : inclinacao < 0 ? '−' : ''}
            {decimal.format(Math.abs(inclinacao))}
            <span className="ml-1 text-3xl">%</span>
          </p>
        </div>

        <dl className="mt-3 grid grid-cols-3 gap-3 lg:grid-cols-1 xl:grid-cols-3">
          <div>
            <dt className="text-xs text-areia-400">Distância</dt>
            <dd className="font-display text-2xl font-semibold leading-tight">
              {decimal.format(ponto.km)} <span className="text-base text-areia-400">km</span>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-areia-400">Altitude</dt>
            <dd className="font-display text-2xl font-semibold leading-tight">
              {formatarNumero(Math.round(ponto.altitude))} <span className="text-base text-areia-400">m</span>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-areia-400">Subida feita</dt>
            <dd className="font-display text-2xl font-semibold leading-tight">
              {formatarNumero(Math.round(ponto.subidaAcumulada))} <span className="text-base text-areia-400">m</span>
            </dd>
          </div>
        </dl>

        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-mata-600" aria-hidden="true">
          <div className="h-full rounded-full bg-trilha-500" style={{ width: `${progresso}%` }} />
        </div>
      </div>
    </div>
  )
}
