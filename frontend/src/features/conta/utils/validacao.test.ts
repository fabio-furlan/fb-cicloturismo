import { describe, expect, it } from 'vitest'
import { formatarTelefone, validarCadastro, validarEntrada, validarRecuperacao } from './validacao'

const cadastroValido = {
  nome: 'Ana Souza',
  email: 'ana@exemplo.com.br',
  telefone: '(11) 91234-5678',
  senha: 'pedal2026',
  confirmacao: 'pedal2026',
}

describe('validarEntrada', () => {
  it('aceita e-mail e senha preenchidos', () => {
    expect(validarEntrada({ email: 'ana@exemplo.com', senha: 'qualquer' })).toEqual({})
  })

  it('aponta campos vazios e e-mail sem domínio', () => {
    expect(validarEntrada({ email: '', senha: '' })).toEqual({ email: 'Informe o seu e-mail.', senha: 'Informe a sua senha.' })
    expect(validarEntrada({ email: 'ana@exemplo', senha: 'x' }).email).toMatch(/Confira o e-mail/)
  })
})

describe('validarRecuperacao', () => {
  it('pede só um e-mail válido', () => {
    expect(validarRecuperacao({ email: 'ana@exemplo.com' })).toEqual({})
    expect(validarRecuperacao({ email: '' })).toEqual({ email: 'Informe o seu e-mail.' })
    expect(validarRecuperacao({ email: 'ana' }).email).toMatch(/Confira o e-mail/)
  })
})

describe('validarCadastro', () => {
  it('aceita um cadastro completo', () => {
    expect(validarCadastro(cadastroValido)).toEqual({})
  })

  it('pede nome e sobrenome e celular com DDD', () => {
    const erros = validarCadastro({ ...cadastroValido, nome: 'Ana', telefone: '91234-5678' })
    expect(Object.keys(erros)).toEqual(['nome', 'telefone'])
  })

  it('exige senha com tamanho mínimo, letras e números, e a confirmação igual', () => {
    expect(validarCadastro({ ...cadastroValido, senha: 'curta1', confirmacao: 'curta1' }).senha).toMatch(/8 caracteres/)
    expect(validarCadastro({ ...cadastroValido, senha: 'semnumeros', confirmacao: 'semnumeros' }).senha).toMatch(/letras e números/)
    expect(validarCadastro({ ...cadastroValido, confirmacao: 'outra2026' }).confirmacao).toBe('As senhas não são iguais.')
  })
})

describe('formatarTelefone', () => {
  it('formata celular e fixo enquanto a pessoa digita', () => {
    expect(formatarTelefone('11')).toBe('(11')
    expect(formatarTelefone('11912')).toBe('(11) 912')
    expect(formatarTelefone('11912345678')).toBe('(11) 91234-5678')
    expect(formatarTelefone('1131234567')).toBe('(11) 3123-4567')
    expect(formatarTelefone('11 9 1234-5678 99')).toBe('(11) 91234-5678')
  })
})
