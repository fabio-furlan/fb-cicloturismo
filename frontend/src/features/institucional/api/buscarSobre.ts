import { API_URL, buscarJson } from '@/lib/api'
import { paginaSobrePadrao } from '../data/paginaSobrePadrao'
import type { PaginaSobre } from '../types'

/** A página "Sobre nós" salva pelo ADM. Sem VITE_API_URL, ou enquanto nada foi salvo (204), devolve o texto padrão. */
export async function buscarSobre(sinal?: AbortSignal): Promise<PaginaSobre> {
  if (!API_URL) return paginaSobrePadrao
  return (await buscarJson<PaginaSobre | undefined>('/api/sobre', sinal)) ?? paginaSobrePadrao
}
