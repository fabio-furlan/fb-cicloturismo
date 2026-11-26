import { useRef, useState, type ComponentType, type FormEvent, type ReactNode } from 'react'
import { LIMITES_SOBRE, paragrafos, type PaginaSobre } from '@/features/institucional'
import { mensagemDoErro } from '@/lib/api'
import {
  mover,
  novaFoto,
  novoMarco,
  paraEstadoSobre,
  paraPaginaSobre,
  validarSobre,
  type EstadoSobre,
  type FotoForm,
  type MarcoForm,
} from '../../utils/formularioSobre'
import { Aviso } from '../ui/Aviso'
import { Botao } from '../ui/Botao'
import { AreaTexto, Campo } from '../ui/campos'
import { Cartao } from '../ui/Cartao'

interface FormularioSobreProps {
  inicial: PaginaSobre
  aoEnviar: (pagina: PaginaSobre) => Promise<unknown>
}

/**
 * Edição da página "Sobre nós": textos, linha do tempo e fotos. A conversão para a API e as validações ficam em
 * `utils/formularioSobre.ts`.
 */
export function FormularioSobre({ inicial, aoEnviar }: FormularioSobreProps) {
  const [estado, setEstado] = useState(() => paraEstadoSobre(inicial))
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const refErro = useRef<HTMLDivElement>(null)

  const mudar = (parcial: Partial<EstadoSobre>) => setEstado((atual) => ({ ...atual, ...parcial }))

  const mostrarErro = (mensagem: string) => {
    setErro(mensagem)
    requestAnimationFrame(() => refErro.current?.scrollIntoView({ block: 'center', behavior: 'smooth' }))
  }

  const enviar = async (evento: FormEvent) => {
    evento.preventDefault()
    setErro(null)
    const problema = validarSobre(estado)
    if (problema) return mostrarErro(problema)

    setEnviando(true)
    try {
      await aoEnviar(paraPaginaSobre(estado))
    } catch (falha) {
      mostrarErro(mensagemDoErro(falha, 'Não foi possível salvar a página.'))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={enviar} className="space-y-6">
      <Cartao titulo="Textos">
        <div className="grid gap-4">
          <Campo
            rotulo="Título"
            required
            maxLength={120}
            value={estado.titulo}
            onChange={(e) => mudar({ titulo: e.target.value })}
            ajuda="Aparece em letras grandes no topo da página."
          />
          <AreaTexto
            rotulo="Chamada"
            required
            rows={3}
            maxLength={500}
            value={estado.chamada}
            onChange={(e) => mudar({ chamada: e.target.value })}
            ajuda="Uma ou duas frases logo abaixo do título."
          />
          <AreaTexto
            rotulo="História"
            required
            rows={16}
            maxLength={20_000}
            value={estado.historia}
            onChange={(e) => mudar({ historia: e.target.value })}
            ajuda={`Deixe uma linha em branco entre os parágrafos. ${contarParagrafos(estado.historia)}`}
          />
          <AreaTexto
            rotulo="Citação em destaque (opcional)"
            rows={2}
            maxLength={300}
            value={estado.citacao}
            onChange={(e) => mudar({ citacao: e.target.value })}
            ajuda="Uma frase forte, que aparece em destaque no meio da história."
          />
        </div>
      </Cartao>

      <ListaEditavel
        titulo="Linha do tempo"
        descricao="Os momentos da sua trajetória, na ordem em que aparecem. O último ganha destaque, como o momento de hoje."
        itens={estado.marcos}
        limite={LIMITES_SOBRE.marcos}
        nomeDoItem="marco"
        aoMudar={(marcos) => mudar({ marcos })}
        novo={novoMarco}
        Campos={CamposMarco}
      />

      <ListaEditavel
        titulo="Fotos"
        descricao={
          <>
            A primeira foto aparece no topo, ao lado do título; as outras formam a galeria. Use o endereço de cada foto (por exemplo,{' '}
            <code className="text-creme-100">/images/roteiros/vale-europeu.jpg</code> para uma imagem do site).
          </>
        }
        itens={estado.fotos}
        limite={LIMITES_SOBRE.fotos}
        nomeDoItem="foto"
        aoMudar={(fotos) => mudar({ fotos })}
        novo={novaFoto}
        Campos={CamposFoto}
      />

      <div ref={refErro} className="space-y-4">
        {erro && <Aviso tipo="erro">{erro}</Aviso>}
        <Botao type="submit" carregando={enviando}>
          Salvar página
        </Botao>
      </div>
    </form>
  )
}

interface PropsCampos<T> {
  item: T
  alterar: (parcial: Partial<T>) => void
}

function CamposMarco({ item: marco, alterar }: PropsCampos<MarcoForm>) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-[14rem_minmax(0,1fr)]">
        <Campo
          rotulo="Momento"
          required
          maxLength={40}
          value={marco.rotulo}
          onChange={(e) => alterar({ rotulo: e.target.value })}
          placeholder="Hoje, 2019, A primeira travessia"
        />
        <Campo rotulo="Título" required maxLength={120} value={marco.titulo} onChange={(e) => alterar({ titulo: e.target.value })} />
      </div>
      <AreaTexto
        rotulo="Texto"
        required
        rows={2}
        maxLength={600}
        value={marco.texto}
        onChange={(e) => alterar({ texto: e.target.value })}
      />
    </div>
  )
}

function CamposFoto({ item: foto, alterar }: PropsCampos<FotoForm>) {
  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_14rem]">
      <div className="grid gap-4">
        <Campo rotulo="Endereço (URL)" required maxLength={500} value={foto.url} onChange={(e) => alterar({ url: e.target.value })} />
        <Campo
          rotulo="Descrição da foto"
          required
          maxLength={255}
          value={foto.descricao}
          onChange={(e) => alterar({ descricao: e.target.value })}
          ajuda="O que aparece na foto, para quem usa leitor de tela."
        />
        <Campo
          rotulo="Legenda (opcional)"
          maxLength={160}
          value={foto.legenda}
          onChange={(e) => alterar({ legenda: e.target.value })}
          ajuda="Frase curta que aparece sobre a foto."
        />
      </div>
      {foto.url.trim() && <img src={foto.url.trim()} alt="" className="aspect-[4/3] w-full rounded-lg bg-carvao-950 object-cover" />}
    </div>
  )
}

function contarParagrafos(historia: string) {
  const total = paragrafos(historia).length
  return total === 1 ? '1 parágrafo.' : `${total} parágrafos.`
}

interface ListaEditavelProps<T extends MarcoForm | FotoForm> {
  titulo: string
  descricao: ReactNode
  itens: T[]
  limite: number
  nomeDoItem: string
  aoMudar: (itens: T[]) => void
  novo: () => T
  /** Os campos de cada item, num componente próprio. */
  Campos: ComponentType<PropsCampos<T>>
}

/** Lista de marcos ou de fotos: cada item com os seus campos e os botões de subir, descer e remover. */
function ListaEditavel<T extends MarcoForm | FotoForm>({
  titulo,
  descricao,
  itens,
  limite,
  nomeDoItem,
  aoMudar,
  novo,
  Campos,
}: ListaEditavelProps<T>) {
  const alterar = (chave: number, parcial: Partial<T>) =>
    aoMudar(itens.map((item) => (item.chave === chave ? { ...item, ...parcial } : item)))

  return (
    <Cartao titulo={titulo} acoes={<span className="text-sm text-cinza-400 tabular-nums">{`${itens.length} de ${limite}`}</span>}>
      <p className="-mt-2 mb-4 text-sm text-cinza-400">{descricao}</p>
      {itens.length > 0 && (
        <ol className="space-y-4">
          {itens.map((item, i) => (
            <li key={item.chave} className="rounded-xl border border-white/10 bg-carvao-950/40 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="font-display text-sm font-extrabold text-sol-400 uppercase">
                  {nomeDoItem} {i + 1}
                </span>
                <div className="flex items-center gap-1">
                  <BotaoIcone rotulo={`Subir ${nomeDoItem} ${i + 1}`} desativado={i === 0} aoClicar={() => aoMudar(mover(itens, i, -1))}>
                    ↑
                  </BotaoIcone>
                  <BotaoIcone
                    rotulo={`Descer ${nomeDoItem} ${i + 1}`}
                    desativado={i === itens.length - 1}
                    aoClicar={() => aoMudar(mover(itens, i, 1))}
                  >
                    ↓
                  </BotaoIcone>
                  <button
                    type="button"
                    onClick={() => aoMudar(itens.filter((outro) => outro.chave !== item.chave))}
                    className="ml-2 min-h-9 rounded-lg px-2 text-sm font-semibold text-alerta-300 hover:underline"
                  >
                    Remover
                  </button>
                </div>
              </div>
              <Campos item={item} alterar={(parcial) => alterar(item.chave, parcial)} />
            </li>
          ))}
        </ol>
      )}
      {itens.length < limite ? (
        <Botao variante="secundario" className={itens.length ? 'mt-4' : ''} onClick={() => aoMudar([...itens, novo()])}>
          + Adicionar {nomeDoItem}
        </Botao>
      ) : (
        <p className="mt-4 text-sm text-cinza-400">Limite de {limite} atingido.</p>
      )}
    </Cartao>
  )
}

function BotaoIcone({
  rotulo,
  desativado,
  aoClicar,
  children,
}: {
  rotulo: string
  desativado: boolean
  aoClicar: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={aoClicar}
      disabled={desativado}
      aria-label={rotulo}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-creme-100 transition-colors hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-30"
    >
      <span aria-hidden="true">{children}</span>
    </button>
  )
}
