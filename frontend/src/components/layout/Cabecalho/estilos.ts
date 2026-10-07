// Classes compartilhadas entre o menu desktop e o mobile.
export const classeLink = ({ isActive }: { isActive: boolean }) =>
  `font-semibold transition-colors ${isActive ? 'text-amber-400' : 'text-white/90 hover:text-amber-400'}`
