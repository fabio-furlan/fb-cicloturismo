import { cn } from '@/utils/cn'
import { statusSaida } from '../../config/rotulos'
import type { StatusSaida } from '../../types'

export function SeloStatus({ status }: { status: StatusSaida }) {
  const { rotulo, classe } = statusSaida[status]
  return <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap', classe)}>{rotulo}</span>
}
