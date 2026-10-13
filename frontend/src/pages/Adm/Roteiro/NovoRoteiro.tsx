import { useNavigate } from 'react-router-dom'
import { rotaRoteiroAdm, ROTAS } from '@/constants/rotas'
import { CabecalhoTela, FormularioRoteiro, useApiAdm, type EstadoDaNavegacao } from '@/features/adm'

export function NovoRoteiro() {
  const api = useApiAdm()
  const navegar = useNavigate()

  return (
    <div className="space-y-6">
      <CabecalhoTela
        titulo="Novo roteiro"
        descricao="Depois de salvar, crie as saídas (datas, vagas e preço) na lista de roteiros."
        voltar={{ para: ROTAS.admRoteiros, rotulo: 'Roteiros' }}
      />
      <FormularioRoteiro
        rotuloBotao="Criar roteiro"
        aoEnviar={async (dados) => {
          const criado = await api.criarRoteiro(dados)
          navegar(rotaRoteiroAdm(criado.id), {
            state: { aviso: 'Roteiro criado. Agora abra uma saída para ele em Roteiros.' } satisfies EstadoDaNavegacao,
          })
        }}
      />
    </div>
  )
}
