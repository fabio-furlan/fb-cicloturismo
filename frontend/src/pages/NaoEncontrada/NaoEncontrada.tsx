import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { ROTAS } from '@/constants/rotas'

export function NaoEncontrada() {
  return (
    <Container className="py-24 text-center">
      <p className="text-6xl font-extrabold text-amber-500">404</p>
      <h1 className="mt-4 text-2xl font-bold">Página não encontrada</h1>
      <p className="mt-2 text-night-700">O endereço que você acessou não existe ou foi removido.</p>
      <Link
        to={ROTAS.inicio}
        className="mt-8 inline-block rounded-full bg-night-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-night-700"
      >
        Voltar ao início
      </Link>
    </Container>
  )
}
