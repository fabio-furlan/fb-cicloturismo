import { describe, expect, it } from 'vitest'
import { roteirosExemplo } from './roteirosExemplo'

// Os dados de exemplo aparecem no site quando ele roda sem a API: precisam respeitar as mesmas regras que a API garante.
describe.each(roteirosExemplo.map((roteiro) => [roteiro.id, roteiro] as const))('roteiro de exemplo %s', (_, roteiro) => {
  it('tem a distância total igual à soma das etapas', () => {
    const soma = roteiro.etapas.reduce((total, etapa) => total + etapa.distanciaKm, 0)
    expect(roteiro.distanciaKm).toBeCloseTo(soma, 1)
  })

  it('tem etapas em dias da viagem, sem repetir dia', () => {
    const dias = roteiro.etapas.map((etapa) => etapa.dia)
    expect(new Set(dias).size).toBe(dias.length)
    expect(Math.max(...dias)).toBeLessThanOrEqual(roteiro.dias)
  })

  it('tem pelo menos uma saída, em ordem de data, e o "a partir de" é o menor preço', () => {
    expect(roteiro.saidas.length).toBeGreaterThan(0)
    const datas = roteiro.saidas.map((saida) => saida.data)
    expect(datas).toEqual([...datas].sort())
    expect(roteiro.precoReais).toBe(Math.min(...roteiro.saidas.map((saida) => saida.precoReais)))
  })

  it('tem pelo menos dois pontos de altitude para o perfil', () => {
    expect(roteiro.altitudes.length).toBeGreaterThanOrEqual(2)
  })
})
