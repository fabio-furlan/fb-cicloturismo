/** Um ponto da linha do tempo da página "Sobre nós". `rotulo` é o momento, curto ("A primeira travessia", "Hoje"). */
export interface Marco {
  rotulo: string
  titulo: string
  texto: string
}

/** Foto da página "Sobre nós". `descricao` é o texto alternativo; `legenda`, a frase embaixo da foto. */
export interface FotoSobre {
  url: string
  descricao: string
  legenda: string | null
}

/** O conteúdo da página "Sobre nós". Na `historia`, uma linha em branco separa os parágrafos. */
export interface PaginaSobre {
  titulo: string
  chamada: string
  historia: string
  citacao: string | null
  marcos: Marco[]
  fotos: FotoSobre[]
}
