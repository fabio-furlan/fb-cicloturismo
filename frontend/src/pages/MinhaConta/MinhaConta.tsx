import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { IconeEmail, IconeSeta } from '@/components/icones'
import { estiloBotao } from '@/components/ui/estilosBotao'
import { ROTAS } from '@/constants/rotas'
import {
  AvisoConta,
  CampoConta,
  CampoSenha,
  focarPrimeiroErro,
  MolduraConta,
  validarEntrada,
  type DadosEntrada,
  type Erros,
} from '@/features/conta'
import { cn } from '@/utils/cn'

/** Tela de entrar da área do cliente. O login de clientes ainda não existe na API: ao enviar, o aviso explica. */
export function MinhaConta() {
  const [dados, setDados] = useState<DadosEntrada>({ email: '', senha: '' })
  const [erros, setErros] = useState<Erros<DadosEntrada>>({})
  const [enviado, setEnviado] = useState(false)

  // Ao corrigir um campo, o erro dele some na hora.
  const mudar = (parcial: Partial<DadosEntrada>) => {
    setDados({ ...dados, ...parcial })
    setErros((antes) => ({ ...antes, ...Object.fromEntries(Object.keys(parcial).map((campo) => [campo, undefined])) }))
  }

  const enviar = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    const novos = validarEntrada(dados)
    setErros(novos)
    setEnviado(Object.keys(novos).length === 0)
    focarPrimeiroErro(evento.currentTarget)
  }

  return (
    <MolduraConta
      titulo="Bem-vindo de volta"
      nomeDaPagina="Entrar"
      descricao="Entre com seu e-mail e senha para reservar e acompanhar suas viagens."
    >
      <form onSubmit={enviar} noValidate className="space-y-5">
        <CampoConta
          rotulo="E-mail"
          icone={IconeEmail}
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="voce@exemplo.com"
          value={dados.email}
          erro={erros.email}
          onChange={(e) => mudar({ email: e.target.value })}
        />
        <CampoSenha
          rotulo="Senha"
          autoComplete="current-password"
          placeholder="Sua senha"
          value={dados.senha}
          erro={erros.senha}
          extraRotulo={
            // Leva o e-mail já digitado, para a pessoa não precisar digitar de novo.
            <Link
              to={ROTAS.recuperarSenha}
              state={{ email: dados.email }}
              className="-my-2 py-2 text-sm font-semibold text-sol-500 hover:underline sm:text-xs"
            >
              Esqueci minha senha
            </Link>
          }
          onChange={(e) => mudar({ senha: e.target.value })}
        />

        {enviado && (
          <AvisoConta>
            O acesso de clientes chega em breve. Enquanto isso, para reservar a sua vaga,{' '}
            <Link to={ROTAS.contato} className="font-semibold text-sol-500 underline-offset-2 hover:underline">
              fale com a gente
            </Link>
            .
          </AvisoConta>
        )}

        <button type="submit" className={cn(estiloBotao('principal', 'grande'), 'group w-full')}>
          Entrar
          <IconeSeta className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-cinza-400">
        Ainda não tem conta?{' '}
        <Link to={ROTAS.cadastro} replace className="font-semibold text-sol-500 hover:underline">
          Criar conta
        </Link>
      </p>
    </MolduraConta>
  )
}
