// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Cadastro } from '../Cadastro/Cadastro'
import { RecuperarSenha } from '../RecuperarSenha/RecuperarSenha'
import { MinhaConta } from './MinhaConta'

const abrir = (tela: ReactNode) => render(<MemoryRouter>{tela}</MemoryRouter>)

describe('tela de entrar', () => {
  it('aponta os campos vazios e não mostra o aviso', async () => {
    abrir(<MinhaConta />)
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(screen.getByText('Informe o seu e-mail.')).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('com os dados certos, avisa que o acesso chega em breve', async () => {
    abrir(<MinhaConta />)
    await userEvent.type(screen.getByLabelText('E-mail'), 'ana@exemplo.com')
    await userEvent.type(screen.getByLabelText('Senha'), 'pedal2026')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(screen.getByRole('status')).toHaveTextContent(/chega em breve/)
  })

  it('mostra e esconde a senha', async () => {
    abrir(<MinhaConta />)
    const senha = screen.getByLabelText('Senha')
    expect(senha).toHaveAttribute('type', 'password')
    await userEvent.click(screen.getByRole('button', { name: 'Mostrar a senha' }))
    expect(senha).toHaveAttribute('type', 'text')
  })
})

describe('tela de criar conta', () => {
  it('formata o celular e confere a confirmação da senha', async () => {
    abrir(<Cadastro />)
    await userEvent.type(screen.getByLabelText('Nome completo'), 'Ana Souza')
    await userEvent.type(screen.getByLabelText('E-mail'), 'ana@exemplo.com')
    await userEvent.type(screen.getByLabelText('Celular (WhatsApp)'), '11912345678')
    expect(screen.getByLabelText('Celular (WhatsApp)')).toHaveValue('(11) 91234-5678')
    await userEvent.type(screen.getByLabelText('Senha'), 'pedal2026')
    await userEvent.type(screen.getByLabelText('Confirme a senha'), 'outra2026')
    await userEvent.click(screen.getByRole('button', { name: 'Criar conta' }))
    expect(screen.getByText('As senhas não são iguais.')).toBeInTheDocument()

    await userEvent.clear(screen.getByLabelText('Confirme a senha'))
    await userEvent.type(screen.getByLabelText('Confirme a senha'), 'pedal2026')
    await userEvent.click(screen.getByRole('button', { name: 'Criar conta' }))
    expect(screen.getByRole('status')).toHaveTextContent(/chega em breve/)
  })
})

describe('tela de recuperar senha', () => {
  it('chega pelo "Esqueci minha senha" com o e-mail já digitado e avisa ao enviar', async () => {
    render(
      <MemoryRouter initialEntries={['/minha-conta']}>
        <Routes>
          <Route path="/minha-conta" element={<MinhaConta />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        </Routes>
      </MemoryRouter>,
    )
    await userEvent.type(screen.getByLabelText('E-mail'), 'ana@exemplo.com')
    await userEvent.click(screen.getByRole('link', { name: 'Esqueci minha senha' }))

    expect(screen.getByRole('heading', { level: 1, name: 'Esqueceu a senha?' })).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail da conta')).toHaveValue('ana@exemplo.com')
    await userEvent.click(screen.getByRole('button', { name: 'Enviar link' }))
    expect(screen.getByRole('status')).toHaveTextContent(/recuperação de senha chega/)
  })

  it('aponta o e-mail inválido', async () => {
    abrir(<RecuperarSenha />)
    await userEvent.type(screen.getByLabelText('E-mail da conta'), 'ana@')
    await userEvent.click(screen.getByRole('button', { name: 'Enviar link' }))
    expect(screen.getByText(/Confira o e-mail/)).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
