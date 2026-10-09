import { Link } from 'react-router-dom'
import { IconeConversa } from '@/components/icones'
import { Container } from '@/components/ui/Container'
import { MarcaFabio } from '@/components/ui/MarcaFabio'
import { ROTAS } from '@/constants/rotas'

export function SecaoChamadaFinal() {
  return (
    // "group": com o mouse em qualquer parte da faixa, o ciclista aponta para o botão (estilos ciclista-* em global.css)
    <section className="group bg-trilha-500 py-8 text-mata-950 sm:py-10" aria-labelledby="titulo-chamada-final">
      <Container className="grid items-center gap-6 lg:grid-cols-[1fr_auto] lg:gap-10">
        {/* Título escuro e em destaque; o texto embaixo em peso normal, uma frase por linha */}
        <div>
          <h2
            id="titulo-chamada-final"
            className="font-display text-2xl font-semibold uppercase italic leading-none text-mata-950 sm:text-3xl"
          >
            Não sabe qual roteiro escolher?
          </h2>
          <p className="mt-3 space-y-0.5 leading-relaxed text-mata-950/80">
            <span className="block">Compartilhe o seu ritmo e as paisagens que te inspiram.</span>
            <span className="block">A gente encontra o destino ideal e cuida de tudo para você chegar pedalando.</span>
          </p>
        </div>
        <div className="flex items-end lg:justify-end">
          {/* O mesmo ciclista do logo, com a camisa verde-escura para não sumir no fundo laranja */}
          <MarcaFabio className="-mr-1.5 h-14 w-[2.9rem] shrink-0 overflow-visible [--color-trilha-500:var(--color-mata-800)] [--color-trilha-700:var(--color-mata-950)]" />
          <Link
            to={ROTAS.contato}
            className="mb-1 inline-flex min-h-12 items-center gap-2 rounded-lg bg-mata-950 px-7 font-semibold text-areia-100 transition-colors hover:bg-mata-700"
          >
            <IconeConversa className="h-5 w-5" />
            Clique aqui para dúvidas
          </Link>
        </div>
      </Container>
    </section>
  )
}
