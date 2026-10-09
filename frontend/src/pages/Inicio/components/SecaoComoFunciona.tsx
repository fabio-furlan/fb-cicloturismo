import { Container } from '@/components/ui/Container'
import { TituloSecao } from '@/components/ui/TituloSecao'
import { revelar } from '@/hooks/useRevelarAoRolar'

const etapas = [
  {
    titulo: 'Você reserva',
    texto: 'Escolha o roteiro e reserve sua vaga após o pagamento.',
  },
  {
    titulo: 'Você online',
    texto: 'Uma semana antes, o guia faz uma reunião online, para orientar todos os ciclistas sobre o percurso, hidratação e apoio.',
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
    <section
      id="como-funciona"
      className="secao-sobreposta recuar-ao-sair bg-verde-50 pb-8 pt-14 text-carvao-900 sm:pb-14 sm:pt-20"
      aria-labelledby="titulo-como-funciona"
    >
      <Container>
        <div {...revelar(0)}>
          <TituloSecao
            id="titulo-como-funciona"
            selo="Passo a passo"
            titulo="Como funciona uma"
            destaque="viagem"
            descricao="Da reserva até a volta para casa, a gente cuida de cada detalhe para você só pedalar."
          />
        </div>

        <ol className="relative mt-10 grid gap-8 sm:mt-14 sm:gap-10 md:grid-cols-4 md:gap-8">
          {/* Linha que liga as etapas, como um trajeto */}
          <span
            className="absolute left-5 top-5 h-[calc(100%-2.5rem)] w-0.5 bg-vermelho-500/25 md:left-5 md:right-0 md:h-0.5 md:w-auto"
            aria-hidden="true"
          />
          {etapas.map((etapa, i) => (
            <li key={etapa.titulo} {...revelar(150 + i * 150)} className="relative grid grid-cols-[2.5rem_1fr] gap-x-5 md:block">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-vermelho-500 font-display text-lg font-black text-white shadow-[0_6px_18px_-6px_rgb(200_16_46/0.8)] ring-8 ring-verde-50">
                {i + 1}
              </span>
              <div>
                <h3 className="font-display text-lg font-extrabold uppercase leading-tight sm:text-xl md:mt-6">{etapa.titulo}</h3>
                <p className="mt-2 max-w-sm leading-relaxed text-cinza-600">{etapa.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
      <div className="espaco-sobreposicao" aria-hidden="true" />
    </section>
  )
}
