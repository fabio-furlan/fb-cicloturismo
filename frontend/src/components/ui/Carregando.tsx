/** Exibido enquanto uma página está sendo carregada. */
export function Carregando() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-mata-900" role="status">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-trilha-500 border-t-transparent" />
      <span className="sr-only">Carregando...</span>
    </div>
  )
}
