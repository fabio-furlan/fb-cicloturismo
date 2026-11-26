import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Carregando } from '@/components/feedback/Carregando'
import { ROTAS } from '@/constants/rotas'
import { Aviso, CabecalhoTela, ErroNoPainel, FormularioSobre, useApiAdm, type Mensagem } from '@/features/adm'
import { paginaSobrePadrao } from '@/features/institucional'
import { useRecurso } from '@/hooks/useRecurso'
import { estiloLinkSecundario } from '../estilos'

const voltarAoTopo = () => window.scrollTo({ top: 0, behavior: 'smooth' })

/** Edição da página "Sobre nós". Enquanto ela não foi salva, o formulário começa do texto padrão que o site mostra. */
export function EditarSobre() {
  const api = useApiAdm()
  const { estado, recarregar, substituir } = useRecurso((sinal) => api.sobre(sinal), [api])
  const [mensagem, setMensagem] = useState<Mensagem | null>(null)
  // Muda a cada salvamento, para o formulário recomeçar do que a API devolveu.
  const [versao, setVersao] = useState(0)

  if (estado.situacao === 'carregando') return <Carregando variante="secao" />
  if (estado.situacao === 'erro') return <ErroNoPainel mensagem={estado.mensagem} aoTentarDeNovo={recarregar} />
  const salva = estado.dados

  return (
    <div className="space-y-6">
      <CabecalhoTela
        titulo="Sobre nós"
        descricao="A história, a linha do tempo e as fotos da página Sobre nós do site."
        acao={
          <Link to={ROTAS.sobre} target="_blank" rel="noreferrer" className={estiloLinkSecundario}>
            Ver a página ↗
          </Link>
        }
      />

      {mensagem ? (
        <Aviso tipo={mensagem.tipo}>{mensagem.texto}</Aviso>
      ) : (
        !salva && (
          <p className="rounded-xl border border-sol-500/30 bg-sol-500/10 px-4 py-3 text-sm text-creme-100">
            A página ainda não foi salva: o site mostra o texto padrão, que já está no formulário abaixo. Ajuste o que quiser e salve.
          </p>
        )
      )}

      <FormularioSobre
        key={versao}
        inicial={salva ?? paginaSobrePadrao}
        aoEnviar={async (pagina) => {
          substituir(await api.salvarSobre(pagina))
          setVersao((v) => v + 1)
          setMensagem({ tipo: 'sucesso', texto: 'Página salva. O site já mostra a versão nova.' })
          voltarAoTopo()
        }}
      />
    </div>
  )
}
