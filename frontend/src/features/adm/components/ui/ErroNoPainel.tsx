import { Aviso } from './Aviso'
import { Botao } from './Botao'

/** Falha ao carregar os dados de uma tela do painel: a explicação da API e a opção de tentar de novo. */
export function ErroNoPainel({ mensagem, aoTentarDeNovo }: { mensagem: string; aoTentarDeNovo: () => void }) {
  return (
    <div className="space-y-4" role="alert">
      <Aviso tipo="erro">{mensagem}</Aviso>
      <Botao variante="secundario" onClick={aoTentarDeNovo}>
        Tentar de novo
      </Botao>
    </div>
  )
}
