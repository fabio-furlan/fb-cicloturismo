const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap transition duration-200 motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-50'

const variantes = {
  /** Ação principal: vermelho com um leve degradê, brilho no alto e sombra suave; sobe um pouco no hover. */
  principal:
    'bg-gradient-to-b from-vermelho-500 to-vermelho-600 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_8px_20px_-10px_rgb(200_16_46/0.85)] hover:-translate-y-px hover:from-vermelho-600 hover:to-vermelho-700 active:translate-y-0 disabled:translate-y-0 motion-reduce:hover:translate-y-0',
  /** Ação secundária sobre fundo claro: contorno fino e texto escuro. */
  secundario: 'border border-carvao-900/15 bg-white text-carvao-900 hover:border-carvao-900/30 hover:bg-carvao-900/[0.03]',
  /** Ação secundária sobre fundo escuro (seções escuras e painel do ADM). */
  secundarioEscuro: 'border border-white/20 text-creme-100 hover:border-white/40 hover:bg-white/[0.06]',
  /** Ação que apaga ou cancela algo (painel do ADM). */
  perigo: 'border border-alerta-600 text-alerta-300 hover:bg-alerta-600 hover:text-white',
}

const tamanhos = {
  /** Dentro de cartões, barras de busca e cabeçalhos. */
  compacto: 'min-h-10 px-4 text-sm',
  /** Ação principal de uma página ou seção. */
  padrao: 'min-h-11 px-5 text-sm',
  /** Chamada de destaque, como o "Fale com a gente" do fim da página inicial. */
  grande: 'min-h-12 px-6 text-base',
}

export type VarianteBotao = keyof typeof variantes
export type TamanhoBotao = keyof typeof tamanhos

/**
 * Receita dos botões do site e do painel: cantos arredondados, texto normal (sem caixa alta) e semibold. Serve para
 * `<button>` e para `<Link>`. Quem usa só acrescenta o que é do lugar (margem, largura) com
 * `cn(estiloBotao(), 'mt-8')`: cor e tamanho vêm das variantes acima, nunca de uma classe que sobrescreva a receita.
 */
export const estiloBotao = (variante: VarianteBotao = 'principal', tamanho: TamanhoBotao = 'padrao') =>
  `${base} ${variantes[variante]} ${tamanhos[tamanho]}`
