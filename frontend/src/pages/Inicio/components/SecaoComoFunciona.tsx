import { Container } from '@/components/ui/Container'

const etapas = [
  {
    titulo: 'Você reserva',
    texto: 'Escolha o roteiro e garanta sua vaga com 30% do valor. O restante pode ser pago até 15 dias antes da saída.',
  },
  {
    titulo: 'O guia liga para você',
    texto: 'Uma semana antes, o guia confere sua bike, o equipamento e o seu ritmo, e tira as dúvidas sobre o percurso.',
  },
  {
    titulo: 'Você pedala',
    texto: 'O carro de apoio leva a bagagem e segue o grupo. Se cansar, é só subir nele. Pousadas e refeições já estão pagas.',
  },
  {
    titulo: 'Você volta para casa',
    texto: 'No último dia, um traslado leva você e a bike de volta ao ponto de partida.',
  },
]

export function SecaoComoFunciona() {
  return (
    <section className="bg-areia-100 py-16 text-mata-900 sm:py-24" aria-labelledby="titulo-como-funciona">
      <Container>
        <h2 id="titulo-como-funciona" className="font-display text-4xl font-bold uppercase leading-none sm:text-6xl">
          Como funciona uma viagem
        </h2>

        <ol className="relative mt-12 grid gap-10 md:grid-cols-4 md:gap-8">
          {/* Linha que liga as etapas, como um trajeto */}
          <span
            className="absolute left-5 top-5 h-[calc(100%-2.5rem)] w-0.5 bg-mata-900/15 md:left-5 md:right-0 md:h-0.5 md:w-auto"
            aria-hidden="true"
          />
          {etapas.map((etapa, i) => (
            <li key={etapa.titulo} className="relative grid grid-cols-[2.5rem_1fr] gap-x-5 md:block">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-trilha-500 font-display text-xl font-bold text-mata-950 ring-8 ring-areia-100">
                {i + 1}
              </span>
              <div>
                <h3 className="font-display text-2xl font-semibold leading-tight md:mt-6">{etapa.titulo}</h3>
                <p className="mt-2 max-w-sm leading-relaxed text-pedra-600">{etapa.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
