import { describe, expect, it } from 'vitest'
import { paginaSobrePadrao } from '@/features/institucional'
import { mover, novaFoto, novoMarco, paraEstadoSobre, paraPaginaSobre, validarSobre } from './formularioSobre'

describe('formulário da página Sobre nós', () => {
  it('ida e volta sem perder nada', () => {
    expect(paraPaginaSobre(paraEstadoSobre(paginaSobrePadrao))).toEqual(paginaSobrePadrao)
  })

  it('opcionais vazios viram null e os textos perdem os espaços das pontas', () => {
    const estado = { ...paraEstadoSobre(paginaSobrePadrao), titulo: '  Título  ', citacao: '   ' }
    estado.fotos = [{ ...novaFoto(), url: ' /foto.jpg ', descricao: 'Foto', legenda: ' ' }]
    const pagina = paraPaginaSobre(estado)
    expect(pagina.titulo).toBe('Título')
    expect(pagina.citacao).toBeNull()
    expect(pagina.fotos).toEqual([{ url: '/foto.jpg', descricao: 'Foto', legenda: null }])
  })

  it('aponta o marco ou a foto incompleta pelo número', () => {
    const estado = paraEstadoSobre(paginaSobrePadrao)
    expect(validarSobre(estado)).toBeNull()
    expect(validarSobre({ ...estado, marcos: [...estado.marcos, novoMarco()] })).toMatch(/marco 5/)
    expect(validarSobre({ ...estado, fotos: [novaFoto()] })).toMatch(/foto 1/)
    expect(validarSobre({ ...estado, historia: '  ' })).toMatch(/história/)
  })

  it('move itens para cima e para baixo, sem sair das pontas', () => {
    expect(mover(['a', 'b', 'c'], 1, -1)).toEqual(['b', 'a', 'c'])
    expect(mover(['a', 'b', 'c'], 1, 1)).toEqual(['a', 'c', 'b'])
    expect(mover(['a', 'b'], 0, -1)).toEqual(['a', 'b'])
  })
})
