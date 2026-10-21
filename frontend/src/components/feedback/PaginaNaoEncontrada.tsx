import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { estiloBotao } from '@/components/ui/estilosBotao'
import { ROTAS } from '@/constants/rotas'
import { cn } from '@/utils/cn'

/** Conteúdo do erro 404: usado pelo site e pelo painel do ADM. */
export function PaginaNaoEncontrada() {
  return (
    <Container className="py-24 text-center">
      <p className="font-display text-7xl font-black text-sol-500 sm:text-8xl">404</p>
      <h1 className="mt-4 font-display text-3xl font-black uppercase">Página não encontrada</h1>
      <p className="mt-2 text-cinza-400">O endereço que você acessou não existe ou foi removido.</p>
      <Link to={ROTAS.inicio} className={cn(estiloBotao(), 'mt-8')}>
        Voltar ao início
      </Link>
    </Container>
  )
}
