import type { Foto, Nivel, Paisagem, Roteiro, Saida } from '@/types/roteiro'

// Formato de GET /api/roteiros (RoteiroPublico no backend). Os enums vêm em maiúsculas e os valores em reais vêm
// como número. Só os campos que o site usa estão tipados.

type NivelApi = 'RECREATIVO' | 'INTERMEDIARIO' | 'AVANCADO'
type PaisagemApi = 'SERRA' | 'VALE' | 'FE'
type StatusSaidaApi = 'ABERTA' | 'ESGOTADA' | 'INSCRICOES_ENCERRADAS'

interface SaidaApi {
  id: number
  dataInicio: string
  dataFim: string
  inscricoesAte: string
  vagasRestantes: number
  precoBase: number
  status: StatusSaidaApi
}

interface ImagemApi {
  tipo: 'BANNER' | 'GALERIA'
  url: string
  descricao: string
}

export interface RoteiroApi {
  slug: string
  titulo: string
  regiao: string
  descricao: string
  nivel: NivelApi
  paisagem: PaisagemApi
  dias: number
  distanciaKm: number
  subidaTotalM: number
  altitudes: number[]
  etapas: { dia: number; titulo: string; distanciaKm: number; subidaM: number | null }[]
  imagens: ImagemApi[]
  precoAPartirDe: number | null
  saidas: SaidaApi[]
}

const niveis: Record<NivelApi, Nivel> = { RECREATIVO: 'recreativo', INTERMEDIARIO: 'intermediario', AVANCADO: 'avancado' }

const paisagens: Record<PaisagemApi, Paisagem> = { SERRA: 'serra', VALE: 'vale', FE: 'fe' }

// Sem imagem cadastrada, o cartão usa a foto de capa do site em vez de ficar vazio.
const fotoPadrao: Foto = { src: '/images/hero-bikepacking.jpg', descricao: '' }

function paraFoto(imagens: ImagemApi[]): Foto {
  const imagem = imagens.find((i) => i.tipo === 'BANNER') ?? imagens[0]
  return imagem ? { src: imagem.url, descricao: imagem.descricao } : fotoPadrao
}

/**
 * Converte um roteiro da API para o formato das telas. Ficam só as saídas abertas: o site lista "datas com vagas", e
 * uma saída esgotada ou com inscrições encerradas ainda não tem tela própria. Sem nenhuma saída aberta, devolve `null`
 * e o roteiro não aparece.
 */
export function paraRoteiro(api: RoteiroApi): Roteiro | null {
  const saidas: Saida[] = api.saidas
    .filter((s) => s.status === 'ABERTA' && s.vagasRestantes > 0)
    .map((s) => ({ data: s.dataInicio, vagasRestantes: s.vagasRestantes, precoReais: s.precoBase }))
  if (saidas.length === 0) return null

  return {
    id: api.slug,
    nome: api.titulo,
    regiao: api.regiao,
    nivel: niveis[api.nivel],
    paisagem: paisagens[api.paisagem],
    descricao: api.descricao,
    foto: paraFoto(api.imagens),
    dias: api.dias,
    etapas: api.etapas.map(({ subidaM, ...etapa }) => (subidaM == null ? etapa : { ...etapa, subidaM })),
    distanciaKm: api.distanciaKm,
    subidaTotalM: api.subidaTotalM,
    altitudes: api.altitudes,
    saidas,
    precoReais: api.precoAPartirDe ?? Math.min(...saidas.map((s) => s.precoReais)),
  }
}
