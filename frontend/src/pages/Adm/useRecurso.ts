import { type DependencyList, useCallback, useEffect, useState } from 'react'

export type EstadoRecurso<T> =
  | { situacao: 'carregando' }
  | { situacao: 'erro'; mensagem: string }
  | { situacao: 'pronto'; dados: T }

/**
 * Carrega dados da API ao montar e quando `dependencias` mudam, cancelando a requisição anterior. `recarregar` busca
 * de novo; `substituir` troca os dados pelo que uma ação já devolveu, sem ir à API outra vez.
 */
export function useRecurso<T>(carregar: (sinal: AbortSignal) => Promise<T>, dependencias: DependencyList) {
  const [tentativa, setTentativa] = useState(0)
  const [estado, setEstado] = useState<EstadoRecurso<T> & { tentativa: number; chave: DependencyList }>({
    situacao: 'carregando',
    tentativa: -1,
    chave: [],
  })

  useEffect(() => {
    const controle = new AbortController()
    carregar(controle.signal)
      .then((dados) => setEstado({ situacao: 'pronto', dados, tentativa, chave: dependencias }))
      .catch((erro: unknown) => {
        if (controle.signal.aborted) return
        const mensagem = erro instanceof Error ? erro.message : 'Não foi possível carregar.'
        setEstado({ situacao: 'erro', mensagem, tentativa, chave: dependencias })
      })
    return () => controle.abort()
    // `carregar` muda a cada render; quem decide quando buscar de novo são as dependências informadas.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tentativa, ...dependencias])

  const recarregar = useCallback(() => setTentativa((t) => t + 1), [])
  const substituir = useCallback((dados: T) => setEstado((atual) => ({ ...atual, situacao: 'pronto', dados })), [])

  const atual =
    estado.tentativa === tentativa && mesmasDependencias(estado.chave, dependencias)
      ? (estado as EstadoRecurso<T>)
      : ({ situacao: 'carregando' } as const)
  return { estado: atual, recarregar, substituir }
}

function mesmasDependencias(a: DependencyList, b: DependencyList) {
  return a.length === b.length && a.every((valor, i) => Object.is(valor, b[i]))
}
