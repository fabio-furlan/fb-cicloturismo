import { Outlet, useLocation } from 'react-router-dom'
import { ROTAS } from '@/constants/rotas'
import { Cabecalho } from './Cabecalho'
import { Rodape } from './Rodape'

export function LayoutPrincipal() {
  const { pathname } = useLocation()
  // Na página inicial a foto fica por trás do cabeçalho; nas demais, o conteúdo começa abaixo dele.
  const recuoDoCabecalho = pathname === ROTAS.inicio ? '' : 'pt-16 md:pt-20'

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-night-900">
      <Cabecalho />
      <main className={`flex-1 ${recuoDoCabecalho}`}>
        <Outlet />
      </main>
      <Rodape />
    </div>
  )
}
