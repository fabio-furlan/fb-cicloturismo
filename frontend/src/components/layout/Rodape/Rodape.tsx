import { Link } from 'react-router-dom'
import { IconeEmail, IconeLocal, IconeTelefone } from '@/components/icones'
import { Container } from '@/components/ui/Container'
import { Logo } from '@/components/ui/Logo'
import { empresa } from '@/config/empresa'
import { linksNavegacao } from '@/config/navegacao'
import { ColunaRodape } from './ColunaRodape'

const anoAtual = new Date().getFullYear()

export function Rodape() {
  const { contato } = empresa

  return (
    <footer className="bg-mata-950 text-sm text-white/70">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 sm:py-14 lg:grid-cols-3">
        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
          <Logo />
          <p className="max-w-xs leading-relaxed">{empresa.descricao}</p>
        </div>

        <ColunaRodape titulo="Navegação">
          <ul className="space-y-2">
            {linksNavegacao.map(({ rota, rotulo }) => (
              <li key={rota}>
                <Link to={rota} className="transition-colors hover:text-trilha-500">
                  {rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </ColunaRodape>

        <ColunaRodape titulo="Contato">
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <IconeEmail className="h-4 w-4 shrink-0 text-trilha-500" />
              <a href={`mailto:${contato.email}`} className="break-all transition-colors hover:text-trilha-500">
                {contato.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <IconeTelefone className="h-4 w-4 shrink-0 text-trilha-500" />
              {contato.telefone}
            </li>
            <li className="flex items-center gap-2">
              <IconeLocal className="h-4 w-4 shrink-0 text-trilha-500" />
              {contato.cidade}
            </li>
          </ul>
        </ColunaRodape>
      </Container>

      <div className="border-t border-white/10 bg-black/25">
        <Container className="py-5 text-center text-xs text-white/50">
          © {anoAtual} {empresa.nome}. Todos os direitos reservados.
        </Container>
      </div>
    </footer>
  )
}
