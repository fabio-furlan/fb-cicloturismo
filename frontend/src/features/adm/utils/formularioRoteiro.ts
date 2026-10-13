import { lerNumero } from '@/utils/formatacao'
import type { DadosRoteiro, Destino, Modalidade, NivelRoteiro, PaisagemRoteiro, TipoImagem } from '../types'

// O estado do formulário de roteiro e a conversão de/para o formato da API. Os campos numéricos ficam como texto
// enquanto se digita (um campo vazio é "", não 0) e viram número só no envio.

export interface EtapaForm {
  /** Identidade estável do item na lista, para o React não trocar um campo pelo outro ao remover. */
  chave: number
  dia: string
  titulo: string
  distanciaKm: string
  subidaM: string
}

export interface ImagemForm {
  chave: number
  tipo: TipoImagem
  url: string
  descricao: string
  autor: string
  origem: string
}

export interface EstadoForm {
  titulo: string
  regiao: string
  descricao: string
  modalidade: Modalidade
  destino: Destino
  nivel: NivelRoteiro
  paisagem: PaisagemRoteiro
  dias: string
  subidaTotalM: string
  altitudes: string
  etapas: EtapaForm[]
  imagens: ImagemForm[]
}

let ultimaChave = 0
const novaChave = () => ++ultimaChave

export const novaEtapa = (dia: number): EtapaForm => ({ chave: novaChave(), dia: String(dia), titulo: '', distanciaKm: '', subidaM: '' })

export const novaImagem = (tipo: TipoImagem): ImagemForm => ({ chave: novaChave(), tipo, url: '', descricao: '', autor: '', origem: '' })

/** O formulário preenchido com um roteiro da API, ou em branco para um roteiro novo. */
export function paraEstado(inicial?: DadosRoteiro): EstadoForm {
  if (!inicial) {
    return {
      titulo: '',
      regiao: '',
      descricao: '',
      modalidade: 'MTB',
      destino: 'NACIONAL',
      nivel: 'INTERMEDIARIO',
      paisagem: 'SERRA',
      dias: '1',
      subidaTotalM: '',
      altitudes: '',
      etapas: [novaEtapa(1)],
      imagens: [],
    }
  }
  return {
    titulo: inicial.titulo,
    regiao: inicial.regiao,
    descricao: inicial.descricao,
    modalidade: inicial.modalidade,
    destino: inicial.destino,
    nivel: inicial.nivel,
    paisagem: inicial.paisagem,
    dias: String(inicial.dias),
    subidaTotalM: String(inicial.subidaTotalM),
    altitudes: inicial.altitudes.join(', '),
    etapas: inicial.etapas.map((e) => ({
      chave: novaChave(),
      dia: String(e.dia),
      titulo: e.titulo,
      distanciaKm: String(e.distanciaKm),
      subidaM: e.subidaM == null ? '' : String(e.subidaM),
    })),
    imagens: inicial.imagens.map((i) => ({
      chave: novaChave(),
      tipo: i.tipo,
      url: i.url,
      descricao: i.descricao,
      autor: i.autor ?? '',
      origem: i.origem ?? '',
    })),
  }
}

export interface AltitudesLidas {
  valores: number[]
  /** Trechos digitados que não são números inteiros. Com algum, `valores` fica vazio. */
  invalidas: string[]
}

/** Lê a lista de altitudes colada (números separados por vírgula, ponto e vírgula, espaço ou linha). */
export function lerAltitudes(texto: string): AltitudesLidas {
  const partes = texto.split(/[\s,;]+/).filter(Boolean)
  const invalidas = partes.filter((parte) => !/^-?\d+$/.test(parte))
  return { valores: invalidas.length ? [] : partes.map(Number), invalidas }
}

/** Soma das subidas entre pontos consecutivos: a subida acumulada que o perfil indica. */
export const subidaDoPerfil = (altitudes: number[]) =>
  altitudes.reduce((total, altitude, i) => (i > 0 && altitude > altitudes[i - 1] ? total + altitude - altitudes[i - 1] : total), 0)

/** Soma das distâncias das etapas preenchidas, em km. */
export const distanciaTotal = (etapas: EtapaForm[]) => etapas.reduce((total, e) => total + (lerNumero(e.distanciaKm) || 0), 0)

/** O próximo dia depois da última etapa, para a etapa nova já vir numerada. */
export const proximoDia = (etapas: EtapaForm[]) => Math.max(0, ...etapas.map((e) => lerNumero(e.dia) || 0)) + 1

/**
 * As regras que o navegador não confere sozinho (os campos obrigatórios e os limites ele já confere). As que dependem
 * de mais de um campo (etapa depois do último dia, mais de um banner) ficam para a API, que explica o problema.
 * Devolve a explicação do primeiro problema, ou `null` se estiver tudo certo.
 */
export function validar(estado: EstadoForm, altitudes: AltitudesLidas): string | null {
  if (altitudes.invalidas.length) {
    return `As altitudes têm valores que não são números inteiros: ${altitudes.invalidas.slice(0, 5).join(', ')}.`
  }
  if (altitudes.valores.length < 2) return 'Informe pelo menos 2 altitudes para o perfil do percurso.'
  if (estado.etapas.length === 0) return 'O roteiro precisa de pelo menos uma etapa (um dia de pedal).'
  return null
}

/** O corpo que a API espera, com os textos aparados e os números convertidos. */
export function paraDadosRoteiro(estado: EstadoForm, altitudes: number[]): DadosRoteiro {
  return {
    titulo: estado.titulo.trim(),
    regiao: estado.regiao.trim(),
    descricao: estado.descricao.trim(),
    modalidade: estado.modalidade,
    destino: estado.destino,
    nivel: estado.nivel,
    paisagem: estado.paisagem,
    dias: lerNumero(estado.dias),
    subidaTotalM: lerNumero(estado.subidaTotalM),
    altitudes,
    etapas: estado.etapas.map((e) => ({
      dia: lerNumero(e.dia),
      titulo: e.titulo.trim(),
      distanciaKm: lerNumero(e.distanciaKm),
      subidaM: e.subidaM.trim() ? lerNumero(e.subidaM) : null,
    })),
    imagens: estado.imagens.map((i) => ({
      tipo: i.tipo,
      url: i.url.trim(),
      descricao: i.descricao.trim(),
      autor: i.autor.trim() || null,
      origem: i.origem.trim() || null,
    })),
  }
}
