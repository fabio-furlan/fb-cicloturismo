import { ErroAoCarregar } from '@/components/feedback/ErroAoCarregar'

/** Falha ao carregar os roteiros, nas páginas que dependem do catálogo (início e roteiros). */
export function ErroNoCatalogo({ aoTentarDeNovo }: { aoTentarDeNovo: () => void }) {
  return <ErroAoCarregar titulo="Não foi possível carregar as viagens" aoTentarDeNovo={aoTentarDeNovo} />
}
