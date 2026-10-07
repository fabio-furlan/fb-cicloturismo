import { useEffect } from 'react'

/** Impede a rolagem da página enquanto `ativo` for verdadeiro (ex.: menu mobile aberto). */
export function useTravarRolagem(ativo: boolean) {
  useEffect(() => {
    if (!ativo) return
    const overflowOriginal = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflowOriginal
    }
  }, [ativo])
}
