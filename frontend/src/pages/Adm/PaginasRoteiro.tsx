import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ROTAS, rotaRoteiroAdm } from '@/constants/rotas'
import { formatarNumero } from '@/utils/formatacao'
import { AcaoConfirmada, Aviso, CarregandoAdm, Cartao, ErroAoCarregar } from './componentes'
import { FormularioRoteiro } from './FormularioRoteiro'
import { useApiAdm } from './sessao/contexto'
import { useRecurso } from './useRecurso'

function Voltar() {
  return (
    <Link to={ROTAS.admRoteiros} className="text-sm font-semibold text-sol-400 hover:text-sol-500">
      ← Roteiros
    </Link>
  )
}

export function NovoRoteiro() {
  const api = useApiAdm()
  const navegar = useNavigate()

  return (
    <div className="space-y-6">
      <div>
        <Voltar />
        <h1 className="mt-2 font-display text-3xl font-black uppercase sm:text-4xl">Novo roteiro</h1>
        <p className="mt-1 text-cinza-400">Depois de salvar, crie as saídas (datas, vagas e preço) na lista de roteiros.</p>
      </div>
      <FormularioRoteiro
        rotuloBotao="Criar roteiro"
        aoEnviar={async (dados) => {
          const criado = await api.criarRoteiro(dados)
          navegar(rotaRoteiroAdm(criado.id), { state: { aviso: 'Roteiro criado. Agora abra uma saída para ele em Roteiros.' } })
        }}
      />
    </div>
  )
}

export function EditarRoteiro() {
  const { id } = useParams()
  // A chave recria a página ao trocar de roteiro, para o formulário não manter os dados do anterior.
  return <PaginaEditarRoteiro key={id} id={Number(id)} />
}

function PaginaEditarRoteiro({ id }: { id: number }) {
  const api = useApiAdm()
  const navegar = useNavigate()
  const avisoDaNavegacao = (useLocation().state as { aviso?: string } | null)?.aviso
  const { estado, recarregar, substituir } = useRecurso((sinal) => api.roteiro(id, sinal), [api, id])
  const [mensagem, setMensagem] = useState<{ tipo: 'erro' | 'sucesso'; texto: string } | null>(null)
  // Muda a cada salvamento, para o formulário recomeçar dos dados que a API devolveu.
  const [versao, setVersao] = useState(0)

  if (estado.situacao === 'carregando') return <CarregandoAdm />
  if (estado.situacao === 'erro') return <ErroAoCarregar mensagem={estado.mensagem} aoTentarDeNovo={recarregar} />
  const roteiro = estado.dados

  return (
    <div className="space-y-6">
      <div>
        <Voltar />
        <h1 className="mt-2 font-display text-3xl font-black uppercase sm:text-4xl">{roteiro.titulo}</h1>
        <p className="mt-1 text-cinza-400 tabular-nums">
          {formatarNumero(roteiro.distanciaKm)} km · endereço no site: <code className="text-creme-100">{roteiro.slug}</code> (não muda ao editar o título)
        </p>
      </div>

      {avisoDaNavegacao && !mensagem && <Aviso tipo="sucesso">{avisoDaNavegacao}</Aviso>}
      {mensagem && <Aviso tipo={mensagem.tipo}>{mensagem.texto}</Aviso>}

      <FormularioRoteiro
        key={versao}
        inicial={roteiro}
        rotuloBotao="Salvar alterações"
        aoEnviar={async (dados) => {
          substituir(await api.atualizarRoteiro(roteiro.id, dados))
          setVersao((v) => v + 1)
          setMensagem({ tipo: 'sucesso', texto: 'Alterações salvas. O site já mostra a versão nova.' })
          window.scrollTo({ top: 0, behavior: 'smooth' })
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
              setMensagem({ tipo: 'erro', texto: falha instanceof Error ? falha.message : 'Não foi possível excluir.' })
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          }}
        />
      </Cartao>
    </div>
  )
}
