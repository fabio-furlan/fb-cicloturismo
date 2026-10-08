import { NavLink } from 'react-router-dom'
import { linksNavegacao } from '@/config/navegacao'
import { ROTAS } from '@/constants/rotas'
import { classeLinkDesktop } from './estilos'

export function MenuDesktop() {
  return (
    <nav aria-label="Menu principal" className="hidden md:block">
      <ul className="flex items-center gap-8 lg:gap-11">
        {linksNavegacao.map(({ rota, rotulo }) => (
          <li key={rota}>
            <NavLink to={rota} end={rota === ROTAS.inicio} className={classeLinkDesktop}>
              {rotulo}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
