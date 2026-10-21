import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { IconeSeta } from '@/components/icones'
import { cn } from '@/utils/cn'

export interface OpcaoLista<T extends string> {
  valor: T
  rotulo: string
  desativada?: boolean
}

interface ListaSuspensaProps<T extends string> {
  id: string
  valor: T
  opcoes: OpcaoLista<T>[]
  aoMudar: (valor: T) => void
}

// Altura máxima da lista aberta e o mínimo que precisa caber em cima para ela abrir para cima.
const ALTURA_MAX = 288
const ALTURA_MIN = 180
// Distância entre o campo e a lista, mais uma folga até a borda.
const MARGEM = 20

/**
 * Lista de opções da busca do topo, no lugar do `<select>`: a lista aberta do navegador não aceita estilo (fica branca
 * no Windows). Segue o padrão de combobox só de escolha do WAI-ARIA: setas, Home/End, Enter/Espaço e Esc pelo teclado.
 */
export function ListaSuspensa<T extends string>({ id, valor, opcoes, aoMudar }: ListaSuspensaProps<T>) {
  const [aberta, setAberta] = useState(false)
  const [ativa, setAtiva] = useState(0)
  // Onde a lista abre e quanto pode crescer, medido a cada abertura.
  const [posicao, setPosicao] = useState<{ paraCima: boolean; alturaMax: number }>({ paraCima: true, alturaMax: ALTURA_MAX })
  const raizRef = useRef<HTMLDivElement>(null)
  const listaRef = useRef<HTMLDivElement>(null)
  const botaoRef = useRef<HTMLButtonElement>(null)
  const idLista = useId()
  const escolhida = opcoes.find((o) => o.valor === valor) ?? opcoes[0]
  const idOpcao = (i: number) => `${idLista}-${i}`

  // Fecha ao clicar fora.
  useEffect(() => {
    if (!aberta) return
    const aoClicar = (evento: PointerEvent) => {
      if (!raizRef.current?.contains(evento.target as Node)) setAberta(false)
    }
    document.addEventListener('pointerdown', aoClicar)
    return () => document.removeEventListener('pointerdown', aoClicar)
  }, [aberta])

  // Mantém a opção destacada à vista rolando só a lista (scrollIntoView rolaria a página junto).
  useEffect(() => {
    const lista = listaRef.current
    const opcao = lista?.children[ativa] as HTMLElement | undefined
    if (!aberta || !lista || !opcao) return
    if (opcao.offsetTop < lista.scrollTop) lista.scrollTop = opcao.offsetTop
    else if (opcao.offsetTop + opcao.offsetHeight > lista.scrollTop + lista.clientHeight)
      lista.scrollTop = opcao.offsetTop + opcao.offsetHeight - lista.clientHeight
  }, [aberta, ativa])

  const abrir = () => {
    // Abre para cima (a busca fica perto do fim do topo da página, que corta o que passa da sua borda). Só abre para
    // baixo se em cima não couber; nos dois casos, rola dentro do espaço que sobra.
    const campo = raizRef.current?.getBoundingClientRect()
    if (campo) {
      const secao = raizRef.current?.closest('section')?.getBoundingClientRect()
      const cabecalho = document.querySelector('header')?.getBoundingClientRect().height ?? 0
      const limiteBaixo = Math.min(window.innerHeight, secao?.bottom ?? Infinity)
      const abaixo = limiteBaixo - campo.bottom - MARGEM
      const acima = campo.top - Math.max(cabecalho, secao?.top ?? 0) - MARGEM
      const paraCima = acima >= ALTURA_MIN || acima >= abaixo
      setPosicao({ paraCima, alturaMax: Math.max(Math.min(paraCima ? acima : abaixo, ALTURA_MAX), 120) })
    }
    setAtiva(Math.max(opcoes.indexOf(escolhida), 0))
    setAberta(true)
  }

  const escolher = (i: number) => {
    const opcao = opcoes[i]
    if (!opcao || opcao.desativada) return
    aoMudar(opcao.valor)
    setAberta(false)
    botaoRef.current?.focus()
  }

  // Próxima opção habilitada a partir de `de`, no sentido indicado.
  const vizinha = (de: number, passo: 1 | -1) => {
    for (let i = de + passo; i >= 0 && i < opcoes.length; i += passo) if (!opcoes[i].desativada) return i
    return de
  }

  const aoTeclar = (evento: KeyboardEvent) => {
    const { key } = evento
    if (!aberta) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)) {
        evento.preventDefault()
        abrir()
      }
      return
    }
    const acoes: Record<string, () => void> = {
      ArrowDown: () => setAtiva((i) => vizinha(i, 1)),
      ArrowUp: () => setAtiva((i) => vizinha(i, -1)),
      Home: () => setAtiva(vizinha(-1, 1)),
      End: () => setAtiva(vizinha(opcoes.length, -1)),
      Enter: () => escolher(ativa),
      ' ': () => escolher(ativa),
      Escape: () => setAberta(false),
    }
    if (key === 'Tab') return setAberta(false)
    const acao = acoes[key]
    if (!acao) return
    evento.preventDefault()
    acao()
  }

  return (
    <div ref={raizRef} className="relative min-w-0 flex-1">
      <button
        ref={botaoRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={aberta}
        aria-controls={idLista}
        aria-activedescendant={aberta ? idOpcao(ativa) : undefined}
        onClick={() => (aberta ? setAberta(false) : abrir())}
        onKeyDown={aoTeclar}
        className="flex h-9 w-full min-w-0 cursor-pointer items-center pr-5 text-left text-[0.8rem] font-semibold text-creme-100 outline-none sm:text-sm"
      >
        <span className="truncate">{escolhida?.rotulo}</span>
      </button>
      <IconeSeta
        className={cn(
          'pointer-events-none absolute top-1/2 right-0 h-3.5 w-3.5 -translate-y-1/2 text-cinza-400 transition-transform motion-reduce:transition-none',
          aberta ? '-rotate-90' : 'rotate-90',
        )}
      />

      {aberta && (
        <div
          ref={listaRef}
          id={idLista}
          role="listbox"
          tabIndex={-1}
          style={{ maxHeight: posicao.alturaMax }}
          className={cn(
            'absolute -left-9 z-50 w-max max-w-[min(20rem,calc(100vw-2rem))] min-w-[calc(100%+3rem)] [scrollbar-width:thin] [scrollbar-color:rgb(255_255_255/0.3)_transparent] overflow-y-auto overscroll-contain rounded-xl border border-white/10 bg-carvao-950/95 p-1.5 shadow-[0_18px_50px_-12px_rgb(0_0_0/0.9)]',
            posicao.paraCima ? 'bottom-[calc(100%+0.6rem)]' : 'top-[calc(100%+0.6rem)]',
          )}
        >
          {opcoes.map((opcao, i) => {
            const selecionada = opcao.valor === valor
            return (
              // O teclado fica no botão (aria-activedescendant); o clique aqui é o atalho do mouse.
              // oxlint-disable-next-line jsx-a11y/click-events-have-key-events
              <div
                key={opcao.valor}
                id={idOpcao(i)}
                role="option"
                tabIndex={-1}
                aria-selected={selecionada}
                aria-disabled={opcao.desativada || undefined}
                onPointerEnter={() => !opcao.desativada && setAtiva(i)}
                onClick={() => escolher(i)}
                className={cn(
                  'flex cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors',
                  selecionada ? 'font-bold text-sol-500' : 'text-creme-100',
                  i === ativa && !opcao.desativada && 'bg-white/10',
                  opcao.desativada && 'cursor-not-allowed opacity-40',
                )}
              >
                {opcao.rotulo}
                {selecionada && (
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
                    <path
                      d="M3 8.5l3.2 3L13 4.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
