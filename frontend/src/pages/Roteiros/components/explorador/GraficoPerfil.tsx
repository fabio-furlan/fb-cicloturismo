import { type KeyboardEvent, type PointerEvent, useEffect, useMemo, useRef, useState } from 'react'
import type { Roteiro } from '@/types/roteiro'
import { formatarNumero } from '@/utils/formatacao'
import { corDaFaixa, faixaDaInclinacao, type FaixaInclinacao, limitesDasEtapas, type PontoRota } from '@/utils/rota'
import { BikeMtb } from '@/components/ui/BikeMtb'

interface GraficoPerfilProps {
  roteiro: Roteiro
  pontos: PontoRota[]
  indice: number
  aoMudarIndice: (indice: number) => void
  aoInteragir: () => void
}

const LARGURA = 1000
const ALTURA = 300

/** Perfil de altimetria colorido pela inclinação. Arraste, passe o mouse ou use as setas para percorrer a rota. */
export function GraficoPerfil({ roteiro, pontos, indice, aoMudarIndice, aoInteragir }: GraficoPerfilProps) {
  const areaRef = useRef<HTMLDivElement>(null)
  const { distanciaKm } = roteiro

  // Tamanho real do gráfico na tela, para inclinar a bike no mesmo ângulo que a linha aparenta ter.
  const [tamanho, setTamanho] = useState({ largura: 800, altura: 288 })
  useEffect(() => {
    const area = areaRef.current
    if (!area) return
    const observador = new ResizeObserver(([entrada]) =>
      setTamanho({ largura: entrada.contentRect.width, altura: entrada.contentRect.height }),
    )
    observador.observe(area)
    return () => observador.disconnect()
  }, [])

  const { escala, trechos, area } = useMemo(() => {
    const alts = pontos.map((p) => p.altitude)
    const min = Math.min(...alts)
    const max = Math.max(...alts)
    // Faixa mínima de 400 m, para que um roteiro plano não pareça uma serra.
    const faixa = Math.max((max - min) * 1.3, 400)
    const base = Math.max(min - (faixa - (max - min)) * 0.35, 0)
    const escala = { base, topo: base + faixa }
    const x = (km: number) => ((km / distanciaKm) * LARGURA).toFixed(1)
    const y = (alt: number) => (ALTURA - ((alt - base) / faixa) * ALTURA).toFixed(1)

    // Agrupa trechos seguidos com a mesma faixa de inclinação num único caminho.
    const grupos: { faixa: FaixaInclinacao; inicio: number; fim: number }[] = []
    pontos.slice(0, -1).forEach((p, i) => {
      const faixaTrecho = faixaDaInclinacao(p.inclinacao)
      const ultimo = grupos.at(-1)
      if (ultimo && ultimo.faixa === faixaTrecho) ultimo.fim = i + 1
      else grupos.push({ faixa: faixaTrecho, inicio: i, fim: i + 1 })
    })
    const trechos = grupos.map(({ faixa: faixaTrecho, inicio, fim }) => {
      const trecho = pontos.slice(inicio, fim + 1)
      const linha = trecho.map((p, i) => `${i ? 'L' : 'M'}${x(p.km)},${y(p.altitude)}`).join('')
      return { faixa: faixaTrecho, linha }
    })
    const contorno = pontos.map((p, i) => `${i ? 'L' : 'M'}${x(p.km)},${y(p.altitude)}`).join('')
    const area = `${contorno}L${LARGURA},${ALTURA}L0,${ALTURA}Z`
    return { escala, trechos, area }
  }, [pontos, distanciaKm])

  const ponto = pontos[indice]
  const posX = (ponto.km / roteiro.distanciaKm) * 100
  const posY = (1 - (ponto.altitude - escala.base) / (escala.topo - escala.base)) * 100
  const limites = limitesDasEtapas(roteiro)
  const passoKm = roteiro.distanciaKm > 150 ? 50 : 25
  const marcasKm = Array.from({ length: Math.floor(roteiro.distanciaKm / passoKm) }, (_, i) => (i + 1) * passoKm)

  const indicePelaPosicao = (clientX: number) => {
    const caixa = areaRef.current?.getBoundingClientRect()
    if (!caixa) return indice
    const fracao = Math.min(Math.max((clientX - caixa.left) / caixa.width, 0), 1)
    return Math.round(fracao * (pontos.length - 1))
  }

  const aoMoverPonteiro = (evento: PointerEvent<HTMLDivElement>) => {
    // No toque, só percorre a rota enquanto o dedo estiver encostado (arrastando).
    if (evento.pointerType !== 'mouse' && evento.buttons === 0) return
    aoInteragir()
    aoMudarIndice(indicePelaPosicao(evento.clientX))
  }

  const aoPressionarTecla = (evento: KeyboardEvent<HTMLDivElement>) => {
    const passo = evento.shiftKey ? 20 : 4
    const ultimo = pontos.length - 1
    const destinos: Record<string, number> = {
      ArrowRight: Math.min(indice + passo, ultimo),
      ArrowUp: Math.min(indice + passo, ultimo),
      ArrowLeft: Math.max(indice - passo, 0),
      ArrowDown: Math.max(indice - passo, 0),
      Home: 0,
      End: ultimo,
    }
    if (!(evento.key in destinos)) return
    evento.preventDefault()
    aoInteragir()
    aoMudarIndice(destinos[evento.key])
  }

  // Ângulo da bike: média da rampa alguns pontos antes e depois, para ela não tremer nas ondulações.
  const antes = pontos[Math.max(indice - 3, 0)]
  const depois = pontos[Math.min(indice + 3, pontos.length - 1)]
  const dxTela = ((depois.km - antes.km) / distanciaKm) * tamanho.largura
  const dyTela = -((depois.altitude - antes.altitude) / (escala.topo - escala.base)) * tamanho.altura
  // O gráfico exagera o relevo na vertical; a bike inclina só uma parte disso, para não parecer empinando.
  const anguloBike = Math.max(Math.min(((Math.atan2(dyTela, dxTela || 1) * 180) / Math.PI) * 0.85, 30), -30)

  return (
    <div className="relative select-none pb-7 pl-12 pt-7">
      {/* Altitudes de referência no eixo vertical */}
      <span className="absolute left-0 top-7 text-xs tabular-nums text-cinza-400">{formatarNumero(Math.round(escala.topo))} m</span>
      <span className="absolute bottom-7 left-0 text-xs tabular-nums text-cinza-400">{formatarNumero(Math.round(escala.base))} m</span>

      <div
        ref={areaRef}
        role="slider"
        tabIndex={0}
        aria-label={`Percorrer o perfil da rota ${roteiro.nome}`}
        aria-valuemin={0}
        aria-valuemax={roteiro.distanciaKm}
        aria-valuenow={Math.round(ponto.km)}
        aria-valuetext={`Quilômetro ${Math.round(ponto.km)}, altitude ${formatarNumero(Math.round(ponto.altitude))} metros, inclinação ${ponto.inclinacao.toFixed(1)}%`}
        onPointerDown={(e) => {
          aoInteragir()
          aoMudarIndice(indicePelaPosicao(e.clientX))
        }}
        onPointerMove={aoMoverPonteiro}
        onKeyDown={aoPressionarTecla}
        className="relative h-52 cursor-crosshair touch-pan-y rounded-sm border-b border-l border-carvao-600 sm:h-72"
      >
        {/* Linhas de grade horizontais */}
        {[25, 50, 75].map((p) => (
          <div key={p} className="absolute inset-x-0 border-t border-dashed border-white/[0.06]" style={{ top: `${p}%` }} />
        ))}

        <svg
          key={roteiro.id}
          viewBox={`0 0 ${LARGURA} ${ALTURA}`}
          preserveAspectRatio="none"
          className="revelar-perfil absolute inset-0 h-full w-full overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="preenchimento-perfil" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--color-creme-100)" stopOpacity="0.16" />
              <stop offset="1" stopColor="var(--color-creme-100)" stopOpacity="0.01" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#preenchimento-perfil)" />
          {trechos.map(({ faixa, linha }, i) => (
            <path
              key={`l${i}`}
              d={linha}
              fill="none"
              stroke={corDaFaixa(faixa)}
              strokeWidth="3.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        {/* Divisões entre os dias de pedal */}
        {roteiro.etapas.slice(1).map((etapa, i) => (
          <div
            key={etapa.dia}
            className="pointer-events-none absolute inset-y-0 border-l border-dashed border-creme-100/25"
            style={{ left: `${(limites[i] / roteiro.distanciaKm) * 100}%` }}
          >
            <span className="absolute -top-6 left-1.5 whitespace-nowrap text-xs font-semibold text-cinza-400">Dia {etapa.dia}</span>
          </div>
        ))}
        <span className="pointer-events-none absolute -top-6 left-1.5 text-xs font-semibold text-cinza-400">
          Dia {roteiro.etapas[0].dia}
        </span>

        {/* Cursor: posição atual na rota */}
        <div className="pointer-events-none absolute inset-y-0 w-px bg-creme-100/70" style={{ left: `${posX}%` }} />
        {/* A bike apoia as rodas na linha e inclina junto com a rampa */}
        <div
          className="pointer-events-none absolute w-9 sm:w-10"
          style={{ left: `${posX}%`, top: `${posY}%`, transform: `translate(-50%, -96%) rotate(${anguloBike}deg)`, transformOrigin: '50% 96%' }}
        >
          <BikeMtb className="block w-full drop-shadow-[0_3px_6px_rgb(0_0_0/0.6)]" />
        </div>

        {/* Marcas de quilometragem */}
        {marcasKm.map((km) => (
          <span
            key={km}
            className="pointer-events-none absolute -bottom-6 -translate-x-1/2 whitespace-nowrap text-xs tabular-nums text-cinza-400"
            style={{ left: `${(km / roteiro.distanciaKm) * 100}%` }}
          >
            {km} km
          </span>
        ))}
      </div>
    </div>
  )
}
