import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { Selo } from './Selo'

interface TituloSecaoProps {
  id?: string
  /** Pílula vermelha acima do título. */
  selo?: string
  /** Primeira parte do título, na cor do texto. */
  titulo: string
  /** Final do título, em vermelho. */
  destaque?: string
  descricao?: ReactNode
  /** Cor do fundo da seção, para escolher as cores do texto. */
  tom?: 'claro' | 'escuro'
  nivel?: 'h1' | 'h2'
  alinhamento?: 'centro' | 'esquerda'
  className?: string
  /** Encolhe em janelas baixas, para a seção caber na tela junto com o conteúdo. */
  compacto?: boolean
}

/** Cabeçalho das seções: selo, título em caixa alta com o final em vermelho e uma linha de apoio. */
export function TituloSecao({
  id,
  selo,
  titulo,
  destaque,
  descricao,
  tom = 'claro',
  nivel: Titulo = 'h2',
  alinhamento = 'centro',
  className,
  compacto = false,
}: TituloSecaoProps) {
  const centro = alinhamento === 'centro'
  return (
    <div className={cn(centro ? 'mx-auto max-w-2xl text-center' : 'max-w-3xl', className)}>
      {selo && <Selo className={cn(compacto && 'mini:hidden')}>{selo}</Selo>}
      <Titulo
        id={id}
        className={cn(
          'font-display text-[1.55rem] leading-[1.08] font-black text-balance uppercase sm:text-3xl lg:text-4xl',
          selo && 'mt-4',
          compacto && 'baixa:mt-2! baixa:text-[1.45rem]! sm:baixa:text-[1.75rem]! mini:mt-0!',
          tom === 'claro' ? 'text-carvao-900' : 'text-white',
        )}
      >
        {titulo}
        {destaque && (
          <>
            {' '}
            <span className={tom === 'claro' ? 'text-vermelho-500' : 'text-vermelho-400'}>{destaque}</span>
          </>
        )}
      </Titulo>
      {descricao && (
        <p
          className={cn(
            'mt-4 leading-relaxed',
            compacto && 'baixa:mt-1.5! baixa:text-sm mini:hidden',
            centro ? 'mx-auto max-w-xl' : 'max-w-xl',
            tom === 'claro' ? 'text-cinza-600' : 'text-cinza-400',
          )}
        >
          {descricao}
        </p>
      )}
    </div>
  )
}
