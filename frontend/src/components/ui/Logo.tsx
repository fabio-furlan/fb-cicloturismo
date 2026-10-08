import { useId } from 'react'
import { Link } from 'react-router-dom'
import { empresa } from '@/config/empresa'
import { ROTAS } from '@/constants/rotas'
import { MarcaFabio } from './MarcaFabio'

export function Logo() {
  // O logo aparece no cabeçalho e no rodapé: cada um precisa do próprio padrão de rastro.
  const idRastro = useId()

  return (
    <Link
      to={ROTAS.inicio}
      className="group relative flex items-center gap-2.5 text-areia-100"
      aria-label={`${empresa.nome}, página inicial`}
    >
      {/* Ao passar o mouse, a montanha sobe e gira e uma trilha é desenhada até o cume (estilos em global.css) */}
      <MarcaFabio className="marca-girar h-8 w-[2.65rem] shrink-0" />
      <span className="flex flex-col whitespace-nowrap leading-none">
        <span className="font-display text-[1.65rem] font-bold tracking-[-0.01em] [text-shadow:0_1px_0_rgb(0_0_0/0.45),0_2px_0_rgb(0_0_0/0.25)]">
          Fabio
        </span>
        <span className="mt-0.5 text-[0.7rem] font-semibold tracking-[0.14em] text-areia-100/70">cicloturismo</span>
      </span>
      {/* Rastro de pneu de MTB: sai do pé da pirâmide e passa por baixo de "cicloturismo", revelado ao passar o mouse */}
      <svg
        className="logo-trilha-chao pointer-events-none absolute inset-x-0 top-full mt-0.5 h-2 w-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          {/* Um cravo do pneu em forma de "›"; repetido, forma a marca da roda na terra */}
          <pattern id={idRastro} width="6" height="8" patternUnits="userSpaceOnUse">
            <path d="M0.6 0.8L3.6 4L0.6 7.2H2.4L5.4 4L2.4 0.8Z" fill="var(--color-trilha-500)" />
          </pattern>
        </defs>
        <rect x="6" y="0" width="100%" height="8" fill={`url(#${idRastro})`} />
      </svg>
    </Link>
  )
}
