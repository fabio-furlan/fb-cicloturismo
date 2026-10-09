import { useEffect } from 'react'
import { Link, Navigate, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { MarcaFabio } from '@/components/ui/MarcaFabio'
import { ROTAS } from '@/constants/rotas'
import { useSessaoAdm } from './sessao/contexto'

const links = [
  { rota: ROTAS.admPainel, rotulo: 'Saídas', fim: true },
  { rota: ROTAS.admRoteiros, rotulo: 'Roteiros', fim: false },
]

/** Estrutura das telas protegidas: barra do painel no topo e redirecionamento para o login sem sessão. */
export function LayoutAdm() {
  const { administrador, sair } = useSessaoAdm()
  const { pathname } = useLocation()

  useEffect(() => {
    const anterior = document.title
    document.title = 'Painel do ADM · Fábio Cicloturismo'
    return () => {
      document.title = anterior
    }
  }, [])

  if (!administrador) return <Navigate to={ROTAS.admEntrar} replace state={{ de: pathname }} />

  return (
    <div className="flex min-h-screen flex-col bg-carvao-900">
      <header className="sticky top-0 z-20 border-b-2 border-vermelho-500 bg-carvao-950/95 backdrop-blur">
        <Container className="flex min-h-16 flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2">
          <div className="flex items-center gap-6">
            <Link to={ROTAS.admPainel} className="flex items-center gap-2.5" aria-label="Painel do ADM, início">
              <MarcaFabio className="h-8 w-7 shrink-0" />
              <span className="font-display text-lg font-black uppercase leading-none">
                Painel <span className="text-sol-500">ADM</span>
              </span>
            </Link>
            <nav aria-label="Painel">
              <ul className="flex gap-1">
                {links.map(({ rota, rotulo, fim }) => (
                  <li key={rota}>
                    <NavLink
                      to={rota}
                      end={fim}
                      className={({ isActive }) =>
                        `inline-flex min-h-11 items-center rounded-lg px-4 text-sm font-semibold transition-colors ${
                          isActive ? 'bg-white/10 text-sol-400' : 'text-creme-100/85 hover:text-sol-400'
                        }`
                      }
                    >
                      {rotulo}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-cinza-400 sm:inline" title={administrador.email}>
              {administrador.nome}
            </span>
            <Link to={ROTAS.inicio} className="hidden font-semibold text-creme-100/85 hover:text-sol-400 md:inline">
              Ver o site
            </Link>
            <button
              type="button"
              onClick={() => sair()}
              className="inline-flex min-h-11 items-center rounded-lg border border-creme-100/30 px-4 font-semibold hover:border-vermelho-500 hover:text-sol-400"
            >
              Sair
            </button>
          </div>
        </Container>
      </header>
      <main className="flex-1 py-8 sm:py-10">
        <Container>
          <Outlet />
        </Container>
      </main>
    </div>
  )
}
