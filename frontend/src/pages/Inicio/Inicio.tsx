import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Carregando } from '@/components/ui/Carregando'
import { ErroAoCarregar } from '@/components/ui/ErroAoCarregar'
import { ROTAS } from '@/constants/rotas'
import { useRevelarAoRolar } from '@/hooks/useRevelarAoRolar'
import { useRoteiros } from '@/hooks/useRoteiros'
import { type FiltrosViagem, filtrosVazios } from '@/utils/saidas'
import { SecaoCalculadoraNivel } from './components/SecaoCalculadoraNivel'
import { SecaoChamadaFinal } from './components/SecaoChamadaFinal'
import { SecaoComoFunciona } from './components/SecaoComoFunciona'
import { SecaoNumeros } from './components/SecaoNumeros'
import { SecaoDestaque } from './components/destaque/SecaoDestaque'
import { SecaoSaidas } from './components/saidas/SecaoSaidas'

const rolarAte = (id: string) => document.getElementById(id)?.scrollIntoView()

export function Inicio() {
  const estado = useRoteiros()
  const [filtros, setFiltros] = useState<FiltrosViagem>(filtrosVazios)
  const navegar = useNavigate()

  // O conteúdo de cada divisão surge ao entrar na tela (só depois que os roteiros carregam).
  useRevelarAoRolar(estado.situacao === 'pronto')

  if (estado.situacao === 'carregando') return <Carregando />
  if (estado.situacao === 'erro') return <ErroAoCarregar aoTentarDeNovo={estado.tentarDeNovo} />
  const { roteiros } = estado
  const temCalculadora = roteiros.length > 0

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
      {/* Divisão 2 (cada divisão sobe por cima da anterior como uma camada), destino de "Ver as próximas saídas" e da busca: saídas e faixa de números ocupam a tela abaixo do cabeçalho */}
      <div id="saidas" data-caber-na-tela className="secao-sobreposta recuar-ao-sair flex min-h-[calc(100svh-var(--cabecalho))] flex-col bg-creme-50">
        <SecaoSaidas
          roteiros={roteiros}
          filtros={filtros}
          aoMudarFiltros={setFiltros}
          aoExplorar={explorarRoteiro}
          proxima={temCalculadora ? { para: 'nivel', rotulo: 'Descubra seu nível' } : { para: 'como-funciona', rotulo: 'Como funciona' }}
        />
        {roteiros.length > 0 && <SecaoNumeros roteiros={roteiros} />}
        {/* Espaço que a calculadora cobre ao subir: nos cantos arredondados dela aparece o vermelho da faixa */}
        <div
          className={`espaco-sobreposicao ${roteiros.length > 0 ? 'bg-gradient-to-r from-vermelho-500 to-vermelho-700' : ''}`}
          aria-hidden="true"
        />
      </div>
      {/* Divisão 3. Sem nenhuma saída aberta, não há percurso para comparar com o ritmo de quem visita. */}
      {temCalculadora && <SecaoCalculadoraNivel roteiros={roteiros} aoExplorar={explorarRoteiro} />}
      {/* Divisão 4: como funciona, o convite final e o rodapé */}
      <SecaoComoFunciona />
      <SecaoChamadaFinal />
    </>
  )
}
