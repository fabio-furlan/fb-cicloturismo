// Classes dos links do menu.
type EstadoLink = { isActive: boolean }

// Desktop: caixa alta com uma linha vermelha embaixo. Na página atual a linha fica fixa;
// nas outras, ela cresce do centro ao passar o mouse. `sobreFoto`: cabeçalho transparente sobre a foto do topo.
export const classeLinkDesktop =
  (sobreFoto: boolean) =>
  ({ isActive }: EstadoLink) => {
    const cores = sobreFoto
      ? isActive
        ? 'text-white [text-shadow:0_1px_8px_rgb(0_0_0/0.4)]'
        : 'text-white/80 [text-shadow:0_1px_8px_rgb(0_0_0/0.4)] hover:text-white'
      : isActive
        ? 'text-vermelho-500'
        : 'text-carvao-900 hover:text-vermelho-500'
    return `relative py-2 font-display text-[0.85rem] font-bold uppercase tracking-[0.08em] transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:rounded-full after:bg-vermelho-500 after:transition-transform after:duration-300 motion-reduce:after:transition-none ${cores} ${
      isActive ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
    }`
  }

// Celular: ícone em quadradinho e o item atual com fundo vermelho suave.
export const classeLinkMobile = ({ isActive }: EstadoLink) =>
  `flex items-center gap-4 rounded-xl px-3 py-3 font-display text-base font-bold uppercase tracking-[0.06em] transition-colors ${
    isActive ? 'bg-vermelho-500/10 text-vermelho-500' : 'text-carvao-900 hover:bg-carvao-900/[0.04]'
  }`
