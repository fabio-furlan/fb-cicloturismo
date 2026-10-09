import { useState } from 'react'
import { Link } from 'react-router-dom'
import { empresa } from '@/config/empresa'
import { ROTAS } from '@/constants/rotas'
import { MarcaFabio } from './MarcaFabio'

export function Logo() {
  // No celular não há "passar o mouse": cada toque faz o ciclista apontar para o nome uma vez.
  const [toques, setToques] = useState(0)

  const aoClicar = () => {
    // Mesmo já estando na página inicial, o clique no logo leva de volta ao topo.
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setToques((n) => n + 1)
  }

  return (
    <Link
      to={ROTAS.inicio}
      onClick={aoClicar}
      className="group inline-flex items-center text-areia-100"
      aria-label={`${empresa.nome}, página inicial`}
    >
      {/* O desenho tem espaço vazio à direita (para o braço esticado): a margem negativa deixa o ciclista colado no nome */}
      <MarcaFabio apontar={toques} className="-mr-1.5 h-11 w-9 shrink-0 overflow-visible drop-shadow-[0_2px_3px_rgb(0_0_0/0.45)]" />
      <span className="flex flex-col whitespace-nowrap leading-none">
        <span className="font-display text-[1.65rem] font-bold tracking-[-0.01em] [text-shadow:0_1px_0_rgb(0_0_0/0.45),0_2px_0_rgb(0_0_0/0.25)]">
          Fábio
        </span>
        <span className="mt-0.5 text-[0.7rem] font-semibold tracking-[0.14em] text-areia-100/70">cicloturismo</span>
      </span>
    </Link>
  )
}
