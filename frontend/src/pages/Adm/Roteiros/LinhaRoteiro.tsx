import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Carregando } from '@/components/feedback/Carregando'
import { rotaRoteiroAdm, rotaSaidaAdm } from '@/constants/rotas'
import {
  Botao,
  ErroNoPainel,
  FormularioSaida,
  niveisRoteiro,
  TabelaSaidas,
  useApiAdm,
  type EstadoDaNavegacao,
  type RoteiroAdm,
} from '@/features/adm'
import { useRecurso } from '@/hooks/useRecurso'
import { formatarNumero } from '@/utils/formatacao'
import { estiloLinkSecundario } from '../estilos'

function SaidasDoRoteiro({ roteiroId }: { roteiroId: number }) {
  const api = useApiAdm()
  const { estado, recarregar } = useRecurso((sinal) => api.saidasDoRoteiro(roteiroId, sinal), [api, roteiroId])
  if (estado.situacao === 'carregando') return <Carregando variante="secao" />
  if (estado.situacao === 'erro') return <ErroNoPainel mensagem={estado.mensagem} aoTentarDeNovo={recarregar} />
  if (estado.dados.length === 0) return <p className="text-sm text-cinza-400">Este roteiro ainda não tem saídas.</p>
  return <TabelaSaidas saidas={estado.dados} mostrarRoteiro={false} />
}

type PainelAberto = 'saidas' | 'nova-saida' | null

/** Um roteiro da lista: os números dele e, sob demanda, as saídas ou o formulário de uma saída nova. */
export function LinhaRoteiro({ roteiro }: { roteiro: RoteiroAdm }) {
  const api = useApiAdm()
  const navegar = useNavigate()
  const [aberto, setAberto] = useState<PainelAberto>(null)
  const alternar = (painel: PainelAberto) => setAberto((atual) => (atual === painel ? null : painel))
  const duracao = `${roteiro.dias} ${roteiro.dias === 1 ? 'dia' : 'dias'}`

  return (
    <li className="py-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl leading-tight font-extrabold uppercase">{roteiro.titulo}</h2>
          <p className="text-sm text-cinza-400">{roteiro.regiao}</p>
          <p className="mt-1 text-sm tabular-nums">
            {duracao} · {formatarNumero(roteiro.distanciaKm)} km · {formatarNumero(roteiro.subidaTotalM)} m de subida ·{' '}
            {niveisRoteiro[roteiro.nivel]}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to={rotaRoteiroAdm(roteiro.id)} className={estiloLinkSecundario}>
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
        <div className="mt-5 rounded-xl border border-white/10 bg-carvao-950/40 p-5">
          <h3 className="mb-4 font-semibold">Nova saída de {roteiro.titulo}</h3>
          <FormularioSaida
            comVagasEPreco
            rotuloBotao="Criar como rascunho"
            aoCancelar={() => setAberto(null)}
            aoEnviar={async (dados) => {
              const criada = await api.criarSaida(roteiro.id, dados)
              navegar(rotaSaidaAdm(criada.id), {
                state: { aviso: 'Saída criada como rascunho. Acrescente opcionais, se houver, e publique.' } satisfies EstadoDaNavegacao,
              })
            }}
          />
        </div>
      )}
    </li>
  )
}
