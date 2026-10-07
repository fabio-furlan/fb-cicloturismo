import { Container } from './Container'

interface PaginaEmConstrucaoProps {
  titulo: string
  descricao?: string
}

/** Conteúdo provisório para páginas que ainda serão desenvolvidas. */
export function PaginaEmConstrucao({ titulo, descricao = 'Esta página está em construção.' }: PaginaEmConstrucaoProps) {
  return (
    <Container className="py-16 sm:py-24">
      <h1 className="text-3xl font-extrabold text-night-900 sm:text-4xl">{titulo}</h1>
      <p className="mt-3 text-night-700">{descricao}</p>
    </Container>
  )
}
