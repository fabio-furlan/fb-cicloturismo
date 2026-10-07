import { NavLink } from 'react-router-dom'
import { linksNavegacao } from '@/config/navegacao'
import { ROTAS } from '@/constants/rotas'
import { classeLink } from './estilos'

export function MenuDesktop() {
  return (
    <nav aria-label="Menu principal" className="hidden md:block">
      <ul className="flex items-center gap-8 text-sm lg:gap-10">
        {linksNavegacao.map(({ rota, rotulo }) => (
          <li key={rota}>
            <NavLink to={rota} end={rota === ROTAS.inicio} className={classeLink}>
              {rotulo}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
