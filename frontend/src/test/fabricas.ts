import type { Roteiro, Saida } from '@/features/roteiros'

// Dados de teste: um roteiro válido completo, em que cada teste troca só o que importa para ele.

export const criarSaida = (sobrescrever: Partial<Saida> = {}): Saida => ({
  data: '2026-11-14',
  vagasRestantes: 8,
  precoReais: 1890,
  ...sobrescrever,
})

export const criarRoteiro = (sobrescrever: Partial<Roteiro> = {}): Roteiro => ({
  id: 'vale-europeu',
  nome: 'Circuito Vale Europeu',
  regiao: 'Timbó, Santa Catarina',
  nivel: 'intermediario',
  paisagem: 'vale',
  descricao: 'Estradas de terra entre colônias alemãs e italianas.',
  foto: { src: '/images/roteiros/vale-europeu.jpg', descricao: 'Estrada de terra entre plantações' },
  dias: 2,
  etapas: [
    { dia: 1, titulo: 'Timbó a Pomerode', distanciaKm: 50, subidaM: 600 },
    { dia: 2, titulo: 'Pomerode a Timbó', distanciaKm: 50, subidaM: 600 },
  ],
  distanciaKm: 100,
  subidaTotalM: 1200,
  altitudes: [100, 300, 200, 400, 100],
  saidas: [criarSaida()],
  precoReais: 1890,
  ...sobrescrever,
})
