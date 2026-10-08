import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { LayoutPrincipal } from '@/components/layout/LayoutPrincipal'
import { Carregando } from '@/components/ui/Carregando'
import { ROTAS } from '@/constants/rotas'

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
  return (
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
  )
}
