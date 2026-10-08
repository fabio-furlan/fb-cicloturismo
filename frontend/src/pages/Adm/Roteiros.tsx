import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROTAS, rotaRoteiroAdm, rotaSaidaAdm } from '@/constants/rotas'
import type { RoteiroAdm } from '@/types/adm'
import { formatarNumero } from '@/utils/formatacao'
import { Botao, CarregandoAdm, Cartao, ErroAoCarregar } from './componentes'
import { FormularioSaida } from './FormularioSaida'
import { niveisRoteiro } from './formato'
import { useApiAdm } from './sessao/contexto'
import { TabelaSaidas } from './TabelaSaidas'
import { useRecurso } from './useRecurso'

function SaidasDoRoteiro({ roteiroId }: { roteiroId: number }) {
  const api = useApiAdm()
  const { estado, recarregar } = useRecurso((sinal) => api.saidasDoRoteiro(roteiroId, sinal), [api, roteiroId])
  if (estado.situacao === 'carregando') return <CarregandoAdm />
  if (estado.situacao === 'erro') return <ErroAoCarregar mensagem={estado.mensagem} aoTentarDeNovo={recarregar} />
  if (estado.dados.length === 0) return <p className="text-sm text-areia-400">Este roteiro ainda não tem saídas.</p>
  return <TabelaSaidas saidas={estado.dados} mostrarRoteiro={false} />
}

type Painel = 'saidas' | 'nova-saida' | null

function LinhaRoteiro({ roteiro }: { roteiro: RoteiroAdm }) {
  const api = useApiAdm()
  const navegar = useNavigate()
  const [aberto, setAberto] = useState<Painel>(null)
  const alternar = (painel: Painel) => setAberto((atual) => (atual === painel ? null : painel))
  const diasDePedal = `${roteiro.dias} ${roteiro.dias === 1 ? 'dia' : 'dias'}`

  return (
    <li className="py-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold leading-tight">{roteiro.titulo}</h2>
          <p className="text-sm text-areia-400">{roteiro.regiao}</p>
          <p className="mt-1 text-sm tabular-nums">
            {diasDePedal} · {formatarNumero(roteiro.distanciaKm)} km · {formatarNumero(roteiro.subidaTotalM)} m de subida ·{' '}
            {niveisRoteiro[roteiro.nivel]}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to={rotaRoteiroAdm(roteiro.id)}
            className="inline-flex min-h-11 items-center rounded-full border border-areia-100/30 px-5 text-sm font-semibold hover:border-trilha-500 hover:text-trilha-400"
          >
            Editar<span className="sr-only"> {roteiro.titulo}</span>
          </Link>
          <Botao variante="secundario" aria-expanded={aberto === 'saidas'} onClick={() => alternar('saidas')}>
            {aberto === 'saidas' ? 'Esconder saídas' : 'Ver saídas'}
          </Botao>
          <Botao aria-expanded={aberto === 'nova-saida'} onClick={() => alternar('nova-saida')}>
            Nova saída
          </Botao>
        </div>
      </div>

      {aberto === 'saidas' && (
        <div className="mt-5">
          <SaidasDoRoteiro roteiroId={roteiro.id} />
        </div>
      )}
      {aberto === 'nova-saida' && (
        <div className="mt-5 rounded-xl border border-white/10 bg-mata-950/40 p-5">
          <h3 className="mb-4 font-semibold">Nova saída de {roteiro.titulo}</h3>
          <FormularioSaida
            comVagasEPreco
            rotuloBotao="Criar como rascunho"
            aoCancelar={() => setAberto(null)}
            aoEnviar={async (dados) => {
              const criada = await api.criarSaida(roteiro.id, dados)
              navegar(rotaSaidaAdm(criada.id), {
                state: { aviso: 'Saída criada como rascunho. Acrescente opcionais, se houver, e publique.' },
              })
            }}
          />
        </div>
      )}
    </li>
  )
}

/** Os roteiros cadastrados e, para cada um, as saídas e a criação de uma nova. */
export function Roteiros() {
  const api = useApiAdm()
  const { estado, recarregar } = useRecurso((sinal) => api.roteiros(sinal), [api])

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Roteiros</h1>
          <p className="mt-1 text-areia-400">Escolha um roteiro para editar, ver as saídas dele ou abrir uma data nova.</p>
        </div>
        <Link
          to={ROTAS.admNovoRoteiro}
          className="inline-flex min-h-11 items-center rounded-full bg-trilha-500 px-5 text-sm font-semibold text-mata-950 hover:bg-trilha-400"
        >
          Novo roteiro
        </Link>
      </div>
      {estado.situacao === 'carregando' && <CarregandoAdm />}
      {estado.situacao === 'erro' && <ErroAoCarregar mensagem={estado.mensagem} aoTentarDeNovo={recarregar} />}
      {estado.situacao === 'pronto' && (
        <Cartao>
          {estado.dados.length === 0 ? (
            <p className="py-6 text-center text-areia-400">Nenhum roteiro cadastrado ainda.</p>
          ) : (
            <ul className="-my-5 divide-y divide-white/10">
              {estado.dados.map((roteiro) => (
                <LinhaRoteiro key={roteiro.id} roteiro={roteiro} />
              ))}
            </ul>
          )}
        </Cartao>
      )}
    </div>
  )
}
