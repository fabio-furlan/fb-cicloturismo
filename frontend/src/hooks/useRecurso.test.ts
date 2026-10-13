// @vitest-environment jsdom
import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useRecurso } from './useRecurso'

/** Uma promessa que o teste resolve ou rejeita quando quiser. */
function adiada<T>() {
  let resolver!: (valor: T) => void
  let rejeitar!: (erro: unknown) => void
  const promessa = new Promise<T>((ok, falha) => {
    resolver = ok
    rejeitar = falha
  })
  return { promessa, resolver, rejeitar }
}

describe('useRecurso', () => {
  it('começa carregando e mostra os dados quando chegam', async () => {
    const { result } = renderHook(() => useRecurso(async () => ['vale-europeu'], []))
    expect(result.current.estado).toEqual({ situacao: 'carregando' })
    await waitFor(() => expect(result.current.estado).toEqual({ situacao: 'pronto', dados: ['vale-europeu'] }))
  })

  it('mostra a mensagem do erro e tenta de novo com recarregar', async () => {
    const carregar = vi
      .fn<(sinal: AbortSignal) => Promise<string>>()
      .mockRejectedValueOnce(new Error('Sem conexão.'))
      .mockResolvedValue('ok')
    const { result } = renderHook(() => useRecurso(carregar, []))
    await waitFor(() => expect(result.current.estado).toEqual({ situacao: 'erro', mensagem: 'Sem conexão.' }))

    act(() => result.current.recarregar())
    expect(result.current.estado.situacao).toBe('carregando')
    await waitFor(() => expect(result.current.estado).toEqual({ situacao: 'pronto', dados: 'ok' }))
    expect(carregar).toHaveBeenCalledTimes(2)
  })

  it('ao mudar as dependências, cancela a requisição anterior e não mostra a resposta dela', async () => {
    const primeira = adiada<string>()
    const sinais: AbortSignal[] = []
    const carregar = (id: number) => (sinal: AbortSignal) => {
      sinais.push(sinal)
      return id === 1 ? primeira.promessa : Promise.resolve('dois')
    }
    const { result, rerender } = renderHook(({ id }) => useRecurso(carregar(id), [id]), { initialProps: { id: 1 } })

    rerender({ id: 2 })
    expect(sinais[0].aborted).toBe(true)
    await waitFor(() => expect(result.current.estado).toEqual({ situacao: 'pronto', dados: 'dois' }))

    await act(async () => primeira.resolver('um'))
    expect(result.current.estado).toEqual({ situacao: 'pronto', dados: 'dois' })
  })

  it('substitui os dados pelo que uma ação devolveu, sem buscar de novo', async () => {
    const carregar = vi.fn<() => Promise<{ vagas: number }>>(async () => ({ vagas: 10 }))
    const { result } = renderHook(() => useRecurso(carregar, []))
    await waitFor(() => expect(result.current.estado.situacao).toBe('pronto'))

    act(() => result.current.substituir({ vagas: 9 }))
    expect(result.current.estado).toEqual({ situacao: 'pronto', dados: { vagas: 9 } })
    expect(carregar).toHaveBeenCalledTimes(1)
  })
})
