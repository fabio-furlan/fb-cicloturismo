import { UserManager, type User } from 'oidc-client-ts'
import { ROTAS } from '@/constants/rotas'
import type { AdministradorLogado } from './contexto'

// Login pelo Keycloak (OpenID Connect com PKCE). A senha é digitada só na tela do Keycloak: o painel recebe um código,
// troca por tokens e manda o access token para a API. A sessão fica no sessionStorage, como no login próprio, e o
// token (de 5 minutos) é renovado em silêncio com o refresh token antes de vencer.

/** Papel que abre o painel, no claim `papeis` dos tokens (o mesmo nome que a API confere). */
export const PAPEL_ADM = 'ADM'

const emissor = () => import.meta.env.VITE_KEYCLOAK_URL?.replace(/\/+$/, '') ?? ''

/** Com `VITE_KEYCLOAK_URL`, o painel entra pelo Keycloak; sem ela, pelo login próprio da API. */
export const keycloakConfigurado = () => emissor() !== ''

let gerenciador: UserManager | null = null

/** O único gerenciador da sessão do Keycloak na página: todos os pontos do painel enxergam a mesma sessão. */
export function gerenciadorKeycloak(): UserManager {
  gerenciador ??= new UserManager({
    authority: emissor(),
    client_id: import.meta.env.VITE_KEYCLOAK_CLIENTE || 'fb-cicloturismo-web',
    redirect_uri: `${window.location.origin}${ROTAS.admRetornoDoLogin}`,
    post_logout_redirect_uri: `${window.location.origin}${ROTAS.admEntrar}`,
    scope: 'openid profile email',
    automaticSilentRenew: true,
  })
  return gerenciador
}

/** O que vai e volta do Keycloak junto com o login: para onde levar o ADM depois de entrar. */
interface EstadoDoLogin {
  de: string
}

/**
 * Leva à tela de login do Keycloak. `prompt: 'login'` pede a senha mesmo que o navegador já tenha uma sessão no
 * Keycloak, de um cliente do site, por exemplo: o painel nunca abre só porque alguém deixou outra conta logada.
 */
export const irParaOLogin = (destino: string) =>
  gerenciadorKeycloak().signinRedirect({ state: { de: destino } satisfies EstadoDoLogin, prompt: 'login' })

let retorno: Promise<string> | null = null

/**
 * Conclui o login na volta do Keycloak: troca o código pelos tokens e devolve para onde ir. Cada volta do Keycloak é
 * uma página nova, então a troca acontece uma vez só por carregamento, mesmo que a tela de retorno seja desenhada duas
 * vezes (como no StrictMode): o código só pode ser trocado uma vez.
 */
export function concluirLogin(): Promise<string> {
  retorno ??= gerenciadorKeycloak()
    .signinRedirectCallback()
    .then((usuario) => (usuario.state as EstadoDoLogin | undefined)?.de ?? ROTAS.admPainel)
  return retorno
}

/** Os papéis vêm no claim `papeis` do id token, copiados pelo mapper do cliente no realm. */
export const temPapelAdm = (usuario: User) => {
  const papeis = usuario.profile.papeis
  return Array.isArray(papeis) && papeis.includes(PAPEL_ADM)
}

export const administradorDe = ({ profile }: User): AdministradorLogado => ({
  nome: profile.name ?? profile.given_name ?? profile.preferred_username ?? 'Administrador',
  email: profile.email ?? '',
})
