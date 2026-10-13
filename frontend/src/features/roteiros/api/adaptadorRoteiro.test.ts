import { describe, expect, it } from 'vitest'
import { paraRoteiro, type RoteiroApi } from './adaptadorRoteiro'

type SaidaApi = RoteiroApi['saidas'][number]

const saidaApi = (sobrescrever: Partial<SaidaApi> = {}): SaidaApi => ({
  id: 1,
  dataInicio: '2026-11-14',
  dataFim: '2026-11-16',
  inscricoesAte: '2026-11-07',
  vagasRestantes: 8,
  precoBase: 1890,
  status: 'ABERTA',
  ...sobrescrever,
})

const roteiroApi = (sobrescrever: Partial<RoteiroApi> = {}): RoteiroApi => ({
  slug: 'vale-europeu',
  titulo: 'Circuito Vale Europeu',
  regiao: 'Timbó, Santa Catarina',
  descricao: 'Estradas de terra entre colônias.',
  nivel: 'INTERMEDIARIO',
  paisagem: 'VALE',
  dias: 2,
  distanciaKm: 100,
  subidaTotalM: 1200,
  altitudes: [100, 300, 100],
  etapas: [
    { dia: 1, titulo: 'Ida', distanciaKm: 50, subidaM: 600 },
    { dia: 2, titulo: 'Volta', distanciaKm: 50, subidaM: null },
  ],
  imagens: [],
  precoAPartirDe: null,
  saidas: [saidaApi()],
  ...sobrescrever,
})

describe('paraRoteiro', () => {
  it('converte os enums e os nomes dos campos para o formato das telas', () => {
    const roteiro = paraRoteiro(roteiroApi())
    expect(roteiro).toMatchObject({ id: 'vale-europeu', nome: 'Circuito Vale Europeu', nivel: 'intermediario', paisagem: 'vale' })
  })

  it('omite a subida de uma etapa quando a API a manda vazia', () => {
    expect(paraRoteiro(roteiroApi())?.etapas).toEqual([
      { dia: 1, titulo: 'Ida', distanciaKm: 50, subidaM: 600 },
      { dia: 2, titulo: 'Volta', distanciaKm: 50 },
    ])
  })

  it('mantém só as saídas abertas e com vagas', () => {
    const roteiro = paraRoteiro(
      roteiroApi({
        saidas: [
          saidaApi({ dataInicio: '2026-11-14' }),
          saidaApi({ dataInicio: '2026-12-05', status: 'ESGOTADA' }),
          saidaApi({ dataInicio: '2027-01-10', status: 'INSCRICOES_ENCERRADAS' }),
          saidaApi({ dataInicio: '2027-02-07', vagasRestantes: 0 }),
        ],
      }),
    )
    expect(roteiro?.saidas.map((s) => s.data)).toEqual(['2026-11-14'])
  })

  it('não mostra o roteiro sem nenhuma saída aberta', () => {
    expect(paraRoteiro(roteiroApi({ saidas: [saidaApi({ status: 'ESGOTADA' })] }))).toBeNull()
  })

  it('usa o "a partir de" da API e, sem ele, o menor preço das saídas', () => {
    const saidas = [saidaApi({ precoBase: 2100 }), saidaApi({ precoBase: 1750 })]
    expect(paraRoteiro(roteiroApi({ saidas, precoAPartirDe: 1500 }))?.precoReais).toBe(1500)
    expect(paraRoteiro(roteiroApi({ saidas }))?.precoReais).toBe(1750)
  })

  it('prefere o banner como foto e, sem imagens, usa a foto de capa do site', () => {
    const imagens: RoteiroApi['imagens'] = [
      { tipo: 'GALERIA', url: '/galeria.jpg', descricao: 'Galeria' },
      { tipo: 'BANNER', url: '/banner.jpg', descricao: 'Banner' },
    ]
    expect(paraRoteiro(roteiroApi({ imagens }))?.foto).toEqual({ src: '/banner.jpg', descricao: 'Banner' })
    expect(paraRoteiro(roteiroApi())?.foto.src).toBe('/images/hero-bikepacking.jpg')
  })
})
