import { useEffect } from 'react'

/** Troca o título da aba enquanto o componente estiver na tela, e devolve o anterior ao sair. */
export function useTituloDaPagina(titulo: string) {
  useEffect(() => {
    const anterior = document.title
    document.title = titulo
    return () => {
      document.title = anterior
    }
  }, [titulo])
}
