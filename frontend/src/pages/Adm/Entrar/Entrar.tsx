import { useState, type FormEvent, type ReactNode } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Carregando } from '@/components/feedback/Carregando'
import { Logo } from '@/components/ui/Logo'
import { empresa } from '@/config/empresa'
import { ROTAS } from '@/constants/rotas'
import { Aviso, Botao, Campo, entrar, useEstadoDaNavegacao, useSessaoAdm, type TokenEmitido } from '@/features/adm'
import { ErroApi } from '@/lib/api'

// A API não respondeu (é diferente de recusar o login): o servidor pode estar parado e levar um tempo para acordar.
const SEM_RESPOSTA = 'Não foi possível falar com o servidor. Se ele estava parado, pode levar até um minuto para acordar: tente de novo.'

const SEM_KEYCLOAK = 'Não foi possível abrir a tela de login. Confira a conexão e tente de novo em instantes.'

export function Entrar() {
  const { administrador, carregando, entrada, motivoDaSaida } = useSessaoAdm()
  // Quem foi mandado para o login a partir de uma página protegida volta para ela depois de entrar.
  const destino = useEstadoDaNavegacao().de ?? ROTAS.admPainel

  if (carregando) return <Carregando />
  if (administrador) return <Navigate to={destino} replace />

  return entrada.tipo === 'formulario' ? (
    <FormularioDeEntrada iniciar={entrada.iniciar} destino={destino} motivoDaSaida={motivoDaSaida} />
  ) : (
    <EntradaPeloKeycloak irParaOLogin={entrada.irParaOLogin} destino={destino} motivoDaSaida={motivoDaSaida} />
  )
}

interface PropsEntrada {
  destino: string
  motivoDaSaida: string | null
}

/** Login próprio da API: e-mail e senha digitados aqui. */
function FormularioDeEntrada({ iniciar, destino, motivoDaSaida }: PropsEntrada & { iniciar: (token: TokenEmitido) => void }) {
  const navegar = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const enviar = async (evento: FormEvent) => {
    evento.preventDefault()
    setEnviando(true)
    setErro(null)
    try {
      iniciar(await entrar(email, senha))
      navegar(destino, { replace: true })
    } catch (falha) {
      setErro(falha instanceof ErroApi ? falha.message : SEM_RESPOSTA)
      setEnviando(false)
    }
  }

  return (
    <MolduraEntrar aoEnviar={enviar} descricao="Entre para gerenciar roteiros, saídas e vagas.">
      {motivoDaSaida && !erro && <Aviso tipo="erro">{motivoDaSaida}</Aviso>}
      <Campo rotulo="E-mail" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <Campo
        rotulo="Senha"
        type="password"
        autoComplete="current-password"
        required
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      {erro && <Aviso tipo="erro">{erro}</Aviso>}
      <Botao type="submit" carregando={enviando} className="w-full">
        {enviando ? 'Entrando...' : 'Entrar'}
      </Botao>
    </MolduraEntrar>
  )
}

/** Login pelo Keycloak: a senha é digitada na tela dele, e o ADM volta ao painel já logado. */
function EntradaPeloKeycloak({
  irParaOLogin,
  destino,
  motivoDaSaida,
}: PropsEntrada & { irParaOLogin: (destino: string) => Promise<void> }) {
  const [indo, setIndo] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const enviar = async (evento: FormEvent) => {
    evento.preventDefault()
    setIndo(true)
    setErro(null)
    try {
      // Em caso de sucesso, o navegador sai do site: não há o que fazer depois daqui.
      await irParaOLogin(destino)
    } catch {
      setErro(SEM_KEYCLOAK)
      setIndo(false)
    }
  }

  return (
    <MolduraEntrar
      aoEnviar={enviar}
      descricao={`Você vai para a tela de login segura da ${empresa.nome} e volta para cá depois de entrar.`}
    >
      {motivoDaSaida && !erro && <Aviso tipo="erro">{motivoDaSaida}</Aviso>}
      {erro && <Aviso tipo="erro">{erro}</Aviso>}
      <Botao type="submit" carregando={indo} className="w-full">
        {indo ? 'Abrindo o login...' : 'Entrar'}
      </Botao>
    </MolduraEntrar>
  )
}

function MolduraEntrar({
  aoEnviar,
  descricao,
  children,
}: {
  aoEnviar: (evento: FormEvent) => void
  descricao: string
  children: ReactNode
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-carvao-900 px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Logo />
        </div>
        <form
          onSubmit={aoEnviar}
          className="mt-10 space-y-5 rounded-2xl border border-white/10 bg-carvao-800/60 p-6"
          aria-labelledby="titulo-entrar"
        >
          <div>
            <h1 id="titulo-entrar" className="font-display text-3xl font-black uppercase">
              Painel do ADM
            </h1>
            <p className="mt-1 text-sm text-cinza-400">{descricao}</p>
          </div>
          {children}
        </form>
      </div>
    </main>
  )
}
