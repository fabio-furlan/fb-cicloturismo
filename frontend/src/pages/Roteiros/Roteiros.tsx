import { useSearchParams } from 'react-router-dom'
import { Carregando } from '@/components/ui/Carregando'
import { Container } from '@/components/ui/Container'
import { ErroAoCarregar } from '@/components/ui/ErroAoCarregar'
import { TituloSecao } from '@/components/ui/TituloSecao'
import { useRoteiros } from '@/hooks/useRoteiros'
import { SecaoExplorador } from './components/explorador/SecaoExplorador'

export function Roteiros() {
  const estado = useRoteiros()
  // O roteiro aberto fica na URL (?roteiro=id): os cartões da página inicial abrem direto nele e o link pode ser compartilhado.
  // Sem nenhum escolhido, o explorador abre o da saída mais próxima.
  const [parametros, setParametros] = useSearchParams()
  const roteiroId = parametros.get('roteiro')

  if (estado.situacao === 'carregando') return <Carregando />
  if (estado.situacao === 'erro') return <ErroAoCarregar aoTentarDeNovo={estado.tentarDeNovo} />
  const { roteiros } = estado

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
