import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { ROTAS } from '@/constants/rotas'
import type { Roteiro } from '@/types/roteiro'
import { formatarNumero, formatarPreco } from '@/utils/formatacao'
import { corDaFaixa, descreverDuracao, detalharRota, faixasInclinacao } from '@/utils/rota'
import { Ciclocomputador } from './Ciclocomputador'
import { GraficoPerfil } from './GraficoPerfil'
import { SeletorRoteiro } from './SeletorRoteiro'

const DURACAO_SIMULACAO_MS = 12000

interface SecaoExploradorProps {
  /** Pelo menos um roteiro: sem catálogo, a página não mostra o explorador. */
  roteiros: Roteiro[]
  roteiroId: string | null
  aoSelecionarRoteiro: (id: string) => void
}

export function SecaoExplorador({ roteiros, roteiroId, aoSelecionarRoteiro }: SecaoExploradorProps) {
  const roteiro = roteiros.find((r) => r.id === roteiroId) ?? roteiros[0]
  const pontos = useMemo(() => detalharRota(roteiro), [roteiro])
  // Cursor e simulação ficam presos ao roteiro: ao trocar de roteiro, voltam para a largada.
  const [cursor, setCursor] = useState({ roteiroId: roteiro.id, indice: 0 })
  const [simulacao, setSimulacao] = useState<{ roteiroId: string; inicio: number } | null>(null)
  const indice = cursor.roteiroId === roteiro.id ? cursor.indice : 0
  const simulando = simulacao?.roteiroId === roteiro.id

  const setIndice = (novo: number) => setCursor({ roteiroId: roteiro.id, indice: novo })
  const pararSimulacao = () => setSimulacao(null)
  const alternarSimulacao = () => {
    if (simulando) return pararSimulacao()
    const ultimo = pontos.length - 1
    setSimulacao({ roteiroId: roteiro.id, inicio: indice >= ultimo ? 0 : indice })
  }

  // "Simular percurso": o cursor anda sozinho da posição atual até a chegada.
  useEffect(() => {
    if (!simulacao) return
    const { roteiroId, inicio } = simulacao
    const ultimo = pontos.length - 1
    const duracao = DURACAO_SIMULACAO_MS * ((ultimo - inicio) / ultimo)
    const comeco = performance.now()
    let quadro = 0

    const avancar = (agora: number) => {
      const fracao = Math.min((agora - comeco) / duracao, 1)
      setCursor({ roteiroId, indice: Math.round(inicio + (ultimo - inicio) * fracao) })
      if (fracao < 1) quadro = requestAnimationFrame(avancar)
      else setSimulacao(null)
    }
    quadro = requestAnimationFrame(avancar)
    return () => cancelAnimationFrame(quadro)
  }, [simulacao, pontos])

  return (
    <section id="explorar" className="relative isolate scroll-mt-16 overflow-hidden bg-mata-950 py-12 sm:py-16" aria-labelledby="titulo-explorar">
      {/* Fundo: a foto da trilha desfocada e escurecida, como se o painel flutuasse sobre a paisagem */}
      <img
        src="/images/hero-bikepacking.jpg"
        alt=""
        className="absolute inset-0 -z-20 h-full w-full scale-110 object-cover blur-2xl brightness-[0.45] saturate-[1.3]"
        loading="lazy"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-mata-950/85 via-mata-950/55 to-mata-950/90" />

      <Container>
        <h2 id="titulo-explorar" className="font-display text-4xl font-semibold uppercase italic leading-none sm:text-6xl">
          Pedale a rota antes de ir
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-areia-400">
          Escolha um roteiro e passe o mouse ou o dedo pelo perfil para sentir cada subida. As cores mostram a inclinação
          de cada trecho.
        </p>

        <div className="mt-10">
          <SeletorRoteiro roteiros={roteiros} selecionadoId={roteiro.id} aoSelecionar={aoSelecionarRoteiro} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem] lg:grid-rows-[auto_1fr]">
          <div className="painel order-2 rounded-2xl p-4 sm:p-6 lg:col-start-1 lg:row-span-2 lg:row-start-1">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-areia-400" aria-label="Legenda de inclinação">
                {faixasInclinacao.map(({ faixa, rotulo }) => (
                  <li key={faixa} className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: corDaFaixa(faixa) }} />
                    {rotulo}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={alternarSimulacao}
                className="inline-flex items-center gap-2 rounded-lg border border-trilha-500 px-4 py-2.5 text-sm font-semibold text-trilha-500 transition-colors hover:bg-trilha-500 hover:text-mata-950"
              >
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                  {simulando ? <path d="M3 2h3.5v12H3zM9.5 2H13v12H9.5z" /> : <path d="M4 2l10 6-10 6z" />}
                </svg>
                {simulando ? 'Pausar simulação' : 'Simular percurso'}
              </button>
            </div>

            <div className="mt-4">
              <GraficoPerfil
                roteiro={roteiro}
                pontos={pontos}
                indice={indice}
                aoMudarIndice={setIndice}
                aoInteragir={pararSimulacao}
              />
            </div>
          </div>

          {/* No celular, a tela do ciclocomputador fica acima do gráfico para acompanhar o dedo. */}
          <div className="order-1 lg:col-start-2 lg:row-start-1">
            <Ciclocomputador roteiro={roteiro} ponto={pontos[indice]} />
          </div>

          <div className="painel order-3 self-start rounded-2xl p-5 lg:col-start-2 lg:row-start-2">
            <p className="text-sm text-areia-400">{roteiro.regiao}</p>
            <p className="mt-1 tabular-nums">
              {descreverDuracao(roteiro)}, {roteiro.distanciaKm} km e {formatarNumero(roteiro.subidaTotalM)} m de subida
            </p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <p>
                <span className="block text-sm text-areia-400">A partir de, por pessoa</span>
                <span className="font-display text-3xl font-bold tabular-nums">{formatarPreco(roteiro.precoReais)}</span>
              </p>
              <Link
                to={ROTAS.roteiros}
                className="rounded-lg bg-trilha-500 px-5 py-3 text-sm font-semibold text-mata-950 transition-colors hover:bg-trilha-400"
              >
                Ver roteiro
              </Link>
            </div>
          </div>
        </div>

        {/* Sobre o roteiro e o dia a dia; a etapa em que a bike está fica destacada */}
        <div className="painel mt-6 grid gap-8 rounded-2xl p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div>
            <h3 className="font-display text-2xl font-bold">{roteiro.nome}</h3>
            <p className="mt-3 leading-relaxed text-areia-100/85">{roteiro.descricao}</p>
          </div>
          <ol className="space-y-2" aria-label="Dia a dia">
            {roteiro.etapas.map((etapa) => {
              const atual = etapa.dia === pontos[indice].dia
              return (
                <li
                  key={etapa.dia}
                  className={`flex items-start gap-4 rounded-xl border p-3 transition-colors ${
                    atual ? 'border-trilha-500/70 bg-trilha-500/10' : 'border-white/10'
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg font-display leading-none ${
                      atual ? 'bg-trilha-500 text-mata-950' : 'bg-white/[0.06]'
                    }`}
                  >
                    <span className="text-[0.65rem] font-semibold">Dia</span>
                    <span className="text-lg font-bold">{etapa.dia}</span>
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold leading-snug">{etapa.titulo}</span>
                    <span className="mt-0.5 block text-sm tabular-nums text-areia-400">
                      {etapa.distanciaKm} km
                      {etapa.subidaM ? ` e ${formatarNumero(etapa.subidaM)} m de subida` : ''}
                    </span>
                  </span>
                </li>
              )
            })}
          </ol>
        </div>
      </Container>
    </section>
  )
}
