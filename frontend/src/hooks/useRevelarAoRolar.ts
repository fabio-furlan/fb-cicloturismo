import { type CSSProperties, useEffect } from 'react'

/** Marca um elemento para surgir ao entrar na tela, `atraso` milissegundos depois dos anteriores da mesma divisão. */
export function revelar(atraso = 0) {
  return { 'data-revelar': '', style: { '--atraso': `${atraso}ms` } as CSSProperties }
}

// O elemento surge quando a borda de cima passa deste ponto da tela (94% da altura, logo acima do pé).
const LIMITE_DA_TELA = 0.94

/**
 * Faz os elementos marcados com `revelar()` surgirem quando chegam à tela (estilos [data-revelar] em global.css).
 * Cada um aparece uma vez só. Revela também o que já ficou para cima: um salto de rolagem (link para outra
 * divisão, por exemplo) pode passar por um elemento sem que ele chegue a estar na tela.
 * Elementos que surgem depois (parte da página recriada ao filtrar) também são vistos. `ativo` espera o conteúdo carregar.
 */
export function useRevelarAoRolar(ativo = true) {
  useEffect(() => {
    if (!ativo) return
    let quadro = 0
    const verificar = () => {
      const limite = window.innerHeight * LIMITE_DA_TELA
      document.querySelectorAll('[data-revelar]:not([data-revelado])').forEach((elemento) => {
        // Atributo, e não classe: o React reescreve o className ao redesenhar e apagaria a marcação.
        if (elemento.getBoundingClientRect().top < limite) elemento.setAttribute('data-revelado', '')
      })
    }
    const agendar = () => {
      cancelAnimationFrame(quadro)
      quadro = requestAnimationFrame(verificar)
    }

    verificar()
    window.addEventListener('scroll', agendar, { passive: true })
    window.addEventListener('resize', agendar)
    const vigia = new MutationObserver(agendar)
    vigia.observe(document.body, { childList: true, subtree: true })
    return () => {
      cancelAnimationFrame(quadro)
      vigia.disconnect()
      window.removeEventListener('scroll', agendar)
      window.removeEventListener('resize', agendar)
    }
  }, [ativo])
}
