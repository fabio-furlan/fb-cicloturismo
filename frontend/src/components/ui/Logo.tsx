import { Link } from 'react-router-dom'
import { empresa } from '@/config/empresa'
import { ROTAS } from '@/constants/rotas'
import { MarcaFabinho } from './MarcaFabinho'

export function Logo() {
  return (
    <Link to={ROTAS.inicio} className="group flex items-center gap-2.5 text-areia-100" aria-label={`${empresa.nome}, página inicial`}>
      <MarcaFabinho className="h-9 w-[3.6rem] shrink-0 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
      <span className="flex flex-col whitespace-nowrap leading-none">
        <span className="font-display text-[1.65rem] font-bold tracking-[-0.01em]">fabinho</span>
        <span className="mt-0.5 text-[0.7rem] font-semibold tracking-[0.12em] text-trilha-500">cicloturismo</span>
      </span>
    </Link>
  )
}
