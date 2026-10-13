import type { TokenEmitido } from '../types'

// O token fica no sessionStorage: sobrevive a um F5, mas some ao fechar a aba. Num computador compartilhado, fechar o
// navegador já encerra a sessão. A expiração é conferida aqui e de novo pela API em cada chamada.
const CHAVE = 'fb-adm-sessao'

export const expirou = (sessao: TokenEmitido, agora = Date.now()) => new Date(sessao.expiraEm).getTime() <= agora

/** A sessão guardada nesta aba, se ainda valer. */
export function lerSessaoGuardada(): TokenEmitido | null {
  try {
    const guardada = sessionStorage.getItem(CHAVE)
    if (!guardada) return null
    const sessao = JSON.parse(guardada) as TokenEmitido
    return expirou(sessao) ? null : sessao
  } catch {
    return null
  }
}

export function guardarSessao(sessao: TokenEmitido) {
  try {
    sessionStorage.setItem(CHAVE, JSON.stringify(sessao))
  } catch {
    // Sem acesso ao armazenamento, a sessão continua valendo enquanto a página estiver aberta.
  }
}

export function esquecerSessao() {
  try {
    sessionStorage.removeItem(CHAVE)
  } catch {
    // Sem acesso ao armazenamento, basta esquecer a sessão em memória.
  }
}

// O setTimeout aceita no máximo ~24 dias; um token mais longo é conferido de novo no próximo carregamento.
const ESPERA_MAXIMA_MS = 2 ** 31 - 1

/** Milissegundos até a sessão expirar, no limite que o `setTimeout` aceita. */
export const tempoAteExpirar = (sessao: TokenEmitido, agora = Date.now()) =>
  Math.min(Math.max(new Date(sessao.expiraEm).getTime() - agora, 0), ESPERA_MAXIMA_MS)
