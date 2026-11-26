import { Link } from 'react-router-dom'
import { Carregando } from '@/components/feedback/Carregando'
import { IconeConversa, IconeRota, IconeSeta } from '@/components/icones'
import { Container } from '@/components/ui/Container'
import { estiloBotao } from '@/components/ui/estilosBotao'
import { empresa } from '@/config/empresa'
import { ROTAS } from '@/constants/rotas'
import { paragrafos, useSobre, type FotoSobre, type Marco, type PaginaSobre } from '@/features/institucional'
import { useParallaxDoTopo } from '@/hooks/useParallaxDoTopo'
import { revelar } from '@/hooks/useRevelarAoRolar'
import { useTituloDaPagina } from '@/hooks/useTituloDaPagina'
import { cn } from '@/utils/cn'

/** Página "Sobre nós": a história, a linha do tempo e as fotos, editáveis pelo ADM. */
export function Sobre() {
  useTituloDaPagina(`Sobre nós · ${empresa.nome}`)
  const estado = useSobre()

  // Sem estado de erro: se a API falhar, o hook já devolve o texto padrão.
  if (estado.situacao !== 'pronto') return <Carregando variante="secao" />
  return <ConteudoSobre pagina={estado.dados} />
}

function ConteudoSobre({ pagina }: { pagina: PaginaSobre }) {
  const [capa, ...galeria] = pagina.fotos
  const textos = paragrafos(pagina.historia)
  // A citação entra no meio da história, como uma pausa na leitura.
  const meio = Math.ceil(textos.length / 2)
  // Como na página inicial: a foto do topo anda mais devagar que o texto ao rolar.
  const topoRef = useParallaxDoTopo<HTMLElement>()

  return (
    <>
      {/* Abertura: a foto de capa de ponta a ponta, com o título escrito sobre ela */}
      <section ref={topoRef} className="relative isolate flex min-h-[58svh] items-end overflow-clip sm:min-h-[68svh] lg:min-h-[74svh]">
        {/* A foto entra com um zoom lento e, ao rolar, anda mais devagar que o texto (parallax) */}
        <div className="parallax-foto absolute inset-0 -z-20 bg-carvao-800">
          {capa && (
            <img
              src={capa.url}
              alt={capa.descricao}
              fetchPriority="high"
              className="entrada-foto h-full w-full object-cover object-[70%_72%]"
            />
          )}
        </div>
        {/* Escurece embaixo, onde fica o título, e funde a foto com o fundo da página */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-carvao-900 via-carvao-900/25 via-30% to-transparent" />
        {/* E escurece à esquerda, para o título ser lido sobre qualquer foto */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/60 via-black/20 via-45% to-transparent" />
        <Container className="parallax-conteudo relative w-full pt-24 pb-8 sm:pb-12">
          {/* Etiqueta fina com um traço, alinhada à mesma margem do título */}
          <p {...revelar(100)} className="flex items-center gap-3 text-xs font-bold tracking-[0.3em] text-sol-500 uppercase">
            <span className="h-px w-8 bg-sol-500" aria-hidden="true" />
            Sobre nós
          </p>
          <h1 {...revelar(250)} className="mt-5 max-w-3xl space-y-2 [text-shadow:0_2px_18px_rgb(0_0_0/0.45)]">
            <TituloComDestaque titulo={pagina.titulo} />
          </h1>
        </Container>
      </section>

      {/* A chamada e os dois caminhos de quem chega: ler a história ou já falar comigo */}
      <section className="recuar-ao-sair bg-carvao-900">
        <Container className="grid gap-8 pt-6 pb-12 sm:pt-8 sm:pb-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
          <div>
            {/* pre-line: as quebras de linha da chamada (Enter no painel) aparecem na página */}
            <p {...revelar(400)} className="max-w-2xl text-lg leading-relaxed whitespace-pre-line text-creme-100/80">
              {pagina.chamada}
            </p>
          </div>
          <div {...revelar(550)} className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <a href="#historia" className={cn(estiloBotao('principal', 'grande'), 'group')}>
              Ler minha história
              <IconeSeta className="h-4 w-4 rotate-90 transition-transform group-hover:translate-y-0.5 motion-reduce:transition-none" />
            </a>
            <Link to={ROTAS.contato} className={estiloBotao('secundarioEscuro', 'grande')}>
              <IconeConversa className="h-4 w-4" />
              Fale comigo
            </Link>
          </div>
        </Container>
      </section>

      {/* História*/}
      <section id="historia" aria-labelledby="titulo-historia" className="secao-sobreposta recuar-ao-sair bg-carvao-950">
        <Container className="py-12 sm:py-20">
          <CabecalhoSecao id="titulo-historia" rotulo="Como tudo começou" titulo="Minha história" />
          <div className="mx-auto mt-10 max-w-2xl sm:mt-12">
            {textos.slice(0, meio).map((texto, i) => (
              <Paragrafo key={i} texto={texto} capitular={i === 0} />
            ))}
            {pagina.citacao && <Citacao texto={pagina.citacao} />}
            {textos.slice(meio).map((texto, i) => (
              <Paragrafo key={meio + i} texto={texto} />
            ))}
          </div>
        </Container>
      </section>

      {pagina.marcos.length > 0 && <LinhaDoTempo marcos={pagina.marcos} />}
      {galeria.length > 0 && <Galeria fotos={galeria} />}

      {/* Fechamento: os dois caminhos de quem chegou até aqui */}
      <section className="secao-sobreposta bg-carvao-900">
        <Container className="py-14 text-center sm:py-20">
          <p
            {...revelar(0)}
            className="mx-auto max-w-2xl font-display text-2xl leading-tight font-extrabold tracking-tight text-white sm:text-3xl"
          >
            Vamos pedalar <span className="text-sol-500">(ou programar)</span> juntos?
          </p>
          <p {...revelar(150)} className="mx-auto mt-3 max-w-md text-cinza-400">
            Conheça os roteiros do site ou mande uma mensagem. Respondo com prazer.
          </p>
          <div {...revelar(300)} className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to={ROTAS.roteiros} className={estiloBotao('principal', 'grande')}>
              <IconeRota className="h-5 w-5" />
              Conhecer os roteiros
            </Link>
            <Link to={ROTAS.contato} className={estiloBotao('secundarioEscuro', 'grande')}>
              <IconeConversa className="h-5 w-5" />
              Fale comigo
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}

/**
 * O título em duas linhas: o começo pequeno, fino e espaçado, como uma assinatura ("Olá, eu sou o"), e a última
 * palavra em destaque, em amarelo ("Fábio").
 */
function TituloComDestaque({ titulo }: { titulo: string }) {
  const espaco = titulo.lastIndexOf(' ')
  const inicio = espaco < 0 ? '' : titulo.slice(0, espaco)
  const destaque = espaco < 0 ? titulo : titulo.slice(espaco + 1)
  return (
    <>
      {inicio && (
        <>
          <span className="block font-sans text-base font-normal tracking-[0.28em] text-creme-100 uppercase sm:text-lg">{inicio}</span>{' '}
        </>
      )}
      <span className="block font-display text-5xl leading-[1.05] font-semibold tracking-tight text-sol-500 sm:text-6xl lg:text-7xl">
        {destaque}
      </span>
    </>
  )
}

/** Título de cada seção: uma etiqueta pequena em cima e o título em letras normais, centralizados. */
function CabecalhoSecao({ id, rotulo, titulo }: { id: string; rotulo: string; titulo: string }) {
  return (
    <div {...revelar(0)} className="text-center">
      <p className="text-xs font-bold tracking-[0.2em] text-sol-500 uppercase">{rotulo}</p>
      <h2 id={id} className="mt-2 font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
        {titulo}
      </h2>
    </div>
  )
}

function Paragrafo({ texto, capitular = false }: { texto: string; capitular?: boolean }) {
  return (
    <p
      {...revelar(0)}
      className={cn(
        'mt-6 text-[1.05rem] leading-[1.85] whitespace-pre-line text-creme-100/85 first:mt-0 sm:text-lg',
        // Letra capitular no primeiro parágrafo, como na abertura de um livro
        capitular &&
          'first-letter:float-left first-letter:mt-1.5 first-letter:mr-3 first-letter:font-display first-letter:text-[4.1rem] first-letter:leading-[0.8] first-letter:font-extrabold first-letter:text-sol-500',
      )}
    >
      {texto}
    </p>
  )
}

function Citacao({ texto }: { texto: string }) {
  return (
    <figure {...revelar(0)} className="relative my-12 border-l-4 border-vermelho-500 py-2 pl-6 sm:my-14 sm:pl-8">
      <span
        className="absolute -top-6 left-4 font-display text-7xl leading-none text-vermelho-500/30 select-none sm:left-6"
        aria-hidden="true"
      >
        “
      </span>
      <blockquote className="relative font-display text-xl leading-snug font-extrabold text-white sm:text-2xl">{texto}</blockquote>
    </figure>
  )
}

function LinhaDoTempo({ marcos }: { marcos: Marco[] }) {
  return (
    <section aria-labelledby="titulo-linha-do-tempo" className="secao-sobreposta recuar-ao-sair bg-carvao-900">
      <Container className="py-14 sm:py-20">
        <CabecalhoSecao id="titulo-linha-do-tempo" rotulo="Linha do tempo" titulo="O percurso até aqui" />
        <ol className="relative mx-auto mt-10 max-w-2xl space-y-8 border-l-2 border-white/10 pl-8 sm:mt-14">
          {marcos.map((marco, i) => {
            const ultimo = i === marcos.length - 1
            return (
              <li key={i} {...revelar(i * 100)} className="relative">
                {/* Ponto na linha: o último, o de hoje, fica cheio */}
                <span
                  className={cn(
                    'absolute top-1 -left-[2.6rem] h-4 w-4 rounded-full border-2',
                    ultimo ? 'border-vermelho-500 bg-vermelho-500 shadow-[0_0_0_6px_rgb(200_16_46/0.2)]' : 'border-sol-500 bg-carvao-900',
                  )}
                  aria-hidden="true"
                />
                <p className="text-xs font-bold tracking-[0.18em] text-sol-500 uppercase">{marco.rotulo}</p>
                <h3 className="mt-1 font-display text-lg font-extrabold text-white sm:text-xl">{marco.titulo}</h3>
                <p className="mt-1.5 leading-relaxed text-cinza-400">{marco.texto}</p>
              </li>
            )
          })}
        </ol>
      </Container>
    </section>
  )
}

function Galeria({ fotos }: { fotos: FotoSobre[] }) {
  return (
    <section aria-labelledby="titulo-galeria" className="secao-sobreposta recuar-ao-sair bg-carvao-950">
      <Container className="py-14 sm:py-20">
        <CabecalhoSecao id="titulo-galeria" rotulo="Fotos" titulo="Pelo caminho" />
        {/* No celular, uma embaixo da outra. Nas telas maiores, o arranjo depende da quantidade, para não sobrar buraco:
            múltiplo de 3, três colunas com a primeira em destaque; senão, duas colunas, com a primeira ocupando a
            linha toda quando a quantidade é ímpar. */}
        <ul className={cn('mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2', fotos.length % 3 === 0 && 'lg:grid-cols-3')}>
          {fotos.map((foto, i) => (
            <li
              key={i}
              {...revelar((i % 3) * 120)}
              className={cn(
                i === 0 && fotos.length % 2 === 1 && 'sm:col-span-2',
                i === 0 && fotos.length % 3 === 0 && 'lg:col-span-2 lg:row-span-2',
              )}
            >
              <figure className="group relative h-full overflow-hidden rounded-2xl bg-carvao-800">
                <img
                  src={foto.url}
                  alt={foto.descricao}
                  loading="lazy"
                  className={cn(
                    'aspect-[4/3] h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none',
                    // A que ocupa a linha toda fica mais panorâmica; em destaque nas três colunas, volta a 4:3
                    i === 0 && fotos.length % 2 === 1 && 'sm:aspect-[16/9] lg:aspect-[4/3]',
                  )}
                />
                {foto.legenda && (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 pt-12 text-sm leading-snug text-white">
                    {foto.legenda}
                  </figcaption>
                )}
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
