import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { IconeFechar, IconeMenu } from '@/components/icones'
import { Container } from '@/components/ui/Container'
import { Logo } from '@/components/ui/Logo'
import { ROTAS } from '@/constants/rotas'
import { useRolagemPassou } from '@/hooks/useRolagemPassou'
import { useTravarRolagem } from '@/hooks/useTravarRolagem'
import { BotaoMinhaConta } from './BotaoMinhaConta'
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

  // Na página inicial o cabeçalho fica transparente sobre a foto até o usuário rolar.
  const transparente = pathname === ROTAS.inicio && !rolou && !menuAberto
  const fecharMenu = () => setMenuAberto(false)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 transition-colors duration-300 ${
        transparente ? 'bg-gradient-to-b from-black/60 to-transparent' : 'bg-night-900 shadow-lg'
      }`}
    >
      <Container className="flex h-16 items-center justify-between md:h-20">
        <Logo />
        <MenuDesktop />
        <div className="hidden md:block">
          <BotaoMinhaConta />
        </div>

        <button
          type="button"
          onClick={() => setMenuAberto((aberto) => !aberto)}
          className="-mr-2 rounded-md p-2 text-white md:hidden"
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
