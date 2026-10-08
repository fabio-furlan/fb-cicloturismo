import { type FormEvent, useMemo, useRef, useState } from 'react'
import type { DadosRoteiro, Destino, Modalidade, NivelRoteiro, PaisagemRoteiro, TipoImagem } from '@/types/adm'
import { formatarNumero } from '@/utils/formatacao'
import { AreaTexto, Aviso, Botao, Campo, Cartao, Selecao } from './componentes'
import { destinos, modalidades, niveisRoteiro, paisagensRoteiro } from './formato'

// Os campos numéricos ficam como texto enquanto se digita (um campo vazio é "", não 0) e viram número só no envio.
interface EtapaForm {
  chave: number
  dia: string
  titulo: string
  distanciaKm: string
  subidaM: string
}

interface ImagemForm {
  chave: number
  tipo: TipoImagem
  url: string
  descricao: string
  autor: string
  origem: string
}

interface EstadoForm {
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

const tiposImagem: Record<TipoImagem, string> = { BANNER: 'Banner (foto principal)', GALERIA: 'Galeria' }

let proximaChave = 1
const novaChave = () => proximaChave++

const numero = (texto: string) => Number(texto.replace(',', '.'))

function paraEstado(inicial?: DadosRoteiro): EstadoForm {
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
      etapas: [{ chave: novaChave(), dia: '1', titulo: '', distanciaKm: '', subidaM: '' }],
      imagens: [],
    }
  }
  return {
    ...inicial,
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
    imagens: inicial.imagens.map((i) => ({ chave: novaChave(), ...i, autor: i.autor ?? '', origem: i.origem ?? '' })),
  }
}

/** Lê a lista de altitudes colada (números separados por vírgula, espaço ou linha). */
function lerAltitudes(texto: string) {
  const partes = texto.split(/[\s,;]+/).filter(Boolean)
  const invalidas = partes.filter((parte) => !/^-?\d+$/.test(parte))
  return { valores: invalidas.length ? [] : partes.map(Number), invalidas }
}

/** Soma das subidas entre pontos consecutivos: a subida acumulada que o perfil indica. */
function subidaDoPerfil(altitudes: number[]) {
  return altitudes.reduce((total, altitude, i) => (i > 0 && altitude > altitudes[i - 1] ? total + altitude - altitudes[i - 1] : total), 0)
}

function PreviaPerfil({ altitudes }: { altitudes: number[] }) {
  if (altitudes.length < 2) return null
  const minima = Math.min(...altitudes)
  const maxima = Math.max(...altitudes)
  const faixa = maxima - minima || 1
  const pontos = altitudes.map((a, i) => `${(i / (altitudes.length - 1)) * 300},${58 - ((a - minima) / faixa) * 54}`).join(' ')
  return (
    <figure className="mt-3">
      <svg viewBox="0 0 300 60" className="h-24 w-full rounded-xl bg-mata-950/60" preserveAspectRatio="none" role="img" aria-label="Prévia do perfil altimétrico">
        <polyline points={`0,60 ${pontos} 300,60`} fill="color-mix(in oklab, var(--color-trilha-500) 25%, transparent)" stroke="none" />
        <polyline points={pontos} fill="none" stroke="var(--color-trilha-500)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <figcaption className="mt-1 text-xs text-areia-400 tabular-nums">
        {altitudes.length} pontos · de {formatarNumero(minima)} a {formatarNumero(maxima)} m
      </figcaption>
    </figure>
  )
}

interface FormularioRoteiroProps {
  inicial?: DadosRoteiro
  rotuloBotao: string
  aoEnviar: (dados: DadosRoteiro) => Promise<unknown>
}

/**
 * Cadastro e edição de um roteiro: dados gerais, etapas (dias de pedal), perfil altimétrico e fotos. As regras que
 * dependem de mais de um campo (etapa depois do último dia, mais de um banner) são conferidas pela API.
 */
export function FormularioRoteiro({ inicial, rotuloBotao, aoEnviar }: FormularioRoteiroProps) {
  const [estado, setEstado] = useState(() => paraEstado(inicial))
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const refErro = useRef<HTMLDivElement>(null)

  const mudar = (parcial: Partial<EstadoForm>) => setEstado((atual) => ({ ...atual, ...parcial }))
  const mudarEtapa = (chave: number, parcial: Partial<EtapaForm>) =>
    mudar({ etapas: estado.etapas.map((e) => (e.chave === chave ? { ...e, ...parcial } : e)) })
  const mudarImagem = (chave: number, parcial: Partial<ImagemForm>) =>
    mudar({ imagens: estado.imagens.map((i) => (i.chave === chave ? { ...i, ...parcial } : i)) })

  const altitudes = useMemo(() => lerAltitudes(estado.altitudes), [estado.altitudes])
  const distanciaTotal = estado.etapas.reduce((total, e) => total + (numero(e.distanciaKm) || 0), 0)
  const subidaSugerida = altitudes.valores.length > 1 ? subidaDoPerfil(altitudes.valores) : null

  const adicionarEtapa = () => {
    const ultimoDia = Math.max(0, ...estado.etapas.map((e) => numero(e.dia) || 0))
    mudar({ etapas: [...estado.etapas, { chave: novaChave(), dia: String(ultimoDia + 1), titulo: '', distanciaKm: '', subidaM: '' }] })
  }

  const adicionarImagem = () => {
    const temBanner = estado.imagens.some((i) => i.tipo === 'BANNER')
    mudar({
      imagens: [...estado.imagens, { chave: novaChave(), tipo: temBanner ? 'GALERIA' : 'BANNER', url: '', descricao: '', autor: '', origem: '' }],
    })
  }

  const mostrarErro = (mensagem: string) => {
    setErro(mensagem)
    requestAnimationFrame(() => refErro.current?.scrollIntoView({ block: 'center', behavior: 'smooth' }))
  }

  const enviar = async (evento: FormEvent) => {
    evento.preventDefault()
    setErro(null)
    if (altitudes.invalidas.length) return mostrarErro(`As altitudes têm valores que não são números inteiros: ${altitudes.invalidas.slice(0, 5).join(', ')}.`)
    if (altitudes.valores.length < 2) return mostrarErro('Informe pelo menos 2 altitudes para o perfil do percurso.')
    if (estado.etapas.length === 0) return mostrarErro('O roteiro precisa de pelo menos uma etapa (um dia de pedal).')

    setEnviando(true)
    try {
      await aoEnviar({
        titulo: estado.titulo.trim(),
        regiao: estado.regiao.trim(),
        descricao: estado.descricao.trim(),
        modalidade: estado.modalidade,
        destino: estado.destino,
        nivel: estado.nivel,
        paisagem: estado.paisagem,
        dias: numero(estado.dias),
        subidaTotalM: numero(estado.subidaTotalM),
        altitudes: altitudes.valores,
        etapas: estado.etapas.map((e) => ({
          dia: numero(e.dia),
          titulo: e.titulo.trim(),
          distanciaKm: numero(e.distanciaKm),
          subidaM: e.subidaM.trim() ? numero(e.subidaM) : null,
        })),
        imagens: estado.imagens.map((i) => ({
          tipo: i.tipo,
          url: i.url.trim(),
          descricao: i.descricao.trim(),
          autor: i.autor.trim() || null,
          origem: i.origem.trim() || null,
        })),
      })
    } catch (falha) {
      mostrarErro(falha instanceof Error ? falha.message : 'Não foi possível salvar o roteiro.')
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

      <Cartao
        titulo="Etapas"
        acoes={
          <p className="text-sm text-areia-400 tabular-nums" aria-live="polite">
            Distância total: <span className="font-semibold text-areia-100">{formatarNumero(Math.round(distanciaTotal * 10) / 10)} km</span>
          </p>
        }
      >
        <p className="-mt-2 mb-4 text-sm text-areia-400">Um item por dia de pedal. Dias sem pedal não têm etapa. A distância do roteiro é a soma das etapas.</p>
        <ol className="space-y-4">
          {estado.etapas.map((etapa, i) => (
            <li key={etapa.chave} className="rounded-xl border border-white/10 bg-mata-950/40 p-4">
              <div className="grid gap-4 sm:grid-cols-[6rem_minmax(0,1fr)_8rem_8rem]">
                <Campo rotulo="Dia" type="number" min={1} step={1} required value={etapa.dia} onChange={(e) => mudarEtapa(etapa.chave, { dia: e.target.value })} />
                <Campo
                  rotulo="Título"
                  required
                  maxLength={160}
                  value={etapa.titulo}
                  onChange={(e) => mudarEtapa(etapa.chave, { titulo: e.target.value })}
                  placeholder="Timbó a Pomerode"
                />
                <Campo
                  rotulo="Km"
                  type="number"
                  min={0}
                  step="0.1"
                  required
                  inputMode="decimal"
                  value={etapa.distanciaKm}
                  onChange={(e) => mudarEtapa(etapa.chave, { distanciaKm: e.target.value })}
                />
                <Campo
                  rotulo="Subida (m)"
                  type="number"
                  min={0}
                  step={1}
                  value={etapa.subidaM}
                  onChange={(e) => mudarEtapa(etapa.chave, { subidaM: e.target.value })}
                  ajuda="Opcional"
                />
              </div>
              {estado.etapas.length > 1 && (
                <button
                  type="button"
                  onClick={() => mudar({ etapas: estado.etapas.filter((e) => e.chave !== etapa.chave) })}
                  className="mt-3 text-sm font-semibold text-[#ff9b8a] hover:underline"
                >
                  Remover etapa {i + 1}
                </button>
              )}
            </li>
          ))}
        </ol>
        <Botao variante="secundario" className="mt-4" onClick={adicionarEtapa}>
          + Adicionar etapa
        </Botao>
      </Cartao>

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
          <p className="mt-2 text-sm text-[#ff9b8a]">Valores que não são números inteiros: {altitudes.invalidas.slice(0, 5).join(', ')}</p>
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
            <div className="self-end pb-1 text-sm text-areia-400">
              Pelas altitudes: <span className="font-semibold text-areia-100 tabular-nums">{formatarNumero(subidaSugerida)} m</span>{' '}
              <button type="button" onClick={() => mudar({ subidaTotalM: String(subidaSugerida) })} className="font-semibold text-trilha-400 hover:underline">
                Usar este valor
              </button>
            </div>
          )}
        </div>
      </Cartao>

      <Cartao titulo="Fotos">
        <p className="-mt-2 mb-4 text-sm text-areia-400">
          Endereço de cada foto (por exemplo, <code className="text-areia-100">/images/roteiros/vale-europeu.jpg</code> para uma imagem do site). Um banner no
          máximo: ele aparece no cartão do site.
        </p>
        {estado.imagens.length > 0 && (
          <ul className="space-y-4">
            {estado.imagens.map((imagem) => (
              <li key={imagem.chave} className="rounded-xl border border-white/10 bg-mata-950/40 p-4">
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_14rem]">
                  <div className="grid gap-4">
                    <div className="grid gap-4 sm:grid-cols-[12rem_minmax(0,1fr)]">
                      <Selecao rotulo="Tipo" valor={imagem.tipo} opcoes={tiposImagem} aoMudar={(tipo) => mudarImagem(imagem.chave, { tipo })} />
                      <Campo rotulo="Endereço (URL)" required maxLength={500} value={imagem.url} onChange={(e) => mudarImagem(imagem.chave, { url: e.target.value })} />
                    </div>
                    <Campo
                      rotulo="Descrição da foto"
                      required
                      maxLength={255}
                      value={imagem.descricao}
                      onChange={(e) => mudarImagem(imagem.chave, { descricao: e.target.value })}
                      ajuda="O que aparece na foto, para quem usa leitor de tela."
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Campo rotulo="Autor (crédito)" maxLength={120} value={imagem.autor} onChange={(e) => mudarImagem(imagem.chave, { autor: e.target.value })} />
                      <Campo rotulo="Origem (link)" maxLength={500} value={imagem.origem} onChange={(e) => mudarImagem(imagem.chave, { origem: e.target.value })} />
                    </div>
                  </div>
                  {imagem.url.trim() && (
                    <img src={imagem.url.trim()} alt="" className="aspect-[16/10] w-full rounded-lg bg-mata-950 object-cover" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => mudar({ imagens: estado.imagens.filter((i) => i.chave !== imagem.chave) })}
                  className="mt-3 text-sm font-semibold text-[#ff9b8a] hover:underline"
                >
                  Remover foto
                </button>
              </li>
            ))}
          </ul>
        )}
        <Botao variante="secundario" className={estado.imagens.length ? 'mt-4' : ''} onClick={adicionarImagem}>
          + Adicionar foto
        </Botao>
      </Cartao>

      <div ref={refErro} className="space-y-4">
        {erro && <Aviso tipo="erro">{erro}</Aviso>}
        <Botao type="submit" carregando={enviando}>
          {rotuloBotao}
        </Botao>
      </div>
    </form>
  )
}
