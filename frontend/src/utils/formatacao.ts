// Formatação de números, preços e datas em português. As datas chegam em ISO (AAAA-MM-DD) e são lidas em UTC, para
// "2026-11-14" ser sempre o dia 14, qualquer que seja o fuso de quem visita.

const numero = new Intl.NumberFormat('pt-BR')
const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
const moedaExata = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

const dataCurta = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', timeZone: 'UTC' })
const dataCompleta = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' })
const diaMes = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'UTC' })
const mesAno = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' })

/** 4380 → "4.380" */
export const formatarNumero = (valor: number) => numero.format(valor)

/** 3890 → "R$ 3.890": no site, o preço aparece sem centavos. */
export const formatarPreco = (valor: number) => moeda.format(valor)

/** 1490 → "R$ 1.490,00": no painel do ADM, os centavos importam. */
export const formatarPrecoExato = (valor: number) => moedaExata.format(valor)

/** "2026-11-14" → "14 de nov." */
export const formatarData = (iso: string) => dataCurta.format(new Date(iso))

/** "2026-12-12" → "12/12/2026" */
export const formatarDataCompleta = (iso: string) => dataCompleta.format(new Date(iso))

/** "2026-12-12" a "2026-12-14" → "12/12 a 14/12/2026"; num dia só, só a data. */
export function formatarPeriodo(inicio: string, fim: string) {
  return inicio === fim ? formatarDataCompleta(inicio) : `${diaMes.format(new Date(inicio))} a ${formatarDataCompleta(fim)}`
}

/** "2026-11" ou "2026-11-14" → "novembro de 2026" */
export const formatarMesAno = (iso: string) => mesAno.format(new Date(iso.length === 7 ? `${iso}-01` : iso))

/** O que se digita num campo numérico ("1490,5" ou "1490.5") → 1490.5. Campo vazio vira 0. */
export const lerNumero = (texto: string) => Number(texto.replace(',', '.'))
