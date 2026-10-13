import { useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

// Sem espaçamento interno: cada controle define o seu (o select tem a seta e fica com um pouco menos).
const estiloControle =
  'mt-1.5 w-full rounded-xl border border-white/15 bg-carvao-950/60 text-base text-creme-100 [color-scheme:dark] placeholder:text-cinza-400/60 focus:border-vermelho-500 focus:outline-none'

/** Os atributos que ligam o controle ao rótulo e ao texto de ajuda. */
interface AtributosControle {
  id: string
  'aria-describedby'?: string
}

interface CampoRotuladoProps {
  rotulo: string
  ajuda?: ReactNode
  className?: string
  children: (atributos: AtributosControle) => ReactNode
}

/** Rótulo em cima, controle no meio e ajuda embaixo, com os ids que ligam os três para leitores de tela. */
function CampoRotulado({ rotulo, ajuda, className, children }: CampoRotuladoProps) {
  const id = useId()
  const idAjuda = `${id}-ajuda`
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold text-creme-100">
        {rotulo}
      </label>
      {children({ id, 'aria-describedby': ajuda ? idAjuda : undefined })}
      {ajuda && (
        <div id={idAjuda} className="mt-1 text-xs text-cinza-400">
          {ajuda}
        </div>
      )}
    </div>
  )
}

interface CampoProps extends InputHTMLAttributes<HTMLInputElement> {
  rotulo: string
  ajuda?: ReactNode
}

export function Campo({ rotulo, ajuda, className, ...resto }: CampoProps) {
  return (
    <CampoRotulado rotulo={rotulo} ajuda={ajuda} className={className}>
      {(atributos) => <input {...resto} {...atributos} className={cn(estiloControle, 'min-h-11 px-3.5')} />}
    </CampoRotulado>
  )
}

interface AreaTextoProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  rotulo: string
  ajuda?: ReactNode
}

export function AreaTexto({ rotulo, ajuda, className, ...resto }: AreaTextoProps) {
  return (
    <CampoRotulado rotulo={rotulo} ajuda={ajuda} className={className}>
      {(atributos) => <textarea {...resto} {...atributos} className={cn(estiloControle, 'px-3.5 py-2.5')} />}
    </CampoRotulado>
  )
}

interface SelecaoProps<T extends string> {
  rotulo: string
  valor: T
  /** Cada valor possível e o texto que aparece na lista, na ordem em que aparecem. */
  opcoes: Record<T, string>
  aoMudar: (valor: T) => void
  ajuda?: ReactNode
  className?: string
}

export function Selecao<T extends string>({ rotulo, valor, opcoes, aoMudar, ajuda, className }: SelecaoProps<T>) {
  return (
    <CampoRotulado rotulo={rotulo} ajuda={ajuda} className={className}>
      {(atributos) => (
        <select {...atributos} value={valor} onChange={(e) => aoMudar(e.target.value as T)} className={cn(estiloControle, 'min-h-11 px-3')}>
          {(Object.keys(opcoes) as T[]).map((opcao) => (
            <option key={opcao} value={opcao}>
              {opcoes[opcao]}
            </option>
          ))}
        </select>
      )}
    </CampoRotulado>
  )
}
