import type { SVGProps } from 'react'

/**
 * Mountain bike de perfil, virada para a direita: suspensão dianteira, guidão reto e pneus com cravos.
 * As rodas tocam a base do desenho (y = 30), para a bike "apoiar" na linha do gráfico.
 */
export function BikeMtb(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 31" aria-hidden="true" {...props}>
      {/* Pneus com cravos */}
      <g fill="none" stroke="var(--color-areia-100)" strokeLinecap="round">
        <circle cx="10" cy="22" r="7.6" strokeWidth="2.6" />
        <circle cx="38" cy="22" r="7.6" strokeWidth="2.6" />
        <circle cx="10" cy="22" r="8.9" strokeWidth="1.2" strokeDasharray="1.1 1.6" />
        <circle cx="38" cy="22" r="8.9" strokeWidth="1.2" strokeDasharray="1.1 1.6" />
      </g>

      {/* Quadro */}
      <g fill="none" stroke="var(--color-trilha-500)" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 22L18.6 11.2L32.4 9.6M10 22L22 22.6L33.6 13.2M22 22.6L18.2 7.6" strokeWidth="2.4" />
        {/* Garfo com suspensão: bengala grossa em cima, fina embaixo */}
        <path d="M32.4 9.6L33.6 13.2" strokeWidth="2.8" />
        <path d="M33.6 13.2L35.6 17.4" strokeWidth="3.2" />
        <path d="M35.6 17.4L38 22" strokeWidth="1.8" />
      </g>

      {/* Selim, guidão reto e pedivela */}
      <g fill="none" stroke="var(--color-areia-100)" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.6 7.2H21" strokeWidth="2.4" />
        <path d="M32.4 9.6L33.2 6.2M30.8 5.8H36.2" strokeWidth="2" />
        <path d="M22 22.6L24.6 25.4" strokeWidth="1.8" />
      </g>
      <circle cx="10" cy="22" r="1.4" fill="var(--color-areia-100)" />
      <circle cx="38" cy="22" r="1.4" fill="var(--color-areia-100)" />
      <circle cx="22" cy="22.6" r="2" fill="var(--color-areia-100)" />
    </svg>
  )
}
