// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { Rotas } from './Rotas'

// O jsdom não tem as APIs de layout e de rolagem que as páginas usam para animações e medidas. Aqui elas só precisam
// existir: o teste confere que cada página abre sem erro, não o visual.
beforeAll(() => {
  class ObservadorVazio {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  }
  vi.stubGlobal('IntersectionObserver', ObservadorVazio)
  vi.stubGlobal('ResizeObserver', ObservadorVazio)
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} }))
  window.scrollTo = () => {}
  Element.prototype.scrollIntoView = () => {}
})

const abrir = (endereco: string) =>
  render(
    <MemoryRouter initialEntries={[endereco]}>
      <Rotas />
    </MemoryRouter>,
  )

// As páginas são carregadas sob demanda: a primeira a abrir no teste ainda é compilada na hora, e pode passar de 1 s.
const ESPERA_PAGINA = { timeout: 10_000 }

// Sem VITE_API_URL nos testes, o catálogo vem dos dados de exemplo: as páginas abrem sem servidor.
describe('rotas do site', () => {
  it.each([
    ['/', /Viagens de bicicleta/i],
    ['/roteiros', /roteiros?/i],
    ['/sobre', /Sobre nós/i],
    ['/contato', /Contato/i],
    ['/minha-conta', /Bem-vindo de volta/i],
    ['/cadastro', /Crie sua conta/i],
    ['/recuperar-senha', /Esqueceu a senha/i],
    ['/um-endereco-que-nao-existe', /Página não encontrada/i],
  ])('%s abre com o título da página', async (endereco, titulo) => {
    abrir(endereco)
    expect(await screen.findByRole('heading', { level: 1, name: titulo }, ESPERA_PAGINA)).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('o painel do ADM manda quem não entrou para o login', async () => {
    abrir('/adm/roteiros')
    expect(await screen.findByRole('heading', { level: 1, name: 'Painel do ADM' }, ESPERA_PAGINA)).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
  })
})
