// API pública do domínio de roteiros. Fora desta pasta, importe sempre daqui (`@/features/roteiros`), nunca de um
// arquivo interno: assim a organização interna pode mudar sem quebrar quem usa.

export type { Etapa, Foto, Nivel, Paisagem, Roteiro, Saida } from './types'
export type { NivelApi, PaisagemApi } from './api/adaptadorRoteiro'

export { nivelDaApi, paisagemDaApi } from './api/adaptadorRoteiro'
export { useRoteiros } from './hooks/useRoteiros'

export { ErroNoCatalogo } from './components/ErroNoCatalogo'
export { IndicadorNivel } from './components/IndicadorNivel'

export { nivelPara, niveis, ordemNiveis } from './config/niveis'
export { paisagens } from './config/paisagens'

export {
  corDaFaixa,
  descreverDuracao,
  detalharRota,
  type FaixaInclinacao,
  faixaDaInclinacao,
  faixasInclinacao,
  limitesDasEtapas,
  type PontoRota,
} from './utils/perfil'
export { contarRoteiros, filtrarSaidas, type FiltrosViagem, filtrosVazios, mesesComSaida } from './utils/saidas'
