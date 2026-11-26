// API pública do conteúdo institucional (página "Sobre nós"). Fora desta pasta, importe sempre daqui
// (`@/features/institucional`), nunca de um arquivo interno.

export type { FotoSobre, Marco, PaginaSobre } from './types'

export { paginaSobrePadrao } from './data/paginaSobrePadrao'
export { useSobre } from './hooks/useSobre'
export { paragrafos } from './utils/paragrafos'

/** Limites da página, iguais aos da API (veja PaginaSobre.java e a migration V4). */
export const LIMITES_SOBRE = { fotos: 8, marcos: 8 } as const
