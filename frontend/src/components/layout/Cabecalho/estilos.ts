// Classes compartilhadas entre o menu desktop e o mobile.
export const classeLink = ({ isActive }: { isActive: boolean }) =>
  `font-semibold transition-colors ${isActive ? 'text-trilha-500' : 'text-white/90 hover:text-trilha-500'}`
