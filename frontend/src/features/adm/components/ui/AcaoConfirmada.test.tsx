// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AcaoConfirmada } from './AcaoConfirmada'

const desenhar = (aoConfirmar = vi.fn<() => Promise<void>>(async () => {})) => {
  render(<AcaoConfirmada rotulo="Excluir roteiro" pergunta="Excluir este roteiro?" confirmar="Sim, excluir" aoConfirmar={aoConfirmar} />)
  return { aoConfirmar, usuario: userEvent.setup() }
}

describe('AcaoConfirmada', () => {
  it('o primeiro clique só pede confirmação', async () => {
    const { aoConfirmar, usuario } = desenhar()
    await usuario.click(screen.getByRole('button', { name: 'Excluir roteiro' }))

    expect(screen.getByRole('group', { name: 'Excluir este roteiro?' })).toBeInTheDocument()
    expect(aoConfirmar).not.toHaveBeenCalled()
  })

  it('executa a ação ao confirmar e volta ao botão inicial', async () => {
    const { aoConfirmar, usuario } = desenhar()
    await usuario.click(screen.getByRole('button', { name: 'Excluir roteiro' }))
    await usuario.click(screen.getByRole('button', { name: 'Sim, excluir' }))

    expect(aoConfirmar).toHaveBeenCalledOnce()
    expect(screen.getByRole('button', { name: 'Excluir roteiro' })).toBeInTheDocument()
  })

  it('"Voltar" desiste sem executar nada', async () => {
    const { aoConfirmar, usuario } = desenhar()
    await usuario.click(screen.getByRole('button', { name: 'Excluir roteiro' }))
    await usuario.click(screen.getByRole('button', { name: 'Voltar' }))

    expect(aoConfirmar).not.toHaveBeenCalled()
    expect(screen.queryByRole('group')).not.toBeInTheDocument()
  })

  it('trava os botões enquanto a ação roda', async () => {
    let concluir!: () => void
    const { usuario } = desenhar(vi.fn<() => Promise<void>>(() => new Promise<void>((ok) => (concluir = ok))))
    await usuario.click(screen.getByRole('button', { name: 'Excluir roteiro' }))
    await usuario.click(screen.getByRole('button', { name: 'Sim, excluir' }))

    expect(screen.getByRole('button', { name: 'Sim, excluir' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Sim, excluir' })).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('button', { name: 'Voltar' })).toBeDisabled()
    concluir()
    expect(await screen.findByRole('button', { name: 'Excluir roteiro' })).toBeEnabled()
  })
})
