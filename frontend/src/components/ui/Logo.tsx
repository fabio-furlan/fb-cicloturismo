import { useState } from 'react'
import { Link } from 'react-router-dom'
import { empresa } from '@/config/empresa'
import { ROTAS } from '@/constants/rotas'
import { MarcaFabio } from './MarcaFabio'

interface LogoProps {
  /** Cor do fundo onde o logo aparece: no claro, nome escuro; no escuro, nome branco. */
  tom?: 'claro' | 'escuro'
}

export function Logo({ tom = 'escuro' }: LogoProps) {
  const escuro = tom === 'escuro'
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
      className={`group inline-flex items-center ${escuro ? 'text-white' : 'text-carvao-900'}`}
      aria-label={`${empresa.nome}, página inicial`}
    >
      {/* O desenho tem espaço vazio à direita (para o braço esticado): a margem negativa deixa o ciclista colado no nome */}
      <MarcaFabio apontar={toques} className="-mr-1.5 h-11 w-9 shrink-0 overflow-visible drop-shadow-[0_2px_3px_rgb(0_0_0/0.45)]" />
      <span className="flex flex-col whitespace-nowrap leading-none">
        <span className={`font-display text-[1.45rem] font-black uppercase tracking-[0.01em] ${escuro ? '[text-shadow:0_1px_6px_rgb(0_0_0/0.4)]' : ''}`}>
          Fábio
        </span>
        <span
          className={`mt-0.5 font-display text-[0.68rem] font-extrabold uppercase tracking-[0.16em] ${escuro ? 'text-sol-500' : 'text-vermelho-500'}`}
        >
          cicloturismo
        </span>
      </span>
    </Link>
  )
}
