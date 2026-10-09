import type { ReactNode } from 'react'
import { IconeCalendario, IconeFechar, IconeSeta } from '@/components/icones'
import { Container } from '@/components/ui/Container'
import { SetaSecao } from '@/components/ui/SetaSecao'
import { TituloSecao } from '@/components/ui/TituloSecao'
import { niveis } from '@/config/niveis'
import { revelar } from '@/hooks/useRevelarAoRolar'
import { paisagens } from '@/config/paisagens'
import type { Paisagem, Roteiro } from '@/types/roteiro'
import { formatarMesAno } from '@/utils/formatacao'
import { contarRoteiros, type FiltrosViagem, filtrarSaidas, mesesComSaida } from '@/utils/saidas'
import { VitrineSaidas } from './VitrineSaidas'

interface FiltroRapidoProps {
  ativo: boolean
  quantidade: number
  aoEscolher: () => void
  children: ReactNode
}

/** Botão de filtro em pílula, com a quantidade de saídas que ele mostraria. Selecionado, fica vermelho. */
function FiltroRapido({ ativo, quantidade, aoEscolher, children }: FiltroRapidoProps) {
  return (
    <button
      type="button"
      aria-pressed={ativo}
      onClick={aoEscolher}
      disabled={quantidade === 0 && !ativo}
      className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-5 text-sm font-bold baixa:sm:min-h-9 baixa:px-4 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        ativo
          ? 'border-vermelho-500 bg-vermelho-500 text-white shadow-[0_6px_18px_-8px_rgb(200_16_46/0.8)]'
          : 'border-carvao-900/10 bg-white text-carvao-900 hover:border-vermelho-500 hover:text-vermelho-500'
      }`}
    >
      {children}
      <span
        className={`rounded-full px-2 py-0.5 text-xs tabular-nums ${ativo ? 'bg-white/20 text-white' : 'bg-carvao-900/[0.06] text-cinza-600'}`}
      >
        {quantidade}
      </span>
    </button>
  )
}

interface SecaoSaidasProps {
  roteiros: Roteiro[]
  filtros: FiltrosViagem
  aoMudarFiltros: (filtros: FiltrosViagem) => void
  aoExplorar: (roteiroId: string) => void
  /** Divisão seguinte da página, para a seta do final. */
  proxima: { para: string; rotulo: string }
}

/** Resultado da busca do topo: as próximas saídas, com filtros rápidos por paisagem e um campo de mês. */
export function SecaoSaidas({ roteiros, filtros, aoMudarFiltros, aoExplorar, proxima }: SecaoSaidasProps) {
  const resultados = filtrarSaidas(roteiros, filtros)
  // Um cartão por roteiro: a primeira saída que combina com os filtros vira o destaque, as outras ficam como "outras datas".
  const porRoteiro = resultados.filter((r, i) => resultados.findIndex((o) => o.roteiro.id === r.roteiro.id) === i)
  const mudar = (parcial: Partial<FiltrosViagem>) => aoMudarFiltros({ ...filtros, ...parcial })
  // Quantas viagens cada opção mostraria, mantendo os outros filtros.
  const contar = (parcial: Partial<FiltrosViagem>) => contarRoteiros(roteiros, { ...filtros, ...parcial })

  return (
    <section
      // Cresce para ocupar a tela em monitores altos, com o conteúdo centralizado na vertical
      className="flex flex-1 flex-col justify-center overflow-hidden bg-creme-50 pb-4 pt-10 text-carvao-900 sm:pb-6 baixa:pb-3 baixa:pt-5 mini:pt-3"
      aria-labelledby="titulo-saidas"
    >
      {/* data-conteudo-ajustavel: o carrossel mede este bloco para os cartões caberem na tela */}
      <Container data-conteudo-ajustavel>
        <div {...revelar(0)}>
          <TituloSecao
            id="titulo-saidas"
            selo="Próximas saídas"
            titulo="Nossos"
            destaque="destinos"
            compacto
            descricao={
              <span aria-live="polite">
                {porRoteiro.length === 0
                  ? 'Nenhuma viagem com esses filtros.'
                  : `${porRoteiro.length} ${porRoteiro.length === 1 ? 'viagem' : 'viagens'} com vagas abertas. Escolha uma para ver os detalhes.`}
              </span>
            }
          />
        </div>

        {/* Filtros numa linha só (paisagem e mês), para o título e os cartões caberem juntos na tela.
            No celular, a linha rola para o lado. */}
        <div {...revelar(150)} className="-mx-4 mt-6 flex items-center gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0 baixa:mt-3 mini:mt-2">
          <div className="flex shrink-0 gap-2 sm:flex-wrap sm:justify-center" role="group" aria-label="Filtrar por paisagem">
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

          <div className="flex shrink-0 items-center gap-2">
            {/* Mês num campo só, igual ao "Quando" da busca do topo, em vez de um botão para cada mês */}
            <div className="relative inline-flex h-11 items-center gap-2 rounded-full baixa:sm:h-9 border border-carvao-900/10 bg-white pl-4 transition-colors focus-within:border-vermelho-500 hover:border-vermelho-500">
              <label htmlFor="filtro-mes" className="sr-only">
                Filtrar por mês
              </label>
              <IconeCalendario className="pointer-events-none h-4 w-4 shrink-0 text-vermelho-500" />
              <select
                id="filtro-mes"
                value={filtros.mes}
                onChange={(e) => mudar({ mes: e.target.value })}
                className="h-full cursor-pointer appearance-none bg-transparent pr-9 text-sm font-bold text-carvao-900"
              >
                <option value="">Datas disponíveis ({contar({ mes: '' })})</option>
                {mesesComSaida(roteiros).map((m) => {
                  const quantidade = contar({ mes: m })
                  return (
                    <option key={m} value={m} disabled={quantidade === 0 && filtros.mes !== m}>
                      {formatarMesAno(m)} ({quantidade})
                    </option>
                  )
                })}
              </select>
              <IconeSeta className="pointer-events-none absolute right-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rotate-90 text-cinza-600" />
            </div>
            {filtros.nivel && (
              <button
                type="button"
                onClick={() => mudar({ nivel: '' })}
                className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-vermelho-500 bg-white px-5 baixa:min-h-9 text-sm font-bold text-vermelho-500"
                aria-label={`Remover filtro de nível ${niveis[filtros.nivel].nome}`}
              >
                Nível {niveis[filtros.nivel].nome.toLowerCase()}
                <IconeFechar className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {porRoteiro.length === 0 ? (
          <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-dashed border-carvao-900/20 bg-white p-8 text-center">
            <p className="font-display text-2xl font-extrabold">Nada nessa combinação por enquanto</p>
            <p className="mt-2 text-cinza-600">Tente outro mês ou outra paisagem. Novas datas abrem todo mês.</p>
            <button
              type="button"
              onClick={() => aoMudarFiltros({ paisagem: '', mes: '', nivel: '' })}
              className="mt-6 min-h-11 rounded-full bg-vermelho-500 px-7 font-display text-[0.8rem] font-bold uppercase tracking-[0.08em] text-white hover:bg-vermelho-600"
            >
              Ver todas as saídas
            </button>
          </div>
        ) : (
          <div {...revelar(300)} className="mt-2 baixa:mt-0">
            {/* A chave recomeça a vitrine pela primeira viagem quando os filtros mudam */}
            <VitrineSaidas
              key={JSON.stringify(filtros)}
              itens={porRoteiro.map(({ roteiro, saida }) => ({
                roteiro,
                saida,
                outrasSaidas: roteiro.saidas.filter((s) => s.data !== saida.data),
              }))}
              aoExplorar={aoExplorar}
            />
          </div>
        )}

        <div {...revelar(500)}>
          <SetaSecao para={proxima.para} rotulo={proxima.rotulo} tom="claro" className="mt-3 baixa:mt-1" compacta />
        </div>
      </Container>
    </section>
  )
}
