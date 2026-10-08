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

export type Modalidade = 'MTB' | 'SPEED' | 'GRAVEL' | 'MISTA'
export type Destino = 'NACIONAL' | 'INTERNACIONAL'
export type NivelRoteiro = 'RECREATIVO' | 'INTERMEDIARIO' | 'AVANCADO'
export type PaisagemRoteiro = 'SERRA' | 'VALE' | 'FE'
export type TipoImagem = 'BANNER' | 'GALERIA'

export interface EtapaRoteiro {
  dia: number
  titulo: string
  distanciaKm: number
  subidaM?: number | null
}

export interface ImagemRoteiro {
  tipo: TipoImagem
  url: string
  /** Texto alternativo, para leitores de tela. */
  descricao: string
  autor?: string | null
  origem?: string | null
}

/** O corpo de POST /api/adm/roteiros e PUT /api/adm/roteiros/{id}. A distância total é calculada pela API. */
export interface DadosRoteiro {
  titulo: string
  regiao: string
  descricao: string
  modalidade: Modalidade
  destino: Destino
  nivel: NivelRoteiro
  paisagem: PaisagemRoteiro
  dias: number
  subidaTotalM: number
  altitudes: number[]
  etapas: EtapaRoteiro[]
  imagens: ImagemRoteiro[]
}

/** Um roteiro como o ADM o vê: GET /api/adm/roteiros e GET /api/adm/roteiros/{id}. */
export interface RoteiroAdm extends DadosRoteiro {
  id: number
  slug: string
  distanciaKm: number
  criadoEm: string
  atualizadoEm: string
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
