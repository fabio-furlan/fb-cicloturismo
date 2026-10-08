import { type FormEvent, useId, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ROTAS, rotaSaidaAdm } from '@/constants/rotas'
import type { GrupoOpcional, SaidaAdm } from '@/types/adm'
import { AcaoConfirmada, Aviso, Botao, Campo, CarregandoAdm, Cartao, ErroAoCarregar, SeloStatus } from './componentes'
import { FormularioSaida } from './FormularioSaida'
import { formatarPeriodo, formatarReais, gruposOpcional } from './formato'
import { useApiAdm } from './sessao/contexto'
import { useRecurso } from './useRecurso'

type Mensagem = { tipo: 'erro' | 'sucesso'; texto: string } | null

function Opcionais({ saida, aoAtualizar }: { saida: SaidaAdm; aoAtualizar: (saida: SaidaAdm) => void }) {
  const api = useApiAdm()
  const idGrupo = useId()
  const [grupo, setGrupo] = useState<GrupoOpcional>('ACOMODACAO')
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [acrescimo, setAcrescimo] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [removendo, setRemovendo] = useState<number | null>(null)
  const [mensagem, setMensagem] = useState<Mensagem>(null)

  const adicionar = async (evento: FormEvent) => {
    evento.preventDefault()
    setEnviando(true)
    setMensagem(null)
    try {
      aoAtualizar(
        await api.adicionarOpcional(saida.id, {
          grupo,
          nome: nome.trim(),
          descricao: descricao.trim() || undefined,
          acrescimo: Number(acrescimo.replace(',', '.')),
        }),
      )
      setNome('')
      setDescricao('')
      setAcrescimo('')
      setMensagem({ tipo: 'sucesso', texto: 'Opcional adicionado.' })
    } catch (falha) {
      setMensagem({ tipo: 'erro', texto: falha instanceof Error ? falha.message : 'Não foi possível adicionar.' })
    } finally {
      setEnviando(false)
    }
  }

  const remover = async (opcionalId: number) => {
    setRemovendo(opcionalId)
    setMensagem(null)
    try {
      aoAtualizar(await api.removerOpcional(saida.id, opcionalId))
    } catch (falha) {
      setMensagem({ tipo: 'erro', texto: falha instanceof Error ? falha.message : 'Não foi possível remover.' })
    } finally {
      setRemovendo(null)
    }
  }

  return (
    <Cartao titulo="Opcionais">
      {saida.opcionais.length === 0 ? (
        <p className="text-sm text-areia-400">Nenhum opcional. Use o formulário abaixo para oferecer quarto individual, aluguel de bike, transfer...</p>
      ) : (
        <ul className="divide-y divide-white/5">
          {saida.opcionais.map((opcional) => (
            <li key={opcional.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="font-semibold">
                  {opcional.nome}
                  <span className="ml-2 text-xs font-normal text-areia-400">{gruposOpcional[opcional.grupo].rotulo}</span>
                </p>
                {opcional.descricao && <p className="text-sm text-areia-400">{opcional.descricao}</p>}
              </div>
              <div className="flex items-center gap-4">
                <span className="tabular-nums">+ {formatarReais(opcional.acrescimo)}</span>
                <Botao variante="secundario" carregando={removendo === opcional.id} onClick={() => remover(opcional.id)}>
                  Remover<span className="sr-only"> {opcional.nome}</span>
                </Botao>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={adicionar} className="mt-6 space-y-4 border-t border-white/10 pt-6">
        <h3 className="font-semibold">Adicionar opcional</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor={idGrupo} className="block text-sm font-semibold">
              Grupo
            </label>
            <select
              id={idGrupo}
              value={grupo}
              onChange={(e) => setGrupo(e.target.value as GrupoOpcional)}
              className="mt-1.5 min-h-11 w-full rounded-xl border border-white/15 bg-mata-950/60 px-3 text-base [color-scheme:dark] focus:border-trilha-500 focus:outline-none"
            >
              {(Object.keys(gruposOpcional) as GrupoOpcional[]).map((g) => (
                <option key={g} value={g}>
                  {gruposOpcional[g].rotulo}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-areia-400">{gruposOpcional[grupo].ajuda}</p>
          </div>
          <Campo rotulo="Nome" required maxLength={120} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Quarto individual" />
          <Campo rotulo="Descrição (opcional)" maxLength={255} value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          <Campo
            rotulo="Acréscimo (R$)"
            type="number"
            min={0}
            step="0.01"
            required
            inputMode="decimal"
            value={acrescimo}
            onChange={(e) => setAcrescimo(e.target.value)}
          />
        </div>
        {mensagem && <Aviso tipo={mensagem.tipo}>{mensagem.texto}</Aviso>}
        <Botao type="submit" carregando={enviando}>
          Adicionar
        </Botao>
      </form>
    </Cartao>
  )
}

/**
 * Uma saída: datas, vagas e preço, publicação, duplicação e opcionais. A chave pelo id recria a página ao ir de uma
 * saída para outra (como depois de duplicar), para mensagens e formulários abertos não passarem para a seguinte.
 */
export function DetalheSaida() {
  const { id } = useParams()
  return <PaginaSaida key={id} id={Number(id)} />
}

function PaginaSaida({ id }: { id: number }) {
  const api = useApiAdm()
  const navegar = useNavigate()
  const avisoDaNavegacao = (useLocation().state as { aviso?: string } | null)?.aviso
  const { estado, recarregar, substituir } = useRecurso((sinal) => api.saida(id, sinal), [api, id])
  const [mensagem, setMensagem] = useState<Mensagem>(null)
  const [duplicando, setDuplicando] = useState(false)
  const [publicando, setPublicando] = useState(false)

  if (estado.situacao === 'carregando') return <CarregandoAdm />
  if (estado.situacao === 'erro') return <ErroAoCarregar mensagem={estado.mensagem} aoTentarDeNovo={recarregar} />
  const saida = estado.dados

  const executar = async (acao: () => Promise<SaidaAdm>, sucesso: string) => {
    setMensagem(null)
    try {
      substituir(await acao())
      setMensagem({ tipo: 'sucesso', texto: sucesso })
    } catch (falha) {
      setMensagem({ tipo: 'erro', texto: falha instanceof Error ? falha.message : 'Não foi possível concluir.' })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to={ROTAS.admPainel} className="text-sm font-semibold text-trilha-400 hover:text-trilha-500">
          ← Saídas
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">{saida.roteiroTitulo}</h1>
          <SeloStatus status={saida.status} />
        </div>
        <p className="mt-1 text-areia-400 tabular-nums">
          {formatarPeriodo(saida.dataInicio, saida.dataFim)} · {saida.vagasOcupadas} de {saida.capacidade} vagas vendidas ·{' '}
          {formatarReais(saida.precoBase)} por pessoa
        </p>
      </div>

      {avisoDaNavegacao && !mensagem && <Aviso tipo="sucesso">{avisoDaNavegacao}</Aviso>}
      {mensagem && <Aviso tipo={mensagem.tipo}>{mensagem.texto}</Aviso>}

      <Cartao titulo="Publicação">
        <div className="flex flex-wrap items-start gap-3">
          {saida.situacao === 'RASCUNHO' && (
            <>
              <Botao
                carregando={publicando}
                onClick={async () => {
                  setPublicando(true)
                  await executar(() => api.publicar(saida.id), 'Saída publicada: ela já aparece no site para inscrição.')
                  setPublicando(false)
                }}
              >
                Publicar no site
              </Botao>
              <AcaoConfirmada
                rotulo="Excluir rascunho"
                pergunta="Excluir este rascunho? Não dá para desfazer."
                confirmar="Sim, excluir"
                aoConfirmar={async () => {
                  try {
                    await api.excluirSaida(saida.id)
                    navegar(ROTAS.admPainel)
                  } catch (falha) {
                    setMensagem({ tipo: 'erro', texto: falha instanceof Error ? falha.message : 'Não foi possível excluir.' })
                  }
                }}
              />
            </>
          )}
          {saida.situacao === 'PUBLICADA' && (
            <AcaoConfirmada
              rotulo="Cancelar saída"
              pergunta="Cancelar esta saída? Ela sai do site e não pode ser publicada de novo (dá para duplicar para outras datas)."
              confirmar="Sim, cancelar"
              aoConfirmar={() => executar(() => api.cancelar(saida.id), 'Saída cancelada.')}
            />
          )}
          {saida.situacao === 'CANCELADA' && (
            <p className="text-sm text-areia-400">Saída cancelada. Para vender estas datas de novo, duplique-a para novas datas.</p>
          )}
          {!duplicando && (
            <Botao variante="secundario" onClick={() => setDuplicando(true)}>
              Duplicar para outras datas
            </Botao>
          )}
        </div>
        {duplicando && (
          <div className="mt-6 border-t border-white/10 pt-6">
            <h3 className="mb-4 font-semibold">Duplicar com as mesmas vagas, preço e opcionais</h3>
            <FormularioSaida
              comVagasEPreco={false}
              rotuloBotao="Criar cópia"
              aoCancelar={() => setDuplicando(false)}
              aoEnviar={async (periodo) => {
                const copia = await api.duplicar(saida.id, periodo)
                setDuplicando(false)
                navegar(rotaSaidaAdm(copia.id), { state: { aviso: 'Cópia criada como rascunho. Confira e publique.' } })
              }}
            />
          </div>
        )}
      </Cartao>

      <Cartao titulo="Datas, vagas e preço">
        <FormularioSaida
          key={`${saida.id}-${saida.dataInicio}-${saida.capacidade}-${saida.precoBase}`}
          comVagasEPreco
          inicial={saida}
          rotuloBotao="Salvar alterações"
          aoEnviar={(dados) => executar(() => api.alterarSaida(saida.id, dados), 'Alterações salvas.')}
        />
      </Cartao>

      <Opcionais saida={saida} aoAtualizar={substituir} />
    </div>
  )
}
