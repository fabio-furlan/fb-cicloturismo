// API pública do domínio da conta do cliente (entrar e criar conta). Fora desta pasta, importe sempre daqui
// (`@/features/conta`), nunca de um arquivo interno.

export { AvisoConta } from './components/AvisoConta'
export { CampoConta, CampoSenha, RegrasSenha } from './components/campos'
export { MolduraConta } from './components/MolduraConta'

export { focarPrimeiroErro } from './utils/focarPrimeiroErro'

export {
  type DadosCadastro,
  type DadosEntrada,
  type Erros,
  formatarTelefone,
  regrasDaSenha,
  SENHA_MINIMA,
  validarCadastro,
  validarEntrada,
  validarRecuperacao,
} from './utils/validacao'
