import { Link } from 'react-router-dom'
import { IconeConversa } from '@/components/icones'
import { Container } from '@/components/ui/Container'
import { estiloBotao } from '@/components/ui/estilosBotao'
import { MarcaFabio } from '@/components/ui/MarcaFabio'
import { ROTAS } from '@/constants/rotas'
import { revelar } from '@/hooks/useRevelarAoRolar'
import { cn } from '@/utils/cn'

export function SecaoChamadaFinal() {
  return (
    // "group": com o mouse em qualquer parte da faixa, o ciclista aponta para o botão (estilos ciclista-* em global.css)
    <section className="group secao-sobreposta bg-carvao-900 pt-14 pb-10 sm:pt-20 sm:pb-16" aria-labelledby="titulo-chamada-final">
      <Container>
        <div
          {...revelar(0)}
          className="grid items-center gap-8 rounded-3xl border border-white/10 bg-carvao-800 p-5 sm:p-10 lg:grid-cols-[1fr_auto] lg:gap-12"
        >
          <div>
            <h2
              id="titulo-chamada-final"
              className="font-display text-xl leading-tight font-black text-white uppercase sm:text-2xl lg:text-3xl"
            >
              Não sabe qual roteiro <span className="text-sol-500">escolher?</span>
            </h2>
            <p className="mt-3 space-y-0.5 text-sm leading-relaxed text-cinza-400 sm:text-base">
              <span className="block">Compartilhe o seu ritmo e as paisagens que te inspiram.</span>
              <span className="block">A gente encontra o destino ideal e cuida de tudo para você chegar pedalando.</span>
            </p>
          </div>
          <div className="flex items-end lg:justify-end">
            <MarcaFabio className="-mr-1.5 h-14 w-[2.9rem] shrink-0 overflow-visible" />
            <Link to={ROTAS.contato} className={cn(estiloBotao('principal', 'grande'), 'mb-1')}>
              <IconeConversa className="h-5 w-5" />
              Fale com a gente
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
