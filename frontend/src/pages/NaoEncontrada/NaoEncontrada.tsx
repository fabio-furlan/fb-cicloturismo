import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { ROTAS } from '@/constants/rotas'

export function NaoEncontrada() {
  return (
    <Container className="py-24 text-center">
      <p className="font-display text-7xl font-black text-sol-500 sm:text-8xl">404</p>
      <h1 className="mt-4 font-display text-3xl font-black uppercase">Página não encontrada</h1>
      <p className="mt-2 text-cinza-400">O endereço que você acessou não existe ou foi removido.</p>
      <Link
        to={ROTAS.inicio}
        className="mt-8 inline-block rounded-full bg-vermelho-500 px-7 py-3 font-display text-[0.8rem] font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-vermelho-600"
      >
        Voltar ao início
      </Link>
    </Container>
  )
}
