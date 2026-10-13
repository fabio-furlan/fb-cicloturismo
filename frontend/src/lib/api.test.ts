import { afterEach, describe, expect, it, vi } from 'vitest'
import { ErroApi, mensagemDoErro, requisitar } from './api'

const respostaJson = (status: number, corpo?: unknown) =>
  new Response(corpo === undefined ? null : JSON.stringify(corpo), { status, headers: { 'Content-Type': 'application/json' } })

function simularFetch(resposta: Response) {
  const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValue(resposta)
  vi.stubGlobal('fetch', fetch)
  return fetch
}

describe('requisitar', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('envia o corpo em JSON e o token do ADM', async () => {
    const fetch = simularFetch(respostaJson(200, { ok: true }))
    await expect(requisitar('/api/adm/roteiros', { metodo: 'POST', corpo: { titulo: 'Novo' }, token: 'abc' })).resolves.toEqual({
      ok: true,
    })

    const [endereco, opcoes] = fetch.mock.calls[0]
    expect(endereco).toBe('/api/adm/roteiros')
    expect(opcoes).toMatchObject({
      method: 'POST',
      body: '{"titulo":"Novo"}',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer abc' },
    })
  })

  it('não manda Content-Type nem token quando não há corpo nem sessão', async () => {
    const fetch = simularFetch(respostaJson(200, []))
    await requisitar('/api/roteiros')
    expect(fetch.mock.calls[0][1]?.headers).toEqual({ Accept: 'application/json' })
  })

  it('devolve undefined numa resposta sem corpo (204)', async () => {
    simularFetch(new Response(null, { status: 204 }))
    await expect(requisitar('/api/adm/saidas/1', { metodo: 'DELETE' })).resolves.toBeUndefined()
  })

  it('usa a explicação do Problem Details no erro', async () => {
    simularFetch(respostaJson(422, { detail: 'A data de fim é antes do início.' }))
    const erro = await requisitar('/api/adm/saidas', { metodo: 'POST', corpo: {} }).catch((e: unknown) => e)
    expect(erro).toBeInstanceOf(ErroApi)
    expect(erro).toMatchObject({ status: 422, message: 'A data de fim é antes do início.' })
  })

  it('sem explicação da API, informa o status', async () => {
    simularFetch(new Response('erro interno', { status: 500 }))
    await expect(requisitar('/api/roteiros')).rejects.toThrow('A API respondeu com o status 500.')
  })
})

describe('mensagemDoErro', () => {
  it('mostra a mensagem do erro ou, sem ela, o texto padrão', () => {
    expect(mensagemDoErro(new ErroApi(409, 'Já existe.'), 'Falhou.')).toBe('Já existe.')
    expect(mensagemDoErro('qualquer coisa', 'Falhou.')).toBe('Falhou.')
  })
})
