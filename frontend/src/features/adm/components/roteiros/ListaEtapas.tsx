import { formatarNumero } from '@/utils/formatacao'
import { distanciaTotal, novaEtapa, proximoDia, type EtapaForm } from '../../utils/formularioRoteiro'
import { Botao } from '../ui/Botao'
import { Campo } from '../ui/campos'
import { Cartao } from '../ui/Cartao'

interface ListaEtapasProps {
  etapas: EtapaForm[]
  aoMudar: (etapas: EtapaForm[]) => void
}

/** Os dias de pedal do roteiro, com a distância total somada enquanto se digita. */
export function ListaEtapas({ etapas, aoMudar }: ListaEtapasProps) {
  const mudarEtapa = (chave: number, parcial: Partial<EtapaForm>) =>
    aoMudar(etapas.map((e) => (e.chave === chave ? { ...e, ...parcial } : e)))
  const total = distanciaTotal(etapas)

  return (
    <Cartao
      titulo="Etapas"
      acoes={
        <p className="text-sm text-cinza-400 tabular-nums" aria-live="polite">
          Distância total: <span className="font-semibold text-creme-100">{formatarNumero(Math.round(total * 10) / 10)} km</span>
        </p>
      }
    >
      <p className="-mt-2 mb-4 text-sm text-cinza-400">
        Um item por dia de pedal. Dias sem pedal não têm etapa. A distância do roteiro é a soma das etapas.
      </p>
      <ol className="space-y-4">
        {etapas.map((etapa, i) => (
          <li key={etapa.chave} className="rounded-xl border border-white/10 bg-carvao-950/40 p-4">
            <div className="grid gap-4 sm:grid-cols-[6rem_minmax(0,1fr)_8rem_8rem]">
              <Campo
                rotulo="Dia"
                type="number"
                min={1}
                step={1}
                required
                value={etapa.dia}
                onChange={(e) => mudarEtapa(etapa.chave, { dia: e.target.value })}
              />
              <Campo
                rotulo="Título"
                required
                maxLength={160}
                value={etapa.titulo}
                onChange={(e) => mudarEtapa(etapa.chave, { titulo: e.target.value })}
                placeholder="Timbó a Pomerode"
              />
              <Campo
                rotulo="Km"
                type="number"
                min={0}
                step="0.1"
                required
                inputMode="decimal"
                value={etapa.distanciaKm}
                onChange={(e) => mudarEtapa(etapa.chave, { distanciaKm: e.target.value })}
              />
              <Campo
                rotulo="Subida (m)"
                type="number"
                min={0}
                step={1}
                value={etapa.subidaM}
                onChange={(e) => mudarEtapa(etapa.chave, { subidaM: e.target.value })}
                ajuda="Opcional"
              />
            </div>
            {etapas.length > 1 && (
              <button
                type="button"
                onClick={() => aoMudar(etapas.filter((e) => e.chave !== etapa.chave))}
                className="mt-3 text-sm font-semibold text-alerta-300 hover:underline"
              >
                Remover etapa {i + 1}
              </button>
            )}
          </li>
        ))}
      </ol>
      <Botao variante="secundario" className="mt-4" onClick={() => aoMudar([...etapas, novaEtapa(proximoDia(etapas))])}>
        + Adicionar etapa
      </Botao>
    </Cartao>
  )
}
