import { useMemo, useRef, useState, type FormEvent } from 'react'
import { mensagemDoErro } from '@/lib/api'
import { formatarNumero } from '@/utils/formatacao'
import { destinos, modalidades, niveisRoteiro, paisagensRoteiro } from '../../config/rotulos'
import type { DadosRoteiro } from '../../types'
import { lerAltitudes, paraDadosRoteiro, paraEstado, subidaDoPerfil, validar, type EstadoForm } from '../../utils/formularioRoteiro'
import { Aviso } from '../ui/Aviso'
import { Botao } from '../ui/Botao'
import { AreaTexto, Campo, Selecao } from '../ui/campos'
import { Cartao } from '../ui/Cartao'
import { ListaEtapas } from './ListaEtapas'
import { ListaFotos } from './ListaFotos'
import { PreviaPerfil } from './PreviaPerfil'

interface FormularioRoteiroProps {
  inicial?: DadosRoteiro
  rotuloBotao: string
  aoEnviar: (dados: DadosRoteiro) => Promise<unknown>
}

/**
 * Cadastro e edição de um roteiro: dados gerais, etapas (dias de pedal), perfil altimétrico e fotos. A conversão entre
 * o formulário e a API e as validações ficam em `utils/formularioRoteiro.ts`.
 */
export function FormularioRoteiro({ inicial, rotuloBotao, aoEnviar }: FormularioRoteiroProps) {
  const [estado, setEstado] = useState(() => paraEstado(inicial))
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const refErro = useRef<HTMLDivElement>(null)

  const mudar = (parcial: Partial<EstadoForm>) => setEstado((atual) => ({ ...atual, ...parcial }))
  const altitudes = useMemo(() => lerAltitudes(estado.altitudes), [estado.altitudes])
  const subidaSugerida = altitudes.valores.length > 1 ? subidaDoPerfil(altitudes.valores) : null

  const mostrarErro = (mensagem: string) => {
    setErro(mensagem)
    requestAnimationFrame(() => refErro.current?.scrollIntoView({ block: 'center', behavior: 'smooth' }))
  }

  const enviar = async (evento: FormEvent) => {
    evento.preventDefault()
    setErro(null)
    const problema = validar(estado, altitudes)
    if (problema) return mostrarErro(problema)

    setEnviando(true)
    try {
      await aoEnviar(paraDadosRoteiro(estado, altitudes.valores))
    } catch (falha) {
      mostrarErro(mensagemDoErro(falha, 'Não foi possível salvar o roteiro.'))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={enviar} className="space-y-6">
      <Cartao titulo="Dados gerais">
        <div className="grid gap-4 md:grid-cols-2">
          <Campo rotulo="Título" required maxLength={120} value={estado.titulo} onChange={(e) => mudar({ titulo: e.target.value })} />
          <Campo
            rotulo="Região"
            required
            maxLength={160}
            value={estado.regiao}
            onChange={(e) => mudar({ regiao: e.target.value })}
            placeholder="Timbó e Médio Vale do Itajaí, Santa Catarina"
          />
          <AreaTexto
            rotulo="Descrição"
            required
            rows={5}
            className="md:col-span-2"
            value={estado.descricao}
            onChange={(e) => mudar({ descricao: e.target.value })}
            ajuda="Duas ou três frases: aparecem no cartão do site e no explorador de rota."
          />
          <div className="grid gap-4 sm:grid-cols-2 md:col-span-2 lg:grid-cols-4">
            <Selecao rotulo="Modalidade" valor={estado.modalidade} opcoes={modalidades} aoMudar={(modalidade) => mudar({ modalidade })} />
            <Selecao rotulo="Destino" valor={estado.destino} opcoes={destinos} aoMudar={(destino) => mudar({ destino })} />
            <Selecao rotulo="Nível" valor={estado.nivel} opcoes={niveisRoteiro} aoMudar={(nivel) => mudar({ nivel })} />
            <Selecao rotulo="Paisagem" valor={estado.paisagem} opcoes={paisagensRoteiro} aoMudar={(paisagem) => mudar({ paisagem })} />
          </div>
          <Campo
            rotulo="Duração (dias)"
            type="number"
            min={1}
            step={1}
            required
            value={estado.dias}
            onChange={(e) => mudar({ dias: e.target.value })}
            ajuda="Total da viagem, incluindo dias sem pedal (traslado, chegada)."
          />
        </div>
      </Cartao>

      <ListaEtapas etapas={estado.etapas} aoMudar={(etapas) => mudar({ etapas })} />

      <Cartao titulo="Perfil altimétrico">
        <AreaTexto
          rotulo="Altitudes (metros)"
          rows={4}
          required
          value={estado.altitudes}
          onChange={(e) => mudar({ altitudes: e.target.value })}
          placeholder="792, 793, 795, 798, 792, 785, ..."
          ajuda="Altitudes do início ao fim do percurso, em intervalos iguais, separadas por vírgula, espaço ou linha. Quanto mais pontos, mais fiel o gráfico do site."
        />
        {altitudes.invalidas.length > 0 ? (
          <p className="mt-2 text-sm text-alerta-300">Valores que não são números inteiros: {altitudes.invalidas.slice(0, 5).join(', ')}</p>
        ) : (
          <PreviaPerfil altitudes={altitudes.valores} />
        )}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Campo
            rotulo="Subida total (m)"
            type="number"
            min={0}
            step={1}
            required
            value={estado.subidaTotalM}
            onChange={(e) => mudar({ subidaTotalM: e.target.value })}
          />
          {subidaSugerida !== null && String(subidaSugerida) !== estado.subidaTotalM && (
            <div className="self-end pb-1 text-sm text-cinza-400">
              Pelas altitudes: <span className="font-semibold text-creme-100 tabular-nums">{formatarNumero(subidaSugerida)} m</span>{' '}
              <button
                type="button"
                onClick={() => mudar({ subidaTotalM: String(subidaSugerida) })}
                className="font-semibold text-sol-400 hover:underline"
              >
                Usar este valor
              </button>
            </div>
          )}
        </div>
      </Cartao>

      <ListaFotos imagens={estado.imagens} aoMudar={(imagens) => mudar({ imagens })} />

      <div ref={refErro} className="space-y-4">
        {erro && <Aviso tipo="erro">{erro}</Aviso>}
        <Botao type="submit" carregando={enviando}>
          {rotuloBotao}
        </Botao>
      </div>
    </form>
  )
}
