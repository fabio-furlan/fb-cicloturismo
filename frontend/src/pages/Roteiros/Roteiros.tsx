import { useSearchParams } from 'react-router-dom'
import { Carregando } from '@/components/feedback/Carregando'
import { Container } from '@/components/ui/Container'
import { TituloSecao } from '@/components/ui/TituloSecao'
import { ErroNoCatalogo, useRoteiros } from '@/features/roteiros'
import { SecaoExplorador } from './components/explorador/SecaoExplorador'

export function Roteiros() {
  const { estado, recarregar } = useRoteiros()
  // O roteiro aberto fica na URL (?roteiro=id): os cartões da página inicial abrem direto nele e o link pode ser compartilhado.
  // Sem nenhum escolhido, o explorador abre o da saída mais próxima.
  const [parametros, setParametros] = useSearchParams()
  const roteiroId = parametros.get('roteiro')

  if (estado.situacao === 'carregando') return <Carregando />
  if (estado.situacao === 'erro') return <ErroNoCatalogo aoTentarDeNovo={recarregar} />
  const roteiros = estado.dados

  if (roteiros.length === 0) {
    return (
      <Container className="flex min-h-[60svh] flex-col justify-center py-16">
        <TituloSecao
          nivel="h1"
          titulo="Nossos"
          destaque="roteiros"
          descricao="Nenhuma saída aberta no momento. Volte em breve para conhecer os próximos roteiros."
          tom="escuro"
          alinhamento="esquerda"
        />
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
