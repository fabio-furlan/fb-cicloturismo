import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { IconeCalendario, IconeLocal, IconeMontanha, IconeRota, IconeSeta } from '@/components/icones'
import { estiloBotao } from '@/components/ui/estilosBotao'
import { ROTAS } from '@/constants/rotas'
import { descreverDuracao, IndicadorNivel, paisagens, type Roteiro, type Saida } from '@/features/roteiros'
import { useClienteLogado } from '@/hooks/useClienteLogado'
import { cn } from '@/utils/cn'
import { formatarData, formatarNumero, formatarPreco } from '@/utils/formatacao'

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

/**
 * Faixa de cartões das próximas saídas: três lado a lado no desktop, dois no tablet e um (com a ponta do seguinte
 * aparecendo) no celular. Rola com o dedo, com o trackpad ou pelas setas, sempre parando no início de um cartão.
 * Nada passa sozinho.
 */
export function VitrineSaidas({ itens, aoExplorar }: VitrineSaidasProps) {
  const faixaRef = useRef<HTMLUListElement>(null)
  const [noInicio, setNoInicio] = useState(true)
  const [noFim, setNoFim] = useState(itens.length <= 1)
  const [atual, setAtual] = useState(0)

  // Atualiza setas e marcadores conforme a faixa rola (por qualquer meio).
  useEffect(() => {
    const faixa = faixaRef.current
    if (!faixa) return
    const atualizar = () => {
      const passo = faixa.firstElementChild?.getBoundingClientRect().width ?? faixa.clientWidth
      setNoInicio(faixa.scrollLeft <= 4)
      setNoFim(faixa.scrollLeft + faixa.clientWidth >= faixa.scrollWidth - 4)
      setAtual(Math.round(faixa.scrollLeft / passo))
    }
    atualizar()
    faixa.addEventListener('scroll', atualizar, { passive: true })
    const observador = new ResizeObserver(atualizar)
    observador.observe(faixa)
    return () => {
      faixa.removeEventListener('scroll', atualizar)
      observador.disconnect()
    }
  }, [])

  const comportamento = (): ScrollBehavior => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth')

  // As setas andam o equivalente aos cartões visíveis.
  const rolar = (sentido: 1 | -1) => {
    const faixa = faixaRef.current
    if (!faixa) return
    faixa.scrollBy({ left: sentido * faixa.clientWidth, behavior: comportamento() })
  }

  const irPara = (indice: number) => {
    const faixa = faixaRef.current
    const cartao = faixa?.children[indice] as HTMLElement | undefined
    if (!faixa || !cartao) return
    faixa.scrollTo({ left: cartao.offsetLeft - faixa.offsetLeft, behavior: comportamento() })
  }

  return (
    <section aria-roledescription="carrossel" aria-label="Próximas saídas" className="relative">
      <ul
        ref={faixaRef}
        className="-mx-4 flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto scroll-smooth px-4 pt-6 pb-4 motion-reduce:scroll-auto sm:mx-0 sm:px-0 baixa:pt-4 mini:pt-3 [&::-webkit-scrollbar]:hidden"
      >
        {itens.map((item, i) => (
          <li
            key={item.roteiro.id}
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${itens.length}`}
            className="w-[85%] shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]"
          >
            <CartaoSaida {...item} aoExplorar={aoExplorar} />
          </li>
        ))}
      </ul>

      {itens.length > 1 && (
        <div className="mt-1 flex items-center justify-center gap-4">
          <Seta lado="esquerda" desativada={noInicio} aoClicar={() => rolar(-1)} />
          <div className="flex items-center gap-1.5">
            {itens.map((item, i) => (
              <button
                key={item.roteiro.id}
                type="button"
                onClick={() => irPara(i)}
                aria-label={`Ir para ${item.roteiro.nome}`}
                aria-current={i === atual}
                className="flex h-6 w-4 items-center justify-center"
              >
                <span
                  className={cn(
                    'block h-2 rounded-full transition-all motion-reduce:transition-none',
                    i === atual ? 'w-4 bg-vermelho-500' : 'w-2 bg-carvao-900/20',
                  )}
                />
              </button>
            ))}
          </div>
          <Seta lado="direita" desativada={noFim} aoClicar={() => rolar(1)} />
        </div>
      )}
    </section>
  )
}

function CartaoSaida({ roteiro, saida, outrasSaidas, aoExplorar }: ItemVitrine & { aoExplorar: (id: string) => void }) {
  const clienteLogado = useClienteLogado()
  const ultimasVagas = saida.vagasRestantes <= 4
  const dados = [
    { icone: IconeCalendario, texto: descreverDuracao(roteiro), extra: '' },
    { icone: IconeRota, texto: `${roteiro.distanciaKm} km`, extra: '' },
    { icone: IconeMontanha, texto: `${formatarNumero(roteiro.subidaTotalM)} m`, extra: ' de subida' },
  ]

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_20px_40px_-28px_rgb(0_0_0/0.45)] ring-1 ring-carvao-900/[0.06] transition-shadow hover:shadow-[0_24px_48px_-24px_rgb(0_0_0/0.5)]">
      <div className="relative aspect-[16/10] overflow-hidden baixa:aspect-[16/8] mini:aspect-[16/7]">
        <img
          src={roteiro.foto.src}
          alt={roteiro.foto.descricao}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
        />
        <span
          className={cn(
            'absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-bold shadow-sm',
            ultimasVagas ? 'bg-sol-500 text-carvao-950' : 'bg-white/95 text-carvao-900',
          )}
        >
          {ultimasVagas ? `Últimas ${saida.vagasRestantes} vagas` : `${saida.vagasRestantes} vagas`}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 baixa:p-4 mini:p-3.5">
        <p className="text-xs font-bold tracking-[0.2em] text-vermelho-500 uppercase">
          {paisagens[roteiro.paisagem]} · {formatarData(saida.data)}
        </p>
        <h3 className="mt-1 font-display text-xl leading-tight font-black text-carvao-900 uppercase">{roteiro.nome}</h3>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-cinza-600">
          <span className="flex min-w-0 items-center gap-1">
            <IconeLocal className="h-4 w-4 shrink-0 text-vermelho-500" />
            <span className="truncate">{roteiro.regiao}</span>
          </span>
          <IndicadorNivel nivel={roteiro.nivel} />
        </p>
        <ul className="mt-3 flex flex-wrap gap-1.5 text-xs font-semibold text-carvao-900 tabular-nums mini:hidden">
          {dados.map(({ icone: Icone, texto, extra }) => (
            <li key={texto} className="flex items-center gap-1 rounded-full bg-carvao-900/[0.05] px-2.5 py-1">
              <Icone className="h-3.5 w-3.5 text-vermelho-500" />
              {texto}
              {extra && <span className="sr-only">{extra}</span>}
            </li>
          ))}
        </ul>

        {/* Preço e a ação principal (Reservar) na mesma linha; "Ver roteiro" fica como um link discreto embaixo */}
        <div className="mt-auto pt-4 baixa:pt-3">
          <div className="flex items-end justify-between gap-3">
            <p className="min-w-0">
              <span className="block truncate text-[0.7rem] text-cinza-600">
                {outrasSaidas.length > 0
                  ? `Outras datas: ${outrasSaidas.map((s) => formatarData(s.data)).join(', ')}`
                  : 'Por pessoa, tudo incluso'}
              </span>
              <span className="block font-display text-2xl leading-none font-black whitespace-nowrap text-carvao-900 tabular-nums">
                {formatarPreco(saida.precoReais)}
              </span>
            </p>
            {/* Logado, a reserva segue pelo contato; sem login, passa antes pela página de entrar. */}
            <Link to={clienteLogado ? ROTAS.contato : ROTAS.minhaConta} className={cn(estiloBotao('principal', 'compacto'), 'shrink-0')}>
              Reservar
            </Link>
          </div>
          <button
            type="button"
            onClick={() => aoExplorar(roteiro.id)}
            className="group/link mt-3 flex min-h-10 w-full items-center justify-between border-t border-carvao-900/[0.08] pt-3 text-sm font-semibold text-carvao-900 transition-colors hover:text-vermelho-500 baixa:mt-2 baixa:pt-2"
          >
            Ver roteiro completo
            <IconeSeta className="h-4 w-4 transition-transform group-hover/link:translate-x-1 motion-reduce:transition-none" />
          </button>
        </div>
      </div>
    </article>
  )
}

function Seta({ lado, desativada, aoClicar }: { lado: 'esquerda' | 'direita'; desativada: boolean; aoClicar: () => void }) {
  return (
    <button
      type="button"
      onClick={aoClicar}
      disabled={desativada}
      aria-label={lado === 'esquerda' ? 'Viagens anteriores' : 'Próximas viagens'}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-carvao-900/15 bg-white text-carvao-900 transition-colors hover:border-vermelho-500 hover:bg-vermelho-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-carvao-900/15 disabled:hover:bg-white disabled:hover:text-carvao-900 baixa:h-9 baixa:w-9"
    >
      <IconeSeta className={cn('h-5 w-5', lado === 'esquerda' && 'rotate-180')} />
    </button>
  )
}
