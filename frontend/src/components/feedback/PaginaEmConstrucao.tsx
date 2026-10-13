import { Container } from '@/components/ui/Container'
import { Selo } from '@/components/ui/Selo'

interface PaginaEmConstrucaoProps {
  titulo: string
  descricao?: string
}

/** Conteúdo provisório para páginas que ainda serão desenvolvidas. */
export function PaginaEmConstrucao({ titulo, descricao = 'Esta página está em construção.' }: PaginaEmConstrucaoProps) {
  return (
    <Container className="py-16 sm:py-24">
      <Selo>Em breve</Selo>
      <h1 className="mt-4 font-display text-3xl font-black uppercase sm:text-4xl">{titulo}</h1>
      <p className="mt-3 max-w-xl text-cinza-400">{descricao}</p>
    </Container>
  )
}
