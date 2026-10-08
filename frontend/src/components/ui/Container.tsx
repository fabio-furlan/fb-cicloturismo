import type { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
  className?: string
}

/** Centraliza o conteúdo e aplica as margens laterais padrão do site. */
export function Container({ children, className = '' }: ContainerProps) {
  return <div className={`mx-auto w-full max-w-[100rem] px-4 sm:px-6 lg:px-10 2xl:px-16 ${className}`}>{children}</div>
}
