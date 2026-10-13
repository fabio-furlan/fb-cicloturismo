import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ErroAoCarregar } from './ErroAoCarregar'

interface LimiteDeErroProps {
  children: ReactNode
  /** O que mostrar no lugar do conteúdo que falhou. Sem ele, uma página de erro com a opção de recarregar. */
  alternativa?: ReactNode
  /**
   * Quando este valor muda, um erro mostrado é descartado e o conteúdo é desenhado de novo (por exemplo, o endereço:
   * trocar de página dá uma nova chance). Sem erro, a mudança não faz nada, e o estado das telas é preservado.
   */
  reiniciarCom?: unknown
}

interface EstadoLimiteDeErro {
  erro: Error | null
  /** O `reiniciarCom` da última vez que o conteúdo foi desenhado, para perceber quando ele muda. */
  chave: unknown
}

/**
 * Error Boundary: um erro ao desenhar uma parte da tela mostra uma mensagem no lugar dela, em vez de deixar a página
 * inteira em branco. Com `reiniciarCom`, volta a tentar sozinho quando esse valor muda (veja `app/Rotas`).
 * Erros de eventos e de código assíncrono não passam por aqui: cada tela os trata onde acontecem.
 */
export class LimiteDeErro extends Component<LimiteDeErroProps, EstadoLimiteDeErro> {
  state: EstadoLimiteDeErro = { erro: null, chave: this.props.reiniciarCom }

  static getDerivedStateFromError(erro: Error): Partial<EstadoLimiteDeErro> {
    return { erro }
  }

  static getDerivedStateFromProps(props: LimiteDeErroProps, estado: EstadoLimiteDeErro): Partial<EstadoLimiteDeErro> | null {
    return Object.is(props.reiniciarCom, estado.chave) ? null : { erro: null, chave: props.reiniciarCom }
  }

  componentDidCatch(erro: Error, info: ErrorInfo) {
    console.error('Erro ao desenhar a tela.', erro, info.componentStack)
  }

  render() {
    if (!this.state.erro) return this.props.children
    return (
      this.props.alternativa ?? (
        <ErroAoCarregar
          titulo="Algo deu errado nesta página"
          descricao="Recarregue a página para tentar de novo. Se continuar, fale com a gente pelo contato."
          aoTentarDeNovo={() => window.location.reload()}
        />
      )
    )
  }
}
