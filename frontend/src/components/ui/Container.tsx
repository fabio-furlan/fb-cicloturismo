import type { HTMLAttributes, ReactNode } from 'react'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

/** Centraliza o conteúdo e aplica as margens laterais padrão do site. */
export function Container({ children, className = '', ...resto }: ContainerProps) {
  return (
    <div {...resto} className={`mx-auto w-full max-w-[100rem] px-4 sm:px-6 lg:px-10 2xl:px-16 ${className}`}>
      {children}
    </div>
  )
}
