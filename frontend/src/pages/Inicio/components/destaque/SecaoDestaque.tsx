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
import { Selo } from '@/components/ui/Selo'
import { SetaSecao } from '@/components/ui/SetaSecao'
import { niveis, ordemNiveis } from '@/config/niveis'
import { revelar } from '@/hooks/useRevelarAoRolar'
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
    <div className="relative flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-white/[0.06] px-3 py-1 lg:rounded-none lg:bg-transparent lg:py-0">
      <label htmlFor={id} className="sr-only">
        {rotulo}
      </label>
      <Icone className="pointer-events-none h-4 w-4 shrink-0 text-sol-500" />
      {children(id)}
      <IconeSeta className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rotate-90 text-cinza-400" />
    </div>
  )
}

const classeSelect =
  'h-9 w-full min-w-0 cursor-pointer appearance-none bg-transparent pr-5 text-[0.8rem] font-semibold sm:text-sm text-creme-100 [&>option]:text-carvao-950'

interface SecaoDestaqueProps {
  roteiros: Roteiro[]
  filtros: FiltrosViagem
  aoBuscar: (filtros: FiltrosViagem) => void
}

/** Topo da página inicial: foto em tela cheia, a proposta da empresa e a busca de viagens. */
export function SecaoDestaque({ roteiros, filtros, aoBuscar }: SecaoDestaqueProps) {
  const [rascunho, setRascunho] = useState(filtros)

  // Parallax: --progresso vai de 0 (topo inteiro à vista) a 1 (topo fora da tela) e move foto e texto em ritmos diferentes.
  const secaoRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const secao = secaoRef.current
    if (!secao) return
    let quadro = 0
    const atualizar = () => {
      const progresso = Math.min(Math.max(window.scrollY / secao.offsetHeight, 0), 1)
      secao.style.setProperty('--progresso', progresso.toFixed(3))
    }
    const aoRolar = () => {
      cancelAnimationFrame(quadro)
      quadro = requestAnimationFrame(atualizar)
    }
    atualizar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => {
      cancelAnimationFrame(quadro)
      window.removeEventListener('scroll', aoRolar)
    }
  }, [])

  const buscar = (evento: FormEvent) => {
    evento.preventDefault()
    aoBuscar(rascunho)
  }

  return (
    <section ref={secaoRef} id="topo" className="relative isolate flex min-h-[100svh] recuar-ao-sair flex-col overflow-clip pb-4 pt-[calc(var(--cabecalho)+1.5rem)] sm:pb-6 baixa:pb-3 baixa:pt-[calc(var(--cabecalho)+0.75rem)]">
      {/* A foto entra com um zoom lento e anda mais devagar que o texto ao rolar */}
      <div className="parallax-foto absolute inset-0 -z-10">
        <img
          src={fotoDestaque}
          alt=""
          className="entrada-foto h-full w-full object-cover object-[68%_center]"
          fetchPriority="high"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-black/50" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />

      {/* O texto surge em sequência e, ao rolar, sobe e esmaece */}
      <Container className="parallax-conteudo flex flex-1 flex-col items-center justify-center text-center">
        <div {...revelar(100)}>
          <Selo>Viva o mundo com cicloturismo</Selo>
        </div>
        <h1 {...revelar(250)} className="mt-5 font-display text-[1.6rem] font-black uppercase leading-[1] text-white [text-shadow:0_4px_24px_rgb(0_0_0/0.45)] sm:mt-6 sm:text-5xl sm:leading-[0.95] lg:text-6xl baixa:mt-4 baixa:lg:text-5xl mini:text-[1.5rem]! mini:sm:text-4xl!">
          <span className="block">Viagens de bicicleta</span>
          <span className="block text-sol-500">guiadas pelo Brasil</span>
        </h1>
        <p {...revelar(450)} className="mt-5 max-w-2xl text-base font-light leading-relaxed text-white/85 sm:mt-6 sm:text-lg baixa:mt-3 baixa:text-base max-sm:curta:hidden">
          Roteiros de 1 a 7 dias pelas serras do Sul, pelo Vale Europeu e pelo caminho da fé até Aparecida, com guia,
          carro de apoio e pousada reservada.
        </p>

        <form
          {...revelar(650)}
          onSubmit={buscar}
          className="mt-6 grid w-full max-w-3xl grid-cols-2 gap-1 rounded-2xl border border-white/15 bg-black/45 p-1.5 text-left shadow-[0_18px_50px_-24px_rgb(0_0_0/0.8)] backdrop-blur-md sm:mt-9 lg:rounded-xl lg:pl-2 lg:flex lg:items-center lg:gap-0 lg:divide-x lg:divide-white/10 baixa:mt-5"
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
          <div className="lg:pl-1">
            <button
              type="submit"
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-vermelho-500 px-6 font-display text-[0.8rem] font-bold uppercase tracking-[0.08em] text-white shadow-[0_6px_18px_-6px_rgb(200_16_46/0.8)] transition-colors hover:bg-vermelho-600 lg:w-auto"
            >
              <IconeLupa className="h-4 w-4" />
              Buscar
            </button>
          </div>
        </form>

        {/* Informação discreta, com estilo diferente da busca para não parecer uma segunda barra */}
        <div {...revelar(850)} className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.85rem] text-white/80 baixa:mt-4 max-sm:curta:hidden">
          <span className="font-bold text-white">Incluso em todas as viagens:</span>
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {inclusos.map(({ icone: Icone, texto }) => (
              <li key={texto} className="flex items-center gap-1.5">
                <Icone className="h-4 w-4 text-sol-400" />
                {texto}
              </li>
            ))}
          </ul>
        </div>
      </Container>

      {/* Convite para a próxima divisão da página */}
      {/* Dois elementos: o parallax e a entrada usam a mesma propriedade (transform) */}
      <div className="parallax-conteudo">
        <div {...revelar(1100)}>
          <SetaSecao para="saidas" rotulo="Ver as próximas saídas" className="mt-8 baixa:mt-4" compacta />
        </div>
      </div>
      {/* Espaço que a próxima divisão cobre ao subir por cima desta */}
      <div className="espaco-sobreposicao" aria-hidden="true" />
    </section>
  )
}
