import { useCallback, useEffect, useState, type DependencyList } from 'react'
import { mensagemDoErro } from '@/lib/api'

export type EstadoRecurso<T> = { situacao: 'carregando' } | { situacao: 'erro'; mensagem: string } | { situacao: 'pronto'; dados: T }

/** A última resposta e a busca a que ela pertence, para não mostrar a resposta de uma busca que já foi trocada. */
interface Resultado<T> {
  estado: EstadoRecurso<T>
  tentativa: number
  dependencias: DependencyList
}

const CARREGANDO = { situacao: 'carregando' } as const

/**
 * Carrega dados da API ao montar e quando `dependencias` mudam, cancelando a requisição anterior. `recarregar` busca
 * de novo; `substituir` troca os dados pelo que uma ação já devolveu, sem ir à API outra vez.
 */
export function useRecurso<T>(carregar: (sinal: AbortSignal) => Promise<T>, dependencias: DependencyList) {
  const [tentativa, setTentativa] = useState(0)
  const [resultado, setResultado] = useState<Resultado<T> | null>(null)

  useEffect(() => {
    const controle = new AbortController()
    const concluir = (estado: EstadoRecurso<T>) => {
      // Uma resposta que chega depois do cancelamento é de uma busca que já foi trocada por outra.
      if (!controle.signal.aborted) setResultado({ estado, tentativa, dependencias })
    }
    carregar(controle.signal).then(
      (dados) => concluir({ situacao: 'pronto', dados }),
      (erro: unknown) => concluir({ situacao: 'erro', mensagem: mensagemDoErro(erro, 'Não foi possível carregar.') }),
    )
    return () => controle.abort()
    // `carregar` muda a cada render; quem decide quando buscar de novo são as dependências informadas.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tentativa, ...dependencias])

  const recarregar = useCallback(() => setTentativa((t) => t + 1), [])
  const substituir = useCallback((dados: T) => setResultado((atual) => atual && { ...atual, estado: { situacao: 'pronto', dados } }), [])

  // Enquanto a busca atual não responde (inclusive logo depois de recarregar ou de mudar as dependências), carregando.
  const estado: EstadoRecurso<T> =
    resultado && resultado.tentativa === tentativa && mesmasDependencias(resultado.dependencias, dependencias)
      ? resultado.estado
      : CARREGANDO
  return { estado, recarregar, substituir }
}

function mesmasDependencias(a: DependencyList, b: DependencyList) {
  return a.length === b.length && a.every((valor, i) => Object.is(valor, b[i]))
}
