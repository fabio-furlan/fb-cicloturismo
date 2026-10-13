import { useLocation } from 'react-router-dom'

/**
 * O que uma tela do painel passa para a próxima ao navegar (`navegar(rota, { state })`). O `state` vem do histórico do
 * navegador, então é lido como opcional: depois de um F5 ou de abrir o link direto, ele não existe.
 */
export interface EstadoDaNavegacao {
  /** Mensagem de sucesso para a tela de destino mostrar (por exemplo, "Saída criada como rascunho"). */
  aviso?: string
  /** De onde a pessoa foi mandada para o login, para voltar depois de entrar. */
  de?: string
}

export const useEstadoDaNavegacao = (): EstadoDaNavegacao => (useLocation().state as EstadoDaNavegacao | null) ?? {}
