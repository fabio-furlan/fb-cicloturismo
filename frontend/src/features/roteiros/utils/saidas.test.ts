import { describe, expect, it } from 'vitest'
import { criarRoteiro, criarSaida } from '@/test/fabricas'
import { contarRoteiros, filtrarSaidas, filtrosVazios, listarSaidas, mesesComSaida } from './saidas'

const serra = criarRoteiro({
  id: 'serra',
  paisagem: 'serra',
  nivel: 'avancado',
  saidas: [criarSaida({ data: '2026-12-05' }), criarSaida({ data: '2027-01-10' })],
})
const vale = criarRoteiro({ id: 'vale', paisagem: 'vale', nivel: 'recreativo', saidas: [criarSaida({ data: '2026-11-20' })] })
const catalogo = [serra, vale]

const ids = (resultado: ReturnType<typeof listarSaidas>) => resultado.map(({ roteiro, saida }) => `${roteiro.id}@${saida.data}`)

describe('listarSaidas', () => {
  it('junta as saídas de todos os roteiros, da mais próxima para a mais distante', () => {
    expect(ids(listarSaidas(catalogo))).toEqual(['vale@2026-11-20', 'serra@2026-12-05', 'serra@2027-01-10'])
  })
})

describe('mesesComSaida', () => {
  it('lista cada mês uma vez, em ordem', () => {
    expect(mesesComSaida(catalogo)).toEqual(['2026-11', '2026-12', '2027-01'])
  })
})

describe('filtrarSaidas', () => {
  it('sem filtros, devolve todas', () => {
    expect(filtrarSaidas(catalogo, filtrosVazios)).toHaveLength(3)
  })

  it('combina paisagem, nível e mês', () => {
    expect(ids(filtrarSaidas(catalogo, { ...filtrosVazios, paisagem: 'serra' }))).toEqual(['serra@2026-12-05', 'serra@2027-01-10'])
    expect(ids(filtrarSaidas(catalogo, { ...filtrosVazios, nivel: 'recreativo' }))).toEqual(['vale@2026-11-20'])
    expect(ids(filtrarSaidas(catalogo, { paisagem: 'serra', nivel: 'avancado', mes: '2027-01' }))).toEqual(['serra@2027-01-10'])
    expect(filtrarSaidas(catalogo, { ...filtrosVazios, paisagem: 'fe' })).toEqual([])
  })
})

describe('contarRoteiros', () => {
  it('conta roteiros diferentes, não saídas', () => {
    expect(contarRoteiros(catalogo, filtrosVazios)).toBe(2)
    expect(contarRoteiros(catalogo, { ...filtrosVazios, paisagem: 'serra' })).toBe(1)
  })
})
