import type { User } from 'oidc-client-ts'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { criarApiAdm } from '../api/apiAdm'
import { ContextoSessaoAdm, type SessaoAdm } from './contexto'
import { administradorDe, gerenciadorKeycloak, irParaOLogin, temPapelAdm } from './keycloak'

const SEM_ACESSO = 'Esta conta não tem acesso ao painel do ADM.'

// O token muda a cada renovação (5 minutos). As chamadas leem sempre o atual, e o cliente da API continua o mesmo: as
// telas o usam como dependência para recarregar dados, e uma renovação não pode apagar o que está sendo editado. Fica
// fora do componente, como o gerenciador: há uma sessão do Keycloak só por página.
let tokenAtual = ''

/** Sessão do login pelo Keycloak. A tela de login e a de retorno ficam em `pages/Adm/Entrar`. */
export function ProvedorKeycloak({ children }: { children: ReactNode }) {
  const gerenciador = gerenciadorKeycloak()
  const [usuario, setUsuario] = useState<User | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [motivoDaSaida, setMotivoDaSaida] = useState<string | null>(null)

  const encerrar = useCallback(
    (motivo: string | null) => {
      void gerenciador.removeUser()
      tokenAtual = ''
      setUsuario(null)
      setMotivoDaSaida(motivo)
    },
    [gerenciador],
  )

  const aceitar = useCallback(
    (novo: User) => {
      if (!temPapelAdm(novo)) return encerrar(SEM_ACESSO)
      tokenAtual = novo.access_token
      setUsuario(novo)
      setMotivoDaSaida(null)
    },
    [encerrar],
  )

  useEffect(() => {
    let ativo = true
    // O login concluído na tela de retorno e cada renovação do token chegam por este evento.
    let recebeuPorEvento = false
    const eventos = gerenciador.events
    const pararDeOuvir = [
      eventos.addUserLoaded((novo) => {
        recebeuPorEvento = true
        aceitar(novo)
      }),
      eventos.addSilentRenewError(() => encerrar('Sua sessão expirou. Entre de novo.')),
    ]

    // A sessão guardada nesta aba, se houver. Depois de um F5 com o token vencido, tenta renová-lo antes de desistir.
    async function retomar() {
      let guardado = await gerenciador.getUser()
      if (guardado?.expired) guardado = await gerenciador.signinSilent().catch(() => null)
      if (!ativo) return
      if (guardado && !recebeuPorEvento) aceitar(guardado)
      setCarregando(false)
    }
    void retomar()

    return () => {
      ativo = false
      pararDeOuvir.forEach((parar) => parar())
    }
  }, [gerenciador, aceitar, encerrar])

  // "Sair" encerra também a sessão no Keycloak, que volta para a tela de login do painel. Sem isso, o próximo "Entrar"
  // veria a sessão do Keycloak ainda aberta. Uma saída forçada (token recusado pela API) só limpa a sessão local.
  const sair = useCallback(
    (motivo?: string) => {
      if (motivo) return encerrar(motivo)
      gerenciador.signoutRedirect().catch(() => encerrar(null))
    },
    [gerenciador, encerrar],
  )

  const sub = usuario?.profile.sub
  const api = useMemo(
    () =>
      sub
        ? criarApiAdm(
            () => tokenAtual,
            () => encerrar('Sua sessão terminou. Entre de novo.'),
          )
        : null,
    [sub, encerrar],
  )

  const nome = usuario ? administradorDe(usuario).nome : null
  const email = usuario ? administradorDe(usuario).email : null
  const administrador = useMemo(() => (nome === null || email === null ? null : { nome, email }), [nome, email])

  const valor = useMemo<SessaoAdm>(
    () => ({ administrador, carregando, api, motivoDaSaida, entrada: { tipo: 'keycloak', irParaOLogin }, sair }),
    [administrador, carregando, api, motivoDaSaida, sair],
  )

  return <ContextoSessaoAdm.Provider value={valor}>{children}</ContextoSessaoAdm.Provider>
}
