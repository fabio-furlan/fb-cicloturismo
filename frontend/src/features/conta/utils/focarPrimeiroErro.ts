/** Depois de validar, leva o foco ao primeiro campo com erro (espera o React marcar os campos com aria-invalid). */
export function focarPrimeiroErro(formulario: HTMLFormElement) {
  requestAnimationFrame(() => formulario.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.focus())
}
