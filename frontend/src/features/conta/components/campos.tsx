import { useId, useState, type ComponentType, type InputHTMLAttributes, type ReactNode, type SVGProps } from 'react'
import { IconeCadeado, IconeOlho, IconeOlhoFechado } from '@/components/icones'
import { cn } from '@/utils/cn'

interface CampoContaProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  rotulo: string
  /** Ícone dentro do campo, à esquerda, para reconhecer o campo de relance. */
  icone: ComponentType<SVGProps<SVGSVGElement>>
  /** Mensagem de erro embaixo do campo; com ela, a borda fica vermelha. */
  erro?: string
  /** Algo na linha do rótulo, à direita (como o "Esqueci minha senha"). */
  extraRotulo?: ReactNode
  /** Algo dentro do campo, à direita (como o botão de mostrar a senha). */
  acessorio?: ReactNode
}

/** Campo dos formulários de conta: rótulo em cima, ícone dentro, borda que acende no foco e o erro embaixo. */
export function CampoConta({ rotulo, icone: Icone, erro, extraRotulo, acessorio, className, ...input }: CampoContaProps) {
  const id = useId()
  const idErro = `${id}-erro`

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-creme-100">
          {rotulo}
        </label>
        {extraRotulo}
      </div>
      <div className="group relative">
        <Icone
          className={cn(
            'pointer-events-none absolute top-1/2 left-4 h-[1.1rem] w-[1.1rem] -translate-y-1/2 transition-colors',
            erro ? 'text-alerta-300' : 'text-cinza-400 group-focus-within:text-sol-500',
          )}
        />
        <input
          id={id}
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro ? idErro : undefined}
          className={cn(
            'h-12 w-full rounded-xl border bg-white/[0.04] pl-11 text-base text-creme-100 transition outline-none placeholder:text-cinza-600 focus:bg-white/[0.06] focus:ring-4',
            acessorio ? 'pr-12' : 'pr-4',
            erro
              ? 'border-alerta-300/80 focus:ring-alerta-300/15'
              : 'border-white/15 hover:border-white/30 focus:border-sol-500 focus:ring-sol-500/15',
          )}
          {...input}
        />
        {acessorio && <div className="absolute inset-y-0 right-1 flex items-center">{acessorio}</div>}
      </div>
      {erro && (
        <p id={idErro} className="mt-1.5 text-xs text-alerta-200">
          {erro}
        </p>
      )}
    </div>
  )
}

/** Campo de senha com o cadeado e o botão de mostrar e esconder o que foi digitado. */
export function CampoSenha(props: Omit<CampoContaProps, 'type' | 'acessorio' | 'icone'>) {
  const [visivel, setVisivel] = useState(false)
  const Icone = visivel ? IconeOlhoFechado : IconeOlho

  return (
    <CampoConta
      {...props}
      icone={IconeCadeado}
      type={visivel ? 'text' : 'password'}
      acessorio={
        <button
          type="button"
          onClick={() => setVisivel((v) => !v)}
          aria-label={visivel ? 'Esconder a senha' : 'Mostrar a senha'}
          aria-pressed={visivel}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-cinza-400 transition-colors hover:bg-white/[0.06] hover:text-creme-100"
        >
          <Icone className="h-5 w-5" />
        </button>
      }
    />
  )
}

/** Regras da senha nova, que ficam verdes conforme a pessoa digita. */
export function RegrasSenha({ regras }: { regras: { texto: string; ok: boolean }[] }) {
  return (
    <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs" aria-label="Regras da senha">
      {regras.map(({ texto, ok }) => (
        <li key={texto} className={cn('flex items-center gap-1.5 transition-colors', ok ? 'text-verde-400' : 'text-cinza-400')}>
          <span
            className={cn(
              'flex h-3.5 w-3.5 items-center justify-center rounded-full border transition-colors',
              ok ? 'border-verde-400 bg-verde-400 text-carvao-950' : 'border-cinza-600',
            )}
            aria-hidden="true"
          >
            {ok && (
              <svg viewBox="0 0 16 16" className="h-2.5 w-2.5">
                <path
                  d="M3 8.5l3.2 3L13 4.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
          {texto}
          <span className="sr-only">{ok ? ' (atendida)' : ' (pendente)'}</span>
        </li>
      ))}
    </ul>
  )
}
