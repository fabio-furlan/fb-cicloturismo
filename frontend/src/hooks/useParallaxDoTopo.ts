import { useEffect, useRef } from 'react'

/**
 * Parallax do topo de uma página: grava em --progresso, na seção devolvida pela ref, quanto ela já saiu da tela (0 com
 * o topo inteiro à vista, 1 com ele fora). As classes .parallax-foto e .parallax-conteudo (global.css) usam esse valor
 * para mover a foto e o texto em ritmos diferentes. Vale para a seção que abre a página, no alto dela.
 */
export function useParallaxDoTopo<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const secao = ref.current
    if (!secao) return
    let quadro = 0
    const atualizar = () => {
      const progresso = Math.min(Math.max(window.scrollY / secao.offsetHeight, 0), 1)
      secao.style.setProperty('--progresso', progresso.toFixed(3))
    }
    const aoRolar = () => {
      cancelAnimationFrame(quadro)
      quadro = requestAnimationFrame(atualizar)
    }
    atualizar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => {
      cancelAnimationFrame(quadro)
      window.removeEventListener('scroll', aoRolar)
    }
  }, [])

  return ref
}
