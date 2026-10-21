import type { ReactNode } from 'react'
import { IconeInfo } from '@/components/icones'

/** Aviso que aparece depois de enviar um formulário de conta, como o de que o acesso ainda não está disponível. */
export function AvisoConta({ children }: { children: ReactNode }) {
  return (
    <div role="status" className="flex gap-3 rounded-xl border border-sol-500/30 bg-sol-500/10 p-4 text-sm leading-relaxed text-creme-100">
      <IconeInfo className="mt-0.5 h-5 w-5 shrink-0 text-sol-500" />
      <div>{children}</div>
    </div>
  )
}
