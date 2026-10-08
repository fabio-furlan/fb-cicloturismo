import type { SVGProps } from 'react'

/**
 * Símbolo da marca: bike gravel equipada para bikepacking (bolsa de quadro, de selim e rolo no guidão).
 * O traço da bike usa `currentColor`; as bolsas ficam em amarelo-ipê.
 * Mantenha em sincronia com `public/favicon.svg` e `docs/logo.svg`.
 */
export function MarcaFabinho(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 40" aria-hidden="true" {...props}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {/* Rodas */}
        <circle cx="14" cy="28" r="10" strokeWidth="2.4" />
        <circle cx="50" cy="28" r="10" strokeWidth="2.4" />
        {/* Quadro, canote e garfo */}
        <path
          d="M14 28L25.6 13.6L44 12.6M14 28L29 28.4L45.7 17.6M29 28.4L24.3 9.2M44 12.6L45.7 17.6Q48.5 22.4 50 28"
          strokeWidth="1.8"
        />
        {/* Selim, guidão drop e pedivela */}
        <path d="M20.2 8.9Q23.4 8 27.4 8.6" strokeWidth="2.1" />
        <path d="M44 12.6L44.6 10.7L49 10.4Q52.6 10.2 52.6 13.4Q52.6 16.2 50.2 16.5" strokeWidth="1.7" />
        <path d="M29 28.4L31.4 31.4" strokeWidth="1.7" />
      </g>

      {/* Bagagem: bolsa de quadro, bolsa de selim e rolo no guidão */}
      <g fill="#ff6b2c" stroke="#ff6b2c" strokeLinejoin="round" strokeWidth="1.1">
        <path d="M28.3 16.4L41.2 15.7L30.8 24.2Z" />
        <path d="M24.2 10.6L16.2 8.6Q13.6 8.1 13.7 10.4Q13.9 12.3 16.1 12.8L23.8 14.2Z" />
        <rect x="44.9" y="12.4" width="6.4" height="3.8" rx="1.9" />
      </g>
      {/* Alças das bolsas */}
      <path d="M46.9 12.6V16M49.3 12.6V16M19.3 9.5L18.7 12" stroke="#0a1e1b" strokeWidth="0.8" strokeLinecap="round" />

      <g fill="currentColor">
        <circle cx="14" cy="28" r="1.3" />
        <circle cx="50" cy="28" r="1.3" />
        <circle cx="29" cy="28.4" r="1.7" />
      </g>
    </svg>
  )
}
