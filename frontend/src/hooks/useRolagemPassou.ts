import { useEffect, useState } from 'react'

/** Retorna `true` quando a página foi rolada além de `limite` pixels. */
export function useRolagemPassou(limite = 40) {
  const [passou, setPassou] = useState(false)

  useEffect(() => {
    const verificar = () => setPassou(window.scrollY > limite)
    verificar()
    window.addEventListener('scroll', verificar, { passive: true })
    return () => window.removeEventListener('scroll', verificar)
  }, [limite])

  return passou
}
