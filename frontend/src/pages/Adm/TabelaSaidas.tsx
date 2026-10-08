import { Link } from 'react-router-dom'
import { rotaSaidaAdm } from '@/constants/rotas'
import type { ResumoSaida } from '@/types/adm'
import { SeloStatus } from './componentes'
import { formatarPeriodo, formatarReais } from './formato'

/** Vagas vendidas sobre o total, com uma barra de ocupação. */
function Ocupacao({ ocupadas, capacidade }: { ocupadas: number; capacidade: number }) {
  const fracao = capacidade > 0 ? ocupadas / capacidade : 0
  return (
    <div className="min-w-28">
      <p className="text-sm tabular-nums">
        <span className="font-semibold">{ocupadas}</span>
        <span className="text-areia-400"> de {capacidade} vendidas</span>
      </p>
      <div
        className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={capacidade}
        aria-valuenow={ocupadas}
        aria-label="Vagas vendidas"
      >
        <div className="h-full rounded-full bg-trilha-500" style={{ width: `${Math.round(fracao * 100)}%` }} />
      </div>
    </div>
  )
}

interface TabelaSaidasProps {
  saidas: ResumoSaida[]
  /** Na página de um roteiro, o nome dele já está no título e a coluna sobra. */
  mostrarRoteiro?: boolean
}

export function TabelaSaidas({ saidas, mostrarRoteiro = true }: TabelaSaidasProps) {
  return (
    <>
      {/* Telas largas: tabela. */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-areia-400">
            <tr>
              <th scope="col" className="py-3 pr-4 font-semibold">
                Datas
              </th>
              {mostrarRoteiro && (
                <th scope="col" className="py-3 pr-4 font-semibold">
                  Roteiro
                </th>
              )}
              <th scope="col" className="py-3 pr-4 font-semibold">
                Status
              </th>
              <th scope="col" className="py-3 pr-4 font-semibold">
                Vagas
              </th>
              <th scope="col" className="py-3 pr-4 text-right font-semibold">
                Preço
              </th>
              <th scope="col" className="py-3">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {saidas.map((saida) => (
              <tr key={saida.id} className="align-middle">
                <td className="py-3.5 pr-4 font-semibold tabular-nums">{formatarPeriodo(saida.dataInicio, saida.dataFim)}</td>
                {mostrarRoteiro && <td className="py-3.5 pr-4">{saida.roteiroTitulo}</td>}
                <td className="py-3.5 pr-4">
                  <SeloStatus status={saida.status} />
                </td>
                <td className="py-3.5 pr-4">
                  <Ocupacao ocupadas={saida.vagasOcupadas} capacidade={saida.capacidade} />
                </td>
                <td className="py-3.5 pr-4 text-right tabular-nums">{formatarReais(saida.precoBase)}</td>
                <td className="py-3.5 text-right">
                  <Link to={rotaSaidaAdm(saida.id)} className="font-semibold text-trilha-400 hover:text-trilha-500">
                    Abrir<span className="sr-only">: saída de {formatarPeriodo(saida.dataInicio, saida.dataFim)}</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Celular: um cartão por saída, inteiro clicável. */}
      <ul className="space-y-3 md:hidden">
        {saidas.map((saida) => (
          <li key={saida.id}>
            <Link to={rotaSaidaAdm(saida.id)} className="block rounded-xl border border-white/10 bg-mata-950/40 p-4 hover:border-trilha-500/60">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold tabular-nums">{formatarPeriodo(saida.dataInicio, saida.dataFim)}</p>
                  {mostrarRoteiro && <p className="text-sm text-areia-400">{saida.roteiroTitulo}</p>}
                </div>
                <SeloStatus status={saida.status} />
              </div>
              <div className="mt-3 flex items-end justify-between gap-4">
                <Ocupacao ocupadas={saida.vagasOcupadas} capacidade={saida.capacidade} />
                <p className="font-semibold tabular-nums">{formatarReais(saida.precoBase)}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
