import { type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes, useId, useState } from 'react'
import type { StatusSaida } from '@/types/adm'
import { statusSaida } from './formato'

type Variante = 'principal' | 'secundario' | 'perigo'

const variantes: Record<Variante, string> = {
  principal: 'bg-trilha-500 text-mata-950 hover:bg-trilha-400',
  secundario: 'border border-areia-100/30 text-areia-100 hover:border-trilha-500 hover:text-trilha-400',
  perigo: 'border border-alerta-600 text-[#ff9b8a] hover:bg-alerta-600 hover:text-white',
}

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante
  carregando?: boolean
}

export function Botao({ variante = 'principal', carregando = false, className = '', children, disabled, ...resto }: BotaoProps) {
  return (
    <button
      type="button"
      {...resto}
      disabled={disabled || carregando}
      aria-busy={carregando || undefined}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantes[variante]} ${className}`}
    >
      {carregando && <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />}
      {children}
    </button>
  )
}

interface CampoProps extends InputHTMLAttributes<HTMLInputElement> {
  rotulo: string
  ajuda?: string
}

export function Campo({ rotulo, ajuda, className = '', ...resto }: CampoProps) {
  const id = useId()
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold text-areia-100">
        {rotulo}
      </label>
      <input
        id={id}
        {...resto}
        aria-describedby={ajuda ? `${id}-ajuda` : undefined}
        className="mt-1.5 min-h-11 w-full rounded-xl border border-white/15 bg-mata-950/60 px-3.5 text-base text-areia-100 placeholder:text-areia-400/60 [color-scheme:dark] focus:border-trilha-500 focus:outline-none"
      />
      {ajuda && (
        <p id={`${id}-ajuda`} className="mt-1 text-xs text-areia-400">
          {ajuda}
        </p>
      )}
    </div>
  )
}

export function SeloStatus({ status }: { status: StatusSaida }) {
  const { rotulo, classe } = statusSaida[status]
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${classe}`}>{rotulo}</span>
}

export function Cartao({ titulo, acoes, children }: { titulo?: string; acoes?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-mata-800/60 p-5 sm:p-6">
      {(titulo || acoes) && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          {titulo && <h2 className="font-display text-2xl font-semibold">{titulo}</h2>}
          {acoes}
        </div>
      )}
      {children}
    </section>
  )
}

/** Mensagem de erro ou de sucesso logo abaixo de um formulário ou ação. */
export function Aviso({ tipo, children }: { tipo: 'erro' | 'sucesso'; children: ReactNode }) {
  const classe = tipo === 'erro' ? 'border-alerta-600/60 bg-alerta-600/15 text-[#ffc2b8]' : 'border-rampa-leve/40 bg-rampa-leve/10 text-rampa-leve'
  return (
    <p role={tipo === 'erro' ? 'alert' : 'status'} className={`rounded-xl border px-4 py-3 text-sm ${classe}`}>
      {children}
    </p>
  )
}

export function CarregandoAdm() {
  return (
    <div className="flex min-h-60 items-center justify-center" role="status">
      <span className="h-8 w-8 animate-spin rounded-full border-4 border-trilha-500 border-t-transparent" />
      <span className="sr-only">Carregando...</span>
    </div>
  )
}

export function ErroAoCarregar({ mensagem, aoTentarDeNovo }: { mensagem: string; aoTentarDeNovo: () => void }) {
  return (
    <div className="space-y-4" role="alert">
      <Aviso tipo="erro">{mensagem}</Aviso>
      <Botao variante="secundario" onClick={aoTentarDeNovo}>
        Tentar de novo
      </Botao>
    </div>
  )
}

/** Ação que não tem volta: o primeiro clique só pede confirmação, na própria página. */
export function AcaoConfirmada({ rotulo, pergunta, confirmar, aoConfirmar }: {
  rotulo: string
  pergunta: string
  confirmar: string
  aoConfirmar: () => Promise<void>
}) {
  const [aberta, setAberta] = useState(false)
  const [executando, setExecutando] = useState(false)

  if (!aberta) {
    return (
      <Botao variante="perigo" onClick={() => setAberta(true)}>
        {rotulo}
      </Botao>
    )
  }
  return (
    <div className="w-full rounded-xl border border-alerta-600/60 bg-alerta-600/10 p-4" role="group" aria-label={pergunta}>
      <p className="text-sm font-semibold">{pergunta}</p>
      <div className="mt-3 flex flex-wrap gap-3">
        <Botao
          variante="perigo"
          carregando={executando}
          onClick={async () => {
            setExecutando(true)
            try {
              await aoConfirmar()
            } finally {
              setExecutando(false)
              setAberta(false)
            }
          }}
        >
          {confirmar}
        </Botao>
        <Botao variante="secundario" onClick={() => setAberta(false)} disabled={executando}>
          Voltar
        </Botao>
      </div>
    </div>
  )
}

const classeControle =
  'mt-1.5 w-full rounded-xl border border-white/15 bg-mata-950/60 px-3.5 text-base text-areia-100 placeholder:text-areia-400/60 [color-scheme:dark] focus:border-trilha-500 focus:outline-none'

interface SelecaoProps<T extends string> {
  rotulo: string
  valor: T
  opcoes: Record<T, string>
  aoMudar: (valor: T) => void
  className?: string
}

export function Selecao<T extends string>({ rotulo, valor, opcoes, aoMudar, className = '' }: SelecaoProps<T>) {
  const id = useId()
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold text-areia-100">
        {rotulo}
      </label>
      <select id={id} value={valor} onChange={(e) => aoMudar(e.target.value as T)} className={`${classeControle} min-h-11 px-3`}>
        {(Object.keys(opcoes) as T[]).map((opcao) => (
          <option key={opcao} value={opcao}>
            {opcoes[opcao]}
          </option>
        ))}
      </select>
    </div>
  )
}

interface AreaTextoProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  rotulo: string
  ajuda?: ReactNode
}

export function AreaTexto({ rotulo, ajuda, className = '', ...resto }: AreaTextoProps) {
  const id = useId()
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold text-areia-100">
        {rotulo}
      </label>
      <textarea id={id} {...resto} aria-describedby={ajuda ? `${id}-ajuda` : undefined} className={`${classeControle} py-2.5`} />
      {ajuda && (
        <div id={`${id}-ajuda`} className="mt-1 text-xs text-areia-400">
          {ajuda}
        </div>
      )}
    </div>
  )
}
