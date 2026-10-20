import { Route, Routes } from 'react-router-dom'
import { PaginaNaoEncontrada } from '@/components/feedback/PaginaNaoEncontrada'
import { ProvedorSessaoAdm } from '@/features/adm'
import { Entrar } from './Entrar/Entrar'
import { RetornoDoLogin } from './Entrar/RetornoDoLogin'
import { LayoutAdm } from './LayoutAdm'
import { Painel } from './Painel/Painel'
import { EditarRoteiro } from './Roteiro/EditarRoteiro'
import { NovoRoteiro } from './Roteiro/NovoRoteiro'
import { Roteiros } from './Roteiros/Roteiros'
import { DetalheSaida } from './Saida/DetalheSaida'

/**
 * Tudo sob /adm. É carregado sob demanda, num pacote separado: quem só visita o site não baixa o código do painel.
 * Os caminhos aqui são relativos a /adm (veja ROTAS em constants/rotas.ts).
 */
export function AreaAdm() {
  return (
    <ProvedorSessaoAdm>
      <Routes>
        <Route path="entrar" element={<Entrar />} />
        <Route path="entrar/retorno" element={<RetornoDoLogin />} />
        <Route element={<LayoutAdm />}>
          <Route index element={<Painel />} />
          <Route path="saidas/:id" element={<DetalheSaida />} />
          <Route path="roteiros" element={<Roteiros />} />
          <Route path="roteiros/novo" element={<NovoRoteiro />} />
          <Route path="roteiros/:id" element={<EditarRoteiro />} />
          <Route path="*" element={<PaginaNaoEncontrada />} />
        </Route>
      </Routes>
    </ProvedorSessaoAdm>
  )
}
