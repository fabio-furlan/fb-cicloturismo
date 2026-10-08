export type Nivel = 'recreativo' | 'intermediario' | 'avancado'

export type Paisagem = 'serra' | 'vale' | 'fe'

export interface Saida {
  data: string // data ISO (AAAA-MM-DD)
  vagasRestantes: number
  /** Preço por pessoa desta data. Cada saída tem o seu: alta temporada, feriados. */
  precoReais: number
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
  /** Crédito e origem, para controle interno das licenças. A API pública não os envia. */
  autor?: string
  origem?: string
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
  /** Próximas saídas com vagas, em ordem de data. Sempre há pelo menos uma. */
  saidas: Saida[]
  /** Menor preço entre as saídas: o "a partir de". */
  precoReais: number
}
