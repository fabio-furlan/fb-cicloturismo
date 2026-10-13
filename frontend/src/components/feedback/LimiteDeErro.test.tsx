// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LimiteDeErro } from './LimiteDeErro'

function Explode({ explodir }: { explodir: boolean }) {
  if (explodir) throw new Error('falhou ao desenhar')
  return <p>Conteúdo da página</p>
}

describe('LimiteDeErro', () => {
  // O React e o próprio limite registram o erro no console; aqui isso é esperado e só polui a saída.
  const silenciarConsole = () => vi.spyOn(console, 'error').mockImplementation(() => {})

  it('mostra o conteúdo quando nada dá errado', () => {
    render(
      <LimiteDeErro>
        <Explode explodir={false} />
      </LimiteDeErro>,
    )
    expect(screen.getByText('Conteúdo da página')).toBeInTheDocument()
  })

  it('troca uma tela quebrada por uma mensagem, em vez de deixar a página em branco', () => {
    silenciarConsole()
    render(
      <LimiteDeErro>
        <Explode explodir />
      </LimiteDeErro>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Algo deu errado nesta página')
    expect(screen.getByRole('button', { name: 'Tentar de novo' })).toBeInTheDocument()
  })

  it('aceita uma alternativa própria', () => {
    silenciarConsole()
    render(
      <LimiteDeErro alternativa={<p>Gráfico indisponível</p>}>
        <Explode explodir />
      </LimiteDeErro>,
    )
    expect(screen.getByText('Gráfico indisponível')).toBeInTheDocument()
  })

  it('tenta de novo quando reiniciarCom muda, como ao trocar de página', () => {
    silenciarConsole()
    const { rerender } = render(
      <LimiteDeErro reiniciarCom="/roteiros">
        <Explode explodir />
      </LimiteDeErro>,
    )
    expect(screen.getByRole('alert')).toBeInTheDocument()

    rerender(
      <LimiteDeErro reiniciarCom="/sobre">
        <Explode explodir={false} />
      </LimiteDeErro>,
    )
    expect(screen.getByText('Conteúdo da página')).toBeInTheDocument()
  })
})
