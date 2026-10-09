import { useEffect, useRef, useState } from 'react'
import { Container } from '@/components/ui/Container'
import type { Roteiro } from '@/types/roteiro'
import { formatarNumero } from '@/utils/formatacao'

const DURACAO_CONTAGEM_MS = 1400

const movimentoReduzido = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Fração da contagem (de 0 a 1) que avança quando a faixa aparece na tela, desacelerando no fim. */
function useContagem() {
  const ref = useRef<HTMLElement>(null)
  // Com movimento reduzido, os números já aparecem prontos.
  const [fracao, setFracao] = useState(() => (movimentoReduzido() ? 1 : 0))

  useEffect(() => {
    const elemento = ref.current
    if (!elemento || movimentoReduzido()) return
    let quadro = 0
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return
        observador.disconnect()
        const inicio = performance.now()
        const avancar = (agora: number) => {
          // O primeiro quadro pode ter um horário um pouco anterior ao início: sem o limite de baixo, a conta daria negativo.
          const t = Math.min(Math.max((agora - inicio) / DURACAO_CONTAGEM_MS, 0), 1)
          setFracao(1 - (1 - t) ** 3)
          if (t < 1) quadro = requestAnimationFrame(avancar)
        }
        quadro = requestAnimationFrame(avancar)
      },
      { threshold: 0.6 },
    )
    observador.observe(elemento)
    return () => {
      observador.disconnect()
      cancelAnimationFrame(quadro)
    }
  }, [])

  return { ref, fracao }
}

/**
 * Faixa vermelha fina com os números do catálogo, calculados a partir dos roteiros abertos.
 * Fica numa linha só, para aparecer na tela junto com o título e os cartões das saídas.
 * Os números contam de zero até o valor quando a faixa aparece.
 */
export function SecaoNumeros({ roteiros }: { roteiros: Roteiro[] }) {
  const { ref, fracao } = useContagem()
  const km = roteiros.reduce((soma, r) => soma + r.distanciaKm, 0)
  const saidas = roteiros.reduce((soma, r) => soma + r.saidas.length, 0)
  const contar = (valor: number) => formatarNumero(Math.round(valor * fracao))

  const numeros = [
    { valor: contar(roteiros.length), rotulo: roteiros.length === 1 ? 'Roteiro' : 'Roteiros' },
    { valor: `${contar(km)} km`, rotulo: 'De pedal' },
    { valor: contar(saidas), rotulo: saidas === 1 ? 'Saída aberta' : 'Saídas abertas' },
    { valor: contar(12), rotulo: 'Ciclistas por grupo' },
  ]

  return (
    <section ref={ref} className="bg-gradient-to-r from-vermelho-500 to-vermelho-700 py-1.5" aria-label="Números das viagens">
      <Container>
        <dl className="grid grid-cols-4 items-center gap-1 sm:flex sm:justify-center sm:gap-x-8 lg:gap-x-14">
          {numeros.map(({ valor, rotulo }) => (
            <div key={rotulo} className="flex flex-col-reverse items-center text-center sm:flex-row-reverse sm:items-baseline sm:gap-1.5">
              <dt className="font-display text-[0.5rem] font-bold uppercase leading-none tracking-[0.08em] text-white/85 sm:text-[0.62rem] sm:tracking-[0.1em]">
                {rotulo}
              </dt>
              <dd className="mb-0.5 font-display text-sm font-black tabular-nums leading-none text-sol-500 sm:mb-0 sm:text-lg">{valor}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
