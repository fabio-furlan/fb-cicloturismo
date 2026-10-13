import { cn } from '@/utils/cn'
import { Spinner } from './Spinner'

interface CarregandoProps {
  /** `pagina`: ocupa a tela inteira, enquanto uma página carrega. `secao`: só o espaço de um bloco. */
  variante?: 'pagina' | 'secao'
}

/** Aviso de carregamento, anunciado a leitores de tela. */
export function Carregando({ variante = 'pagina' }: CarregandoProps) {
  const pagina = variante === 'pagina'
  return (
    <div className={cn('flex items-center justify-center', pagina ? 'min-h-screen bg-carvao-900' : 'min-h-60')} role="status">
      <Spinner tamanho={pagina ? 'grande' : 'medio'} />
      <span className="sr-only">Carregando...</span>
    </div>
  )
}
