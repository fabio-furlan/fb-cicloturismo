import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ROTAS } from '@/constants/rotas'
import type { ResumoSaida, StatusSaida } from '@/types/adm'
import { CarregandoAdm, Cartao, ErroAoCarregar } from './componentes'
import { ordemStatus, statusSaida } from './formato'
import { useApiAdm } from './sessao/contexto'
import { TabelaSaidas } from './TabelaSaidas'
import { useRecurso } from './useRecurso'

// Saídas que ainda vendem ou podem vender: entram na conta de vagas vendidas do resumo.
const aVenda: StatusSaida[] = ['ABERTA', 'ESGOTADA', 'INSCRICOES_ENCERRADAS']

function Resumo({ saidas }: { saidas: ResumoSaida[] }) {
  const vendendo = saidas.filter((s) => aVenda.includes(s.status))
  const ocupadas = vendendo.reduce((total, s) => total + s.vagasOcupadas, 0)
  const capacidade = vendendo.reduce((total, s) => total + s.capacidade, 0)
  const itens = [
    { rotulo: 'Saídas abertas', valor: String(saidas.filter((s) => s.status === 'ABERTA').length) },
    { rotulo: 'Vagas vendidas', valor: `${ocupadas} de ${capacidade}` },
    { rotulo: 'Rascunhos', valor: String(saidas.filter((s) => s.status === 'RASCUNHO').length) },
  ]
  return (
    <dl className="grid gap-4 sm:grid-cols-3">
      {itens.map(({ rotulo, valor }) => (
        <div key={rotulo} className="rounded-2xl border border-white/10 bg-mata-800/60 p-5">
          <dt className="text-sm text-areia-400">{rotulo}</dt>
          <dd className="mt-1 font-display text-4xl font-bold tabular-nums">{valor}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Dashboard: as saídas que ainda não terminaram, com status, vagas vendidas e filtro por status. */
export function Painel() {
  const api = useApiAdm()
  const { estado, recarregar } = useRecurso((sinal) => api.proximasSaidas(sinal), [api])
  const [filtro, setFiltro] = useState<StatusSaida | ''>('')

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Próximas saídas</h1>
          <p className="mt-1 text-areia-400">Todas as saídas que ainda não terminaram, da mais próxima para a mais distante.</p>
        </div>
        <Link
          to={ROTAS.admRoteiros}
          className="inline-flex min-h-11 items-center rounded-full bg-trilha-500 px-5 text-sm font-semibold text-mata-950 hover:bg-trilha-400"
        >
          Nova saída
        </Link>
      </div>

      {estado.situacao === 'carregando' && <CarregandoAdm />}
      {estado.situacao === 'erro' && <ErroAoCarregar mensagem={estado.mensagem} aoTentarDeNovo={recarregar} />}
      {estado.situacao === 'pronto' && (
        <>
          <Resumo saidas={estado.dados} />
          <Cartao>
            <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filtrar por status">
              {(['', ...ordemStatus] as const).map((status) => {
                const quantidade = status ? estado.dados.filter((s) => s.status === status).length : estado.dados.length
                if (status && quantidade === 0) return null
                const ativo = filtro === status
                return (
                  <button
                    key={status || 'todas'}
                    type="button"
                    aria-pressed={ativo}
                    onClick={() => setFiltro(status)}
                    className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors ${
                      ativo ? 'border-trilha-500 bg-trilha-500 text-mata-950' : 'border-white/15 hover:border-trilha-500 hover:text-trilha-400'
                    }`}
                  >
                    {status ? statusSaida[status].rotulo : 'Todas'}
                    <span className={`rounded-full px-1.5 text-xs tabular-nums ${ativo ? 'bg-mata-950/15' : 'bg-white/10'}`}>{quantidade}</span>
                  </button>
                )
              })}
            </div>
            {estado.dados.length === 0 ? (
              <p className="py-6 text-center text-areia-400">
                Nenhuma saída por vir. Crie uma em <Link to={ROTAS.admRoteiros} className="font-semibold text-trilha-400">Roteiros</Link>.
              </p>
            ) : (
              <TabelaSaidas saidas={filtro ? estado.dados.filter((s) => s.status === filtro) : estado.dados} />
            )}
          </Cartao>
        </>
      )}
    </div>
  )
}
