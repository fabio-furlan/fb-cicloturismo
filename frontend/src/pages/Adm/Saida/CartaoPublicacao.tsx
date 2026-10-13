import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROTAS, rotaSaidaAdm } from '@/constants/rotas'
import {
  AcaoConfirmada,
  Botao,
  Cartao,
  FormularioSaida,
  useApiAdm,
  type EstadoDaNavegacao,
  type Mensagem,
  type SaidaAdm,
} from '@/features/adm'
import { mensagemDoErro } from '@/lib/api'

interface CartaoPublicacaoProps {
  saida: SaidaAdm
  /** Roda uma ação que devolve a saída atualizada e mostra `sucesso` ou o erro da API. */
  executar: (acao: () => Promise<SaidaAdm>, sucesso: string) => Promise<void>
  aoAvisar: (mensagem: Mensagem) => void
}

/** O ciclo de vida da saída: publicar ou excluir o rascunho, cancelar a publicada e duplicar para outras datas. */
export function CartaoPublicacao({ saida, executar, aoAvisar }: CartaoPublicacaoProps) {
  const api = useApiAdm()
  const navegar = useNavigate()
  const [duplicando, setDuplicando] = useState(false)
  const [publicando, setPublicando] = useState(false)

  const publicar = async () => {
    setPublicando(true)
    await executar(() => api.publicar(saida.id), 'Saída publicada: ela já aparece no site para inscrição.')
    setPublicando(false)
  }

  const excluir = async () => {
    try {
      await api.excluirSaida(saida.id)
      navegar(ROTAS.admPainel)
    } catch (falha) {
      aoAvisar({ tipo: 'erro', texto: mensagemDoErro(falha, 'Não foi possível excluir.') })
    }
  }

  return (
    <Cartao titulo="Publicação">
      <div className="flex flex-wrap items-start gap-3">
        {saida.situacao === 'RASCUNHO' && (
          <>
            <Botao carregando={publicando} onClick={publicar}>
              Publicar no site
            </Botao>
            <AcaoConfirmada
              rotulo="Excluir rascunho"
              pergunta="Excluir este rascunho? Não dá para desfazer."
              confirmar="Sim, excluir"
              aoConfirmar={excluir}
            />
          </>
        )}
        {saida.situacao === 'PUBLICADA' && (
          <AcaoConfirmada
            rotulo="Cancelar saída"
            pergunta="Cancelar esta saída? Ela sai do site e não pode ser publicada de novo (dá para duplicar para outras datas)."
            confirmar="Sim, cancelar"
            aoConfirmar={() => executar(() => api.cancelar(saida.id), 'Saída cancelada.')}
          />
        )}
        {saida.situacao === 'CANCELADA' && (
          <p className="text-sm text-cinza-400">Saída cancelada. Para vender estas datas de novo, duplique-a para novas datas.</p>
        )}
        {!duplicando && (
          <Botao variante="secundario" onClick={() => setDuplicando(true)}>
            Duplicar para outras datas
          </Botao>
        )}
      </div>
      {duplicando && (
        <div className="mt-6 border-t border-white/10 pt-6">
          <h3 className="mb-4 font-semibold">Duplicar com as mesmas vagas, preço e opcionais</h3>
          <FormularioSaida
            comVagasEPreco={false}
            rotuloBotao="Criar cópia"
            aoCancelar={() => setDuplicando(false)}
            aoEnviar={async (periodo) => {
              const copia = await api.duplicar(saida.id, periodo)
              setDuplicando(false)
              navegar(rotaSaidaAdm(copia.id), {
                state: { aviso: 'Cópia criada como rascunho. Confira e publique.' } satisfies EstadoDaNavegacao,
              })
            }}
          />
        </div>
      )}
    </Cartao>
  )
}
