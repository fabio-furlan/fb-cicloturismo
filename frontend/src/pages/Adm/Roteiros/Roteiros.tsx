import { Link } from 'react-router-dom'
import { Carregando } from '@/components/feedback/Carregando'
import { ROTAS } from '@/constants/rotas'
import { CabecalhoTela, Cartao, ErroNoPainel, useApiAdm } from '@/features/adm'
import { useRecurso } from '@/hooks/useRecurso'
import { estiloBotaoPainel } from '../estilos'
import { LinhaRoteiro } from './LinhaRoteiro'

/** Os roteiros cadastrados e, para cada um, as saídas e a criação de uma nova. */
export function Roteiros() {
  const api = useApiAdm()
  const { estado, recarregar } = useRecurso((sinal) => api.roteiros(sinal), [api])

  return (
    <div className="space-y-8">
      <CabecalhoTela
        titulo="Roteiros"
        descricao="Escolha um roteiro para editar, ver as saídas dele ou abrir uma data nova."
        acao={
          <Link to={ROTAS.admNovoRoteiro} className={estiloBotaoPainel}>
            Novo roteiro
          </Link>
        }
      />
      {estado.situacao === 'carregando' && <Carregando variante="secao" />}
      {estado.situacao === 'erro' && <ErroNoPainel mensagem={estado.mensagem} aoTentarDeNovo={recarregar} />}
      {estado.situacao === 'pronto' && (
        <Cartao>
          {estado.dados.length === 0 ? (
            <p className="py-6 text-center text-cinza-400">Nenhum roteiro cadastrado ainda.</p>
          ) : (
            <ul className="-my-5 divide-y divide-white/10">
              {estado.dados.map((roteiro) => (
                <LinhaRoteiro key={roteiro.id} roteiro={roteiro} />
              ))}
            </ul>
          )}
        </Cartao>
      )}
    </div>
  )
}
