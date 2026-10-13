import { describe, expect, it } from 'vitest'
import { niveis, nivelPara, ordemNiveis } from './niveis'

describe('nivelPara', () => {
  it('escolhe o nível mais leve em que o ritmo cabe', () => {
    expect(nivelPara(40, 400)).toBe('recreativo')
    expect(nivelPara(41, 400)).toBe('intermediario')
    expect(nivelPara(40, 401)).toBe('intermediario')
    expect(nivelPara(70, 1000)).toBe('intermediario')
  })

  it('acima de todos os limites, é avançado', () => {
    expect(nivelPara(71, 0)).toBe('avancado')
    expect(nivelPara(200, 5000)).toBe('avancado')
  })
})

describe('niveis', () => {
  it('estão em ordem crescente de dificuldade', () => {
    expect(ordemNiveis.map((n) => niveis[n].ordem)).toEqual([1, 2, 3])
  })
})
