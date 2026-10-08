import type { DadosRoteiro, DadosSaida, NovoOpcional, PeriodoSaida, ResumoSaida, RoteiroAdm, SaidaAdm, TokenEmitido } from '@/types/adm'
import { ErroApi, requisitar } from './api'

export const entrar = (email: string, senha: string) =>
  requisitar<TokenEmitido>('/api/auth/login', { metodo: 'POST', corpo: { email, senha } })

/**
 * As chamadas do painel, já com o token. Quando a API responde 401 (token expirado ou conta removida), avisa quem
 * criou o cliente para encerrar a sessão, e repassa o erro.
 */
export function criarApiAdm(token: string, aoPerderAcesso: () => void) {
  async function chamar<T>(caminho: string, opcoes: Parameters<typeof requisitar>[1] = {}) {
    try {
      return await requisitar<T>(caminho, { ...opcoes, token })
    } catch (erro) {
      if (erro instanceof ErroApi && erro.status === 401) aoPerderAcesso()
      throw erro
    }
  }

  return {
    proximasSaidas: (sinal?: AbortSignal) => chamar<ResumoSaida[]>('/api/adm/saidas', { sinal }),
    saida: (id: number, sinal?: AbortSignal) => chamar<SaidaAdm>(`/api/adm/saidas/${id}`, { sinal }),
    alterarSaida: (id: number, dados: DadosSaida) => chamar<SaidaAdm>(`/api/adm/saidas/${id}`, { metodo: 'PUT', corpo: dados }),
    publicar: (id: number) => chamar<SaidaAdm>(`/api/adm/saidas/${id}/publicar`, { metodo: 'POST' }),
    cancelar: (id: number) => chamar<SaidaAdm>(`/api/adm/saidas/${id}/cancelar`, { metodo: 'POST' }),
    duplicar: (id: number, periodo: PeriodoSaida) =>
      chamar<SaidaAdm>(`/api/adm/saidas/${id}/duplicar`, { metodo: 'POST', corpo: periodo }),
    excluirSaida: (id: number) => chamar<void>(`/api/adm/saidas/${id}`, { metodo: 'DELETE' }),
    adicionarOpcional: (id: number, opcional: NovoOpcional) =>
      chamar<SaidaAdm>(`/api/adm/saidas/${id}/opcionais`, { metodo: 'POST', corpo: opcional }),
    removerOpcional: (id: number, opcionalId: number) =>
      chamar<SaidaAdm>(`/api/adm/saidas/${id}/opcionais/${opcionalId}`, { metodo: 'DELETE' }),
    roteiros: (sinal?: AbortSignal) => chamar<RoteiroAdm[]>('/api/adm/roteiros', { sinal }),
    roteiro: (id: number, sinal?: AbortSignal) => chamar<RoteiroAdm>(`/api/adm/roteiros/${id}`, { sinal }),
    criarRoteiro: (dados: DadosRoteiro) => chamar<RoteiroAdm>('/api/adm/roteiros', { metodo: 'POST', corpo: dados }),
    atualizarRoteiro: (id: number, dados: DadosRoteiro) =>
      chamar<RoteiroAdm>(`/api/adm/roteiros/${id}`, { metodo: 'PUT', corpo: dados }),
    excluirRoteiro: (id: number) => chamar<void>(`/api/adm/roteiros/${id}`, { metodo: 'DELETE' }),
    saidasDoRoteiro: (roteiroId: number, sinal?: AbortSignal) =>
      chamar<ResumoSaida[]>(`/api/adm/roteiros/${roteiroId}/saidas`, { sinal }),
    criarSaida: (roteiroId: number, dados: DadosSaida) =>
      chamar<SaidaAdm>(`/api/adm/roteiros/${roteiroId}/saidas`, { metodo: 'POST', corpo: dados }),
  }
}

export type ApiAdm = ReturnType<typeof criarApiAdm>
