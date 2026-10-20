// API pública do domínio do painel do ADM. As telas (`pages/Adm`) importam daqui (`@/features/adm`), nunca de um
// arquivo interno. Este domínio só é usado pelo pacote do painel, carregado sob demanda: o site público não o baixa.

export type * from './types'

export { entrar } from './api/apiAdm'
export { ProvedorSessaoAdm } from './sessao/ProvedorSessaoAdm'
export { type AdministradorLogado, useApiAdm, useSessaoAdm } from './sessao/contexto'
export { concluirLogin } from './sessao/keycloak'
export { type EstadoDaNavegacao, useEstadoDaNavegacao } from './hooks/useEstadoDaNavegacao'

export { niveisRoteiro, ordemStatus, statusAVenda, statusSaida } from './config/rotulos'

export { AcaoConfirmada } from './components/ui/AcaoConfirmada'
export { Aviso, type Mensagem } from './components/ui/Aviso'
export { Botao } from './components/ui/Botao'
export { CabecalhoTela } from './components/ui/CabecalhoTela'
export { Campo } from './components/ui/campos'
export { Cartao } from './components/ui/Cartao'
export { ErroNoPainel } from './components/ui/ErroNoPainel'
export { SeloStatus } from './components/ui/SeloStatus'

export { FormularioRoteiro } from './components/roteiros/FormularioRoteiro'
export { FormularioSaida } from './components/saidas/FormularioSaida'
export { Opcionais } from './components/saidas/Opcionais'
export { TabelaSaidas } from './components/saidas/TabelaSaidas'
