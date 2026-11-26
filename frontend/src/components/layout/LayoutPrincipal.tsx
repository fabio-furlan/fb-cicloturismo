import { Outlet, useLocation } from 'react-router-dom'
import { LimiteDeErro } from '@/components/feedback/LimiteDeErro'
import { ROTAS } from '@/constants/rotas'
import { useRevelarAoRolar } from '@/hooks/useRevelarAoRolar'
import { cn } from '@/utils/cn'
import { Cabecalho } from './Cabecalho'
import { Rodape } from './Rodape'

export function LayoutPrincipal() {
  const { pathname } = useLocation()
  // Em todas as páginas do site, o que é marcado com revelar() surge ao entrar na tela, como na página inicial.
  useRevelarAoRolar()
  // Na página inicial a foto fica por trás do cabeçalho; nas demais, o conteúdo começa abaixo dele.
  const recuoDoCabecalho = pathname === ROTAS.inicio ? '' : 'pt-16 md:pt-20'

  return (
    <div className="flex min-h-screen flex-col">
      <Cabecalho />
      <main className={cn('flex-1', recuoDoCabecalho)}>
        {/* Um erro numa página fica no conteúdo: o cabeçalho e o rodapé continuam para a pessoa sair dela. */}
        <LimiteDeErro reiniciarCom={pathname}>
          <Outlet />
        </LimiteDeErro>
      </main>
      <Rodape />
    </div>
  )
}
