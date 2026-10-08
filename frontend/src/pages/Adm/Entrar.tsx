import { type FormEvent, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Logo } from '@/components/ui/Logo'
import { ROTAS } from '@/constants/rotas'
import { entrar } from '@/services/adm'
import { ErroApi } from '@/services/api'
import { Aviso, Botao, Campo } from './componentes'
import { useSessaoAdm } from './sessao/contexto'

export function Entrar() {
  const { administrador, iniciar, motivoDaSaida } = useSessaoAdm()
  const navegar = useNavigate()
  // Quem foi mandado para o login a partir de uma página protegida volta para ela depois de entrar.
  const destino = (useLocation().state as { de?: string } | null)?.de ?? ROTAS.admPainel
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  if (administrador) return <Navigate to={destino} replace />

  const enviar = async (evento: FormEvent) => {
    evento.preventDefault()
    setEnviando(true)
    setErro(null)
    try {
      iniciar(await entrar(email, senha))
      navegar(destino, { replace: true })
    } catch (falha) {
      setErro(
        falha instanceof ErroApi
          ? falha.message
          : 'Não foi possível falar com o servidor. Se ele estava parado, pode levar até um minuto para acordar: tente de novo.',
      )
      setEnviando(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-mata-900 px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Logo />
        </div>
        <form onSubmit={enviar} className="mt-10 space-y-5 rounded-2xl border border-white/10 bg-mata-800/60 p-6" aria-labelledby="titulo-entrar">
          <div>
            <h1 id="titulo-entrar" className="font-display text-3xl font-semibold">
              Painel do ADM
            </h1>
            <p className="mt-1 text-sm text-areia-400">Entre para gerenciar roteiros, saídas e vagas.</p>
          </div>
          {motivoDaSaida && !erro && <Aviso tipo="erro">{motivoDaSaida}</Aviso>}
          <Campo rotulo="E-mail" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <Campo rotulo="Senha" type="password" autoComplete="current-password" required value={senha} onChange={(e) => setSenha(e.target.value)} />
          {erro && <Aviso tipo="erro">{erro}</Aviso>}
          <Botao type="submit" carregando={enviando} className="w-full">
            {enviando ? 'Entrando...' : 'Entrar'}
          </Botao>
        </form>
      </div>
    </main>
  )
}
