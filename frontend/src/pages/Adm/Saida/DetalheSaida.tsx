import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Carregando } from '@/components/feedback/Carregando'
import { ROTAS } from '@/constants/rotas'
import {
  Aviso,
  CabecalhoTela,
  Cartao,
  ErroNoPainel,
  FormularioSaida,
  Opcionais,
  SeloStatus,
  useApiAdm,
  useEstadoDaNavegacao,
  type Mensagem,
  type SaidaAdm,
} from '@/features/adm'
import { useRecurso } from '@/hooks/useRecurso'
import { mensagemDoErro } from '@/lib/api'
import { formatarPeriodo, formatarPrecoExato } from '@/utils/formatacao'
import { CartaoPublicacao } from './CartaoPublicacao'

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
  const { aviso } = useEstadoDaNavegacao()
  const { estado, recarregar, substituir } = useRecurso((sinal) => api.saida(id, sinal), [api, id])
  const [mensagem, setMensagem] = useState<Mensagem | null>(null)

  if (estado.situacao === 'carregando') return <Carregando variante="secao" />
  if (estado.situacao === 'erro') return <ErroNoPainel mensagem={estado.mensagem} aoTentarDeNovo={recarregar} />
  const saida = estado.dados

  const executar = async (acao: () => Promise<SaidaAdm>, sucesso: string) => {
    setMensagem(null)
    try {
      substituir(await acao())
      setMensagem({ tipo: 'sucesso', texto: sucesso })
    } catch (falha) {
      setMensagem({ tipo: 'erro', texto: mensagemDoErro(falha, 'Não foi possível concluir.') })
    }
  }

  return (
    <div className="space-y-6">
      <CabecalhoTela
        titulo={saida.roteiroTitulo}
        selo={<SeloStatus status={saida.status} />}
        voltar={{ para: ROTAS.admPainel, rotulo: 'Saídas' }}
        descricao={`${formatarPeriodo(saida.dataInicio, saida.dataFim)} · ${saida.vagasOcupadas} de ${saida.capacidade} vagas vendidas · ${formatarPrecoExato(saida.precoBase)} por pessoa`}
      />

      {aviso && !mensagem && <Aviso tipo="sucesso">{aviso}</Aviso>}
      {mensagem && <Aviso tipo={mensagem.tipo}>{mensagem.texto}</Aviso>}

      <CartaoPublicacao saida={saida} executar={executar} aoAvisar={setMensagem} />

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
