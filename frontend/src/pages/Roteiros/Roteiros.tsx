import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Carregando } from '@/components/ui/Carregando'
import { Container } from '@/components/ui/Container'
import { ErroAoCarregar } from '@/components/ui/ErroAoCarregar'
import { useRoteiros } from '@/hooks/useRoteiros'
import { SecaoExplorador } from './components/explorador/SecaoExplorador'

export function Roteiros() {
  const estado = useRoteiros()
  // O roteiro aberto fica na URL (?roteiro=id): os cartões da página inicial abrem direto nele e o link pode ser compartilhado.
  // Sem nenhum escolhido, o explorador abre o da saída mais próxima.
  const [parametros, setParametros] = useSearchParams()
  const roteiroId = parametros.get('roteiro')

  // Quem chega de outra página começa do topo, não da altura em que estava rolando.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (estado.situacao === 'carregando') return <Carregando />
  if (estado.situacao === 'erro') return <ErroAoCarregar aoTentarDeNovo={estado.tentarDeNovo} />
  const { roteiros } = estado

  if (roteiros.length === 0) {
    return (
      <Container className="flex min-h-[60svh] flex-col justify-center py-16">
        <h1 className="font-display text-3xl font-semibold uppercase italic leading-none sm:text-4xl">Roteiros</h1>
        <p className="mt-3 text-areia-400">Nenhuma saída aberta no momento. Volte em breve para conhecer os próximos roteiros.</p>
      </Container>
    )
  }

  return (
    <SecaoExplorador
      roteiros={roteiros}
      roteiroId={roteiroId}
      aoSelecionarRoteiro={(id) => setParametros({ roteiro: id }, { replace: true })}
    />
  )
}
