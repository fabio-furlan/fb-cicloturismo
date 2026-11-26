import type { FotoSobre, Marco, PaginaSobre } from '@/features/institucional'

// O formulário da página "Sobre nós" guarda cada marco e foto com uma chave própria, para o React não confundir os
// itens ao remover ou trocar a ordem. Os campos opcionais ficam como texto vazio enquanto se edita.

export type MarcoForm = Marco & { chave: number }
export type FotoForm = Omit<FotoSobre, 'legenda'> & { chave: number; legenda: string }

export interface EstadoSobre {
  titulo: string
  chamada: string
  historia: string
  citacao: string
  marcos: MarcoForm[]
  fotos: FotoForm[]
}

let ultimaChave = 0
const novaChave = () => ++ultimaChave

export const novoMarco = (): MarcoForm => ({ chave: novaChave(), rotulo: '', titulo: '', texto: '' })
export const novaFoto = (): FotoForm => ({ chave: novaChave(), url: '', descricao: '', legenda: '' })

export function paraEstadoSobre(pagina: PaginaSobre): EstadoSobre {
  return {
    titulo: pagina.titulo,
    chamada: pagina.chamada,
    historia: pagina.historia,
    citacao: pagina.citacao ?? '',
    marcos: pagina.marcos.map((marco) => ({ ...marco, chave: novaChave() })),
    fotos: pagina.fotos.map((foto) => ({ ...foto, legenda: foto.legenda ?? '', chave: novaChave() })),
  }
}

/** O que vai para a API: sem as chaves, sem espaços nas pontas e com os opcionais vazios como `null`. */
export function paraPaginaSobre(estado: EstadoSobre): PaginaSobre {
  const opcional = (texto: string) => texto.trim() || null
  return {
    titulo: estado.titulo.trim(),
    chamada: estado.chamada.trim(),
    historia: estado.historia.trim(),
    citacao: opcional(estado.citacao),
    marcos: estado.marcos.map(({ rotulo, titulo, texto }) => ({ rotulo: rotulo.trim(), titulo: titulo.trim(), texto: texto.trim() })),
    fotos: estado.fotos.map(({ url, descricao, legenda }) => ({
      url: url.trim(),
      descricao: descricao.trim(),
      legenda: opcional(legenda),
    })),
  }
}

/** Troca o item de lugar com o vizinho (`-1`, acima; `1`, abaixo). Nas pontas, devolve a lista como está. */
export function mover<T>(lista: T[], indice: number, sentido: -1 | 1): T[] {
  const destino = indice + sentido
  if (destino < 0 || destino >= lista.length) return lista
  const nova = [...lista]
  ;[nova[indice], nova[destino]] = [nova[destino], nova[indice]]
  return nova
}

/** O primeiro problema que impede salvar, ou `null`. Os limites de tamanho ficam nos próprios campos (maxLength). */
export function validarSobre(estado: EstadoSobre): string | null {
  if (!estado.titulo.trim() || !estado.chamada.trim() || !estado.historia.trim()) return 'Preencha o título, a chamada e a história.'
  const marcoIncompleto = estado.marcos.findIndex((m) => !m.rotulo.trim() || !m.titulo.trim() || !m.texto.trim())
  if (marcoIncompleto >= 0) return `Complete o marco ${marcoIncompleto + 1} da linha do tempo (momento, título e texto) ou remova-o.`
  const fotoIncompleta = estado.fotos.findIndex((f) => !f.url.trim() || !f.descricao.trim())
  if (fotoIncompleta >= 0) return `Informe o endereço e a descrição da foto ${fotoIncompleta + 1} ou remova-a.`
  return null
}
