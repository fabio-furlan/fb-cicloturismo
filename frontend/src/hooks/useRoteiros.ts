import { useCallback, useEffect, useState } from 'react'
import { buscarRoteiros } from '@/services/roteiros'
import type { Roteiro } from '@/types/roteiro'

export type EstadoRoteiros =
  | { situacao: 'carregando' }
  | { situacao: 'erro'; tentarDeNovo: () => void }
  | { situacao: 'pronto'; roteiros: Roteiro[] }

/** Carrega o catálogo de roteiros uma vez, ao montar. Cancela a requisição se o componente sair da tela antes. */
export function useRoteiros(): EstadoRoteiros {
  const [tentativa, setTentativa] = useState(0)
  const [resultado, setResultado] = useState<{ tentativa: number; roteiros?: Roteiro[]; falhou?: boolean }>({ tentativa: -1 })
  const tentarDeNovo = useCallback(() => setTentativa((t) => t + 1), [])

  useEffect(() => {
    const controle = new AbortController()
    buscarRoteiros(controle.signal)
      .then((roteiros) => setResultado({ tentativa, roteiros }))
      .catch((erro: unknown) => {
        if (controle.signal.aborted) return
        console.error('Não foi possível carregar os roteiros.', erro)
        setResultado({ tentativa, falhou: true })
      })
    return () => controle.abort()
  }, [tentativa])

  // Enquanto a tentativa atual não responde, o estado é "carregando", inclusive depois de clicar em tentar de novo.
  if (resultado.tentativa !== tentativa) return { situacao: 'carregando' }
  if (resultado.falhou || !resultado.roteiros) return { situacao: 'erro', tentarDeNovo }
  return { situacao: 'pronto', roteiros: resultado.roteiros }
}
