import { useRecurso } from '@/hooks/useRecurso'
import { buscarSobre } from '../api/buscarSobre'
import { paginaSobrePadrao } from '../data/paginaSobrePadrao'

// A página é institucional: se a API falhar, mostra o texto padrão em vez de uma tela de erro.
async function carregarSobre(sinal: AbortSignal) {
  try {
    return await buscarSobre(sinal)
  } catch (erro) {
    if (sinal.aborted) throw erro
    console.error('Não foi possível carregar a página Sobre nós; mostrando o texto padrão.', erro)
    return paginaSobrePadrao
  }
}

/** O conteúdo da página "Sobre nós", carregado uma vez ao montar. */
export const useSobre = () => useRecurso(carregarSobre, []).estado
