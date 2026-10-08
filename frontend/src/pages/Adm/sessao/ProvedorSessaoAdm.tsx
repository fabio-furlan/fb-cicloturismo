import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { criarApiAdm } from '@/services/adm'
import type { TokenEmitido } from '@/types/adm'
import { ContextoSessaoAdm, type SessaoAdm } from './contexto'

// O token fica no sessionStorage: sobrevive a um F5, mas some ao fechar a aba. Num computador compartilhado, fechar o
// navegador já encerra a sessão. A expiração é conferida aqui e de novo pela API em cada chamada.
const CHAVE = 'fb-adm-sessao'

function lerSessaoGuardada(): TokenEmitido | null {
  try {
    const guardada = sessionStorage.getItem(CHAVE)
    if (!guardada) return null
    const sessao = JSON.parse(guardada) as TokenEmitido
    return new Date(sessao.expiraEm).getTime() > Date.now() ? sessao : null
  } catch {
    return null
  }
}

export function ProvedorSessaoAdm({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<TokenEmitido | null>(lerSessaoGuardada)
  const [motivoDaSaida, setMotivoDaSaida] = useState<string | null>(null)

  const sair = useCallback((motivo?: string) => {
    try {
      sessionStorage.removeItem(CHAVE)
    } catch {
      // Sem acesso ao armazenamento, basta esquecer a sessão em memória.
    }
    setSessao(null)
    setMotivoDaSaida(motivo ?? null)
  }, [])

  const iniciar = useCallback((token: TokenEmitido) => {
    try {
      sessionStorage.setItem(CHAVE, JSON.stringify(token))
    } catch {
      // A sessão continua valendo enquanto a página estiver aberta.
    }
    setSessao(token)
    setMotivoDaSaida(null)
  }, [])

  // Encerra a sessão no momento em que o token expira, mesmo com a página parada.
  useEffect(() => {
    if (!sessao) return
    const restante = new Date(sessao.expiraEm).getTime() - Date.now()
    // O setTimeout aceita no máximo ~24 dias; um token mais longo seria conferido de novo no próximo carregamento.
    const espera = Math.min(Math.max(restante, 0), 2 ** 31 - 1)
    const temporizador = setTimeout(() => sair('Sua sessão expirou. Entre de novo.'), espera)
    return () => clearTimeout(temporizador)
  }, [sessao, sair])

  // O cliente da API só muda quando muda o token: as telas o usam como dependência para recarregar dados.
  const api = useMemo(
    () => (sessao ? criarApiAdm(sessao.token, () => sair('Sua sessão terminou. Entre de novo.')) : null),
    [sessao, sair],
  )

  const valor = useMemo<SessaoAdm>(
    () => ({ administrador: sessao?.administrador ?? null, api, motivoDaSaida, iniciar, sair }),
    [sessao, api, motivoDaSaida, iniciar, sair],
  )

  return <ContextoSessaoAdm.Provider value={valor}>{children}</ContextoSessaoAdm.Provider>
}
