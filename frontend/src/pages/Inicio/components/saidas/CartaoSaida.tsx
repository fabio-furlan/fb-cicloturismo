import { IconeCalendario, IconeMontanha, IconeRota, IconeSeta } from '@/components/icones'
import { IndicadorNivel } from '@/components/ui/IndicadorNivel'
import { paisagens } from '@/config/paisagens'
import type { Roteiro, Saida } from '@/types/roteiro'
import { formatarData, formatarNumero, formatarPreco, partesData } from '@/utils/formatacao'
import { descreverDuracao } from '@/utils/rota'

interface CartaoSaidaProps {
  roteiro: Roteiro
  /** A próxima saída que combina com os filtros; as demais aparecem como "outras datas". */
  saida: Saida
  outrasSaidas: Saida[]
  aoVerRoteiro: () => void
}

export function CartaoSaida({ roteiro, saida, outrasSaidas, aoVerRoteiro }: CartaoSaidaProps) {
  const { dia, mes } = partesData(saida.data)
  const ultimasVagas = saida.vagasRestantes <= 4

  const dados = [
    { icone: IconeCalendario, texto: descreverDuracao(roteiro), extra: '' },
    { icone: IconeRota, texto: `${roteiro.distanciaKm} km`, extra: '' },
    { icone: IconeMontanha, texto: `${formatarNumero(roteiro.subidaTotalM)} m`, extra: ' de subida' },
  ]

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-areia-50 text-mata-900 shadow-[0_18px_40px_-24px_rgb(0_0_0/0.7)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-24px_rgb(0_0_0/0.85)] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={roteiro.foto.src}
          alt={roteiro.foto.descricao}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <p className="absolute left-3 top-3 rounded-xl bg-areia-50/95 px-3 py-1.5 text-center leading-none shadow-sm">
          <span className="block font-display text-2xl font-bold tabular-nums">{dia}</span>
          <span className="block text-xs font-semibold text-pedra-600">
            {mes} {saida.data.slice(2, 4)}
          </span>
        </p>
        <span
          className={`absolute right-3 top-3 rounded-md px-2.5 py-1 text-xs font-semibold shadow-sm ${
            ultimasVagas ? 'bg-alerta-600 text-white' : 'bg-areia-50/95 text-mata-900'
          }`}
        >
          {ultimasVagas ? `Últimas ${saida.vagasRestantes} vagas` : `${saida.vagasRestantes} vagas`}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span className="font-semibold text-trilha-700">{paisagens[roteiro.paisagem]}</span>
          <IndicadorNivel nivel={roteiro.nivel} className="text-pedra-600" />
        </p>
        <h3 className="mt-1 font-display text-[1.65rem] font-bold leading-tight">{roteiro.nome}</h3>
        <p className="mt-0.5 text-sm text-pedra-600">{roteiro.regiao}</p>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-mata-900/80">{roteiro.descricao}</p>

        <ul className="mt-4 flex flex-wrap gap-2 text-sm font-semibold tabular-nums">
          {dados.map(({ icone: Icone, texto, extra }) => (
            <li key={texto} className="flex items-center gap-1.5 rounded-lg bg-mata-900/[0.06] px-3 py-1.5">
              <Icone className="h-4 w-4 text-trilha-700" />
              {texto}
              {extra && <span className="sr-only">{extra}</span>}
            </li>
          ))}
        </ul>
        <p className="mb-6 mt-3 text-sm text-pedra-600">
          {outrasSaidas.length > 0
            ? `Outras datas: ${outrasSaidas.map((s) => formatarData(s.data)).join(', ')}`
            : 'Única data aberta no momento'}
        </p>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-areia-200 pt-5">
          <p>
            <span className="block text-xs text-pedra-600">Por pessoa, tudo incluso</span>
            <span className="font-display text-3xl font-bold tabular-nums leading-none">{formatarPreco(saida.precoReais)}</span>
          </p>
          <button
            type="button"
            onClick={aoVerRoteiro}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-trilha-500 pl-5 pr-4 text-sm font-semibold text-mata-950 transition-colors hover:bg-trilha-400"
          >
            Ver roteiro
            <IconeSeta className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </button>
        </div>
      </div>
    </article>
  )
}
