import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { empresa } from '@/config/empresa'
import { ROTAS } from '@/constants/rotas'

export function SecaoChamadaFinal() {
  return (
    <section className="bg-trilha-500 py-12 text-mata-950 sm:py-14" aria-labelledby="titulo-chamada-final">
      <Container className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <h2 id="titulo-chamada-final" className="font-display text-4xl font-semibold uppercase italic leading-none sm:text-6xl">
            Não sabe qual roteiro escolher?
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-mata-950/80">
            Conte como você pedala hoje e o que quer ver pelo caminho. A gente indica a viagem certa para o seu ritmo.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
          <Link
            to={ROTAS.contato}
            className="rounded-lg bg-mata-950 px-7 py-3.5 font-semibold text-areia-100 transition-colors hover:bg-mata-700"
          >
            Falar com a gente
          </Link>
          <a
            href={`mailto:${empresa.contato.email}`}
            className="font-semibold underline decoration-mata-950 decoration-2 underline-offset-[6px] hover:decoration-transparent"
          >
            {empresa.contato.email}
          </a>
        </div>
      </Container>
    </section>
  )
}
