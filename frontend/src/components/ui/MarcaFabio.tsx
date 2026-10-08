import { type SVGProps, useId } from 'react'

// Trilha em zigue-zague subindo a encosta da montanha da frente, da base até o cume, em blocos curtos como os cravos de um pneu.
const TRILHA = 'M6.5 27.5L11.5 23.8L8.6 20.2L13.2 16.4L11.4 12.6L14.5 6.5'

/**
 * Símbolo da marca: duas montanhas em forma de pirâmide, cada uma com uma face iluminada e outra na sombra,
 * separadas pela aresta do cume, o que dá volume (efeito 3D). Ao carregar, as montanhas sobem a partir da base;
 * ao passar o mouse no logo, uma trilha tracejada é desenhada até o cume (classes em global.css).
 * Mantenha em sincronia com `public/favicon.svg` e `docs/logo.svg`.
 */
export function MarcaFabio(props: SVGProps<SVGSVGElement>) {
  // O logo aparece mais de uma vez na página (cabeçalho e rodapé): cada um precisa da própria máscara.
  const idMascara = useId()

  return (
    <svg viewBox="0 0 40 30" aria-hidden="true" {...props}>
      <defs>
        {/* A máscara "desenha" a trilha aos poucos; a trilha visível continua tracejada */}
        <mask id={idMascara} maskUnits="userSpaceOnUse" x="0" y="0" width="40" height="30">
          <path
            d={TRILHA}
            pathLength={1}
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="marca-trilha-mascara"
          />
        </mask>
      </defs>
      <g strokeLinejoin="round" strokeWidth="1">
        {/* Montanha de trás: face iluminada e face na sombra */}
        <g className="marca-erguer marca-erguer-tras">
          <path d="M17.5 28.5L28 9.5L30.5 28.5Z" fill="var(--color-areia-100)" stroke="var(--color-areia-100)" />
          <path d="M28 9.5L38.5 28.5L30.5 28.5Z" fill="#b9b1a4" stroke="#b9b1a4" />
        </g>
        {/* Montanha da frente: face iluminada, face na sombra, brilho no cume e a trilha */}
        <g className="marca-erguer">
          <path d="M1.5 28.5L14.5 3.5L17.5 28.5Z" fill="var(--color-trilha-400)" stroke="var(--color-trilha-400)" />
          <path d="M14.5 3.5L27.5 28.5L17.5 28.5Z" fill="var(--color-trilha-700)" stroke="var(--color-trilha-700)" />
          <path d="M14.5 3.5L12.4 7.6L15 7.2Z" fill="#fde3d3" stroke="#fde3d3" />
          <path
            d={TRILHA}
            fill="none"
            stroke="var(--color-areia-100)"
            strokeWidth="2.4"
            strokeLinejoin="round"
            strokeDasharray="1 0.9"
            mask={`url(#${idMascara})`}
          />
        </g>
      </g>
    </svg>
  )
}
