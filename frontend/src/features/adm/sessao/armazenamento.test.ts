// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { TokenEmitido } from '../types'
import { esquecerSessao, expirou, guardarSessao, lerSessaoGuardada, tempoAteExpirar } from './armazenamento'

const AGORA = new Date('2026-10-13T12:00:00Z').getTime()

const sessao = (expiraEm: string): TokenEmitido => ({
  tipo: 'Bearer',
  token: 'abc',
  expiraEm,
  administrador: { id: 1, nome: 'Ana', email: 'ana@exemplo.com' },
})

describe('armazenamento da sessão', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.useFakeTimers({ now: AGORA })
    return () => vi.useRealTimers()
  })

  it('guarda e lê a sessão da aba', () => {
    const valida = sessao('2026-10-13T20:00:00Z')
    guardarSessao(valida)
    expect(lerSessaoGuardada()).toEqual(valida)
    esquecerSessao()
    expect(lerSessaoGuardada()).toBeNull()
  })

  it('descarta uma sessão já expirada', () => {
    guardarSessao(sessao('2026-10-13T11:59:59Z'))
    expect(lerSessaoGuardada()).toBeNull()
  })

  it('descarta um valor corrompido em vez de quebrar a página', () => {
    sessionStorage.setItem('fb-adm-sessao', '{não é json')
    expect(lerSessaoGuardada()).toBeNull()
  })
})

describe('expiração', () => {
  it('considera expirada a partir do instante exato', () => {
    expect(expirou(sessao('2026-10-13T12:00:00Z'), AGORA)).toBe(true)
    expect(expirou(sessao('2026-10-13T12:00:01Z'), AGORA)).toBe(false)
  })

  it('limita a espera ao máximo que o setTimeout aceita e nunca fica negativa', () => {
    expect(tempoAteExpirar(sessao('2026-10-13T12:00:05Z'), AGORA)).toBe(5000)
    expect(tempoAteExpirar(sessao('2026-10-13T11:00:00Z'), AGORA)).toBe(0)
    expect(tempoAteExpirar(sessao('2030-01-01T00:00:00Z'), AGORA)).toBe(2 ** 31 - 1)
  })
})
