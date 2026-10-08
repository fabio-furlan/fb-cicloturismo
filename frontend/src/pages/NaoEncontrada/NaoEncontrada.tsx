import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { ROTAS } from '@/constants/rotas'

export function NaoEncontrada() {
  return (
    <Container className="py-24 text-center">
      <p className="font-display text-7xl font-bold text-trilha-500">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold">Página não encontrada</h1>
      <p className="mt-2 text-areia-400">O endereço que você acessou não existe ou foi removido.</p>
      <Link
        to={ROTAS.inicio}
        className="mt-8 inline-block rounded-lg bg-trilha-500 px-6 py-3 text-sm font-semibold text-mata-950 transition-colors hover:bg-trilha-400"
      >
        Voltar ao início
      </Link>
    </Container>
  )
}
