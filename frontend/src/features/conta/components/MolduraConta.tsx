import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { IconeSeta } from '@/components/icones'
import { Container } from '@/components/ui/Container'
import { Selo } from '@/components/ui/Selo'
import { empresa } from '@/config/empresa'
import { ROTAS } from '@/constants/rotas'
import { useTituloDaPagina } from '@/hooks/useTituloDaPagina'
import { cn } from '@/utils/cn'

// Foto: Patrick Hendry / Unsplash (Licença Unsplash: uso gratuito, inclusive comercial)
const foto = '/images/hero-bikepacking.jpg'

const vantagens = ['Reserve sua vaga em poucos passos', 'Acompanhe datas, pagamentos e roteiro', 'Receba novidades das próximas saídas']

interface MolduraContaProps {
  titulo: string
  /** Nome da tela na aba do navegador ("Entrar", "Criar conta"). */
  nomeDaPagina: string
  descricao: string
  /** As abas Entrar e Criar conta; sem elas (como no recuperar senha), aparece o link de voltar para entrar. */
  abas?: boolean
  children: ReactNode
}

/**
 * Página das telas de conta (entrar, criar conta e recuperar senha): a foto com o convite à esquerda (só no desktop) e o formulário à
 * direita, com as abas para trocar de uma tela para a outra.
 */
export function MolduraConta({ titulo, nomeDaPagina, descricao, abas = true, children }: MolduraContaProps) {
  useTituloDaPagina(`${nomeDaPagina} · ${empresa.nome}`)

  return (
    <Container className="py-5 sm:py-10">
      {/* No celular o formulário usa a largura toda, sem o cartão em volta; a partir do tablet, vira cartão */}
      <div className="mx-auto grid max-w-5xl overflow-hidden sm:rounded-3xl sm:border sm:border-white/10 sm:bg-carvao-800 sm:shadow-[0_30px_60px_-30px_rgb(0_0_0/0.8)] lg:grid-cols-[1fr_1.1fr]">
        <aside className="relative isolate hidden flex-col justify-end p-10 lg:flex">
          <img src={foto} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover object-[68%_center]" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
          <Selo className="self-start">Sua conta</Selo>
          <p className="mt-4 font-display text-3xl leading-tight font-black text-white uppercase">
            Sua próxima viagem <span className="text-sol-500">começa aqui</span>
          </p>
          <ul className="mt-6 space-y-2.5 text-sm text-white/85">
            {vantagens.map((vantagem) => (
              <li key={vantagem} className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sol-500/20 text-sol-500">
                  <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden="true">
                    <path
                      d="M3 8.5l3.2 3L13 4.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {vantagem}
              </li>
            ))}
          </ul>
        </aside>

        <div className="sm:p-10">
          {abas ? (
            <nav aria-label="Conta" className="grid grid-cols-2 gap-1 rounded-xl bg-carvao-950/60 p-1">
              <Aba para={ROTAS.minhaConta}>Entrar</Aba>
              <Aba para={ROTAS.cadastro}>Criar conta</Aba>
            </nav>
          ) : (
            <Link
              to={ROTAS.minhaConta}
              className="group inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-cinza-400 transition-colors hover:text-creme-100"
            >
              <IconeSeta className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none" />
              Voltar para entrar
            </Link>
          )}
          <h1 className="mt-7 font-display text-2xl font-black text-white uppercase sm:text-3xl">{titulo}</h1>
          <p className="mt-2 text-sm text-cinza-400">{descricao}</p>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </Container>
  )
}

function Aba({ para, children }: { para: string; children: ReactNode }) {
  return (
    <NavLink
      to={para}
      replace
      className={({ isActive }) =>
        cn(
          'flex min-h-10 items-center justify-center rounded-lg text-sm font-semibold transition-colors',
          isActive ? 'bg-carvao-700 text-white shadow-sm' : 'text-cinza-400 hover:text-creme-100',
        )
      }
    >
      {children}
    </NavLink>
  )
}
