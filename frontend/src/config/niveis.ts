import type { Nivel } from '@/types/roteiro'

interface InfoNivel {
  nome: string
  /** Posição na escala de dificuldade, de 1 a 3. */
  ordem: 1 | 2 | 3
  /** Limites de um dia típico de pedal nesse nível. */
  kmPorDiaMax: number
  subidaPorDiaMax: number
  paraQuem: string
}

export const niveis: Record<Nivel, InfoNivel> = {
  recreativo: {
    nome: 'Iniciante',
    ordem: 1,
    kmPorDiaMax: 40,
    subidaPorDiaMax: 400,
    paraQuem: 'Para quem pedala no fim de semana e quer curtir a paisagem sem pressa. Estradas de terra boas e trechos de asfalto.',
  },
  intermediario: {
    nome: 'Intermediário',
    ordem: 2,
    kmPorDiaMax: 70,
    subidaPorDiaMax: 1000,
    paraQuem: 'Para quem já faz pedais longos e encara subidas de alguns quilômetros. Terra, cascalho e um pouco de trilha.',
  },
  avancado: {
    nome: 'Avançado',
    ordem: 3,
    kmPorDiaMax: Infinity,
    subidaPorDiaMax: Infinity,
    paraQuem: 'Para quem treina com frequência e gosta de serra. Subidas longas e íngremes, descidas técnicas e dias inteiros no selim.',
  },
}

export const ordemNiveis: Nivel[] = ['recreativo', 'intermediario', 'avancado']

/** O nível de quem pedala `km` por dia e encara `subida` metros de subida por dia. */
export function nivelPara(km: number, subida: number): Nivel {
  return ordemNiveis.find((n) => km <= niveis[n].kmPorDiaMax && subida <= niveis[n].subidaPorDiaMax) ?? 'avancado'
}
