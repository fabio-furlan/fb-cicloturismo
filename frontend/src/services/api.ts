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

export async function buscarJson<T>(caminho: string, sinal?: AbortSignal): Promise<T> {
  const resposta = await fetch(`${API_URL}${caminho}`, { headers: { Accept: 'application/json' }, signal: sinal })
  if (!resposta.ok) {
    const problema = await resposta.json().catch(() => null)
    throw new ErroApi(resposta.status, problema?.detail)
  }
  return resposta.json() as Promise<T>
}
