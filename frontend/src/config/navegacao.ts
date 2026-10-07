import { ROTAS } from '@/constants/rotas'
import type { LinkNavegacao } from '@/types/navegacao'

// Links exibidos no menu do cabeçalho e no rodapé.
export const linksNavegacao: LinkNavegacao[] = [
  { rota: ROTAS.inicio, rotulo: 'Início' },
  { rota: ROTAS.roteiros, rotulo: 'Roteiros' },
  { rota: ROTAS.sobre, rotulo: 'Sobre' },
  { rota: ROTAS.contato, rotulo: 'Contato' },
]
