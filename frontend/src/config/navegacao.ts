import { IconeCasa, IconeConversa, IconeInfo, IconeRota } from '@/components/icones'
import { ROTAS } from '@/constants/rotas'
import type { LinkNavegacao } from '@/types/navegacao'

// Links exibidos no menu do cabeçalho e no rodapé. O ícone aparece no menu do celular.
export const linksNavegacao: LinkNavegacao[] = [
  { rota: ROTAS.inicio, rotulo: 'Início', icone: IconeCasa },
  { rota: ROTAS.roteiros, rotulo: 'Roteiros', icone: IconeRota },
  { rota: ROTAS.sobre, rotulo: 'Sobre', icone: IconeInfo },
  { rota: ROTAS.contato, rotulo: 'Contato', icone: IconeConversa },
]
