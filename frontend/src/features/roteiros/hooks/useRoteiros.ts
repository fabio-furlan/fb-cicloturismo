import { useRecurso } from '@/hooks/useRecurso'
import { buscarRoteiros } from '../api/buscarRoteiros'

async function carregarCatalogo(sinal: AbortSignal) {
  try {
    return await buscarRoteiros(sinal)
  } catch (erro) {
    if (!sinal.aborted) console.error('Não foi possível carregar os roteiros.', erro)
    throw erro
  }
}

/** O catálogo de roteiros, carregado uma vez ao montar. `recarregar` tenta de novo depois de uma falha. */
export const useRoteiros = () => useRecurso(carregarCatalogo, [])
