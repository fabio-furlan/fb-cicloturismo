// Caminhos de todas as páginas. Use sempre estas constantes em vez de strings soltas.
export const ROTAS = {
  inicio: '/',
  roteiros: '/roteiros',
  sobre: '/sobre',
  contato: '/contato',
  minhaConta: '/minha-conta',
  cadastro: '/cadastro',
  admEntrar: '/adm/entrar',
  admPainel: '/adm',
  admRoteiros: '/adm/roteiros',
  admNovoRoteiro: '/adm/roteiros/novo',
} as const

/** Página de uma saída no painel do ADM. */
export const rotaSaidaAdm = (id: number) => `/adm/saidas/${id}`

/** Edição de um roteiro no painel do ADM. */
export const rotaRoteiroAdm = (id: number) => `/adm/roteiros/${id}`
