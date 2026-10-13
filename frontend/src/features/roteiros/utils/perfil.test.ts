import { describe, expect, it } from 'vitest'
import { criarRoteiro } from '@/test/fabricas'
import { descreverDuracao, detalharRota, faixaDaInclinacao, limitesDasEtapas } from './perfil'

describe('detalharRota', () => {
  // 100 km em 5 pontos: um a cada 25 km. As altitudes sobem 400 m no total; o roteiro declara 1.200 m.
  const pontos = detalharRota(criarRoteiro())

  it('distribui os pontos em intervalos iguais do início ao fim', () => {
    expect(pontos.map((p) => p.km)).toEqual([0, 25, 50, 75, 100])
  })

  it('calcula a inclinação do trecho seguinte e repete a do anterior no último ponto', () => {
    expect(pontos.map((p) => p.inclinacao)).toEqual([0.8, -0.4, 0.8, -1.2, -1.2])
  })

  it('ajusta a subida acumulada para fechar na subida total do roteiro', () => {
    expect(pontos.map((p) => p.subidaAcumulada)).toEqual([0, 600, 600, 1200, 1200])
    expect(pontos.at(-1)?.subidaAcumulada).toBe(criarRoteiro().subidaTotalM)
  })

  it('marca cada ponto com o dia de pedal em que ele está', () => {
    expect(pontos.map((p) => p.dia)).toEqual([1, 1, 1, 2, 2])
  })
})

describe('faixaDaInclinacao', () => {
  it.each([
    [-5, 'descida'],
    [-1, 'leve'],
    [2.9, 'leve'],
    [3, 'moderada'],
    [6, 'forte'],
    [9, 'muito-forte'],
  ])('%s%% fica na faixa %s', (inclinacao, faixa) => {
    expect(faixaDaInclinacao(inclinacao)).toBe(faixa)
  })
})

describe('limitesDasEtapas', () => {
  it('acumula a distância de cada etapa desde a largada', () => {
    expect(limitesDasEtapas(criarRoteiro())).toEqual([50, 100])
  })
})

describe('descreverDuracao', () => {
  it('usa o singular para um dia', () => {
    expect(descreverDuracao(criarRoteiro({ dias: 1, etapas: [{ dia: 1, titulo: 'Volta', distanciaKm: 40 }] }))).toBe('1 dia')
  })

  it('avisa quando há dias sem pedal', () => {
    expect(descreverDuracao(criarRoteiro())).toBe('2 dias')
    expect(descreverDuracao(criarRoteiro({ dias: 3 }))).toBe('3 dias, 2 de pedal')
  })
})
