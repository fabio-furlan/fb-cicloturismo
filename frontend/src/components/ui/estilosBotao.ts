const base =
  'inline-flex items-center justify-center rounded-full bg-vermelho-500 font-display font-bold tracking-[0.08em] text-white uppercase transition-colors hover:bg-vermelho-600'

const tamanhos = {
  /** Ação principal de uma página ou seção. */
  padrao: 'min-h-11 gap-2 px-7 text-[0.8rem]',
  /** Chamada de destaque, como o "Fale com a gente" do fim da página inicial. */
  grande: 'min-h-12 gap-2 px-7 text-[0.8rem]',
  /** Cabeçalho das telas do painel do ADM. */
  compacto: 'min-h-11 gap-2 px-6 text-[0.75rem]',
  /** Texto seguido de uma seta: o lado da seta tem menos respiro. */
  comSeta: 'min-h-11 gap-1.5 pr-4 pl-5 text-[0.75rem]',
}

export type TamanhoBotao = keyof typeof tamanhos

/**
 * Botão de ação principal do site: pílula vermelha com texto em caixa alta. Serve para `<button>` e para `<Link>`.
 * Quem usa só acrescenta o que é do lugar (margem, posição) com `cn(estiloBotaoPrincipal(), 'mt-8')`: o tamanho vem das
 * variantes acima, nunca de uma classe que sobrescreva a da receita.
 */
export const estiloBotaoPrincipal = (tamanho: TamanhoBotao = 'padrao') => `${base} ${tamanhos[tamanho]}`

/** Sombra avermelhada dos botões principais que ficam sobre fotos ou fundos escuros. */
export const sombraBotaoPrincipal = 'shadow-[0_8px_24px_-8px_rgb(200_16_46/0.8)]'
