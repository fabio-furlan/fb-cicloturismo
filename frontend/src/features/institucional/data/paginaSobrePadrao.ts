import type { PaginaSobre } from '../types'

/**
 * O texto da página "Sobre nós" enquanto o ADM não salva a dele (e quando o site roda sem a API). Também é o ponto de
 * partida do formulário de edição no painel.
 */
export const paginaSobrePadrao: PaginaSobre = {
  titulo: 'Olá, eu sou o Fábio',
  chamada:
    'Desenvolvedor de Software, ciclista e viajante.\nNo meu dia a dia, transformo ideias em código, nas horas livres troco o teclado pelo guidão, e saio para explorar o mundo sobre duas rodas.\nCriei este espaço justamente para unir esses dois universos, onde compartilho rotas, experiências de cicloturismo e os projetos de tecnologia que desenvolvo para o pedal.',
  historia: `Sempre gostei de entender como as coisas funcionam, quando criança desmontava brinquedos para entender o funcionamento. Com o tempo, essa curiosidade encontrou dois caminhos, a bicicleta e o desenvolvimento de software.

A bicicleta veio primeiro, no começo eram voltas pelo bairro, depois pedais mais longos nos fins de semana. \n E foi sobre duas rodas que encontrei meu melhor espaço de reflexão, o movimento das pedaladas dita o ritmo da mente, clareando o pensamento e organizando as ideias.

A programação chegou depois, pela mesma curiosidade. \nEscrevi as primeiras linhas de código para resolver problemas pequenos e logo percebi que era isso que eu queria fazer da vida.\n Hoje desenvolvo software profissionalmente e continuo gostando do mesmo que me conquistou no início, pegar um problema confuso, dividir em partes e fazer funcionar.


Foi aí que percebi o quanto as duas paixões se parecem. \nPlanejar uma viagem é como planejar um software, você divide o percurso em etapas, prevê os trechos difíceis e se prepara para o imprevisto.

Dessa ideia nasceu a Fábio Cicloturismo. Ela não é uma agência real: é um projeto de portfólio, feito com o cuidado de um produto de verdade, para mostrar como eu trabalho. Tem catálogo de roteiros com filtros, um explorador com o perfil de altimetria de cada percurso, área do cliente e um painel administrativo, onde inclusive esta página é editada.

Por trás, usei React e TypeScript no site, Java com Spring Boot na API, banco PostgreSQL, login com Keycloak, testes automatizados e integração contínua a cada mudança.

Se você é recrutador, desenvolvedor ou também gosta de pedalar, vou gostar de conversar. Fique à vontade para entrar em contato.`,
  citacao: 'Conhecer um lugar de bicicleta é chegar devagar, conversar com quem encontra no caminho e lembrar de cada subida.',
  marcos: [
    {
      rotulo: 'O começo',
      titulo: 'A primeira bicicleta',
      texto: 'Voltas pelo bairro e a descoberta de que, pedalando, as ideias ficam mais claras.',
    },
    {
      rotulo: 'Primeiras linhas',
      titulo: 'O primeiro código',
      texto: 'Pequenos programas para resolver problemas do dia a dia e a certeza de que essa seria a minha profissão.',
    },
    {
      rotulo: 'Na estrada',
      titulo: 'As primeiras viagens',
      texto: 'Roteiros de vários dias, com alforjes, mapas e perfis de altimetria.',
    },
    {
      rotulo: 'Hoje',
      titulo: 'Fábio Cicloturismo',
      texto: 'Um projeto que junta as duas paixões, código e cicloturismo.',
    },
  ],
  fotos: [
    {
      // Foto: Patrick Hendry / Unsplash (Licença Unsplash: uso gratuito, inclusive comercial)
      // https://unsplash.com/photos/P-cuEyEUUAA
      url: '/images/sobre/bike-e-fusca.jpg',
      descricao: 'Mountain bike amarela carregada com bolsas de viagem, encostada na carcaça enferrujada de um carro antigo num cânion',
      legenda: null,
    },
    {
      url: '/images/roteiros/rio-do-rastro.jpg',
      descricao: 'Estrada da Serra do Rio do Rastro serpenteando entre os paredões verdes',
      legenda: 'Serra do Rio do Rastro, Santa Catarina.',
    },
    {
      url: '/images/roteiros/vale-europeu.jpg',
      descricao: 'Casa enxaimel em Pomerode com a serra coberta de mata ao fundo',
      legenda: 'Vale Europeu, Santa Catarina.',
    },
    {
      url: '/images/roteiros/graciosa.jpg',
      descricao: 'Encosta da Serra do Mar coberta de Mata Atlântica, vista de Morretes',
      legenda: 'Serra da Graciosa, Paraná.',
    },
    {
      url: '/images/roteiros/aparecida.jpg',
      descricao: 'Basílica de Nossa Senhora Aparecida entre palmeiras',
      legenda: 'Basílica de Aparecida, São Paulo.',
    },
  ],
}
