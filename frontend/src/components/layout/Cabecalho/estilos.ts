// Classes dos links do menu.
type EstadoLink = { isActive: boolean }

// Desktop: texto limpo com uma linha laranja embaixo. Na página atual a linha fica fixa;
// nas outras, ela cresce do centro ao passar o mouse.
export const classeLinkDesktop = ({ isActive }: EstadoLink) =>
  `relative py-2 text-[1.02rem] font-semibold tracking-[0.01em] [text-shadow:0_1px_8px_rgb(0_0_0/0.35)] transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:rounded-full after:bg-trilha-500 after:transition-transform after:duration-300 motion-reduce:after:transition-none ${
    isActive ? 'text-areia-100 after:scale-x-100' : 'text-areia-100/75 after:scale-x-0 hover:text-areia-100 hover:after:scale-x-100'
  }`

// Celular: ícone em quadradinho e o item atual com fundo suave.
export const classeLinkMobile = ({ isActive }: EstadoLink) =>
  `flex items-center gap-4 rounded-xl px-3 py-3 text-lg font-semibold transition-colors ${
    isActive ? 'bg-white/[0.07] text-areia-100' : 'text-areia-100/85 hover:bg-white/[0.05]'
  }`
