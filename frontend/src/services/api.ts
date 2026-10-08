/** Endereço da API, sem barra no fim. Vazio quando o site roda só com os dados de exemplo. */
export const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') ?? ''

/** A API respondeu com erro. `detalhe` vem do Problem Details (RFC 9457) quando a API o envia. */
export class ErroApi extends Error {
  readonly status: number

  constructor(status: number, detalhe?: string) {
    super(detalhe ?? `A API respondeu com o status ${status}.`)
    this.name = 'ErroApi'
    this.status = status
  }
}

interface OpcoesRequisicao {
  metodo?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  corpo?: unknown
  /** Token do login do ADM, enviado como `Authorization: Bearer`. */
  token?: string
  sinal?: AbortSignal
}

/** Chama a API e devolve o JSON da resposta. Respostas sem corpo (204) devolvem `undefined`. */
export async function requisitar<T>(caminho: string, { metodo = 'GET', corpo, token, sinal }: OpcoesRequisicao = {}): Promise<T> {
  const cabecalhos: Record<string, string> = { Accept: 'application/json' }
  if (corpo !== undefined) cabecalhos['Content-Type'] = 'application/json'
  if (token) cabecalhos.Authorization = `Bearer ${token}`

  const resposta = await fetch(`${API_URL}${caminho}`, {
    method: metodo,
    headers: cabecalhos,
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
    signal: sinal,
  })
  if (!resposta.ok) {
    const problema = await resposta.json().catch(() => null)
    throw new ErroApi(resposta.status, problema?.detail)
  }
  if (resposta.status === 204) return undefined as T
  return resposta.json() as Promise<T>
}

export const buscarJson = <T>(caminho: string, sinal?: AbortSignal) => requisitar<T>(caminho, { sinal })
