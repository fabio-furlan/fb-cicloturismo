import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Carregando } from '@/components/feedback/Carregando'
import { ROTAS } from '@/constants/rotas'
import {
  AcaoConfirmada,
  Aviso,
  CabecalhoTela,
  Cartao,
  ErroNoPainel,
  FormularioRoteiro,
  useApiAdm,
  useEstadoDaNavegacao,
  type Mensagem,
} from '@/features/adm'
import { useRecurso } from '@/hooks/useRecurso'
import { mensagemDoErro } from '@/lib/api'
import { formatarNumero } from '@/utils/formatacao'

export function EditarRoteiro() {
  const { id } = useParams()
  // A chave recria a página ao trocar de roteiro, para o formulário não manter os dados do anterior.
  return <PaginaEditarRoteiro key={id} id={Number(id)} />
}

const voltarAoTopo = () => window.scrollTo({ top: 0, behavior: 'smooth' })

function PaginaEditarRoteiro({ id }: { id: number }) {
  const api = useApiAdm()
  const navegar = useNavigate()
  const { aviso } = useEstadoDaNavegacao()
  const { estado, recarregar, substituir } = useRecurso((sinal) => api.roteiro(id, sinal), [api, id])
  const [mensagem, setMensagem] = useState<Mensagem | null>(null)
  // Muda a cada salvamento, para o formulário recomeçar dos dados que a API devolveu.
  const [versao, setVersao] = useState(0)

  if (estado.situacao === 'carregando') return <Carregando variante="secao" />
  if (estado.situacao === 'erro') return <ErroNoPainel mensagem={estado.mensagem} aoTentarDeNovo={recarregar} />
  const roteiro = estado.dados

  return (
    <div className="space-y-6">
      <CabecalhoTela
        titulo={roteiro.titulo}
        voltar={{ para: ROTAS.admRoteiros, rotulo: 'Roteiros' }}
        descricao={
          <>
            {formatarNumero(roteiro.distanciaKm)} km · endereço no site: <code className="text-creme-100">{roteiro.slug}</code> (não muda ao
            editar o título)
          </>
        }
      />

      {aviso && !mensagem && <Aviso tipo="sucesso">{aviso}</Aviso>}
      {mensagem && <Aviso tipo={mensagem.tipo}>{mensagem.texto}</Aviso>}

      <FormularioRoteiro
        key={versao}
        inicial={roteiro}
        rotuloBotao="Salvar alterações"
        aoEnviar={async (dados) => {
          substituir(await api.atualizarRoteiro(roteiro.id, dados))
          setVersao((v) => v + 1)
          setMensagem({ tipo: 'sucesso', texto: 'Alterações salvas. O site já mostra a versão nova.' })
          voltarAoTopo()
        }}
      />

      <Cartao titulo="Excluir roteiro">
        <p className="mb-4 text-sm text-cinza-400">
          Só é possível excluir um roteiro sem nenhuma saída. Se ele já teve saídas, cancele-as: assim o histórico de vendas fica guardado.
        </p>
        <AcaoConfirmada
          rotulo="Excluir roteiro"
          pergunta={`Excluir "${roteiro.titulo}"? Não dá para desfazer.`}
          confirmar="Sim, excluir"
          aoConfirmar={async () => {
            try {
              await api.excluirRoteiro(roteiro.id)
              navegar(ROTAS.admRoteiros)
            } catch (falha) {
              setMensagem({ tipo: 'erro', texto: mensagemDoErro(falha, 'Não foi possível excluir.') })
              voltarAoTopo()
            }
          }}
        />
      </Cartao>
    </div>
  )
}
