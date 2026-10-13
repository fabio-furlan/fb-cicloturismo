import { statusAVenda, type ResumoSaida } from '@/features/adm'

/** Os números do topo do dashboard: saídas abertas, vagas vendidas e rascunhos. */
export function ResumoSaidas({ saidas }: { saidas: ResumoSaida[] }) {
  const vendendo = saidas.filter((s) => statusAVenda.includes(s.status))
  const ocupadas = vendendo.reduce((total, s) => total + s.vagasOcupadas, 0)
  const capacidade = vendendo.reduce((total, s) => total + s.capacidade, 0)
  const itens = [
    { rotulo: 'Saídas abertas', valor: String(saidas.filter((s) => s.status === 'ABERTA').length) },
    { rotulo: 'Vagas vendidas', valor: `${ocupadas} de ${capacidade}` },
    { rotulo: 'Rascunhos', valor: String(saidas.filter((s) => s.status === 'RASCUNHO').length) },
  ]

  return (
    <dl className="grid gap-4 sm:grid-cols-3">
      {itens.map(({ rotulo, valor }) => (
        <div key={rotulo} className="rounded-2xl border border-white/10 bg-carvao-800/60 p-5">
          <dt className="text-sm text-cinza-400">{rotulo}</dt>
          <dd className="mt-1 font-display text-4xl font-black text-sol-500 tabular-nums">{valor}</dd>
        </div>
      ))}
    </dl>
  )
}
