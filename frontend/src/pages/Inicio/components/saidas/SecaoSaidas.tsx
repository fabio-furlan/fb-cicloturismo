import type { ReactNode } from 'react'
import { IconeFechar } from '@/components/icones'
import { Container } from '@/components/ui/Container'
import { niveis } from '@/config/niveis'
import { paisagens } from '@/config/paisagens'
import type { Paisagem } from '@/types/roteiro'
import { partesData } from '@/utils/formatacao'
import { contarRoteiros, type FiltrosViagem, filtrarSaidas, mesesComSaida } from '@/utils/saidas'
import { CartaoSaida } from './CartaoSaida'

interface FiltroRapidoProps {
  ativo: boolean
  quantidade: number
  aoEscolher: () => void
  children: ReactNode
}

/** Botão de filtro com a quantidade de saídas que ele mostraria. */
function FiltroRapido({ ativo, quantidade, aoEscolher, children }: FiltroRapidoProps) {
  return (
    <button
      type="button"
      aria-pressed={ativo}
      onClick={aoEscolher}
      disabled={quantidade === 0 && !ativo}
      className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        ativo
          ? 'border-trilha-500 bg-trilha-500 text-mata-950'
          : 'border-white/15 bg-white/[0.04] text-areia-100 hover:border-trilha-500 hover:text-trilha-400'
      }`}
    >
      {children}
      <span
        className={`rounded-full px-1.5 py-0.5 text-xs tabular-nums ${ativo ? 'bg-mata-950/15' : 'bg-white/10 text-areia-400'}`}
      >
        {quantidade}
      </span>
    </button>
  )
}

interface SecaoSaidasProps {
  filtros: FiltrosViagem
  aoMudarFiltros: (filtros: FiltrosViagem) => void
  aoExplorar: (roteiroId: string) => void
}

/** Resultado da busca do topo: as próximas saídas, com filtros rápidos por paisagem e mês. */
export function SecaoSaidas({ filtros, aoMudarFiltros, aoExplorar }: SecaoSaidasProps) {
  const resultados = filtrarSaidas(filtros)
  // Um cartão por roteiro: a primeira saída que combina com os filtros vira o destaque, as outras ficam como "outras datas".
  const porRoteiro = resultados.filter((r, i) => resultados.findIndex((o) => o.roteiro.id === r.roteiro.id) === i)
  const mudar = (parcial: Partial<FiltrosViagem>) => aoMudarFiltros({ ...filtros, ...parcial })
  // Quantas viagens cada opção mostraria, mantendo os outros filtros.
  const contar = (parcial: Partial<FiltrosViagem>) => contarRoteiros({ ...filtros, ...parcial })

  return (
    <section
      id="saidas"
      className="relative isolate scroll-mt-16 overflow-hidden bg-mata-950 py-16 sm:py-24"
      aria-labelledby="titulo-saidas"
    >
      {/* Brilho laranja vindo do topo, como o fim de tarde da foto */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(60%_100%_at_50%_0%,color-mix(in_oklab,var(--color-trilha-500)_16%,transparent),transparent)]"
        aria-hidden="true"
      />

      <Container>
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
          <h2 id="titulo-saidas" className="font-display text-4xl font-bold uppercase leading-none sm:text-6xl">
            Próximas saídas
          </h2>
          <p className="text-areia-400" aria-live="polite">
            {porRoteiro.length === 0
              ? 'Nenhuma viagem com esses filtros'
              : `${porRoteiro.length} ${porRoteiro.length === 1 ? 'viagem' : 'viagens'} com vagas abertas`}
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filtrar por paisagem">
            <FiltroRapido ativo={!filtros.paisagem} quantidade={contar({ paisagem: '' })} aoEscolher={() => mudar({ paisagem: '' })}>
              Todas
            </FiltroRapido>
            {(Object.keys(paisagens) as Paisagem[]).map((p) => (
              <FiltroRapido
                key={p}
                ativo={filtros.paisagem === p}
                quantidade={contar({ paisagem: p })}
                aoEscolher={() => mudar({ paisagem: filtros.paisagem === p ? '' : p })}
              >
                {paisagens[p]}
              </FiltroRapido>
            ))}
          </div>

          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filtrar por mês">
            <FiltroRapido ativo={!filtros.mes} quantidade={contar({ mes: '' })} aoEscolher={() => mudar({ mes: '' })}>
              Qualquer mês
            </FiltroRapido>
            {mesesComSaida.map((m) => {
              const { mes } = partesData(`${m}-01`)
              return (
                <FiltroRapido
                  key={m}
                  ativo={filtros.mes === m}
                  quantidade={contar({ mes: m })}
                  aoEscolher={() => mudar({ mes: filtros.mes === m ? '' : m })}
                >
                  {mes} {m.slice(0, 4)}
                </FiltroRapido>
              )
            })}
            {filtros.nivel && (
              <button
                type="button"
                onClick={() => mudar({ nivel: '' })}
                className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-trilha-500 px-4 text-sm font-semibold text-trilha-400"
                aria-label={`Remover filtro de nível ${niveis[filtros.nivel].nome}`}
              >
                Nível {niveis[filtros.nivel].nome.toLowerCase()}
                <IconeFechar className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {porRoteiro.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-white/20 p-8 text-center">
            <p className="font-display text-2xl font-bold">Nada nessa combinação por enquanto</p>
            <p className="mt-2 text-areia-400">Tente outro mês ou outra paisagem. Novas datas abrem todo mês.</p>
            <button
              type="button"
              onClick={() => aoMudarFiltros({ paisagem: '', mes: '', nivel: '' })}
              className="mt-6 min-h-11 rounded-full bg-trilha-500 px-6 text-sm font-semibold text-mata-950 hover:bg-trilha-400"
            >
              Ver todas as saídas
            </button>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {porRoteiro.map(({ roteiro, saida }) => (
              <CartaoSaida
                key={roteiro.id}
                roteiro={roteiro}
                saida={saida}
                outrasSaidas={roteiro.saidas.filter((s) => s.data !== saida.data)}
                aoVerRoteiro={() => aoExplorar(roteiro.id)}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}
