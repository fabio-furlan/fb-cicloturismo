import type { Destino, GrupoOpcional, Modalidade, NivelRoteiro, PaisagemRoteiro, StatusSaida } from '@/types/adm'

const data = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' })
const diaMes = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'UTC' })
const reais = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

/** "2026-12-12" → "12/12/2026" */
export const formatarData = (iso: string) => data.format(new Date(iso))

/** "2026-12-12" a "2026-12-14" → "12/12 a 14/12/2026"; num dia só, só a data. */
export function formatarPeriodo(inicio: string, fim: string) {
  return inicio === fim ? formatarData(inicio) : `${diaMes.format(new Date(inicio))} a ${formatarData(fim)}`
}

/** 1490 → "R$ 1.490,00": no painel, os centavos importam. */
export const formatarReais = (valor: number) => reais.format(valor)

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
  CANCELADA: { rotulo: 'Cancelada', classe: 'bg-alerta-600/25 text-[#ff9b8a]' },
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

export const gruposOpcional: Record<GrupoOpcional, { rotulo: string; ajuda: string }> = {
  ACOMODACAO: { rotulo: 'Acomodação', ajuda: 'O participante escolhe uma opção só (por exemplo, quarto individual).' },
  EQUIPAMENTO: { rotulo: 'Equipamento', ajuda: 'Pode somar várias (aluguel de bike, alforjes).' },
  SERVICO: { rotulo: 'Serviço', ajuda: 'Pode somar vários (transfer, seguro).' },
}

export const modalidades: Record<Modalidade, string> = { MTB: 'MTB', SPEED: 'Speed', GRAVEL: 'Gravel', MISTA: 'Mista' }

export const destinos: Record<Destino, string> = { NACIONAL: 'Nacional', INTERNACIONAL: 'Internacional' }

export const niveisRoteiro: Record<NivelRoteiro, string> = {
  RECREATIVO: 'Iniciante',
  INTERMEDIARIO: 'Intermediário',
  AVANCADO: 'Avançado',
}

export const paisagensRoteiro: Record<PaisagemRoteiro, string> = { SERRA: 'Serra', VALE: 'Vales e colônias', FE: 'Caminhos de fé' }
