const numero = new Intl.NumberFormat('pt-BR')
const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
const dataCurta = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', timeZone: 'UTC' })

/** 4380 → "4.380" */
export const formatarNumero = (valor: number) => numero.format(valor)

/** 3890 → "R$ 3.890" */
export const formatarPreco = (valor: number) => moeda.format(valor)

/** "2026-11-14" → "14 de nov." */
export const formatarData = (iso: string) => dataCurta.format(new Date(iso))

const mesAno = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' })
const mesCurto = new Intl.DateTimeFormat('pt-BR', { month: 'short', timeZone: 'UTC' })

/** "2026-11" ou "2026-11-14" → "novembro de 2026" */
export const formatarMesAno = (iso: string) => mesAno.format(new Date(iso.length === 7 ? `${iso}-01` : iso))

/** "2026-11-14" → { dia: "14", mes: "nov" } */
export function partesData(iso: string) {
  const data = new Date(iso)
  return { dia: String(data.getUTCDate()), mes: mesCurto.format(data).replace('.', '') }
}
