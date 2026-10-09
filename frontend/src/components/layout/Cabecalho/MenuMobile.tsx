import { NavLink } from 'react-router-dom'
import { linksNavegacao } from '@/config/navegacao'
import { ROTAS } from '@/constants/rotas'
import { useVoltarAoTopoNaMesmaPagina } from '@/hooks/useRolagemAoTopo'
import { AcessoConta } from './AcessoConta'
import { classeLinkMobile } from './estilos'

interface MenuMobileProps {
  aberto: boolean
  aoFechar: () => void
}

export function MenuMobile({ aberto, aoFechar }: MenuMobileProps) {
  const voltarAoTopo = useVoltarAoTopoNaMesmaPagina()
  if (!aberto) return null

  return (
    <nav
      id="menu-mobile"
      aria-label="Menu principal"
      className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-carvao-900/10 bg-white md:hidden"
    >
      <ul className="flex flex-col gap-1 px-4 py-4">
        {linksNavegacao.map(({ rota, rotulo, icone: Icone }) => (
          <li key={rota}>
            <NavLink
              to={rota}
              end={rota === ROTAS.inicio}
              onClick={() => {
                aoFechar()
                voltarAoTopo(rota)()
              }}
              className={classeLinkMobile}
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      isActive ? 'bg-vermelho-500 text-white' : 'bg-carvao-900/[0.05] text-vermelho-500'
                    }`}
                  >
                    <Icone className="h-5 w-5" />
                  </span>
                  {rotulo}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="px-4 pb-8">
        <AcessoConta onClick={aoFechar} larguraTotal />
      </div>
    </nav>
  )
}
