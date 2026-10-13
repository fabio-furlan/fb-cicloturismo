import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { criarApiAdm } from '../api/apiAdm'
import type { TokenEmitido } from '../types'
import { esquecerSessao, guardarSessao, lerSessaoGuardada, tempoAteExpirar } from './armazenamento'
import { ContextoSessaoAdm, type SessaoAdm } from './contexto'

export function ProvedorSessaoAdm({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<TokenEmitido | null>(lerSessaoGuardada)
  const [motivoDaSaida, setMotivoDaSaida] = useState<string | null>(null)

  const sair = useCallback((motivo?: string) => {
    esquecerSessao()
    setSessao(null)
    setMotivoDaSaida(motivo ?? null)
  }, [])

  const iniciar = useCallback((token: TokenEmitido) => {
    guardarSessao(token)
    setSessao(token)
    setMotivoDaSaida(null)
  }, [])

  // Encerra a sessão no momento em que o token expira, mesmo com a página parada.
  useEffect(() => {
    if (!sessao) return
    const temporizador = setTimeout(() => sair('Sua sessão expirou. Entre de novo.'), tempoAteExpirar(sessao))
    return () => clearTimeout(temporizador)
  }, [sessao, sair])

  // O cliente da API só muda quando muda o token: as telas o usam como dependência para recarregar dados.
  const api = useMemo(() => (sessao ? criarApiAdm(sessao.token, () => sair('Sua sessão terminou. Entre de novo.')) : null), [sessao, sair])

  const valor = useMemo<SessaoAdm>(
    () => ({ administrador: sessao?.administrador ?? null, api, motivoDaSaida, iniciar, sair }),
    [sessao, api, motivoDaSaida, iniciar, sair],
  )

  return <ContextoSessaoAdm.Provider value={valor}>{children}</ContextoSessaoAdm.Provider>
}
