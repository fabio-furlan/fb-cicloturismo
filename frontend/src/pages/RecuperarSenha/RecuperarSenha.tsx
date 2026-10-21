import { useState, type FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { IconeEmail, IconeSeta } from '@/components/icones'
import { estiloBotao } from '@/components/ui/estilosBotao'
import { ROTAS } from '@/constants/rotas'
import { AvisoConta, CampoConta, focarPrimeiroErro, MolduraConta, validarRecuperacao } from '@/features/conta'
import { cn } from '@/utils/cn'

/**
 * Tela de recuperar a senha: a pessoa informa o e-mail da conta para receber o link de criar uma senha nova. A
 * recuperação depende da conta de clientes, que ainda não existe na API: ao enviar, o aviso explica.
 */
export function RecuperarSenha() {
  // Quem vem do "Esqueci minha senha" já traz o e-mail digitado na tela de entrar.
  const emailDaTelaDeEntrar = (useLocation().state as { email?: string } | null)?.email ?? ''
  const [email, setEmail] = useState(emailDaTelaDeEntrar)
  const [erro, setErro] = useState<string>()
  const [enviado, setEnviado] = useState(false)

  const enviar = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    const novo = validarRecuperacao({ email }).email
    setErro(novo)
    setEnviado(!novo)
    focarPrimeiroErro(evento.currentTarget)
  }

  return (
    <MolduraConta
      titulo="Esqueceu a senha?"
      nomeDaPagina="Recuperar senha"
      descricao="Informe o e-mail da sua conta e enviaremos um link para você criar uma senha nova."
      abas={false}
    >
      <form onSubmit={enviar} noValidate className="space-y-5">
        <CampoConta
          rotulo="E-mail da conta"
          icone={IconeEmail}
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="voce@exemplo.com"
          value={email}
          erro={erro}
          onChange={(e) => {
            setEmail(e.target.value)
            setErro(undefined)
          }}
        />

        {enviado && (
          <AvisoConta>
            A recuperação de senha chega junto com o acesso de clientes. Enquanto isso, se precisar de ajuda com uma reserva,{' '}
            <Link to={ROTAS.contato} className="font-semibold text-sol-500 underline-offset-2 hover:underline">
              fale com a gente
            </Link>
            .
          </AvisoConta>
        )}

        <button type="submit" className={cn(estiloBotao('principal', 'grande'), 'group w-full')}>
          Enviar link
          <IconeSeta className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
        </button>
      </form>

      <ul className="mt-6 space-y-1.5 text-xs leading-relaxed text-cinza-400">
        <li>O link vale por 1 hora e só pode ser usado uma vez.</li>
        <li>Não chegou? Confira a caixa de spam ou de promoções.</li>
      </ul>

      <p className="mt-6 text-center text-sm text-cinza-400">
        Lembrou a senha?{' '}
        <Link to={ROTAS.minhaConta} className="font-semibold text-sol-500 hover:underline">
          Entrar
        </Link>
      </p>
    </MolduraConta>
  )
}
