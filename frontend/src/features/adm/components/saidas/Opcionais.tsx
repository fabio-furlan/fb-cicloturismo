import { useState, type FormEvent } from 'react'
import { mensagemDoErro } from '@/lib/api'
import { formatarPrecoExato, lerNumero } from '@/utils/formatacao'
import { gruposOpcional } from '../../config/rotulos'
import { useApiAdm } from '../../sessao/contexto'
import type { GrupoOpcional, SaidaAdm } from '../../types'
import { Aviso, type Mensagem } from '../ui/Aviso'
import { Botao } from '../ui/Botao'
import { Campo, Selecao } from '../ui/campos'
import { Cartao } from '../ui/Cartao'

const rotulosGrupo = Object.fromEntries(Object.entries(gruposOpcional).map(([grupo, { rotulo }]) => [grupo, rotulo])) as Record<
  GrupoOpcional,
  string
>

interface OpcionaisProps {
  saida: SaidaAdm
  /** Recebe a saída como a API a devolveu depois de cada mudança. */
  aoAtualizar: (saida: SaidaAdm) => void
}

/** Os acréscimos que o participante pode escolher na inscrição (quarto individual, aluguel de bike, transfer). */
export function Opcionais({ saida, aoAtualizar }: OpcionaisProps) {
  const api = useApiAdm()
  const [grupo, setGrupo] = useState<GrupoOpcional>('ACOMODACAO')
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [acrescimo, setAcrescimo] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [removendo, setRemovendo] = useState<number | null>(null)
  const [mensagem, setMensagem] = useState<Mensagem | null>(null)

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
          acrescimo: lerNumero(acrescimo),
        }),
      )
      setNome('')
      setDescricao('')
      setAcrescimo('')
      setMensagem({ tipo: 'sucesso', texto: 'Opcional adicionado.' })
    } catch (falha) {
      setMensagem({ tipo: 'erro', texto: mensagemDoErro(falha, 'Não foi possível adicionar.') })
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
      setMensagem({ tipo: 'erro', texto: mensagemDoErro(falha, 'Não foi possível remover.') })
    } finally {
      setRemovendo(null)
    }
  }

  return (
    <Cartao titulo="Opcionais">
      {saida.opcionais.length === 0 ? (
        <p className="text-sm text-cinza-400">
          Nenhum opcional. Use o formulário abaixo para oferecer quarto individual, aluguel de bike, transfer...
        </p>
      ) : (
        <ul className="divide-y divide-white/5">
          {saida.opcionais.map((opcional) => (
            <li key={opcional.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="font-semibold">
                  {opcional.nome}
                  <span className="ml-2 text-xs font-normal text-cinza-400">{gruposOpcional[opcional.grupo].rotulo}</span>
                </p>
                {opcional.descricao && <p className="text-sm text-cinza-400">{opcional.descricao}</p>}
              </div>
              <div className="flex items-center gap-4">
                <span className="tabular-nums">+ {formatarPrecoExato(opcional.acrescimo)}</span>
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
          <Selecao rotulo="Grupo" valor={grupo} opcoes={rotulosGrupo} aoMudar={setGrupo} ajuda={gruposOpcional[grupo].ajuda} />
          <Campo
            rotulo="Nome"
            required
            maxLength={120}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Quarto individual"
          />
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
