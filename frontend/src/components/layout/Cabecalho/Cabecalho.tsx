import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { IconeFechar, IconeMenu } from '@/components/icones'
import { Container } from '@/components/ui/Container'
import { Logo } from '@/components/ui/Logo'
import { ROTAS } from '@/constants/rotas'
import { useRolagemPassou } from '@/hooks/useRolagemPassou'
import { useTravarRolagem } from '@/hooks/useTravarRolagem'
import { AcessoConta } from './AcessoConta'
import { MenuDesktop } from './MenuDesktop'
import { MenuMobile } from './MenuMobile'

export function Cabecalho() {
  const [menuAberto, setMenuAberto] = useState(false)
  const rolou = useRolagemPassou()
  const { pathname } = useLocation()

  useTravarRolagem(menuAberto)

  // Fecha o menu mobile com a tecla Esc.
  useEffect(() => {
    if (!menuAberto) return
    const aoPressionar = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') setMenuAberto(false)
    }
    window.addEventListener('keydown', aoPressionar)
    return () => window.removeEventListener('keydown', aoPressionar)
  }, [menuAberto])

  // Na página inicial o cabeçalho fica transparente sobre a foto até o usuário rolar; depois, branco com borda vermelha.
  const transparente = pathname === ROTAS.inicio && !rolou && !menuAberto
  const fecharMenu = () => setMenuAberto(false)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 border-b-2 transition-colors duration-300 ${
        transparente
          ? 'border-transparent bg-gradient-to-b from-black/55 to-transparent'
          : 'border-vermelho-500 bg-white/95 shadow-[0_4px_20px_-8px_rgb(0_0_0/0.25)] backdrop-blur-md'
      }`}
    >
      <Container className="flex h-16 items-center justify-between md:h-20">
        <Logo tom={transparente ? 'escuro' : 'claro'} />
        <MenuDesktop sobreFoto={transparente} />
        <div className="hidden md:block">
          <AcessoConta />
        </div>

        <button
          type="button"
          onClick={() => setMenuAberto((aberto) => !aberto)}
          className={`-mr-2 rounded-md p-2 md:hidden ${transparente ? 'text-white' : 'text-carvao-900'}`}
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuAberto}
          aria-controls="menu-mobile"
        >
          {menuAberto ? <IconeFechar className="h-7 w-7" /> : <IconeMenu className="h-7 w-7" />}
        </button>
      </Container>

      <MenuMobile aberto={menuAberto} aoFechar={fecharMenu} />
    </header>
  )
}
