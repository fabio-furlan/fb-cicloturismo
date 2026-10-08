import { Route, Routes } from 'react-router-dom'
import { NaoEncontrada } from '@/pages/NaoEncontrada/NaoEncontrada'
import { DetalheSaida } from './DetalheSaida'
import { Entrar } from './Entrar'
import { LayoutAdm } from './LayoutAdm'
import { EditarRoteiro, NovoRoteiro } from './PaginasRoteiro'
import { Painel } from './Painel'
import { Roteiros } from './Roteiros'
import { ProvedorSessaoAdm } from './sessao/ProvedorSessaoAdm'

/**
 * Tudo sob /adm. É carregado sob demanda, num pacote separado: quem só visita o site não baixa o código do painel.
 * Os caminhos aqui são relativos a /adm (veja ROTAS em constants/rotas.ts).
 */
export function AreaAdm() {
  return (
    <ProvedorSessaoAdm>
      <Routes>
        <Route path="entrar" element={<Entrar />} />
        <Route element={<LayoutAdm />}>
          <Route index element={<Painel />} />
          <Route path="saidas/:id" element={<DetalheSaida />} />
          <Route path="roteiros" element={<Roteiros />} />
          <Route path="roteiros/novo" element={<NovoRoteiro />} />
          <Route path="roteiros/:id" element={<EditarRoteiro />} />
          <Route path="*" element={<NaoEncontrada />} />
        </Route>
      </Routes>
    </ProvedorSessaoAdm>
  )
}
