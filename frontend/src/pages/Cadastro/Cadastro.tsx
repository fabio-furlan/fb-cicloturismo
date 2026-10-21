import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { IconeEmail, IconeSeta, IconeTelefone, IconeUsuario } from '@/components/icones'
import { estiloBotao } from '@/components/ui/estilosBotao'
import { ROTAS } from '@/constants/rotas'
import {
  AvisoConta,
  CampoConta,
  CampoSenha,
  focarPrimeiroErro,
  formatarTelefone,
  MolduraConta,
  regrasDaSenha,
  RegrasSenha,
  validarCadastro,
  type DadosCadastro,
  type Erros,
} from '@/features/conta'
import { cn } from '@/utils/cn'

const vazio: DadosCadastro = { nome: '', email: '', telefone: '', senha: '', confirmacao: '' }

/** Tela de criar conta da área do cliente. O cadastro ainda não existe na API: ao enviar, o aviso explica. */
export function Cadastro() {
  const [dados, setDados] = useState(vazio)
  const [erros, setErros] = useState<Erros<DadosCadastro>>({})
  const [enviado, setEnviado] = useState(false)

  // Ao corrigir um campo, o erro dele some na hora.
  const mudar = (parcial: Partial<DadosCadastro>) => {
    setDados({ ...dados, ...parcial })
    setErros((antes) => ({ ...antes, ...Object.fromEntries(Object.keys(parcial).map((campo) => [campo, undefined])) }))
  }

  const enviar = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    const novos = validarCadastro(dados)
    setErros(novos)
    setEnviado(Object.keys(novos).length === 0)
    focarPrimeiroErro(evento.currentTarget)
  }

  return (
    <MolduraConta
      titulo="Crie sua conta"
      nomeDaPagina="Criar conta"
      descricao="Leva menos de um minuto. Depois é só escolher a viagem e reservar."
    >
      <form onSubmit={enviar} noValidate className="space-y-5">
        <CampoConta
          rotulo="Nome completo"
          icone={IconeUsuario}
          placeholder="Seu nome"
          autoComplete="name"
          value={dados.nome}
          erro={erros.nome}
          onChange={(e) => mudar({ nome: e.target.value })}
        />
        <div className="grid gap-5 sm:grid-cols-2">
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
          <CampoConta
            rotulo="Celular (WhatsApp)"
            icone={IconeTelefone}
            type="tel"
            autoComplete="tel-national"
            inputMode="tel"
            placeholder="(11) 91234-5678"
            value={dados.telefone}
            erro={erros.telefone}
            onChange={(e) => mudar({ telefone: formatarTelefone(e.target.value) })}
          />
        </div>
        {/* As regras ficam embaixo das duas senhas, na largura toda, e vão ficando verdes enquanto a pessoa digita */}
        <div>
          <div className="grid gap-5 sm:grid-cols-2 sm:items-start">
            <CampoSenha
              rotulo="Senha"
              autoComplete="new-password"
              value={dados.senha}
              erro={erros.senha}
              placeholder="Crie uma senha"
              onChange={(e) => mudar({ senha: e.target.value })}
            />
            <CampoSenha
              rotulo="Confirme a senha"
              placeholder="Repita a senha"
              autoComplete="new-password"
              value={dados.confirmacao}
              erro={erros.confirmacao}
              onChange={(e) => mudar({ confirmacao: e.target.value })}
            />
          </div>
          <RegrasSenha regras={regrasDaSenha(dados.senha)} />
        </div>

        {enviado && (
          <AvisoConta>
            O cadastro de clientes chega em breve. Enquanto isso, para reservar a sua vaga,{' '}
            <Link to={ROTAS.contato} className="font-semibold text-sol-500 underline-offset-2 hover:underline">
              fale com a gente
            </Link>
            .
          </AvisoConta>
        )}

        <button type="submit" className={cn(estiloBotao('principal', 'grande'), 'group w-full')}>
          Criar conta
          <IconeSeta className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-cinza-400">
        Já tem conta?{' '}
        <Link to={ROTAS.minhaConta} replace className="font-semibold text-sol-500 hover:underline">
          Entrar
        </Link>
      </p>
    </MolduraConta>
  )
}
