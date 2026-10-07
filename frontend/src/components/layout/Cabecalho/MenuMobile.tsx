import { NavLink } from 'react-router-dom'
import { linksNavegacao } from '@/config/navegacao'
import { ROTAS } from '@/constants/rotas'
import { BotaoMinhaConta } from './BotaoMinhaConta'
import { classeLink } from './estilos'

interface MenuMobileProps {
  aberto: boolean
  aoFechar: () => void
}

export function MenuMobile({ aberto, aoFechar }: MenuMobileProps) {
  if (!aberto) return null

  return (
    <nav
      id="menu-mobile"
      aria-label="Menu principal"
      className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/10 bg-night-900 md:hidden"
    >
      <ul className="flex flex-col px-4 py-4">
        {linksNavegacao.map(({ rota, rotulo }) => (
          <li key={rota} className="border-b border-white/10">
            <NavLink
              to={rota}
              end={rota === ROTAS.inicio}
              onClick={aoFechar}
              className={(estado) => `block py-4 text-lg ${classeLink(estado)}`}
            >
              {rotulo}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="px-4 pb-8">
        <BotaoMinhaConta onClick={aoFechar} className="w-full py-3 text-base" />
      </div>
    </nav>
  )
}
