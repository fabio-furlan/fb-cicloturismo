import { useState } from 'react'
import { Botao } from './Botao'

interface AcaoConfirmadaProps {
  rotulo: string
  pergunta: string
  /** Texto do botão que confirma, como "Sim, excluir". */
  confirmar: string
  aoConfirmar: () => Promise<void>
}

/** Ação que não tem volta: o primeiro clique só pede confirmação, na própria página. */
export function AcaoConfirmada({ rotulo, pergunta, confirmar, aoConfirmar }: AcaoConfirmadaProps) {
  const [aberta, setAberta] = useState(false)
  const [executando, setExecutando] = useState(false)

  const executar = async () => {
    setExecutando(true)
    try {
      await aoConfirmar()
    } finally {
      setExecutando(false)
      setAberta(false)
    }
  }

  if (!aberta) {
    return (
      <Botao variante="perigo" onClick={() => setAberta(true)}>
        {rotulo}
      </Botao>
    )
  }
  return (
    <div className="w-full rounded-xl border border-alerta-600/60 bg-alerta-600/10 p-4" role="group" aria-label={pergunta}>
      <p className="text-sm font-semibold">{pergunta}</p>
      <div className="mt-3 flex flex-wrap gap-3">
        <Botao variante="perigo" carregando={executando} onClick={executar}>
          {confirmar}
        </Botao>
        <Botao variante="secundario" onClick={() => setAberta(false)} disabled={executando}>
          Voltar
        </Botao>
      </div>
    </div>
  )
}
