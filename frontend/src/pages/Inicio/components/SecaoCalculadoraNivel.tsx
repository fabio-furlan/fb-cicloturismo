import { useId, useState } from 'react'
import { IconeSeta } from '@/components/icones'
import { Container } from '@/components/ui/Container'
import { IndicadorNivel } from '@/components/ui/IndicadorNivel'
import { SetaSecao } from '@/components/ui/SetaSecao'
import { TituloSecao } from '@/components/ui/TituloSecao'
import { nivelPara, niveis } from '@/config/niveis'
import { revelar } from '@/hooks/useRevelarAoRolar'
import type { Roteiro } from '@/types/roteiro'
import { formatarNumero } from '@/utils/formatacao'

// Margem de 10% acima do ritmo informado: um dia um pouco mais puxado ainda é confortável.
const TOLERANCIA = 1.1

interface ControleProps {
  rotulo: string
  unidade: string
  valor: number
  min: number
  max: number
  passo: number
  aoMudar: (valor: number) => void
}

function Controle({ rotulo, unidade, valor, min, max, passo, aoMudar }: ControleProps) {
  const id = useId()
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm text-cinza-400 sm:text-base">
          {rotulo}
        </label>
        <output htmlFor={id} className="font-display text-2xl font-black tabular-nums sm:text-3xl baixa:sm:text-2xl">
          {formatarNumero(valor)} <span className="text-base text-cinza-400 sm:text-lg">{unidade}</span>
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={passo}
        value={valor}
        onChange={(e) => aoMudar(Number(e.target.value))}
        className="h-9 w-full cursor-pointer sm:h-10"
      />
    </div>
  )
}

interface SecaoCalculadoraNivelProps {
  roteiros: Roteiro[]
  aoExplorar: (id: string) => void
}

export function SecaoCalculadoraNivel({ roteiros, aoExplorar }: SecaoCalculadoraNivelProps) {
  const [kmPorDia, setKmPorDia] = useState(50)
  const [subidaPorDia, setSubidaPorDia] = useState(700)

  const nivel = nivelPara(kmPorDia, subidaPorDia)
  const avaliados = roteiros
    .map((roteiro) => {
      const diasDePedal = roteiro.etapas.length
      const km = Math.round(roteiro.distanciaKm / diasDePedal)
      const subida = Math.round(roteiro.subidaTotalM / diasDePedal)
      const cabe = km <= kmPorDia * TOLERANCIA && subida <= subidaPorDia * TOLERANCIA
      return { roteiro, km, subida, cabe }
    })
    // Os que cabem primeiro; dentro de cada grupo, do mais leve para o mais puxado.
    .sort((a, b) => Number(b.cabe) - Number(a.cabe) || a.subida - b.subida)
  const quantosCabem = avaliados.filter((a) => a.cabe).length

  return (
    <section
      id="nivel"
      className="secao-sobreposta recuar-ao-sair flex min-h-[calc(100svh-var(--cabecalho))] flex-col justify-center bg-carvao-900 pb-4 pt-8 sm:pb-6 sm:pt-12 baixa:pb-3 baixa:pt-7 mini:pt-5"
      aria-labelledby="titulo-nivel"
    >
      <Container className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center lg:gap-12 baixa:gap-4 baixa:lg:gap-10">
        <div {...revelar(0)}>
          <TituloSecao
            id="titulo-nivel"
            selo="Descubra seu nível"
            titulo="Qual viagem cabe nas suas"
            destaque="pernas?"
            descricao="Conte como é um bom dia de pedal para você hoje."
            tom="escuro"
            alinhamento="esquerda"
            compacto
          />

          <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4 baixa:mt-3 baixa:space-y-2">
            <Controle rotulo="Distância por dia" unidade="km" valor={kmPorDia} min={10} max={120} passo={5} aoMudar={setKmPorDia} />
            <Controle
              rotulo="Subida por dia"
              unidade="m"
              valor={subidaPorDia}
              min={0}
              max={2000}
              passo={50}
              aoMudar={setSubidaPorDia}
            />
          </div>

          <div className="painel mt-4 rounded-2xl px-4 py-3 sm:mt-5 sm:px-5 sm:py-4 baixa:mt-3" aria-live="polite">
            <p className="flex flex-wrap items-baseline gap-x-3">
              <span className="text-sm text-cinza-400">Seu nível</span>
              <span className="font-display text-xl font-black uppercase text-sol-500 sm:text-2xl">
                <IndicadorNivel nivel={nivel} className="[&>svg]:h-4 [&>svg]:w-5" />
              </span>
            </p>
            <p className="mt-1 text-sm leading-relaxed text-white/85 mini:line-clamp-2 max-sm:curta:hidden">{niveis[nivel].paraQuem}</p>
          </div>
        </div>

        <div {...revelar(200)} className="min-w-0">
          <p className="text-sm font-semibold sm:text-base" aria-live="polite">
            {quantosCabem === 0
              ? 'Nenhum roteiro cabe nesse ritmo ainda. Veja o mais leve abaixo.'
              : quantosCabem === 1
                ? '1 roteiro cabe no seu ritmo'
                : `${quantosCabem} roteiros cabem no seu ritmo`}
          </p>
          {/* No celular, uma fileira de cartões com rolagem lateral; no computador, uma lista enxuta */}
          <ul className="-mx-4 mt-3 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:mx-0 lg:block lg:space-y-2 lg:overflow-visible mini:lg:space-y-1.5 lg:px-0 lg:pb-0">
            {avaliados.map(({ roteiro, km, subida, cabe }) => (
              <li
                key={roteiro.id}
                className={`flex w-[15.5rem] shrink-0 snap-start items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 transition-colors lg:w-auto lg:px-4 lg:py-3 baixa:lg:py-2 mini:lg:py-1.5 ${
                  cabe ? 'border-white/10 bg-carvao-800' : 'border-dashed border-white/15'
                }`}
              >
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-extrabold leading-tight sm:text-base">{roteiro.nome}</p>
                  <p className="mt-0.5 truncate text-xs tabular-nums text-cinza-400">
                    {km} km e {formatarNumero(subida)} m de subida por dia
                  </p>
                  <p className={`mt-0.5 text-xs font-semibold ${cabe ? 'text-rampa-leve' : 'text-rampa-forte'}`}>
                    {cabe ? 'Cabe no seu ritmo' : 'Mais puxado que o seu ritmo'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => aoExplorar(roteiro.id)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 transition-colors hover:border-vermelho-500 hover:bg-vermelho-500 hover:text-white sm:h-auto sm:w-auto sm:px-5 sm:py-2.5"
                  aria-label={`Ver roteiro ${roteiro.nome}`}
                >
                  <IconeSeta className="h-4 w-4 sm:hidden" />
                  <span className="hidden whitespace-nowrap font-display text-[0.75rem] font-bold uppercase tracking-[0.08em] sm:inline">
                    Ver roteiro
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </Container>
      <div {...revelar(400)}>
        <SetaSecao para="como-funciona" rotulo="Como funciona" className="mt-6 baixa:mt-3" compacta />
      </div>
      <div className="espaco-sobreposicao" aria-hidden="true" />
    </section>
  )
}
