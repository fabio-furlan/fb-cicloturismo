// Regras dos formulários de entrar e de criar conta. Cada função devolve só os campos com problema, com a mensagem
// que aparece embaixo do campo: um objeto vazio quer dizer que pode enviar.

export interface DadosEntrada {
  email: string
  senha: string
}

export interface DadosCadastro {
  nome: string
  email: string
  telefone: string
  senha: string
  confirmacao: string
}

export type Erros<T> = Partial<Record<keyof T, string>>

/** Tamanho mínimo da senha de uma conta nova. */
export const SENHA_MINIMA = 8

const emailValido = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
// Mensagem do campo de e-mail, igual em todas as telas de conta; vazia quando o e-mail serve.
const erroDeEmail = (email: string) => {
  if (!email.trim()) return 'Informe o seu e-mail.'
  if (!emailValido(email)) return 'Confira o e-mail: falta alguma parte, como o @ ou o domínio.'
  return undefined
}
const soDigitos = (texto: string) => texto.replace(/\D/g, '')

export function validarEntrada({ email, senha }: DadosEntrada): Erros<DadosEntrada> {
  const erros: Erros<DadosEntrada> = {}
  if (erroDeEmail(email)) erros.email = erroDeEmail(email)
  if (!senha) erros.senha = 'Informe a sua senha.'
  return erros
}

/** Recuperar senha: só o e-mail da conta. */
export function validarRecuperacao({ email }: Pick<DadosEntrada, 'email'>): Erros<DadosEntrada> {
  const erro = erroDeEmail(email)
  return erro ? { email: erro } : {}
}

export function validarCadastro({ nome, email, telefone, senha, confirmacao }: DadosCadastro): Erros<DadosCadastro> {
  const erros: Erros<DadosCadastro> = {}
  if (nome.trim().split(/\s+/).filter(Boolean).length < 2) erros.nome = 'Informe o nome e o sobrenome.'
  if (erroDeEmail(email)) erros.email = erroDeEmail(email)
  const digitos = soDigitos(telefone).length
  if (digitos !== 10 && digitos !== 11) erros.telefone = 'Informe o celular com DDD, como (11) 91234-5678.'
  const [tamanho, letras, numeros] = regrasDaSenha(senha)
  if (!tamanho.ok) erros.senha = `A senha precisa ter pelo menos ${SENHA_MINIMA} caracteres.`
  else if (!letras.ok || !numeros.ok) erros.senha = 'Use letras e números na senha.'
  if (!confirmacao) erros.confirmacao = 'Repita a senha.'
  else if (confirmacao !== senha) erros.confirmacao = 'As senhas não são iguais.'
  return erros
}

/** As regras da senha nova, na ordem em que aparecem embaixo do campo. */
export const regrasDaSenha = (senha: string) => [
  { texto: `${SENHA_MINIMA}+ caracteres`, ok: senha.length >= SENHA_MINIMA },
  { texto: 'Letras', ok: /[a-zA-Z]/.test(senha) },
  { texto: 'Números', ok: /\d/.test(senha) },
]

/** Formata o telefone enquanto a pessoa digita: (11) 91234-5678 ou (11) 3123-4567. */
export function formatarTelefone(texto: string) {
  const d = soDigitos(texto).slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  const meio = d.length === 11 ? 7 : 6
  if (d.length <= meio) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, meio)}-${d.slice(meio)}`
}
