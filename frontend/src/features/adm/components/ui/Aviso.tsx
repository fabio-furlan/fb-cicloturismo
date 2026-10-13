import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

export type TipoAviso = 'erro' | 'sucesso'

/** O resultado de uma ação, guardado no estado da tela e mostrado com `<Aviso>`. */
export interface Mensagem {
  tipo: TipoAviso
  texto: string
}

const estilos: Record<TipoAviso, string> = {
  erro: 'border-alerta-600/60 bg-alerta-600/15 text-alerta-200',
  sucesso: 'border-rampa-leve/40 bg-rampa-leve/10 text-rampa-leve',
}

/** Mensagem de erro ou de sucesso logo abaixo de um formulário ou ação. Erros são anunciados na hora. */
export function Aviso({ tipo, children }: { tipo: TipoAviso; children: ReactNode }) {
  return (
    <p role={tipo === 'erro' ? 'alert' : 'status'} className={cn('rounded-xl border px-4 py-3 text-sm', estilos[tipo])}>
      {children}
    </p>
  )
}
