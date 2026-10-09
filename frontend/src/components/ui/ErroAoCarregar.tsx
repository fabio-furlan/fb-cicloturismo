import { Container } from './Container'

export function ErroAoCarregar({ aoTentarDeNovo }: { aoTentarDeNovo: () => void }) {
  return (
    <div role="alert">
      <Container className="flex min-h-[70svh] flex-col items-start justify-center py-28">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">Não foi possível carregar as viagens</h1>
        <p className="mt-3 max-w-xl text-areia-400">
          Confira sua conexão e tente de novo. Se continuar, fale com a gente pelo contato.
        </p>
        <button
          type="button"
          onClick={aoTentarDeNovo}
          className="mt-8 min-h-11 rounded-lg bg-trilha-500 px-6 text-sm font-semibold text-mata-950 hover:bg-trilha-400"
        >
          Tentar de novo
        </button>
      </Container>
    </div>
  )
}
