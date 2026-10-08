import { createContext, useContext } from 'react'
import type { ApiAdm } from '@/services/adm'
import type { Administrador, TokenEmitido } from '@/types/adm'

export interface SessaoAdm {
  /** Quem está logado; `null` fora do painel ou depois de sair. */
  administrador: Administrador | null
  /** Chamadas da API com o token da sessão. Só existe com alguém logado. */
  api: ApiAdm | null
  /** Por que a última sessão terminou, para a tela de login explicar. */
  motivoDaSaida: string | null
  iniciar: (token: TokenEmitido) => void
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
