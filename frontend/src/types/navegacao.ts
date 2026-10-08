import type { ComponentType, SVGProps } from 'react'

export interface LinkNavegacao {
  rota: string
  rotulo: string
  icone: ComponentType<SVGProps<SVGSVGElement>>
}
