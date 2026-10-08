// Formatos da API do ADM (/api/adm/** e /api/auth/**), como o backend os devolve. Datas em ISO (AAAA-MM-DD).

export type StatusSaida =
  | 'RASCUNHO'
  | 'CANCELADA'
  | 'ABERTA'
  | 'ESGOTADA'
  | 'INSCRICOES_ENCERRADAS'
  | 'EM_ANDAMENTO'
  | 'FINALIZADA'

export type SituacaoSaida = 'RASCUNHO' | 'PUBLICADA' | 'CANCELADA'

export type GrupoOpcional = 'ACOMODACAO' | 'EQUIPAMENTO' | 'SERVICO'

export interface Administrador {
  id: number
  nome: string
  email: string
}

export interface TokenEmitido {
  tipo: 'Bearer'
  token: string
  expiraEm: string
  administrador: Administrador
}

/** Uma linha do dashboard: GET /api/adm/saidas e GET /api/adm/roteiros/{id}/saidas. */
export interface ResumoSaida {
  id: number
  roteiroId: number
  roteiroTitulo: string
  dataInicio: string
  dataFim: string
  inscricoesAte: string
  vagasOcupadas: number
  capacidade: number
  precoBase: number
  status: StatusSaida
}

export interface Opcional {
  id: number
  grupo: GrupoOpcional
  escolhaUnica: boolean
  nome: string
  descricao: string | null
  acrescimo: number
}

/** Uma saída com os opcionais: GET /api/adm/saidas/{id} e as ações sobre ela. */
export interface SaidaAdm {
  id: number
  roteiroId: number
  roteiroTitulo: string
  dataInicio: string
  dataFim: string
  inscricoesAte: string
  capacidade: number
  vagasOcupadas: number
  vagasDisponiveis: number
  precoBase: number
  situacao: SituacaoSaida
  status: StatusSaida
  opcionais: Opcional[]
}

/** O que a lista de roteiros do ADM usa de GET /api/adm/roteiros. */
export interface RoteiroAdm {
  id: number
  slug: string
  titulo: string
  regiao: string
  dias: number
  distanciaKm: number
  subidaTotalM: number
  nivel: 'RECREATIVO' | 'INTERMEDIARIO' | 'AVANCADO'
}

export interface PeriodoSaida {
  dataInicio: string
  dataFim: string
  inscricoesAte: string
}

export interface DadosSaida extends PeriodoSaida {
  capacidade: number
  precoBase: number
}

export interface NovoOpcional {
  grupo: GrupoOpcional
  nome: string
  descricao?: string
  acrescimo: number
}
