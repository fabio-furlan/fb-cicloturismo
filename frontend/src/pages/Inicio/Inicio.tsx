import { useState } from 'react'
import { Carregando } from '@/components/ui/Carregando'
import { Container } from '@/components/ui/Container'
import { useRoteiros } from '@/hooks/useRoteiros'
import { type FiltrosViagem, filtrosVazios } from '@/utils/saidas'
import { SecaoCalculadoraNivel } from './components/SecaoCalculadoraNivel'
import { SecaoChamadaFinal } from './components/SecaoChamadaFinal'
import { SecaoComoFunciona } from './components/SecaoComoFunciona'
import { SecaoDestaque } from './components/destaque/SecaoDestaque'
import { SecaoExplorador } from './components/explorador/SecaoExplorador'
import { SecaoSaidas } from './components/saidas/SecaoSaidas'

const rolarAte = (id: string) => document.getElementById(id)?.scrollIntoView()

function ErroAoCarregar({ aoTentarDeNovo }: { aoTentarDeNovo: () => void }) {
  return (
    <div role="alert">
      <Container className="flex min-h-[70svh] flex-col items-start justify-center py-28">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">Não foi possível carregar as viagens</h1>
        <p className="mt-3 max-w-xl text-areia-400">
          Confira sua conexão e tente de novo. Se continuar, fale com a gente pelo contato.
        </p>
        <button
          type="button"
          onClick={aoTentarDeNovo}
          className="mt-8 min-h-11 rounded-lg bg-trilha-500 px-6 text-sm font-semibold text-mata-950 hover:bg-trilha-400"
        >
          Tentar de novo
        </button>
      </Container>
    </div>
  )
}

export function Inicio() {
  const estado = useRoteiros()
  const [filtros, setFiltros] = useState<FiltrosViagem>(filtrosVazios)
  // O roteiro aberto no explorador pode ser escolhido pelos cartões de saída e pela calculadora de nível.
  // Enquanto ninguém escolhe, o explorador abre o da saída mais próxima.
  const [roteiroId, setRoteiroId] = useState<string | null>(null)

  if (estado.situacao === 'carregando') return <Carregando />
  if (estado.situacao === 'erro') return <ErroAoCarregar aoTentarDeNovo={estado.tentarDeNovo} />
  const { roteiros } = estado

  const buscar = (novos: FiltrosViagem) => {
    setFiltros(novos)
    rolarAte('saidas')
  }

  const explorarRoteiro = (id: string) => {
    setRoteiroId(id)
    rolarAte('explorar')
  }

  return (
    <>
      {/* A chave recria a busca do topo quando um filtro é removido lá embaixo, para os campos refletirem o estado atual. */}
      <SecaoDestaque key={JSON.stringify(filtros)} roteiros={roteiros} filtros={filtros} aoBuscar={buscar} />
      <SecaoSaidas roteiros={roteiros} filtros={filtros} aoMudarFiltros={setFiltros} aoExplorar={explorarRoteiro} />
      {/* Sem nenhuma saída aberta, não há percurso para explorar nem para comparar com o ritmo de quem visita. */}
      {roteiros.length > 0 && (
        <>
          <SecaoExplorador roteiros={roteiros} roteiroId={roteiroId} aoSelecionarRoteiro={setRoteiroId} />
          <SecaoCalculadoraNivel roteiros={roteiros} aoExplorar={explorarRoteiro} />
        </>
      )}
      <SecaoComoFunciona />
      <SecaoChamadaFinal />
    </>
  )
}
