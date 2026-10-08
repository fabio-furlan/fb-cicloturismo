import { type FormEvent, useState } from 'react'
import type { DadosSaida, PeriodoSaida } from '@/types/adm'
import { Aviso, Botao, Campo } from './componentes'

interface ComVagasEPreco {
  comVagasEPreco: true
  inicial?: Partial<DadosSaida>
  aoEnviar: (dados: DadosSaida) => Promise<unknown>
}

interface SoPeriodo {
  comVagasEPreco: false
  inicial?: Partial<PeriodoSaida>
  aoEnviar: (dados: PeriodoSaida) => Promise<unknown>
}

type FormularioSaidaProps = (ComVagasEPreco | SoPeriodo) & {
  rotuloBotao: string
  aoCancelar?: () => void
}

/**
 * Datas de uma saída e, quando é o caso, vagas e preço. Usado para criar, editar e duplicar. As regras entre as datas
 * (fim depois do início, inscrições até o início) são conferidas pela API, que explica o problema na resposta.
 */
export function FormularioSaida(props: FormularioSaidaProps) {
  const { rotuloBotao, aoCancelar, comVagasEPreco, inicial = {} } = props
  const [dataInicio, setDataInicio] = useState(inicial.dataInicio ?? '')
  const [dataFim, setDataFim] = useState(inicial.dataFim ?? '')
  const [inscricoesAte, setInscricoesAte] = useState(inicial.inscricoesAte ?? '')
  const vagasEPreco = comVagasEPreco ? (inicial as Partial<DadosSaida>) : {}
  const [capacidade, setCapacidade] = useState(vagasEPreco.capacidade?.toString() ?? '12')
  const [precoBase, setPrecoBase] = useState(vagasEPreco.precoBase?.toString() ?? '')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const enviar = async (evento: FormEvent) => {
    evento.preventDefault()
    setEnviando(true)
    setErro(null)
    const periodo = { dataInicio, dataFim, inscricoesAte }
    try {
      if (props.comVagasEPreco) {
        await props.aoEnviar({ ...periodo, capacidade: Number(capacidade), precoBase: Number(precoBase.replace(',', '.')) })
      } else {
        await props.aoEnviar(periodo)
      }
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : 'Não foi possível salvar.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={enviar} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Campo rotulo="Início" type="date" required value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
        <Campo rotulo="Fim" type="date" required value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
        <Campo
          rotulo="Inscrições até"
          type="date"
          required
          value={inscricoesAte}
          onChange={(e) => setInscricoesAte(e.target.value)}
          ajuda="Último dia para se inscrever. No máximo o dia do início."
        />
      </div>
      {comVagasEPreco && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Campo rotulo="Vagas" type="number" min={1} step={1} required value={capacidade} onChange={(e) => setCapacidade(e.target.value)} />
          <Campo
            rotulo="Preço por pessoa (R$)"
            type="number"
            min={0}
            step="0.01"
            required
            inputMode="decimal"
            value={precoBase}
            onChange={(e) => setPrecoBase(e.target.value)}
          />
        </div>
      )}
      {erro && <Aviso tipo="erro">{erro}</Aviso>}
      <div className="flex flex-wrap gap-3">
        <Botao type="submit" carregando={enviando}>
          {rotuloBotao}
        </Botao>
        {aoCancelar && (
          <Botao variante="secundario" onClick={aoCancelar} disabled={enviando}>
            Cancelar
          </Botao>
        )}
      </div>
    </form>
  )
}
