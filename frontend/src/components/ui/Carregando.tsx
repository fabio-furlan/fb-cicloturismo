/** Exibido enquanto uma página está sendo carregada. */
export function Carregando() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-carvao-900" role="status">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-vermelho-500 border-t-transparent" />
      <span className="sr-only">Carregando...</span>
    </div>
  )
}
