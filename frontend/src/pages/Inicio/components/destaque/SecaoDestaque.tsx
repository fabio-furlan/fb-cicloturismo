import { type FormEvent, type ReactNode, useId, useState } from 'react'
import { IconeCama, IconeGrupo, IconeGuia, IconeSeta, IconeVan } from '@/components/icones'
import { Container } from '@/components/ui/Container'
import { niveis, ordemNiveis } from '@/config/niveis'
import { paisagens } from '@/config/paisagens'
import type { Nivel, Paisagem } from '@/types/roteiro'
import { formatarMesAno } from '@/utils/formatacao'
import { type FiltrosViagem, mesesComSaida } from '@/utils/saidas'

// Foto: Patrick Hendry / Unsplash (Licença Unsplash: uso gratuito, inclusive comercial)
// https://unsplash.com/photos/1ow9zrlldJU
const fotoDestaque = '/images/hero-bikepacking.jpg'

const inclusos = [
  { icone: IconeGuia, texto: 'Guia especializado' },
  { icone: IconeVan, texto: 'Carro de apoio' },
  { icone: IconeCama, texto: 'Pousadas e refeições' },
  { icone: IconeGrupo, texto: 'Até 12 ciclistas' },
]

interface CampoProps {
  rotulo: string
  children: (id: string) => ReactNode
}

function Campo({ rotulo, children }: CampoProps) {
  const id = useId()
  return (
    <div className="relative flex min-w-0 flex-1 flex-col px-4 py-2.5 lg:py-1">
      <label htmlFor={id} className="text-xs font-semibold text-areia-400">
        {rotulo}
      </label>
      {children(id)}
      <IconeSeta className="pointer-events-none absolute bottom-3.5 right-4 h-4 w-4 rotate-90 text-trilha-500 lg:bottom-2.5" />
    </div>
  )
}

const classeSelect =
  'min-h-8 w-full cursor-pointer appearance-none bg-transparent pr-6 text-base font-semibold text-areia-100 [&>option]:text-mata-950'

interface SecaoDestaqueProps {
  filtros: FiltrosViagem
  aoBuscar: (filtros: FiltrosViagem) => void
}

/** Topo da página inicial: foto em tela cheia, a proposta da empresa e a busca de viagens. */
export function SecaoDestaque({ filtros, aoBuscar }: SecaoDestaqueProps) {
  const [rascunho, setRascunho] = useState(filtros)

  const buscar = (evento: FormEvent) => {
    evento.preventDefault()
    aoBuscar(rascunho)
  }

  return (
    <section className="relative isolate flex min-h-[92svh] items-center overflow-hidden pb-14 pt-28">
      <img
        src={fotoDestaque}
        alt=""
        className="absolute inset-0 -z-10 h-full w-full object-cover object-[68%_center]"
        fetchPriority="high"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-mata-950/95 via-mata-950/60 to-mata-950/10" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-mata-950/80 to-transparent" />

      <Container>
        <div className="max-w-2xl">
          <h1 className="font-display text-5xl font-bold uppercase leading-[0.9] text-balance sm:text-7xl lg:text-8xl">
            Viagens de bicicleta guiadas pelo Brasil
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-areia-100/85 sm:text-xl">
            Roteiros de 1 a 7 dias pelas serras do Sul, pelo Vale Europeu e pelos caminhos de fé até Aparecida, com
            guia, carro de apoio e pousada reservada. Você só pedala.
          </p>
        </div>

        <form
          onSubmit={buscar}
          className="mt-10 flex max-w-4xl flex-col divide-y divide-white/10 rounded-2xl border border-white/15 bg-mata-950/85 p-2 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)] lg:flex-row lg:items-center lg:divide-x lg:divide-y-0 lg:rounded-full lg:pl-4"
          aria-label="Buscar viagens"
        >
          <Campo rotulo="Paisagem">
            {(id) => (
              <select
                id={id}
                value={rascunho.paisagem}
                onChange={(e) => setRascunho({ ...rascunho, paisagem: e.target.value as Paisagem | '' })}
                className={classeSelect}
              >
                <option value="">Todas as paisagens</option>
                {(Object.keys(paisagens) as Paisagem[]).map((p) => (
                  <option key={p} value={p}>
                    {paisagens[p]}
                  </option>
                ))}
              </select>
            )}
          </Campo>
          <Campo rotulo="Quando">
            {(id) => (
              <select
                id={id}
                value={rascunho.mes}
                onChange={(e) => setRascunho({ ...rascunho, mes: e.target.value })}
                className={classeSelect}
              >
                <option value="">Qualquer mês</option>
                {mesesComSaida.map((m) => (
                  <option key={m} value={m}>
                    {formatarMesAno(m)}
                  </option>
                ))}
              </select>
            )}
          </Campo>
          <Campo rotulo="Nível">
            {(id) => (
              <select
                id={id}
                value={rascunho.nivel}
                onChange={(e) => setRascunho({ ...rascunho, nivel: e.target.value as Nivel | '' })}
                className={classeSelect}
              >
                <option value="">Qualquer nível</option>
                {ordemNiveis.map((n) => (
                  <option key={n} value={n}>
                    {niveis[n].nome}
                  </option>
                ))}
              </select>
            )}
          </Campo>
          <div className="pt-2 lg:pl-2 lg:pt-0">
            <button
              type="submit"
              className="w-full rounded-xl bg-trilha-500 px-7 py-3.5 font-semibold text-mata-950 transition-colors hover:bg-trilha-400 lg:w-auto lg:rounded-full"
            >
              Buscar viagens
            </button>
          </div>
        </form>

        <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold text-areia-100/90">
          {inclusos.map(({ icone: Icone, texto }) => (
            <li key={texto} className="flex items-center gap-2">
              <Icone className="h-5 w-5 text-trilha-500" />
              {texto}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
