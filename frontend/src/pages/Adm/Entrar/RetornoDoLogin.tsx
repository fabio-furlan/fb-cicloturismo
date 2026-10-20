import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Carregando } from '@/components/feedback/Carregando'
import { Logo } from '@/components/ui/Logo'
import { ROTAS } from '@/constants/rotas'
import { Aviso, concluirLogin } from '@/features/adm'

/**
 * Para onde o Keycloak devolve o ADM depois do login. Conclui a entrada e segue para a página de onde ele saiu. Uma
 * conta sem o papel ADM é recusada pela sessão, e o painel a manda de volta ao login com a explicação.
 */
export function RetornoDoLogin() {
  const navegar = useNavigate()
  const [falhou, setFalhou] = useState(false)

  useEffect(() => {
    let ativo = true
    concluirLogin().then(
      (destino) => ativo && navegar(destino, { replace: true }),
      () => ativo && setFalhou(true),
    )
    return () => {
      ativo = false
    }
  }, [navegar])

  if (!falhou) return <Carregando />

  // O login foi cancelado na tela do Keycloak, demorou demais ou este endereço foi aberto direto.
  return (
    <main className="flex min-h-screen items-center justify-center bg-carvao-900 px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="mt-10 space-y-5 rounded-2xl border border-white/10 bg-carvao-800/60 p-6">
          <h1 className="font-display text-3xl font-black uppercase">Painel do ADM</h1>
          <Aviso tipo="erro">Não foi possível concluir a entrada.</Aviso>
          <Link to={ROTAS.admEntrar} replace className="inline-flex font-semibold text-sol-400 hover:text-sol-500">
            Tentar de novo
          </Link>
        </div>
      </div>
    </main>
  )
}
