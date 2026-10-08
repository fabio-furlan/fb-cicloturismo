import { useState } from 'react'
import { roteirosExemplo } from '@/data/roteirosExemplo'
import { type FiltrosViagem, filtrosVazios } from '@/utils/saidas'
import { SecaoCalculadoraNivel } from './components/SecaoCalculadoraNivel'
import { SecaoChamadaFinal } from './components/SecaoChamadaFinal'
import { SecaoComoFunciona } from './components/SecaoComoFunciona'
import { SecaoDestaque } from './components/destaque/SecaoDestaque'
import { SecaoExplorador } from './components/explorador/SecaoExplorador'
import { SecaoSaidas } from './components/saidas/SecaoSaidas'

const rolarAte = (id: string) => document.getElementById(id)?.scrollIntoView()

export function Inicio() {
  const [filtros, setFiltros] = useState<FiltrosViagem>(filtrosVazios)
  // O roteiro aberto no explorador pode ser escolhido pelos cartões de saída e pela calculadora de nível.
  const [roteiroId, setRoteiroId] = useState(roteirosExemplo[0].id)

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
      <SecaoDestaque key={JSON.stringify(filtros)} filtros={filtros} aoBuscar={buscar} />
      <SecaoSaidas filtros={filtros} aoMudarFiltros={setFiltros} aoExplorar={explorarRoteiro} />
      <SecaoExplorador roteiroId={roteiroId} aoSelecionarRoteiro={setRoteiroId} />
      <SecaoCalculadoraNivel aoExplorar={explorarRoteiro} />
      <SecaoComoFunciona />
      <SecaoChamadaFinal />
    </>
  )
}
