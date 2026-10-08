import { roteirosExemplo } from '@/data/roteirosExemplo'
import type { Roteiro } from '@/types/roteiro'
import { paraRoteiro, type RoteiroApi } from './adaptadorRoteiro'
import { API_URL, buscarJson } from './api'

/** Roteiros com saídas abertas, pela saída mais próxima. Sem VITE_API_URL, devolve os dados de exemplo. */
export async function buscarRoteiros(sinal?: AbortSignal): Promise<Roteiro[]> {
  if (!API_URL) return roteirosExemplo
  const roteiros = await buscarJson<RoteiroApi[]>('/api/roteiros', sinal)
  return roteiros.map(paraRoteiro).filter((roteiro): roteiro is Roteiro => roteiro !== null)
}
