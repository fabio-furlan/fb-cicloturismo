import { IconeSeta } from '@/components/icones'

interface SetaSecaoProps {
  /** Id da divisão de destino. */
  para: string
  rotulo: string
  /** Cor do fundo onde a seta aparece. */
  tom?: 'claro' | 'escuro'
  /** Em janelas muito baixas, mostra só a seta (o texto fica para leitores de tela). */
  compacta?: boolean
  className?: string
}

/** Convite para a próxima divisão da página: texto curto e uma seta redonda que balança. */
export function SetaSecao({ para, rotulo, tom = 'escuro', compacta = false, className = '' }: SetaSecaoProps) {
  const seta = (
    <span
      className={`balancar-seta flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-sm transition-colors group-hover:border-vermelho-500 group-hover:bg-vermelho-500 group-hover:text-white ${
        tom === 'escuro' ? 'border-white/30 bg-carvao-950/60' : 'border-carvao-900/15 bg-white'
      }`}
    >
      <IconeSeta className="h-4 w-4 rotate-90" />
    </span>
  )

  return (
    <a
      href={`#${para}`}
      className={`group mx-auto flex w-fit flex-col items-center gap-1.5 text-sm font-bold transition-colors ${
        tom === 'escuro' ? 'text-white/85 [text-shadow:0_1px_6px_rgb(0_0_0/0.5)] hover:text-white' : 'text-carvao-900/70 hover:text-carvao-900'
      } ${className}`}
    >
      <span className={compacta ? 'max-sm:curta:sr-only sm:mini:sr-only' : ''}>{rotulo}</span>
      {seta}
    </a>
  )
}
