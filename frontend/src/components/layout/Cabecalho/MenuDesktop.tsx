import { NavLink } from 'react-router-dom'
import { linksNavegacao } from '@/config/navegacao'
import { ROTAS } from '@/constants/rotas'
import { useVoltarAoTopoNaMesmaPagina } from '@/hooks/useRolagemAoTopo'
import { classeLinkDesktop } from './estilos'

export function MenuDesktop({ sobreFoto }: { sobreFoto: boolean }) {
  const voltarAoTopo = useVoltarAoTopoNaMesmaPagina()

  return (
    <nav aria-label="Menu principal" className="hidden md:block">
      <ul className="flex items-center gap-7 lg:gap-10">
        {linksNavegacao.map(({ rota, rotulo }) => (
          <li key={rota}>
            <NavLink to={rota} end={rota === ROTAS.inicio} onClick={voltarAoTopo(rota)} className={classeLinkDesktop(sobreFoto)}>
              {rotulo}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
