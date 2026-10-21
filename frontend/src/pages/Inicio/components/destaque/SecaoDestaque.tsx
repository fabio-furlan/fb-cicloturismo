import { useEffect, useId, useRef, useState, type ComponentType, type FormEvent, type ReactNode, type SVGProps } from 'react'
import { IconeCalendario, IconeCama, IconeGrupo, IconeGuia, IconeLupa, IconeMontanha, IconeNivel, IconeVan } from '@/components/icones'
import { Container } from '@/components/ui/Container'
import { estiloBotao } from '@/components/ui/estilosBotao'
import { Selo } from '@/components/ui/Selo'
import { SetaSecao } from '@/components/ui/SetaSecao'
import { mesesComSaida, niveis, ordemNiveis, paisagens, type FiltrosViagem, type Paisagem, type Roteiro } from '@/features/roteiros'
import { revelar } from '@/hooks/useRevelarAoRolar'
import { cn } from '@/utils/cn'
import { formatarMesAno } from '@/utils/formatacao'
import { ListaSuspensa } from './ListaSuspensa'

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

/** Campo da busca numa linha só: ícone e lista de opções. O nome fica só para leitores de tela. */
function Campo({ rotulo, icone: Icone, children }: CampoProps) {
  const id = useId()
  return (
    // O foco pelo teclado aparece como um contorno claro no campo inteiro, no tom da barra (e não no vermelho padrão).
    <div className="relative flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-white/[0.06] px-3 py-1 has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-white/40 lg:rounded-lg lg:bg-transparent lg:py-0">
      <label htmlFor={id} className="sr-only">
        {rotulo}
      </label>
      <Icone className="pointer-events-none h-4 w-4 shrink-0 text-sol-500" />
      {children(id)}
    </div>
  )
}

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
    <section
      ref={secaoRef}
      id="topo"
      className="recuar-ao-sair relative isolate flex min-h-[100svh] flex-col overflow-clip pt-[calc(var(--cabecalho)+1.5rem)] pb-4 sm:pb-6 baixa:pt-[calc(var(--cabecalho)+0.75rem)] baixa:pb-3"
    >
      {/* A foto entra com um zoom lento e anda mais devagar que o texto ao rolar */}
      <div className="parallax-foto absolute inset-0 -z-10">
        <img src={fotoDestaque} alt="" className="entrada-foto h-full w-full object-cover object-[68%_center]" fetchPriority="high" />
      </div>
      <div className="absolute inset-0 -z-10 bg-black/50" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />

      {/* O texto surge em sequência e, ao rolar, sobe e esmaece */}
      <Container className="parallax-conteudo flex flex-1 flex-col items-center justify-center text-center">
        <div {...revelar(100)}>
          <Selo>Viva o mundo com cicloturismo</Selo>
        </div>
        <h1
          {...revelar(250)}
          className="mt-5 font-display text-[1.6rem] leading-[1] font-black text-white uppercase [text-shadow:0_4px_24px_rgb(0_0_0/0.45)] sm:mt-6 sm:text-5xl sm:leading-[0.95] lg:text-6xl baixa:mt-4 baixa:lg:text-5xl mini:text-[1.5rem]! mini:sm:text-4xl!"
        >
          <span className="block">Viagens de bicicleta</span>
          <span className="block text-sol-500">guiadas pelo Brasil</span>
        </h1>
        <p
          {...revelar(450)}
          className="mt-5 max-w-2xl text-base leading-relaxed font-light text-white/85 sm:mt-6 sm:text-lg baixa:mt-3 baixa:text-base max-sm:curta:hidden"
        >
          Roteiros de 1 a 7 dias pelas serras do Sul, pelo Vale Europeu e pelo caminho da fé até Aparecida, com guia, carro de apoio e
          pousada reservada.
        </p>

        <form
          {...revelar(650)}
          onSubmit={buscar}
          className="relative z-10 mt-6 grid w-full max-w-3xl grid-cols-2 gap-1 rounded-2xl border border-white/15 bg-black/45 p-1.5 text-left shadow-[0_18px_50px_-24px_rgb(0_0_0/0.8)] backdrop-blur-md sm:mt-9 lg:flex lg:items-center lg:gap-0 lg:divide-x lg:divide-white/10 lg:rounded-xl lg:pl-2 baixa:mt-5"
          aria-label="Buscar viagens"
        >
          <Campo rotulo="Paisagem" icone={IconeMontanha}>
            {(id) => (
              <ListaSuspensa
                id={id}
                valor={rascunho.paisagem}
                opcoes={[
                  { valor: '', rotulo: 'Todas as viagens' },
                  ...(Object.keys(paisagens) as Paisagem[]).map((p) => ({ valor: p, rotulo: paisagens[p] })),
                ]}
                aoMudar={(paisagem) => setRascunho({ ...rascunho, paisagem })}
              />
            )}
          </Campo>
          <Campo rotulo="Quando" icone={IconeCalendario}>
            {(id) => (
              <ListaSuspensa
                id={id}
                valor={rascunho.mes}
                opcoes={[
                  { valor: '', rotulo: 'Qualquer mês' },
                  ...mesesComSaida(roteiros).map((m) => ({ valor: m, rotulo: formatarMesAno(m) })),
                ]}
                aoMudar={(mes) => setRascunho({ ...rascunho, mes })}
              />
            )}
          </Campo>
          <Campo rotulo="Nível" icone={IconeNivel}>
            {(id) => (
              <ListaSuspensa
                id={id}
                valor={rascunho.nivel}
                opcoes={[{ valor: '', rotulo: 'Qualquer nível' }, ...ordemNiveis.map((n) => ({ valor: n, rotulo: niveis[n].nome }))]}
                aoMudar={(nivel) => setRascunho({ ...rascunho, nivel })}
              />
            )}
          </Campo>
          <div className="lg:pl-1">
            <button type="submit" className={cn(estiloBotao('principal', 'compacto'), 'w-full lg:w-auto')}>
              <IconeLupa className="h-4 w-4" />
              Buscar
            </button>
          </div>
        </form>

        {/* Informação discreta, com estilo diferente da busca para não parecer uma segunda barra */}
        <div
          {...revelar(850)}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.85rem] text-white/80 baixa:mt-4 max-sm:curta:hidden"
        >
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
