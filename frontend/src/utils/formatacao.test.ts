import { describe, expect, it } from 'vitest'
import {
  formatarData,
  formatarDataCompleta,
  formatarMesAno,
  formatarNumero,
  formatarPeriodo,
  formatarPreco,
  formatarPrecoExato,
  lerNumero,
} from './formatacao'

// O Intl separa "R$" do valor com um espaço não separável; nos testes, qualquer espaço vale.
const comEspacoComum = (texto: string) => texto.replace(/\s/g, ' ')

describe('formatação de números e preços', () => {
  it('separa os milhares com ponto', () => {
    expect(formatarNumero(4380)).toBe('4.380')
  })

  it('mostra o preço do site sem centavos', () => {
    expect(comEspacoComum(formatarPreco(3890))).toBe('R$ 3.890')
    expect(comEspacoComum(formatarPreco(3890.6))).toBe('R$ 3.891')
  })

  it('mostra o preço do painel com centavos', () => {
    expect(comEspacoComum(formatarPrecoExato(1490))).toBe('R$ 1.490,00')
  })

  it('lê números digitados com vírgula ou ponto', () => {
    expect(lerNumero('1490,5')).toBe(1490.5)
    expect(lerNumero('1490.5')).toBe(1490.5)
    expect(lerNumero('')).toBe(0)
  })
})

describe('formatação de datas', () => {
  it('lê a data em UTC, sem voltar um dia em fusos a oeste de Greenwich', () => {
    expect(formatarData('2026-11-14')).toBe('14 de nov.')
    expect(formatarDataCompleta('2026-01-01')).toBe('01/01/2026')
  })

  it('escreve o mês por extenso a partir de AAAA-MM ou de uma data completa', () => {
    expect(formatarMesAno('2026-11')).toBe('novembro de 2026')
    expect(formatarMesAno('2026-11-14')).toBe('novembro de 2026')
  })

  it('resume um período e mostra uma data só quando começa e termina no mesmo dia', () => {
    expect(formatarPeriodo('2026-12-12', '2026-12-14')).toBe('12/12 a 14/12/2026')
    expect(formatarPeriodo('2026-12-12', '2026-12-12')).toBe('12/12/2026')
  })
})
