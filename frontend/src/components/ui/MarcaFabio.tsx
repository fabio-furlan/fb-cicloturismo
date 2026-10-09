import { type SVGProps, useId } from 'react'

interface MarcaFabioProps extends SVGProps<SVGSVGElement> {
  /** No celular (sem mouse), cada vez que este número muda o ciclista aponta para o nome uma vez. */
  apontar?: number
}

const PELE = '#e2a77d'
const PELE_SOMBRA = '#c98c63'
const ESCURO = '#1d2226'

/**
 * Símbolo da marca: ciclista em pé, de frente, com capacete, óculos esportivos, camisa laranja, bermuda e
 * sapatilhas. Ao passar o mouse no logo (ou tocar, no celular), estica o braço e aponta para o nome
 * (classes ciclista-* em global.css).
 * Mantenha em sincronia com `public/favicon.svg` e `docs/logo.svg`.
 */
export function MarcaFabio({ apontar = 0, ...props }: MarcaFabioProps) {
  const id = useId()
  const lente = `${id}-lente`

  return (
    <svg viewBox="0 0 36 44" aria-hidden="true" {...props}>
      <defs>
        <linearGradient id={lente} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffb27a" />
          <stop offset="0.55" stopColor="var(--color-vermelho-500)" />
          <stop offset="1" stopColor="#8a4bd8" />
        </linearGradient>
      </defs>

      {/* A chave recria o grupo a cada toque, para o gesto recomeçar no celular */}
      <g key={apontar} className={`ciclista-corpo ${apontar > 0 ? 'ciclista-apontando' : ''}`}>
        {/* Pernas, meias e sapatilhas */}
        <rect x="11.4" y="33" width="2.5" height="6.6" rx="1.1" fill={PELE} />
        <rect x="18.1" y="33" width="2.5" height="6.6" rx="1.1" fill={PELE} />
        <rect x="11.3" y="38.6" width="2.7" height="1.7" fill="#f3eee6" />
        <rect x="18" y="38.6" width="2.7" height="1.7" fill="#f3eee6" />
        <path d="M10.2 42.4Q10.2 40.1 12.7 40.1Q14.6 40.1 14.6 42.4Z" fill={ESCURO} />
        <path d="M17.4 42.4Q17.4 40.1 19.3 40.1Q21.8 40.1 21.8 42.4Z" fill={ESCURO} />

        {/* Bermuda de ciclismo */}
        <path d="M10.9 27.6H21.1L21.4 34.2H16.7L16 30.6L15.3 34.2H10.6Z" fill={ESCURO} />

        {/* Braço esquerdo (do ponto de vista de quem olha), sempre relaxado */}
        <path d="M10.6 17.4L9 25.4" stroke={PELE} strokeWidth="2.3" strokeLinecap="round" />
        <path d="M10.7 17.2L10 20.4" stroke="var(--color-vermelho-500)" strokeWidth="2.7" strokeLinecap="round" />
        <circle cx="8.9" cy="26.4" r="1.4" fill={ESCURO} />

        {/* Braço direito relaxado: some enquanto o ciclista aponta */}
        <g className="ciclista-braco-baixo">
          <path d="M21.4 17.4L23 25.4" stroke={PELE} strokeWidth="2.3" strokeLinecap="round" />
          <path d="M21.3 17.2L22 20.4" stroke="var(--color-vermelho-500)" strokeWidth="2.7" strokeLinecap="round" />
          <circle cx="23.1" cy="26.4" r="1.4" fill={ESCURO} />
        </g>

        {/* Camisa de ciclismo: laranja, com zíper e faixas laterais */}
        <path d="M10.2 16.8Q16 14.8 21.8 16.8L21.1 28.2H10.9Z" fill="var(--color-vermelho-500)" />
        <path d="M10.6 18.6L11.1 28.2H12.4L12 18.2Z" fill="var(--color-vermelho-700)" opacity="0.55" />
        <path d="M21.4 18.6L20.9 28.2H19.6L20 18.2Z" fill="var(--color-vermelho-700)" opacity="0.55" />
        <path d="M16 15.9V27.6" stroke="var(--color-vermelho-700)" strokeWidth="0.5" />
        <path d="M14.3 15.6Q16 16.9 17.7 15.6" fill="none" stroke="var(--color-vermelho-700)" strokeWidth="0.7" strokeLinecap="round" />

        {/* Pescoço e rosto */}
        <rect x="14.8" y="13" width="2.4" height="3.1" rx="0.8" fill={PELE_SOMBRA} />
        <ellipse cx="16" cy="10.2" rx="4" ry="4.5" fill={PELE} />
        <path d="M14.4 12.9Q16 14 17.6 12.9" fill="none" stroke="#9c5f3c" strokeWidth="0.55" strokeLinecap="round" />

        {/* Óculos esportivos com lente espelhada */}
        <rect x="11.6" y="9" width="8.8" height="2.5" rx="1.2" fill={ESCURO} />
        <rect x="12.2" y="9.4" width="7.6" height="1.7" rx="0.8" fill={`url(#${lente})`} />

        {/* Capacete de bike: casco claro com faixa laranja, entradas de ar e viseira */}
        <path d="M11.2 9.4Q10.8 3 16 2.8Q21.2 3 20.8 9.4Q16 7.7 11.2 9.4Z" fill="var(--color-creme-100)" />
        <path d="M11.6 6.3Q16 4.6 20.4 6.3" fill="none" stroke="var(--color-vermelho-500)" strokeWidth="0.9" />
        <path d="M14 4.3V6M16 3.9V5.6M18 4.3V6" stroke="#8a8f94" strokeWidth="0.55" strokeLinecap="round" />
        <path d="M11.4 8.6Q16 7.1 20.6 8.6" fill="none" stroke={ESCURO} strokeWidth="0.8" strokeLinecap="round" />
        <path d="M11.6 9.3L12 12.6M20.4 9.3L20 12.6" stroke={ESCURO} strokeWidth="0.45" />

        {/* Braço direito esticado apontando para o nome: aparece ao passar o mouse (ou tocar) */}
        <g className="ciclista-braco-apontar">
          <path d="M21.4 17.4L26.4 17.1L30.4 16.6" stroke={PELE} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21.3 17.3L23.8 17.2" stroke="var(--color-vermelho-500)" strokeWidth="2.7" strokeLinecap="round" />
          <g className="ciclista-dedo">
            <rect x="29.6" y="15.2" width="2.9" height="2.7" rx="1" fill={ESCURO} />
            <rect x="31.8" y="15.4" width="3.3" height="1.1" rx="0.55" fill={ESCURO} />
          </g>
        </g>
      </g>
    </svg>
  )
}
