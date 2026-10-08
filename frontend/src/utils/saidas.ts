import { roteirosExemplo } from '@/data/roteirosExemplo'
import type { Nivel, Paisagem, Roteiro, Saida } from '@/types/roteiro'

export interface FiltrosViagem {
  paisagem: Paisagem | ''
  mes: string // AAAA-MM
  nivel: Nivel | ''
}

export const filtrosVazios: FiltrosViagem = { paisagem: '', mes: '', nivel: '' }

export interface SaidaDoRoteiro {
  roteiro: Roteiro
  saida: Saida
}

/** Todas as saídas do catálogo, da mais próxima para a mais distante. */
export const todasSaidas: SaidaDoRoteiro[] = roteirosExemplo
  .flatMap((roteiro) => roteiro.saidas.map((saida) => ({ roteiro, saida })))
  .sort((a, b) => a.saida.data.localeCompare(b.saida.data))

export const mesesComSaida = [...new Set(todasSaidas.map(({ saida }) => saida.data.slice(0, 7)))]

export function filtrarSaidas({ paisagem, mes, nivel }: FiltrosViagem) {
  return todasSaidas.filter(
    ({ roteiro, saida }) =>
      (!paisagem || roteiro.paisagem === paisagem) && (!nivel || roteiro.nivel === nivel) && (!mes || saida.data.startsWith(mes)),
  )
}

/** Quantos roteiros diferentes têm saída com esses filtros. */
export const contarRoteiros = (filtros: FiltrosViagem) => new Set(filtrarSaidas(filtros).map(({ roteiro }) => roteiro.id)).size
