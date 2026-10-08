import type { Roteiro } from '@/types/roteiro'

export interface PontoRota {
  km: number
  altitude: number
  /** Inclinação do trecho que começa neste ponto, em %. */
  inclinacao: number
  /** Metros de subida acumulados desde a largada. */
  subidaAcumulada: number
  dia: number
}

export type FaixaInclinacao = 'descida' | 'leve' | 'moderada' | 'forte' | 'muito-forte'

export const faixasInclinacao: { faixa: FaixaInclinacao; rotulo: string }[] = [
  { faixa: 'descida', rotulo: 'Descida' },
  { faixa: 'leve', rotulo: 'Até 3%' },
  { faixa: 'moderada', rotulo: '3 a 6%' },
  { faixa: 'forte', rotulo: '6 a 9%' },
  { faixa: 'muito-forte', rotulo: 'Acima de 9%' },
]

export function faixaDaInclinacao(inclinacao: number): FaixaInclinacao {
  if (inclinacao < -1) return 'descida'
  if (inclinacao < 3) return 'leve'
  if (inclinacao < 6) return 'moderada'
  if (inclinacao < 9) return 'forte'
  return 'muito-forte'
}

export const corDaFaixa = (faixa: FaixaInclinacao) => `var(--color-rampa-${faixa})`

/**
 * Percurso detalhado de um roteiro a partir das altitudes reais (amostradas em intervalos iguais de distância):
 * quilômetro, inclinação, subida acumulada e dia de cada ponto.
 */
export function detalharRota(roteiro: Roteiro): PontoRota[] {
  const { altitudes, distanciaKm, etapas, subidaTotalM } = roteiro
  const passoKm = distanciaKm / (altitudes.length - 1)
  const limites = limitesDasEtapas(roteiro)
  // As altitudes estão arredondadas; o ajuste faz a subida acumulada fechar exatamente na subida total do roteiro.
  const subidaBruta = altitudes.reduce((soma, alt, i) => soma + (i ? Math.max(0, alt - altitudes[i - 1]) : 0), 0)
  const ajuste = subidaTotalM / (subidaBruta || 1)
  let subidaAcumulada = 0

  return altitudes.map((altitude, i) => {
    if (i > 0) subidaAcumulada += Math.max(0, altitude - altitudes[i - 1])
    // Inclinação do trecho seguinte (no último ponto, a do trecho anterior).
    const [de, ate] = i < altitudes.length - 1 ? [altitude, altitudes[i + 1]] : [altitudes[i - 1], altitude]
    const km = i * passoKm
    return {
      km,
      altitude,
      inclinacao: ((ate - de) / (passoKm * 1000)) * 100,
      subidaAcumulada: subidaAcumulada * ajuste,
      dia: etapas[Math.max(limites.findIndex((fim) => km <= fim + 1e-6), 0)].dia,
    }
  })
}

/** Quilômetro em que cada etapa termina, acumulado desde a largada. */
export function limitesDasEtapas({ etapas }: Roteiro) {
  let acumulado = 0
  return etapas.map((etapa) => (acumulado += etapa.distanciaKm))
}


/** "3 dias", "1 dia" ou "3 dias, 2 de pedal" quando há dias sem pedal (traslado, chegada). */
export function descreverDuracao({ dias, etapas }: Roteiro) {
  const total = `${dias} ${dias === 1 ? 'dia' : 'dias'}`
  return etapas.length === dias ? total : `${total}, ${etapas.length} de pedal`
}
