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
export const listarSaidas = (roteiros: Roteiro[]): SaidaDoRoteiro[] =>
  roteiros
    .flatMap((roteiro) => roteiro.saidas.map((saida) => ({ roteiro, saida })))
    .sort((a, b) => a.saida.data.localeCompare(b.saida.data))

/** Os meses (AAAA-MM) que têm alguma saída, em ordem. */
export const mesesComSaida = (roteiros: Roteiro[]) => [...new Set(listarSaidas(roteiros).map(({ saida }) => saida.data.slice(0, 7)))]

export function filtrarSaidas(roteiros: Roteiro[], { paisagem, mes, nivel }: FiltrosViagem) {
  return listarSaidas(roteiros).filter(
    ({ roteiro, saida }) =>
      (!paisagem || roteiro.paisagem === paisagem) && (!nivel || roteiro.nivel === nivel) && (!mes || saida.data.startsWith(mes)),
  )
}

/** Quantos roteiros diferentes têm saída com esses filtros. */
export const contarRoteiros = (roteiros: Roteiro[], filtros: FiltrosViagem) =>
  new Set(filtrarSaidas(roteiros, filtros).map(({ roteiro }) => roteiro.id)).size
