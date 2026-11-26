import { describe, expect, it } from 'vitest'
import { paginaSobrePadrao } from '../data/paginaSobrePadrao'
import { paragrafos } from './paragrafos'

describe('paragrafos', () => {
  it('separa por linha em branco, ignorando espaços e linhas vazias a mais', () => {
    expect(paragrafos('Primeiro.\n\nSegundo,\nainda o segundo.\n \n\n  Terceiro.  \n')).toEqual([
      'Primeiro.',
      'Segundo,\nainda o segundo.',
      'Terceiro.',
    ])
  })

  it('texto vazio não tem parágrafos', () => {
    expect(paragrafos('  \n\n ')).toEqual([])
  })

  it('o texto padrão respeita os limites da API', () => {
    const { titulo, chamada, historia, citacao, marcos, fotos } = paginaSobrePadrao
    expect(titulo.length).toBeLessThanOrEqual(120)
    expect(chamada.length).toBeLessThanOrEqual(500)
    expect(historia.length).toBeLessThanOrEqual(20_000)
    expect(citacao?.length ?? 0).toBeLessThanOrEqual(300)
    expect(marcos.length).toBeLessThanOrEqual(8)
    expect(fotos.length).toBeLessThanOrEqual(8)
    for (const marco of marcos) {
      expect(marco.rotulo.length).toBeLessThanOrEqual(40)
      expect(marco.texto.length).toBeLessThanOrEqual(600)
    }
    for (const foto of fotos) expect(foto.legenda?.length ?? 0).toBeLessThanOrEqual(160)
  })
})
