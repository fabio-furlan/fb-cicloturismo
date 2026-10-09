import { type CSSProperties, type ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { IconeCalendario, IconeLocal, IconeMontanha, IconeRota, IconeSeta } from '@/components/icones'
import { IndicadorNivel } from '@/components/ui/IndicadorNivel'
import { paisagens } from '@/config/paisagens'
import type { Roteiro, Saida } from '@/types/roteiro'
import { formatarData, formatarNumero, formatarPreco } from '@/utils/formatacao'
import { descreverDuracao } from '@/utils/rota'

export interface ItemVitrine {
  roteiro: Roteiro
  /** A próxima saída que combina com os filtros; as demais aparecem como "outras datas". */
  saida: Saida
  outrasSaidas: Saida[]
}

interface VitrineSaidasProps {
  itens: ItemVitrine[]
  aoExplorar: (roteiroId: string) => void
}

// Tempo de cada viagem na tela antes da troca automática.
const DURACAO_MS = 6000
// Limites da altura da vitrine; entre eles, a altura que faz o bloco inteiro caber na tela.
const ALTURA_MIN = 240
const ALTURA_MAX = 640
// Folga embaixo, para a faixa de números não ficar colada na borda da tela.
const FOLGA = 12

const movimentoReduzido = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const doisDigitos = (n: number) => String(n).padStart(2, '0')

/**
 * Vitrine das próximas saídas em tela cheia: uma viagem por vez. Na troca, a foto nova entra como uma cortina, com um
 * zoom lento, e o texto sobe linha a linha. Contador, setas, linha do tempo e a prévia da próxima ficam embaixo;
 * as vagas, no alto.
 * Troca sozinha a cada poucos segundos, pausando com o mouse em cima ou fora da tela.
 *
 * A altura se ajusta à janela, para o bloco marcado com `data-caber-na-tela` (título, filtros, vitrine e faixa de
 * números) caber inteiro abaixo do cabeçalho, do notebook pequeno ao monitor grande.
 */
export function VitrineSaidas({ itens, aoExplorar }: VitrineSaidasProps) {
  const [indice, setIndice] = useState(0)
  // A foto anterior fica por baixo enquanto a nova entra como cortina.
  const [anterior, setAnterior] = useState<number | null>(null)
  const [mouseEmCima, setMouseEmCima] = useState(false)
  const [naTela, setNaTela] = useState(false)
  const [altura, setAltura] = useState(460)
  const raizRef = useRef<HTMLDivElement>(null)
  const varias = itens.length > 1
  const automatico = varias && !mouseEmCima && naTela && !movimentoReduzido()
  const atual = itens[Math.min(indice, itens.length - 1)]
  const proxima = itens[(indice + 1) % itens.length]

  const irPara = (novo: number) => {
    const destino = (novo + itens.length) % itens.length
    if (destino === indice) return
    setAnterior(indice)
    setIndice(destino)
  }

  // Troca automática: cada mudança (sozinha ou pelas setas) recomeça a contagem.
  useEffect(() => {
    if (!automatico) return
    const espera = window.setTimeout(() => {
      setAnterior(indice)
      setIndice((indice + 1) % itens.length)
    }, DURACAO_MS)
    return () => window.clearTimeout(espera)
  }, [automatico, indice, itens.length])

  // Só conta o tempo enquanto a vitrine está na tela.
  useEffect(() => {
    const raiz = raizRef.current
    if (!raiz) return
    const observador = new IntersectionObserver(([entrada]) => setNaTela(entrada.isIntersecting), { threshold: 0.4 })
    observador.observe(raiz)
    return () => observador.disconnect()
  }, [])

  // Altura que faz o bloco inteiro caber no espaço abaixo do cabeçalho.
  const ajustarAltura = useCallback(() => {
    const raiz = raizRef.current
    const bloco = raiz?.closest<HTMLElement>('[data-caber-na-tela]')
    if (!raiz || !bloco) return
    // Em monitores altos a seção estica para ocupar a tela; essa sobra não conta como espaço ocupado.
    const conteudo = bloco.querySelector<HTMLElement>('[data-conteudo-ajustavel]')
    const secao = conteudo?.parentElement
    let esticado = 0
    if (conteudo && secao) {
      const estilo = getComputedStyle(secao)
      esticado = secao.clientHeight - conteudo.offsetHeight - parseFloat(estilo.paddingTop) - parseFloat(estilo.paddingBottom)
    }
    const cabecalho = document.querySelector('header')?.getBoundingClientRect().height ?? 0
    const fixo = bloco.offsetHeight - Math.max(esticado, 0) - raiz.offsetHeight
    const nova = Math.round(Math.min(Math.max(window.innerHeight - cabecalho - fixo - FOLGA, ALTURA_MIN), ALTURA_MAX))
    setAltura((antes) => (Math.abs(nova - antes) < 2 ? antes : nova))
  }, [])

  useLayoutEffect(() => {
    const bloco = raizRef.current?.closest('[data-caber-na-tela]')
    ajustarAltura()
    const observador = new ResizeObserver(() => ajustarAltura())
    if (bloco) observador.observe(bloco)
    window.addEventListener('resize', ajustarAltura)
    return () => {
      observador.disconnect()
      window.removeEventListener('resize', ajustarAltura)
    }
  }, [ajustarAltura])

  if (!atual) return null
  const { roteiro, saida, outrasSaidas } = atual
  const ultimasVagas = saida.vagasRestantes <= 4
  const dados = [
    { icone: IconeCalendario, texto: descreverDuracao(roteiro), extra: '' },
    { icone: IconeRota, texto: `${roteiro.distanciaKm} km`, extra: '' },
    { icone: IconeMontanha, texto: `${formatarNumero(roteiro.subidaTotalM)} m`, extra: ' de subida' },
  ]

  return (
    <div
      ref={raizRef}
      onMouseEnter={() => setMouseEmCima(true)}
      onMouseLeave={() => setMouseEmCima(false)}
      onFocus={() => setMouseEmCima(true)}
      onBlur={() => setMouseEmCima(false)}
      data-pausado={!automatico}
      style={{ height: altura, '--duracao-vitrine': `${DURACAO_MS}ms` } as CSSProperties}
      className="relative isolate flex flex-col justify-between overflow-hidden rounded-[2rem] bg-carvao-950 p-5 text-white shadow-[0_30px_60px_-30px_rgb(0_0_0/0.6)] sm:p-8 lg:p-10 mini:p-4"
      role="region"
      aria-roledescription="vitrine"
      aria-label="Próximas saídas"
    >
      {/* Fotos: a anterior por baixo e a atual entrando como cortina (a chave recomeça a animação a cada troca) */}
      {anterior !== null && (
        <img src={itens[anterior]?.roteiro.foto.src} alt="" className="absolute inset-0 -z-30 h-full w-full object-cover" />
      )}
      <div key={roteiro.id} className="cortina-entrada absolute inset-0 -z-20">
        <img src={roteiro.foto.src} alt={roteiro.foto.descricao} className="cortina-foto h-full w-full object-cover" />
      </div>
      {/* Escurece à esquerda e embaixo, onde fica o texto */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-transparent to-black/25" />

      {/* Alto: as vagas */}
      <div className="flex justify-end">
        <span className={`rounded-full px-3 py-1 text-xs font-bold shadow-sm ${ultimasVagas ? 'bg-sol-500 text-carvao-950' : 'bg-white/95 text-carvao-900'}`}>
          {ultimasVagas ? `Últimas ${saida.vagasRestantes} vagas` : `${saida.vagasRestantes} vagas`}
        </span>
      </div>

      {/* Baixo: o texto (sobe linha a linha a cada troca) e os controles */}
      <div>
        <div key={`texto-${roteiro.id}`} className="max-w-3xl">
          <Linha atraso={350}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sol-500">
              {paisagens[roteiro.paisagem]} · {formatarData(saida.data)}
            </p>
          </Linha>
          <Linha atraso={450}>
            <h3 className="mt-1 font-display text-2xl font-black uppercase leading-[0.95] sm:text-3xl lg:text-4xl baixa:lg:text-3xl mini:text-xl mini:sm:text-2xl mini:lg:text-2xl">
              {roteiro.nome}
            </h3>
          </Linha>
          <Linha atraso={550}>
            <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/85">
              <span className="flex min-w-0 items-center gap-1">
                <IconeLocal className="h-4 w-4 shrink-0 text-sol-500" />
                <span className="truncate">{roteiro.regiao}</span>
              </span>
              <IndicadorNivel nivel={roteiro.nivel} />
            </p>
          </Linha>
          <Linha atraso={650} className="baixa:hidden">
            <ul className="mt-3 flex flex-wrap gap-1.5 text-xs font-semibold tabular-nums">
              {dados.map(({ icone: Icone, texto, extra }) => (
                <li key={texto} className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 backdrop-blur-sm">
                  <Icone className="h-3.5 w-3.5 text-sol-500" />
                  {texto}
                  {extra && <span className="sr-only">{extra}</span>}
                </li>
              ))}
            </ul>
          </Linha>
          <Linha atraso={750}>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 mini:mt-2.5">
              <p>
                <span className="block text-[0.7rem] text-white/70">
                  {outrasSaidas.length > 0 ? `Outras datas: ${outrasSaidas.map((s) => formatarData(s.data)).join(', ')}` : 'Por pessoa, tudo incluso'}
                </span>
                <span className="block whitespace-nowrap font-display text-2xl font-black tabular-nums leading-none sm:text-3xl">
                  {formatarPreco(saida.precoReais)}
                </span>
              </p>
              <button
                type="button"
                onClick={() => aoExplorar(roteiro.id)}
                className="group inline-flex min-h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-vermelho-500 pl-5 pr-4 font-display text-[0.75rem] font-bold uppercase tracking-[0.08em] text-white shadow-[0_8px_24px_-8px_rgb(200_16_46/0.8)] transition-colors hover:bg-vermelho-600"
              >
                Ver roteiro
                <IconeSeta className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </button>
            </div>
          </Linha>
        </div>

        {varias && (
          <div className="mt-5 flex items-center gap-3 sm:mt-6 sm:gap-4 mini:mt-3">
            <p className="mr-1 font-display font-bold tabular-nums" aria-live="polite">
              <span className="text-2xl font-black">{doisDigitos(indice + 1)}</span>
              <span className="text-sm text-white/60"> / {doisDigitos(itens.length)}</span>
            </p>
            <Seta lado="esquerda" aoClicar={() => irPara(indice - 1)} />
            <Seta lado="direita" aoClicar={() => irPara(indice + 1)} />
            {/* Linha do tempo: enche até a próxima troca (a chave recomeça a cada troca) */}
            <div className="h-px flex-1 bg-white/25" aria-hidden="true">
              <div key={`tempo-${indice}`} className="linha-tempo h-full bg-white" />
            </div>
            <button type="button" onClick={() => irPara(indice + 1)} className="group hidden items-center gap-3 text-left sm:flex">
              <span className="text-right text-xs leading-tight">
                <span className="block text-white/60">Próxima</span>
                <span className="font-display font-bold transition-colors group-hover:text-sol-500">{proxima.roteiro.nome}</span>
              </span>
              <img src={proxima.roteiro.foto.src} alt="" className="h-12 w-[4.5rem] rounded-lg object-cover ring-1 ring-white/20" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/** Uma linha do texto que sobe de baixo de uma máscara, `atraso` milissegundos depois da troca. */
function Linha({ atraso, className = '', children }: { atraso: number; className?: string; children: ReactNode }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="linha-sobe" style={{ '--atraso': `${atraso}ms` } as CSSProperties}>
        {children}
      </div>
    </div>
  )
}

function Seta({ lado, aoClicar }: { lado: 'esquerda' | 'direita'; aoClicar: () => void }) {
  return (
    <button
      type="button"
      onClick={aoClicar}
      aria-label={lado === 'esquerda' ? 'Viagem anterior' : 'Próxima viagem'}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/30 text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-white hover:text-carvao-900 sm:h-12 sm:w-12"
    >
      <IconeSeta className={`h-5 w-5 ${lado === 'esquerda' ? 'rotate-180' : ''}`} />
    </button>
  )
}
