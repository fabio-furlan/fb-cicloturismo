export type Nivel = 'recreativo' | 'intermediario' | 'avancado'

export type Paisagem = 'serra' | 'vale' | 'fe'

export interface Saida {
  data: string // data ISO (AAAA-MM-DD)
  vagasRestantes: number
}

/** Um dia de pedal. Dias sem pedal (traslado, chegada) não têm etapa. */
export interface Etapa {
  dia: number
  titulo: string
  distanciaKm: number
  subidaM?: number
}

export interface Foto {
  src: string
  /** Descrição para leitores de tela. */
  descricao: string
  /** Crédito e origem, para controle interno das licenças. */
  autor: string
  origem: string
}

export interface Roteiro {
  id: string
  nome: string
  regiao: string
  nivel: Nivel
  paisagem: Paisagem
  /** Resumo de duas ou três frases, exibido no cartão e no explorador. */
  descricao: string
  foto: Foto
  /** Duração total da viagem, incluindo dias sem pedal. */
  dias: number
  /** Dias de pedal, em ordem. A soma das distâncias é a distância total. */
  etapas: Etapa[]
  distanciaKm: number
  subidaTotalM: number
  /** Altitudes em metros, amostradas em intervalos iguais do início ao fim do percurso. */
  altitudes: number[]
  /** Próximas saídas, em ordem de data. */
  saidas: Saida[]
  vagasPorGrupo: number
  precoReais: number
}
