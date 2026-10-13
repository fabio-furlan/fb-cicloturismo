import { cn } from '@/utils/cn'

const tamanhos = {
  pequeno: 'h-4 w-4 border-2',
  medio: 'h-8 w-8 border-4',
  grande: 'h-10 w-10 border-4',
}

const cores = {
  /** Vermelho da marca, sobre os fundos do site. */
  marca: 'border-vermelho-500',
  /** A cor do texto ao redor, dentro de um botão. */
  texto: 'border-current',
}

interface SpinnerProps {
  tamanho?: keyof typeof tamanhos
  cor?: keyof typeof cores
}

/** Círculo girando. Decorativo: quem o usa informa o carregamento a leitores de tela (`role="status"`, `aria-busy`). */
export function Spinner({ tamanho = 'medio', cor = 'marca' }: SpinnerProps) {
  return (
    <span className={cn('inline-block animate-spin rounded-full border-t-transparent', tamanhos[tamanho], cores[cor])} aria-hidden="true" />
  )
}
