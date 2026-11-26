/** Os parágrafos da história: uma ou mais linhas em branco separam um do outro; espaços nas pontas são ignorados. */
export const paragrafos = (texto: string) =>
  texto
    .split(/\n\s*\n/)
    .map((paragrafo) => paragrafo.trim())
    .filter(Boolean)
