import { Container } from './Container'

interface PaginaEmConstrucaoProps {
  titulo: string
  descricao?: string
}

/** Conteúdo provisório para páginas que ainda serão desenvolvidas. */
export function PaginaEmConstrucao({ titulo, descricao = 'Esta página está em construção.' }: PaginaEmConstrucaoProps) {
  return (
    <Container className="py-16 sm:py-24">
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">{titulo}</h1>
      <p className="mt-3 text-areia-400">{descricao}</p>
    </Container>
  )
}
