import { type ComponentType, type FormEvent, type ReactNode, type SVGProps, useEffect, useId, useRef, useState } from 'react'
import {
  IconeCalendario,
  IconeCama,
  IconeGrupo,
  IconeGuia,
  IconeLupa,
  IconeMontanha,
  IconeNivel,
  IconeSeta,
  IconeVan,
} from '@/components/icones'
import { Container } from '@/components/ui/Container'
import { useRolagemPassou } from '@/hooks/useRolagemPassou'
import { niveis, ordemNiveis } from '@/config/niveis'
import { paisagens } from '@/config/paisagens'
import type { Nivel, Paisagem, Roteiro } from '@/types/roteiro'
import { formatarMesAno } from '@/utils/formatacao'
import { type FiltrosViagem, mesesComSaida } from '@/utils/saidas'

// Foto: Patrick Hendry / Unsplash (Licença Unsplash: uso gratuito, inclusive comercial)
// https://unsplash.com/photos/1ow9zrlldJU
const fotoDestaque = '/images/hero-bikepacking.jpg'

const inclusos = [
  { icone: IconeGuia, texto: 'Guia especializado' },
  { icone: IconeVan, texto: 'Carro de apoio' },
  { icone: IconeCama, texto: 'Pousadas e refeições' },
  { icone: IconeGrupo, texto: 'Grupos de até 12 ciclistas' },
]

interface CampoProps {
  rotulo: string
  icone: ComponentType<SVGProps<SVGSVGElement>>
  children: (id: string) => ReactNode
}

/** Campo da busca numa linha só: ícone, lista de opções e seta. O nome fica só para leitores de tela. */
function Campo({ rotulo, icone: Icone, children }: CampoProps) {
  const id = useId()
  return (
    <div className="relative flex min-w-0 flex-1 items-center gap-2 px-3 py-1.5 lg:py-0">
      <label htmlFor={id} className="sr-only">
        {rotulo}
      </label>
      <Icone className="pointer-events-none h-4 w-4 shrink-0 text-trilha-500" />
      {children(id)}
      <IconeSeta className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rotate-90 text-areia-400" />
    </div>
  )
}

const classeSelect =
  'h-9 w-full min-w-0 cursor-pointer appearance-none bg-transparent pr-5 text-sm font-semibold text-areia-100 [&>option]:text-mata-950'

interface SecaoDestaqueProps {
  roteiros: Roteiro[]
  filtros: FiltrosViagem
  aoBuscar: (filtros: FiltrosViagem) => void
}

/** Topo da página inicial: foto em tela cheia, a proposta da empresa e a busca de viagens. */
export function SecaoDestaque({ roteiros, filtros, aoBuscar }: SecaoDestaqueProps) {
  const [rascunho, setRascunho] = useState(filtros)
  const rolou = useRolagemPassou(60)
  // O convite para rolar só aparece se o topo ocupa a tela toda, ou seja, se a próxima seção ainda não está à vista.
  const secaoRef = useRef<HTMLElement>(null)
  const [topoCobreATela, setTopoCobreATela] = useState(true)
  useEffect(() => {
    const medir = () => {
      const fim = secaoRef.current?.getBoundingClientRect().bottom ?? 0
      setTopoCobreATela(fim + window.scrollY > window.innerHeight - 24)
    }
    medir()
    window.addEventListener('resize', medir)
    return () => window.removeEventListener('resize', medir)
  }, [])
  const mostrarConvite = topoCobreATela && !rolou

  const buscar = (evento: FormEvent) => {
    evento.preventDefault()
    aoBuscar(rascunho)
  }

  return (
    <section ref={secaoRef} className="relative isolate overflow-hidden pb-14 pt-24 sm:pt-28">
      <img
        src={fotoDestaque}
        alt=""
        className="absolute inset-0 -z-10 h-full w-full object-cover object-[68%_center]"
        fetchPriority="high"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-mata-950/95 via-mata-950/60 to-mata-950/10" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-mata-950/80 to-transparent" />

      <Container>
        <div className="max-w-3xl">
          <h1 className="font-display text-5xl font-semibold uppercase italic leading-[0.92] text-balance sm:text-6xl lg:text-7xl">
            Viagens de bicicleta guiadas pelo Brasil
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-areia-100/85 sm:text-xl">
            Roteiros de 1 a 7 dias pelas serras do Sul, pelo Vale Europeu e pelo caminho da fé até Aparecida, com guia,
            carro de apoio e pousada reservada.
          </p>
        </div>

        <form
          onSubmit={buscar}
          className="mt-9 flex max-w-3xl flex-col divide-y divide-white/10 rounded-2xl border border-white/15 bg-mata-950/55 p-1 shadow-[0_18px_50px_-24px_rgb(0_0_0/0.8)] backdrop-blur-md lg:flex-row lg:items-center lg:divide-x lg:divide-y-0 lg:rounded-xl lg:pl-2"
          aria-label="Buscar viagens"
        >
          <Campo rotulo="Paisagem" icone={IconeMontanha}>
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
          <Campo rotulo="Quando" icone={IconeCalendario}>
            {(id) => (
              <select
                id={id}
                value={rascunho.mes}
                onChange={(e) => setRascunho({ ...rascunho, mes: e.target.value })}
                className={classeSelect}
              >
                <option value="">Qualquer mês</option>
                {mesesComSaida(roteiros).map((m) => (
                  <option key={m} value={m}>
                    {formatarMesAno(m)}
                  </option>
                ))}
              </select>
            )}
          </Campo>
          <Campo rotulo="Nível" icone={IconeNivel}>
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
          <div className="pt-1 lg:pl-1 lg:pt-0">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-trilha-500 h-9 px-5 text-sm font-semibold text-mata-950 transition-colors hover:bg-trilha-400 lg:w-auto lg:rounded-lg"
            >
              <IconeLupa className="h-4 w-4" />
              Buscar
            </button>
          </div>
        </form>

        {/* Informação discreta, com estilo diferente da busca para não parecer uma segunda barra */}
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.82rem] text-areia-100/75">
          <span className="font-semibold text-areia-100/90">Incluso em todas as viagens:</span>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {inclusos.map(({ icone: Icone, texto }) => (
              <li key={texto} className="flex items-center gap-1.5">
                <Icone className="h-4 w-4 text-trilha-400" />
                {texto}
              </li>
            ))}
          </ul>
        </div>
      </Container>

      {/* Convite para rolar: sem ele, o topo parece ser a página inteira. Fica preso na base da tela
          (aparece em qualquer altura de janela) e some quando a pessoa começa a rolar. */}
      <a
        href="#saidas"
        aria-hidden={!mostrarConvite}
        tabIndex={mostrarConvite ? undefined : -1}
        className={`group fixed bottom-4 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1.5 text-sm font-semibold text-areia-100/85 transition-opacity duration-300 [text-shadow:0_1px_6px_rgb(0_0_0/0.5)] hover:text-areia-100 ${
          mostrarConvite ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        Ver as próximas saídas
        <span className="balancar-seta flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-mata-950/70 backdrop-blur-sm transition-colors group-hover:border-trilha-500 group-hover:bg-trilha-500 group-hover:text-mata-950">
          <IconeSeta className="h-4 w-4 rotate-90" />
        </span>
      </a>
    </section>
  )
}
