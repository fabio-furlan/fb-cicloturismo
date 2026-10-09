import { Link } from 'react-router-dom'
import { IconeEmail, IconeLocal, IconeTelefone } from '@/components/icones'
import { Container } from '@/components/ui/Container'
import { Logo } from '@/components/ui/Logo'
import { empresa } from '@/config/empresa'
import { linksNavegacao } from '@/config/navegacao'
import { ROTAS } from '@/constants/rotas'
import { useVoltarAoTopoNaMesmaPagina } from '@/hooks/useRolagemAoTopo'
import { ColunaRodape } from './ColunaRodape'

const anoAtual = new Date().getFullYear()

// No rodapé, "Contato" já é o título da coluna ao lado (e leva à página de contato); a navegação fica sem ele.
const ordemRodape: string[] = [ROTAS.inicio, ROTAS.sobre, ROTAS.roteiros]
const linksRodape = ordemRodape.flatMap((rota) => linksNavegacao.filter((link) => link.rota === rota))

export function Rodape() {
  const { contato } = empresa
  const voltarAoTopo = useVoltarAoTopoNaMesmaPagina()

  // "group": com o mouse em qualquer parte do rodapé, o ciclista do logo aponta para o nome.
  return (
    <footer className="group border-t-2 border-vermelho-500 bg-carvao-950 text-sm text-white/70">
      {/* Três blocos distribuídos pela largura: marca à esquerda, navegação no centro e contato à direita */}
      <Container className="grid gap-8 py-10 sm:grid-cols-3 sm:items-start">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs leading-relaxed">{empresa.descricao}</p>
        </div>

        <ColunaRodape titulo="Navegação" className="sm:justify-self-center">
          <ul className="sm:space-y-1.5">
            {linksRodape.map(({ rota, rotulo }) => (
              <li key={rota}>
                <Link to={rota} onClick={voltarAoTopo(rota)} className="inline-flex min-h-10 items-center transition-colors hover:text-sol-500 sm:min-h-0">
                  {rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </ColunaRodape>

        <ColunaRodape titulo="Contato" rota={ROTAS.contato} className="sm:justify-self-end">
          <ul className="sm:space-y-1.5">
            <li className="flex min-h-10 items-center gap-2 sm:min-h-0">
              <IconeEmail className="h-4 w-4 shrink-0 text-sol-500" />
              <a href={`mailto:${contato.email}`} className="-my-3 break-all py-3 transition-colors hover:text-sol-500">
                {contato.email}
              </a>
            </li>
            <li className="flex min-h-10 items-center gap-2 sm:min-h-0">
              <IconeTelefone className="h-4 w-4 shrink-0 text-sol-500" />
              {contato.telefone}
            </li>
            <li className="flex min-h-10 items-center gap-2 sm:min-h-0">
              <IconeLocal className="h-4 w-4 shrink-0 text-sol-500" />
              {contato.cidade}
            </li>
          </ul>
        </ColunaRodape>
      </Container>

      <div className="border-t border-white/10 bg-black/30">
        <Container className="py-4 text-center text-xs text-white/50">
          © {anoAtual} {empresa.nome}. Todos os direitos reservados.
        </Container>
      </div>
    </footer>
  )
}
