import { niveis, nivelDaApi, paisagemDaApi, paisagens } from '@/features/roteiros'
import type { Destino, GrupoOpcional, Modalidade, NivelRoteiro, PaisagemRoteiro, StatusSaida, TipoImagem } from '../types'

// Textos e cores de cada valor que a API do ADM devolve. Ficam aqui, e não nas telas, para uma mudança de nome
// (como "Recreativo" virar "Iniciante") valer no painel inteiro.

interface InfoStatus {
  rotulo: string
  /** Classes do selo: cor de fundo e de texto. */
  classe: string
}

export const statusSaida: Record<StatusSaida, InfoStatus> = {
  RASCUNHO: { rotulo: 'Rascunho', classe: 'bg-white/10 text-creme-100' },
  ABERTA: { rotulo: 'Aberta', classe: 'bg-rampa-leve/20 text-rampa-leve' },
  ESGOTADA: { rotulo: 'Esgotada', classe: 'bg-vermelho-500/20 text-sol-400' },
  INSCRICOES_ENCERRADAS: { rotulo: 'Inscrições encerradas', classe: 'bg-rampa-moderada/20 text-rampa-moderada' },
  EM_ANDAMENTO: { rotulo: 'Em andamento', classe: 'bg-rampa-descida/20 text-rampa-descida' },
  FINALIZADA: { rotulo: 'Finalizada', classe: 'bg-white/5 text-cinza-400' },
  CANCELADA: { rotulo: 'Cancelada', classe: 'bg-alerta-600/25 text-alerta-300' },
}

/** Ordem dos filtros do dashboard: primeiro o que pede atenção. */
export const ordemStatus: StatusSaida[] = [
  'ABERTA',
  'ESGOTADA',
  'INSCRICOES_ENCERRADAS',
  'RASCUNHO',
  'EM_ANDAMENTO',
  'CANCELADA',
  'FINALIZADA',
]

/** Saídas que ainda vendem ou podem vender: entram na conta de vagas vendidas do dashboard. */
export const statusAVenda: StatusSaida[] = ['ABERTA', 'ESGOTADA', 'INSCRICOES_ENCERRADAS']

export const gruposOpcional: Record<GrupoOpcional, { rotulo: string; ajuda: string }> = {
  ACOMODACAO: { rotulo: 'Acomodação', ajuda: 'O participante escolhe uma opção só (por exemplo, quarto individual).' },
  EQUIPAMENTO: { rotulo: 'Equipamento', ajuda: 'Pode somar várias (aluguel de bike, alforjes).' },
  SERVICO: { rotulo: 'Serviço', ajuda: 'Pode somar vários (transfer, seguro).' },
}

export const modalidades: Record<Modalidade, string> = { MTB: 'MTB', SPEED: 'Speed', GRAVEL: 'Gravel', MISTA: 'Mista' }

export const destinos: Record<Destino, string> = { NACIONAL: 'Nacional', INTERNACIONAL: 'Internacional' }

export const tiposImagem: Record<TipoImagem, string> = { BANNER: 'Banner (foto principal)', GALERIA: 'Galeria' }

/** Os mesmos nomes que o site mostra, para o ADM ver o nível e a paisagem como o cliente os vê. */
export const niveisRoteiro: Record<NivelRoteiro, string> = {
  RECREATIVO: niveis[nivelDaApi.RECREATIVO].nome,
  INTERMEDIARIO: niveis[nivelDaApi.INTERMEDIARIO].nome,
  AVANCADO: niveis[nivelDaApi.AVANCADO].nome,
}

export const paisagensRoteiro: Record<PaisagemRoteiro, string> = {
  SERRA: paisagens[paisagemDaApi.SERRA],
  VALE: paisagens[paisagemDaApi.VALE],
  FE: paisagens[paisagemDaApi.FE],
}
