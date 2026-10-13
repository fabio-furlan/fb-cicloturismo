import { lazy, Suspense } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Carregando } from '@/components/feedback/Carregando'
import { LimiteDeErro } from '@/components/feedback/LimiteDeErro'
import { LayoutPrincipal } from '@/components/layout/LayoutPrincipal'
import { ROTAS } from '@/constants/rotas'
import { useTopoAoTrocarDePagina } from '@/hooks/useRolagemAoTopo'

// Cada página é carregada sob demanda, deixando o carregamento inicial mais leve.
const Inicio = lazy(() => import('@/pages/Inicio'))
const Roteiros = lazy(() => import('@/pages/Roteiros'))
const Sobre = lazy(() => import('@/pages/Sobre'))
const Contato = lazy(() => import('@/pages/Contato'))
const MinhaConta = lazy(() => import('@/pages/MinhaConta'))
const Cadastro = lazy(() => import('@/pages/Cadastro'))
const NaoEncontrada = lazy(() => import('@/pages/NaoEncontrada'))
const AreaAdm = lazy(() => import('@/pages/Adm'))

export function Rotas() {
  const { pathname } = useLocation()
  // Vale para todas as páginas, do site e do painel do ADM.
  useTopoAoTrocarDePagina()

  // Um erro numa página não prende o site nela: ao trocar de endereço, o limite tenta desenhar de novo.
  return (
    <LimiteDeErro reiniciarCom={pathname}>
      <Suspense fallback={<Carregando />}>
        <Routes>
          {/* O painel do ADM tem layout próprio, sem o cabeçalho e o rodapé do site. */}
          <Route path="/adm/*" element={<AreaAdm />} />
          <Route element={<LayoutPrincipal />}>
            <Route path={ROTAS.inicio} element={<Inicio />} />
            <Route path={ROTAS.roteiros} element={<Roteiros />} />
            <Route path={ROTAS.sobre} element={<Sobre />} />
            <Route path={ROTAS.contato} element={<Contato />} />
            <Route path={ROTAS.minhaConta} element={<MinhaConta />} />
            <Route path={ROTAS.cadastro} element={<Cadastro />} />
            <Route path="*" element={<NaoEncontrada />} />
          </Route>
        </Routes>
      </Suspense>
    </LimiteDeErro>
  )
}
