import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Carregando } from '@/components/feedback/Carregando'
import { ROTAS } from '@/constants/rotas'
import { CabecalhoTela, Cartao, ErroNoPainel, TabelaSaidas, useApiAdm, type StatusSaida } from '@/features/adm'
import { useRecurso } from '@/hooks/useRecurso'
import { estiloBotaoPainel } from '../estilos'
import { FiltroStatus } from './FiltroStatus'
import { ResumoSaidas } from './ResumoSaidas'

/** Dashboard: as saídas que ainda não terminaram, com status, vagas vendidas e filtro por status. */
export function Painel() {
  const api = useApiAdm()
  const { estado, recarregar } = useRecurso((sinal) => api.proximasSaidas(sinal), [api])
  const [filtro, setFiltro] = useState<StatusSaida | ''>('')

  return (
    <div className="space-y-8">
      <CabecalhoTela
        titulo="Próximas saídas"
        descricao="Todas as saídas que ainda não terminaram, da mais próxima para a mais distante."
        acao={
          <Link to={ROTAS.admRoteiros} className={estiloBotaoPainel}>
            Nova saída
          </Link>
        }
      />

      {estado.situacao === 'carregando' && <Carregando variante="secao" />}
      {estado.situacao === 'erro' && <ErroNoPainel mensagem={estado.mensagem} aoTentarDeNovo={recarregar} />}
      {estado.situacao === 'pronto' && (
        <>
          <ResumoSaidas saidas={estado.dados} />
          <Cartao>
            <FiltroStatus saidas={estado.dados} filtro={filtro} aoMudar={setFiltro} />
            {estado.dados.length === 0 ? (
              <p className="py-6 text-center text-cinza-400">
                Nenhuma saída por vir. Crie uma em{' '}
                <Link to={ROTAS.admRoteiros} className="font-semibold text-sol-400">
                  Roteiros
                </Link>
                .
              </p>
            ) : (
              <TabelaSaidas saidas={filtro ? estado.dados.filter((s) => s.status === filtro) : estado.dados} />
            )}
          </Cartao>
        </>
      )}
    </div>
  )
}
