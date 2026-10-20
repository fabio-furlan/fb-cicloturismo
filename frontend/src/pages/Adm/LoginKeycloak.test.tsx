// @vitest-environment jsdom
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { User } from 'oidc-client-ts'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AreaAdm } from './AreaAdm'

// O Keycloak de mentira: o mesmo gerenciador para todo o painel, como o de verdade, com os eventos que o provedor ouve.
const keycloak = vi.hoisted(() => {
  const aoCarregar: ((usuario: unknown) => void)[] = []
  return {
    aoCarregar,
    getUser: vi.fn<() => Promise<User | null>>(),
    signinSilent: vi.fn<() => Promise<User | null>>(),
    signinRedirect: vi.fn<(args?: unknown) => Promise<void>>(),
    signinRedirectCallback: vi.fn<() => Promise<User>>(),
    signoutRedirect: vi.fn<() => Promise<void>>(),
    removeUser: vi.fn<() => Promise<void>>(),
    events: {
      addUserLoaded: (ouvinte: (usuario: unknown) => void) => {
        aoCarregar.push(ouvinte)
        return () => aoCarregar.splice(aoCarregar.indexOf(ouvinte), 1)
      },
      addSilentRenewError: () => () => {},
    },
  }
})

vi.mock('oidc-client-ts', () => ({
  UserManager: vi.fn<() => typeof keycloak>(function UserManager() {
    return keycloak
  }),
}))

const usuario = (papeis: string[], state?: unknown) =>
  ({
    profile: { sub: 'ana', name: 'Ana Souza', email: 'ana@exemplo.com', papeis },
    access_token: 'token-do-keycloak',
    expired: false,
    state,
  }) as unknown as User

const abrir = (endereco: string) =>
  render(
    <MemoryRouter initialEntries={[endereco]}>
      <Routes>
        <Route path="/adm/*" element={<AreaAdm />} />
      </Routes>
    </MemoryRouter>,
  )

const fetchFalso = vi.fn<(url: string, init?: RequestInit) => Promise<Response>>(
  async () => new Response('[]', { status: 200, headers: { 'Content-Type': 'application/json' } }),
)

beforeEach(() => {
  vi.stubEnv('VITE_KEYCLOAK_URL', 'http://keycloak.teste/realms/fb-cicloturismo')
  vi.stubGlobal('fetch', fetchFalso)
  keycloak.getUser.mockResolvedValue(null)
  keycloak.signinRedirect.mockResolvedValue(undefined)
  keycloak.signoutRedirect.mockResolvedValue(undefined)
  keycloak.removeUser.mockResolvedValue(undefined)
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

/** O cabeçalho Authorization das chamadas feitas à API. */
const tokensEnviados = () => fetchFalso.mock.calls.map(([, init]) => new Headers(init?.headers).get('Authorization'))

describe('login do painel pelo Keycloak', () => {
  it('sem sessão, manda para a tela de entrada, que leva ao Keycloak e guarda a página de origem', async () => {
    abrir('/adm/roteiros')

    await userEvent.click(await screen.findByRole('button', { name: 'Entrar' }))

    expect(screen.queryByLabelText('E-mail')).not.toBeInTheDocument()
    expect(keycloak.signinRedirect).toHaveBeenCalledWith({ state: { de: '/adm/roteiros' }, prompt: 'login' })
  })

  it('avisa quando a tela de login do Keycloak não abre', async () => {
    keycloak.signinRedirect.mockRejectedValue(new Error('sem rede'))
    abrir('/adm/entrar')

    await userEvent.click(await screen.findByRole('button', { name: 'Entrar' }))

    expect(await screen.findByText(/Não foi possível abrir a tela de login/)).toBeInTheDocument()
  })

  it('com a sessão de um ADM guardada, abre o painel e chama a API com o token do Keycloak', async () => {
    keycloak.getUser.mockResolvedValue(usuario(['CLIENTE', 'ADM']))
    abrir('/adm')

    expect(await screen.findByText('Ana Souza')).toBeInTheDocument()
    await waitFor(() => expect(tokensEnviados()).toContain('Bearer token-do-keycloak'))
  })

  it('recusa uma conta sem o papel ADM e explica na tela de entrada', async () => {
    keycloak.getUser.mockResolvedValue(usuario(['CLIENTE']))
    abrir('/adm')

    expect(await screen.findByText('Esta conta não tem acesso ao painel do ADM.')).toBeInTheDocument()
    expect(keycloak.removeUser).toHaveBeenCalled()
    expect(fetchFalso).not.toHaveBeenCalled()
  })

  it('na volta do Keycloak, conclui o login e leva à página de onde o ADM saiu', async () => {
    keycloak.signinRedirectCallback.mockImplementation(async () => {
      // Como o de verdade, só avisa do login depois de trocar o código pelos tokens, na rede.
      await new Promise((resolver) => setTimeout(resolver, 0))
      const ana = usuario(['ADM'], { de: '/adm/roteiros' })
      keycloak.aoCarregar.forEach((ouvinte) => ouvinte(ana))
      return ana
    })
    abrir('/adm/entrar/retorno')

    await waitFor(() => expect(fetchFalso).toHaveBeenCalledWith(expect.stringContaining('/api/adm/roteiros'), expect.anything()))
    expect(keycloak.signinRedirectCallback).toHaveBeenCalledOnce()
  })

  it('"Sair" encerra também a sessão no Keycloak', async () => {
    keycloak.getUser.mockResolvedValue(usuario(['ADM']))
    abrir('/adm')

    await userEvent.click(await screen.findByRole('button', { name: 'Sair' }))

    expect(keycloak.signoutRedirect).toHaveBeenCalledOnce()
  })
})
