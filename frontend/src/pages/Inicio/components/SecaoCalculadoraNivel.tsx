import { useId, useState } from 'react'
import { Container } from '@/components/ui/Container'
import { IndicadorNivel } from '@/components/ui/IndicadorNivel'
import { nivelPara, niveis } from '@/config/niveis'
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
        <label htmlFor={id} className="text-areia-400">
          {rotulo}
        </label>
        <output htmlFor={id} className="font-display text-4xl font-bold tabular-nums">
          {formatarNumero(valor)} <span className="text-xl text-areia-400">{unidade}</span>
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
        className="mt-1 h-11 w-full cursor-pointer"
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
    <section id="nivel" className="scroll-mt-16 bg-mata-800 py-12 sm:py-16" aria-labelledby="titulo-nivel">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div>
          <h2 id="titulo-nivel" className="font-display text-4xl font-semibold uppercase italic leading-none sm:text-6xl">
            Qual viagem cabe nas suas pernas?
          </h2>
          <p className="mt-4 text-lg text-areia-400">Conte como é um bom dia de pedal para você hoje.</p>

          <div className="mt-10 space-y-8">
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

          <div className="painel mt-10 rounded-2xl p-5" aria-live="polite">
            <p className="text-sm text-areia-400">Seu nível</p>
            <p className="mt-1 font-display text-3xl font-bold text-trilha-500">
              <IndicadorNivel nivel={nivel} className="[&>svg]:h-4 [&>svg]:w-5" />
            </p>
            <p className="mt-2 leading-relaxed">{niveis[nivel].paraQuem}</p>
          </div>
        </div>

        <div>
          <p className="font-semibold" aria-live="polite">
            {quantosCabem === 0
              ? 'Nenhum roteiro cabe nesse ritmo ainda. Veja o mais leve abaixo.'
              : quantosCabem === 1
                ? '1 roteiro cabe no seu ritmo'
                : `${quantosCabem} roteiros cabem no seu ritmo`}
          </p>
          <ul className="mt-4 space-y-3">
            {avaliados.map(({ roteiro, km, subida, cabe }) => (
              <li
                key={roteiro.id}
                className={`flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4 transition-colors ${
                  cabe ? 'border-mata-600 bg-mata-900' : 'border-dashed border-mata-600'
                }`}
              >
                <div>
                  <p className="font-display text-xl font-semibold leading-tight">{roteiro.nome}</p>
                  <p className="mt-1 text-sm tabular-nums text-areia-400">
                    {km} km e {formatarNumero(subida)} m de subida por dia
                  </p>
                  <p className={`mt-1 text-sm font-semibold ${cabe ? 'text-rampa-leve' : 'text-rampa-forte'}`}>
                    {cabe ? 'Cabe no seu ritmo' : 'Mais puxado que o seu ritmo'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => aoExplorar(roteiro.id)}
                  className="rounded-lg border border-areia-400/50 px-4 py-2.5 text-sm font-semibold transition-colors hover:border-trilha-500 hover:text-trilha-500"
                >
                  Ver no explorador
                </button>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
