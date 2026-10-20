import { createContext, useContext } from 'react'
import type { ApiAdm } from '../api/apiAdm'
import type { TokenEmitido } from '../types'

/** Quem está logado no painel, como as telas mostram. */
export interface AdministradorLogado {
  nome: string
  email: string
}

/**
 * Como se entra no painel. `formulario`: e-mail e senha na própria tela, trocados por um token na API.
 * `keycloak`: a tela leva ao login do Keycloak, que devolve o ADM ao painel.
 */
export type Entrada =
  { tipo: 'formulario'; iniciar: (token: TokenEmitido) => void } | { tipo: 'keycloak'; irParaOLogin: (destino: string) => Promise<void> }

export interface SessaoAdm {
  /** Quem está logado; `null` fora do painel ou depois de sair. */
  administrador: AdministradorLogado | null
  /** Enquanto a sessão guardada é conferida, ao abrir a página. Ninguém deve ser mandado ao login antes disso. */
  carregando: boolean
  /** Chamadas da API com o token da sessão. Só existe com alguém logado. */
  api: ApiAdm | null
  /** Por que a última sessão terminou, para a tela de login explicar. */
  motivoDaSaida: string | null
  entrada: Entrada
  sair: (motivo?: string) => void
}

export const ContextoSessaoAdm = createContext<SessaoAdm | null>(null)

export function useSessaoAdm(): SessaoAdm {
  const sessao = useContext(ContextoSessaoAdm)
  if (!sessao) throw new Error('useSessaoAdm precisa estar dentro de <ProvedorSessaoAdm>.')
  return sessao
}

/** Atalho para as telas protegidas, onde a sessão sempre existe (o layout redireciona quem não está logado). */
export function useApiAdm(): ApiAdm {
  const { api } = useSessaoAdm()
  if (!api) throw new Error('useApiAdm só pode ser usado em telas protegidas.')
  return api
}
