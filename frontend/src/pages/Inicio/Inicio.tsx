import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Carregando } from '@/components/ui/Carregando'
import { ErroAoCarregar } from '@/components/ui/ErroAoCarregar'
import { ROTAS } from '@/constants/rotas'
import { useRoteiros } from '@/hooks/useRoteiros'
import { type FiltrosViagem, filtrosVazios } from '@/utils/saidas'
import { SecaoCalculadoraNivel } from './components/SecaoCalculadoraNivel'
import { SecaoChamadaFinal } from './components/SecaoChamadaFinal'
import { SecaoComoFunciona } from './components/SecaoComoFunciona'
import { SecaoDestaque } from './components/destaque/SecaoDestaque'
import { SecaoSaidas } from './components/saidas/SecaoSaidas'

const rolarAte = (id: string) => document.getElementById(id)?.scrollIntoView()

export function Inicio() {
  const estado = useRoteiros()
  const [filtros, setFiltros] = useState<FiltrosViagem>(filtrosVazios)
  const navegar = useNavigate()

  if (estado.situacao === 'carregando') return <Carregando />
  if (estado.situacao === 'erro') return <ErroAoCarregar aoTentarDeNovo={estado.tentarDeNovo} />
  const { roteiros } = estado

  const buscar = (novos: FiltrosViagem) => {
    setFiltros(novos)
    rolarAte('saidas')
  }

  // Os cartões de saída e a calculadora de nível abrem o roteiro escolhido na página de roteiros.
  const explorarRoteiro = (id: string) => navegar(`${ROTAS.roteiros}?roteiro=${encodeURIComponent(id)}`)

  return (
    <>
      {/* A chave recria a busca do topo quando um filtro é removido lá embaixo, para os campos refletirem o estado atual. */}
      <SecaoDestaque key={JSON.stringify(filtros)} roteiros={roteiros} filtros={filtros} aoBuscar={buscar} />
      <SecaoSaidas roteiros={roteiros} filtros={filtros} aoMudarFiltros={setFiltros} aoExplorar={explorarRoteiro} />
      {/* Sem nenhuma saída aberta, não há percurso para comparar com o ritmo de quem visita. */}
      {roteiros.length > 0 && <SecaoCalculadoraNivel roteiros={roteiros} aoExplorar={explorarRoteiro} />}
      <SecaoComoFunciona />
      <SecaoChamadaFinal />
    </>
  )
}
