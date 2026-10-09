import { Container } from './Container'

export function ErroAoCarregar({ aoTentarDeNovo }: { aoTentarDeNovo: () => void }) {
  return (
    <div role="alert">
      <Container className="flex min-h-[70svh] flex-col items-start justify-center py-28">
        <h1 className="font-display text-2xl font-black uppercase sm:text-4xl">Não foi possível carregar as viagens</h1>
        <p className="mt-3 max-w-xl text-cinza-400">
          Confira sua conexão e tente de novo. Se continuar, fale com a gente pelo contato.
        </p>
        <button
          type="button"
          onClick={aoTentarDeNovo}
          className="mt-8 min-h-11 rounded-full bg-vermelho-500 px-7 font-display text-[0.8rem] font-bold uppercase tracking-[0.08em] text-white hover:bg-vermelho-600"
        >
          Tentar de novo
        </button>
      </Container>
    </div>
  )
}
