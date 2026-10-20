import type { User } from 'oidc-client-ts'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { administradorDe, keycloakConfigurado, temPapelAdm } from './keycloak'

const usuario = (profile: Record<string, unknown>) => ({ profile: { sub: 'u1', ...profile } }) as unknown as User

afterEach(() => vi.unstubAllEnvs())

describe('keycloakConfigurado', () => {
  it('liga o Keycloak só com o endereço do realm', () => {
    vi.stubEnv('VITE_KEYCLOAK_URL', '')
    expect(keycloakConfigurado()).toBe(false)

    vi.stubEnv('VITE_KEYCLOAK_URL', 'http://localhost:8180/realms/fb-cicloturismo/')
    expect(keycloakConfigurado()).toBe(true)
  })
})

describe('temPapelAdm', () => {
  it('confere o papel ADM no claim papeis', () => {
    expect(temPapelAdm(usuario({ papeis: ['CLIENTE', 'ADM'] }))).toBe(true)
    expect(temPapelAdm(usuario({ papeis: ['CLIENTE'] }))).toBe(false)
  })

  it('sem o claim, ou com um formato inesperado, não é ADM', () => {
    expect(temPapelAdm(usuario({}))).toBe(false)
    expect(temPapelAdm(usuario({ papeis: 'ADM' }))).toBe(false)
  })
})

describe('administradorDe', () => {
  it('usa o nome completo e o e-mail do token', () => {
    expect(administradorDe(usuario({ name: 'Ana Souza', given_name: 'Ana', email: 'ana@exemplo.com' }))).toEqual({
      nome: 'Ana Souza',
      email: 'ana@exemplo.com',
    })
  })

  it('sem o nome completo, usa o primeiro nome ou o usuário', () => {
    expect(administradorDe(usuario({ given_name: 'Ana' })).nome).toBe('Ana')
    expect(administradorDe(usuario({ preferred_username: 'ana.souza' })).nome).toBe('ana.souza')
  })
})
