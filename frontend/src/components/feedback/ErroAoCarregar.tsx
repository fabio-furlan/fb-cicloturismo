import { Container } from '@/components/ui/Container'
import { estiloBotao } from '@/components/ui/estilosBotao'
import { cn } from '@/utils/cn'

interface ErroAoCarregarProps {
  titulo?: string
  descricao?: string
  aoTentarDeNovo?: () => void
}

/** Página inteira de erro, com a opção de tentar de novo quando a falha é passageira (rede, servidor acordando). */
export function ErroAoCarregar({
  titulo = 'Não foi possível carregar esta página',
  descricao = 'Confira sua conexão e tente de novo. Se continuar, fale com a gente pelo contato.',
  aoTentarDeNovo,
}: ErroAoCarregarProps) {
  return (
    <div role="alert">
      <Container className="flex min-h-[70svh] flex-col items-start justify-center py-28">
        <h1 className="font-display text-2xl font-black uppercase sm:text-4xl">{titulo}</h1>
        <p className="mt-3 max-w-xl text-cinza-400">{descricao}</p>
        {aoTentarDeNovo && (
          <button type="button" onClick={aoTentarDeNovo} className={cn(estiloBotao(), 'mt-8')}>
            Tentar de novo
          </button>
        )}
      </Container>
    </div>
  )
}
