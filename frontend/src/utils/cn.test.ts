import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('junta as classes na ordem em que vêm', () => {
    expect(cn('flex items-center', 'mt-8')).toBe('flex items-center mt-8')
  })

  it('ignora condições falsas e valores vazios', () => {
    const ativo = false
    expect(cn('base', ativo && 'ativa', undefined, null, '', 'fim')).toBe('base fim')
  })

  it('aceita objetos de condições', () => {
    expect(cn('base', { ativa: true, desativada: false })).toBe('base ativa')
  })
})
