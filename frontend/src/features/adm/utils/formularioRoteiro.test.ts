import { describe, expect, it } from 'vitest'
import type { DadosRoteiro } from '../types'
import {
  distanciaTotal,
  lerAltitudes,
  novaEtapa,
  paraDadosRoteiro,
  paraEstado,
  proximoDia,
  subidaDoPerfil,
  validar,
} from './formularioRoteiro'

const roteiro: DadosRoteiro = {
  titulo: 'Serra do Rio do Rastro',
  regiao: 'Lauro Müller, Santa Catarina',
  descricao: 'A estrada mais famosa do Sul.',
  modalidade: 'SPEED',
  destino: 'NACIONAL',
  nivel: 'AVANCADO',
  paisagem: 'SERRA',
  dias: 3,
  subidaTotalM: 2100,
  altitudes: [300, 900, 1400],
  etapas: [
    { dia: 1, titulo: 'Subida da serra', distanciaKm: 62.5, subidaM: 1500 },
    { dia: 2, titulo: 'Campos de cima', distanciaKm: 48, subidaM: null },
  ],
  imagens: [{ tipo: 'BANNER', url: '/rastro.jpg', descricao: 'Curvas da serra', autor: null, origem: null }],
}

describe('paraEstado e paraDadosRoteiro', () => {
  it('um roteiro sai do formulário sem mudanças quando nada é editado', () => {
    const estado = paraEstado(roteiro)
    expect(paraDadosRoteiro(estado, lerAltitudes(estado.altitudes).valores)).toEqual(roteiro)
  })

  it('um roteiro novo começa com uma etapa no dia 1', () => {
    const estado = paraEstado()
    expect(estado.etapas).toHaveLength(1)
    expect(estado.etapas[0]).toMatchObject({ dia: '1', titulo: '' })
  })

  it('apara os textos e transforma campos vazios opcionais em null', () => {
    const estado = paraEstado(roteiro)
    estado.titulo = '  Rio do Rastro  '
    estado.imagens[0] = { ...estado.imagens[0], autor: '   ', origem: ' https://exemplo.com ' }
    const dados = paraDadosRoteiro(estado, roteiro.altitudes)
    expect(dados.titulo).toBe('Rio do Rastro')
    expect(dados.imagens[0]).toMatchObject({ autor: null, origem: 'https://exemplo.com' })
  })

  it('cada item da lista tem uma chave diferente', () => {
    const chaves = paraEstado(roteiro).etapas.map((e) => e.chave)
    expect(new Set(chaves).size).toBe(chaves.length)
  })
})

describe('lerAltitudes', () => {
  it('aceita vírgula, ponto e vírgula, espaço e quebra de linha como separador', () => {
    expect(lerAltitudes('792, 793;795\n798  801')).toEqual({ valores: [792, 793, 795, 798, 801], invalidas: [] })
  })

  it('aponta o que não é número inteiro e não devolve valores pela metade', () => {
    expect(lerAltitudes('792, 12.5, abc, -3')).toEqual({ valores: [], invalidas: ['12.5', 'abc'] })
  })
})

describe('cálculos do formulário', () => {
  it('soma só as subidas do perfil', () => {
    expect(subidaDoPerfil([100, 300, 200, 400])).toBe(400)
  })

  it('soma a distância das etapas e ignora as que ainda estão em branco', () => {
    expect(distanciaTotal([{ ...novaEtapa(1), distanciaKm: '62,5' }, novaEtapa(2)])).toBe(62.5)
  })

  it('sugere o dia seguinte ao da última etapa', () => {
    expect(proximoDia([{ ...novaEtapa(1) }, { ...novaEtapa(3) }])).toBe(4)
    expect(proximoDia([])).toBe(1)
  })
})

describe('validar', () => {
  it('aceita um roteiro completo', () => {
    const estado = paraEstado(roteiro)
    expect(validar(estado, lerAltitudes(estado.altitudes))).toBeNull()
  })

  it('explica o primeiro problema encontrado', () => {
    const estado = paraEstado(roteiro)
    expect(validar(estado, lerAltitudes('100, x'))).toMatch(/não são números inteiros: x/)
    expect(validar(estado, lerAltitudes('100'))).toMatch(/pelo menos 2 altitudes/)
    expect(validar({ ...estado, etapas: [] }, lerAltitudes('100, 200'))).toMatch(/pelo menos uma etapa/)
  })
})
