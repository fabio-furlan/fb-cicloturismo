import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Ao trocar de página, a nova abre no topo (e não na altura em que a anterior estava rolada). */
export function useTopoAoTrocarDePagina() {
  const { pathname } = useLocation()
  useEffect(() => {
    // "instant": sem a rolagem suave do site, a página nova já aparece no topo.
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
}

/**
 * Para links do menu e do rodapé: clicar no link da página em que a pessoa já está não troca de página,
 * então a rolagem volta suavemente ao topo.
 */
export function useVoltarAoTopoNaMesmaPagina() {
  const { pathname } = useLocation()
  return (rota: string) => () => {
    if (rota === pathname) window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
