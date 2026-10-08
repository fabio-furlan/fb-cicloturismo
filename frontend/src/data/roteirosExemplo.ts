import type { Roteiro } from '@/types/roteiro'

// Dados de exemplo, usados quando VITE_API_URL não está definida (o site no ar antes da API). Datas, preços e vagas são ilustrativos.
// Distâncias e subidas seguem a descrição de cada passeio. As altitudes são reais: trajeto pelas cidades do percurso
// (OpenStreetMap, roteador de bicicleta) com a altitude do terreno (Open-Meteo, modelo Copernicus DEM), redistribuídas
// pela quilometragem de cada etapa. Para precisão total, troque pelo GPX gravado de cada passeio.
// Fotos: Unsplash (Licença Unsplash: uso gratuito, inclusive comercial, sem necessidade de crédito).
export const roteirosExemplo: Roteiro[] = [
  {
    id: 'aparecida',
    nome: 'Aparecida do Norte',
    regiao: 'São Bernardo do Campo a Aparecida, São Paulo',
    nivel: 'intermediario',
    paisagem: 'fe',
    descricao:
      'Do centro de São Bernardo do Campo até a Basílica de Aparecida, seguindo o corredor do Rodoanel e do ' +
      'Vale do Paraíba. São três dias de pedal em terreno ondulado, com chegada ao maior santuário mariano ' +
      'do mundo. Nos trechos de rodovia em que bicicletas não podem circular, o grupo segue por vias ' +
      'paralelas.',
    foto: {
      src: '/images/roteiros/aparecida.jpg',
      descricao: 'Basílica de Nossa Senhora Aparecida entre palmeiras',
      autor: 'Damáris Gonçalves',
      origem: 'https://unsplash.com/photos/Z2SkdxHaQz8',
    },
    dias: 3,
    etapas: [
      { dia: 1, titulo: 'São Bernardo do Campo a Arujá, pelo corredor do Rodoanel', distanciaKm: 56 },
      { dia: 2, titulo: 'Arujá a São José dos Campos', distanciaKm: 58 },
      { dia: 3, titulo: 'São José dos Campos a Aparecida', distanciaKm: 84 },
    ],
    distanciaKm: 198,
    subidaTotalM: 608,
    altitudes: [
      792, 793, 795, 798, 792, 785, 777, 769, 763, 764, 766, 763, 759, 754, 750, 753, 764, 774, 783, 789, 789, 783,
      773, 761, 750, 741, 736, 734, 733, 733, 736, 742, 751, 763, 773, 778, 778, 770, 757, 748, 740, 734, 732, 730,
      729, 728, 727, 726, 728, 734, 738, 739, 741, 744, 747, 748, 749, 748, 744, 737, 732, 731, 730, 730, 731, 732,
      733, 735, 736, 738, 742, 746, 754, 760, 767, 772, 775, 775, 776, 774, 770, 767, 767, 769, 775, 782, 786, 784,
      778, 771, 766, 763, 762, 762, 761, 760, 762, 766, 770, 779, 785, 790, 797, 804, 803, 807, 812, 811, 811, 813,
      809, 803, 796, 797, 795, 796, 798, 794, 782, 764, 744, 730, 714, 698, 691, 687, 677, 678, 683, 689, 692, 699,
      697, 694, 688, 687, 680, 673, 668, 660, 652, 651, 650, 648, 652, 650, 644, 638, 630, 617, 608, 600, 593, 590,
      590, 591, 590, 590, 591, 591, 591, 595, 600, 602, 604, 608, 610, 608, 607, 611, 614, 611, 609, 608, 606, 606,
      609, 614, 620, 621, 615, 610, 606, 596, 585, 578, 572, 564, 562, 562, 562, 562, 562, 562, 562, 563, 563, 564,
      567, 572, 578, 586, 592, 596, 599, 601, 601, 602, 603, 601, 596, 593, 588, 582, 577, 580, 582, 587, 590, 591,
      585, 579, 578, 581, 587, 587, 594, 595, 594, 588, 589, 581, 577, 578, 583, 588, 595, 592, 586, 580, 574, 571,
      573, 575, 578, 581, 577, 574, 575, 573, 571, 574, 576, 572, 573, 572, 572, 570, 568, 566, 566, 562, 561, 564,
      565, 566, 569, 572, 573, 572, 572, 570, 569, 571, 569, 567, 567, 565, 567, 572, 573, 574, 579, 575, 576, 582,
      583, 579, 581, 581, 577, 577, 580, 581, 579, 583, 583, 583, 584, 583, 583, 585, 588, 590, 596, 599, 597, 593,
      591, 587, 583, 583, 588, 588, 592, 593, 593, 589, 589, 587, 590, 592, 592, 598, 599, 598, 593, 586, 574, 566,
      559, 568, 577, 585, 590, 597, 591, 584, 584, 579, 576, 576, 577, 577, 579, 576, 574, 573, 569, 570, 570, 570,
      571, 569, 565, 562, 562, 562, 564, 566, 568, 569, 570, 570, 568, 566, 562, 558, 555, 553, 550, 550, 550, 551,
      551, 551, 550, 549, 547, 546, 546, 545, 545, 545, 547, 551, 557, 561, 569, 578, 578, 578, 578, 572, 565, 561,
      560, 557,
    ],
    saidas: [
      { data: '2026-12-12', vagasRestantes: 6, precoReais: 1490 },
      { data: '2027-10-09', vagasRestantes: 12, precoReais: 1490 },
    ],
    precoReais: 1490,
  },
  {
    id: 'rio-do-rastro',
    nome: 'Serra do Rio do Rastro',
    regiao: 'Serra catarinense, Santa Catarina',
    nivel: 'avancado',
    paisagem: 'serra',
    descricao:
      'Três dias pela serra catarinense. No primeiro, traslado de Balneário Camboriú até Lauro Müller e ' +
      'jantar de apresentação do grupo. No segundo, a subida das 284 curvas da Serra do Rio do Rastro até o ' +
      'mirante a 1.421 m, com pernoite em Urubici. No terceiro, a descida pela Serra do Corvo Branco até ' +
      'Grão-Pará, jantar de encerramento e pernoite em Tubarão.',
    foto: {
      src: '/images/roteiros/rio-do-rastro.jpg',
      descricao: 'Estrada da Serra do Rio do Rastro serpenteando entre os paredões verdes',
      autor: 'Mateus Campos Felipe',
      origem: 'https://unsplash.com/photos/_fzl2PQH6kw',
    },
    dias: 3,
    etapas: [
      { dia: 2, titulo: 'Lauro Müller a Urubici, pela Serra do Rio do Rastro e Bom Jardim da Serra', distanciaKm: 73, subidaM: 1507 },
      { dia: 3, titulo: 'Urubici a Grão-Pará, pela Serra do Corvo Branco', distanciaKm: 56, subidaM: 689 },
    ],
    distanciaKm: 129,
    subidaTotalM: 2196,
    altitudes: [
      228, 239, 253, 276, 301, 319, 335, 343, 346, 345, 343, 345, 345, 348, 356, 362, 370, 385, 398, 414, 436, 455,
      474, 491, 509, 526, 544, 564, 593, 622, 651, 681, 715, 740, 770, 808, 852, 890, 941, 1001, 1055, 1123, 1196,
      1256, 1305, 1346, 1373, 1396, 1412, 1424, 1427, 1422, 1412, 1397, 1382, 1379, 1386, 1392, 1393, 1385, 1371,
      1354, 1336, 1320, 1298, 1276, 1259, 1247, 1244, 1242, 1240, 1239, 1236, 1229, 1227, 1223, 1218, 1217, 1214,
      1212, 1215, 1215, 1211, 1209, 1205, 1205, 1219, 1239, 1260, 1279, 1287, 1280, 1267, 1247, 1232, 1232, 1243,
      1271, 1301, 1324, 1341, 1361, 1376, 1400, 1428, 1449, 1466, 1469, 1449, 1423, 1386, 1355, 1335, 1337, 1347,
      1374, 1409, 1437, 1461, 1472, 1475, 1473, 1472, 1474, 1475, 1482, 1483, 1479, 1479, 1475, 1477, 1485, 1491,
      1494, 1495, 1491, 1483, 1477, 1471, 1468, 1464, 1450, 1423, 1388, 1348, 1312, 1288, 1276, 1270, 1269, 1268,
      1258, 1244, 1227, 1209, 1193, 1184, 1182, 1184, 1191, 1197, 1204, 1212, 1215, 1212, 1208, 1203, 1200, 1203,
      1209, 1215, 1224, 1238, 1256, 1281, 1290, 1297, 1299, 1297, 1302, 1309, 1318, 1324, 1327, 1328, 1327, 1336,
      1350, 1370, 1399, 1425, 1449, 1466, 1475, 1482, 1493, 1512, 1528, 1530, 1523, 1499, 1471, 1447, 1422, 1396,
      1376, 1354, 1335, 1313, 1295, 1272, 1247, 1218, 1183, 1140, 1099, 1058, 1021, 989, 960, 938, 923, 914, 908, 905,
      901, 900, 899, 899, 899, 899, 900, 900, 900, 900, 901, 903, 904, 905, 911, 916, 920, 923, 925, 927, 928, 928,
      926, 926, 926, 926, 926, 924, 924, 924, 925, 924, 925, 925, 926, 928, 928, 928, 928, 928, 928, 928, 929, 932,
      938, 941, 942, 943, 944, 945, 940, 939, 939, 939, 941, 943, 947, 950, 954, 956, 959, 964, 970, 972, 972, 972,
      973, 971, 967, 964, 964, 967, 969, 973, 977, 981, 992, 1000, 1008, 1015, 1026, 1043, 1059, 1079, 1106, 1120,
      1115, 1096, 1067, 1026, 978, 929, 884, 848, 817, 790, 762, 734, 717, 698, 679, 662, 646, 624, 604, 586, 570,
      549, 524, 506, 492, 475, 460, 449, 440, 433, 422, 411, 398, 383, 365, 344, 320, 295, 272, 252, 238, 228, 220,
      216, 212, 209, 206, 204, 202, 199, 195, 192, 188, 187, 184, 182, 183, 182, 180, 176, 172, 170, 166, 162, 159,
      157, 152, 149, 148, 146, 144, 141, 139, 137, 132, 128, 125, 122, 121, 120, 119, 117, 116, 114, 112, 110, 109,
      109,
    ],
    saidas: [
      { data: '2026-11-14', vagasRestantes: 4, precoReais: 2890 },
      { data: '2027-03-20', vagasRestantes: 12, precoReais: 2890 },
    ],
    precoReais: 2890,
  },
  {
    id: 'graciosa',
    nome: 'Serra da Graciosa',
    regiao: 'Quatro Barras a Morretes, Paraná',
    nivel: 'recreativo',
    paisagem: 'serra',
    descricao:
      'Um dia de pedal pela Estrada da Graciosa, caminho histórico de 1873 que desce a Serra do Mar no meio ' +
      'da Mata Atlântica, do Portal da Graciosa, em Quatro Barras, até Morretes. São 34 km com 904 m de ' +
      'desnível, quase todo em descida, com trechos de paralelepípedo e parada para o barreado em Morretes.',
    foto: {
      src: '/images/roteiros/graciosa.jpg',
      descricao: 'Encosta da Serra do Mar coberta de Mata Atlântica, vista de Morretes',
      autor: 'Muhammed Ballan',
      origem: 'https://unsplash.com/photos/xG0dWQeJstk',
    },
    dias: 1,
    etapas: [
      { dia: 1, titulo: 'Portal da Graciosa a Morretes, pela Estrada da Graciosa', distanciaKm: 34 },
    ],
    distanciaKm: 34,
    subidaTotalM: 141,
    altitudes: [
      870, 868, 866, 864, 860, 856, 852, 852, 854, 856, 856, 857, 857, 854, 853, 857, 859, 863, 864, 865, 863, 863,
      860, 862, 865, 870, 874, 879, 882, 886, 889, 894, 900, 907, 910, 912, 910, 905, 899, 895, 890, 885, 880, 875,
      872, 871, 872, 871, 869, 866, 858, 849, 844, 834, 828, 825, 823, 823, 818, 812, 802, 790, 776, 768, 768, 763,
      761, 756, 751, 741, 737, 733, 725, 716, 706, 693, 685, 683, 682, 679, 681, 678, 669, 661, 655, 652, 644, 641,
      641, 634, 624, 616, 611, 602, 605, 605, 604, 599, 596, 587, 580, 576, 573, 573, 573, 574, 570, 554, 539, 531,
      518, 520, 531, 535, 534, 534, 527, 520, 512, 498, 499, 492, 484, 488, 493, 492, 493, 496, 498, 488, 473, 473,
      463, 446, 448, 445, 436, 428, 428, 417, 415, 415, 415, 409, 403, 393, 380, 376, 369, 368, 369, 370, 366, 360,
      354, 346, 338, 337, 338, 332, 325, 321, 310, 299, 294, 289, 281, 277, 269, 260, 251, 245, 233, 227, 221, 215,
      207, 201, 197, 194, 189, 185, 184, 180, 178, 173, 169, 165, 168, 162, 158, 157, 153, 142, 139, 137, 130, 124,
      120, 117, 114, 111, 109, 107, 105, 103, 101, 99, 97, 97, 95, 94, 92, 92, 90, 90, 89, 88, 87, 86, 85, 85, 85, 85,
      86, 86, 85, 86, 85, 84, 82, 82, 82, 82, 81, 79, 78, 76, 74, 73, 71, 69, 67, 66, 65, 64, 65, 67, 66, 67, 67, 66,
      63, 62, 59, 58, 58, 58, 57, 57, 56, 53, 51, 50, 49, 49, 49, 49, 49, 50, 51, 51, 51, 51, 50, 48, 48, 46, 45, 42,
      40, 38, 37, 37, 37, 38, 38, 37, 36, 36, 35, 35, 36, 36, 36, 35, 35, 34, 33, 33, 32, 32, 31, 32, 32, 31, 32, 31,
      31, 30, 29, 29, 28, 28, 28, 29, 29, 29, 30, 31, 30, 29, 29, 26, 25, 24, 24, 23, 23, 23, 24, 23, 23, 23, 22, 21,
      21, 21, 21, 21, 21, 20, 20, 20, 19, 18, 17, 17, 16, 16, 17, 17, 17, 16, 15, 16, 16, 16, 16, 16, 16, 16, 17, 18,
      18, 19, 18, 17, 17, 16, 15, 14, 14, 14, 13, 13, 14, 13, 14, 14, 15, 15, 14, 14, 13, 12, 13, 13, 13, 13, 12, 12,
      12, 11, 11, 12, 12, 12, 13, 13,
    ],
    saidas: [
      { data: '2026-11-21', vagasRestantes: 10, precoReais: 390 },
      { data: '2027-02-06', vagasRestantes: 12, precoReais: 390 },
    ],
    precoReais: 390,
  },
  {
    id: 'vale-europeu',
    nome: 'Vale Europeu',
    regiao: 'Timbó e Médio Vale do Itajaí, Santa Catarina',
    nivel: 'avancado',
    paisagem: 'vale',
    descricao:
      'O primeiro circuito de cicloturismo planejado do Brasil, com saída e chegada em Timbó. São 7 dias e ' +
      '6 pernoites, com 6 dias de pedal por estradas de terra entre casas enxaimel, plantações e cachoeiras ' +
      'de Pomerode, Rodeio, Benedito Novo e Doutor Pedrinho. Os morros entre as cidades são íngremes, por ' +
      'isso não é indicado para iniciantes.',
    foto: {
      src: '/images/roteiros/vale-europeu.jpg',
      descricao: 'Casa enxaimel em Pomerode com a serra coberta de mata ao fundo',
      autor: 'Marina Lorenzini',
      origem: 'https://unsplash.com/photos/R65r2u8JQ-0',
    },
    dias: 7,
    etapas: [
      { dia: 1, titulo: 'Timbó a Pomerode', distanciaKm: 29 },
      { dia: 2, titulo: 'Pomerode a Indaial', distanciaKm: 42 },
      { dia: 3, titulo: 'Indaial a Apiúna, por Ascurra', distanciaKm: 65 },
      { dia: 4, titulo: 'Apiúna a Benedito Novo, por Rodeio', distanciaKm: 54 },
      { dia: 5, titulo: 'Benedito Novo a Doutor Pedrinho', distanciaKm: 30 },
      { dia: 6, titulo: 'Doutor Pedrinho a Timbó, por Rio dos Cedros', distanciaKm: 80 },
    ],
    distanciaKm: 300,
    subidaTotalM: 4700,
    altitudes: [
      71, 77, 78, 80, 81, 80, 77, 77, 81, 83, 86, 88, 88, 85, 87, 89, 91, 93, 97, 110, 128, 138, 143, 143, 132, 118,
      113, 113, 113, 111, 113, 112, 106, 102, 95, 84, 76, 69, 69, 78, 87, 95, 104, 108, 114, 115, 115, 116, 116, 113,
      118, 128, 140, 143, 137, 129, 114, 100, 93, 91, 90, 88, 86, 86, 87, 85, 83, 81, 77, 74, 75, 77, 81, 83, 83, 83,
      82, 78, 76, 75, 72, 69, 66, 65, 64, 64, 62, 62, 60, 57, 58, 61, 63, 65, 68, 68, 68, 67, 65, 65, 65, 64, 64, 66,
      66, 66, 65, 66, 66, 66, 67, 68, 68, 69, 69, 68, 68, 69, 69, 70, 70, 71, 70, 70, 69, 70, 70, 70, 72, 73, 74, 77,
      79, 81, 86, 93, 98, 101, 103, 101, 96, 92, 89, 86, 85, 83, 82, 80, 79, 79, 80, 80, 81, 82, 82, 81, 82, 81, 81,
      83, 88, 96, 99, 100, 98, 93, 86, 85, 94, 99, 101, 105, 112, 104, 106, 111, 105, 97, 104, 109, 104, 112, 117,
      115, 107, 106, 100, 98, 93, 91, 89, 89, 94, 99, 105, 106, 103, 97, 91, 86, 84, 84, 84, 84, 84, 85, 83, 81, 80,
      81, 82, 83, 85, 86, 88, 91, 94, 98, 99, 100, 99, 95, 92, 88, 82, 79, 76, 74, 72, 71, 70, 69, 71, 72, 73, 73, 77,
      82, 89, 94, 105, 113, 122, 133, 141, 144, 145, 141, 137, 137, 144, 148, 153, 162, 175, 186, 201, 225, 245, 266,
      281, 293, 303, 320, 346, 379, 408, 430, 444, 445, 443, 447, 450, 455, 469, 480, 492, 507, 518, 519, 519, 521,
      522, 523, 524, 527, 527, 532, 532, 534, 534, 532, 527, 527, 525, 522, 521, 518, 520, 519, 520, 516, 504, 487,
      475, 461, 451, 451, 448, 446, 450, 448, 432, 409, 378, 344, 314, 293, 282, 270, 254, 236, 216, 196, 178, 168,
      157, 152, 148, 147, 140, 138, 139, 134, 125, 115, 109, 100, 89, 87, 84, 81, 81, 81, 78, 79, 77, 73, 72, 72, 71,
      74, 73, 73, 72, 72, 67, 69, 69, 70, 72, 78, 77, 79, 80, 79, 74, 76, 75, 75, 75, 75, 74, 74, 74, 74, 74, 76, 78,
      77, 80, 80, 78, 75, 75, 72, 71, 70, 69, 68, 68, 68, 69, 70, 70, 70,
    ],
    saidas: [
      { data: '2027-03-06', vagasRestantes: 8, precoReais: 5490 },
      { data: '2027-09-11', vagasRestantes: 12, precoReais: 5490 },
    ],
    precoReais: 5490,
  },
  {
    id: 'rota-da-luz',
    nome: 'Rota da Luz',
    regiao: 'Mogi das Cruzes a Aparecida, São Paulo',
    nivel: 'intermediario',
    paisagem: 'fe',
    descricao:
      'O caminho de peregrinação da Estação Estudantes, em Mogi das Cruzes, até a Basílica de Aparecida, ' +
      'por estradas secundárias, vicinais e rurais que evitam a Via Dutra. Passa por Sabaúna, Luiz Carlos, ' +
      'Guararema, Santa Branca, Paraibuna, Redenção da Serra, Taubaté, Pindamonhangaba e Roseira. Os ' +
      'trechos de terra e as subidas íngremes pedem MTB ou gravel e bom preparo físico.',
    foto: {
      src: '/images/roteiros/rota-da-luz.jpg',
      descricao: 'Represa de Paraibuna com névoa sobre as montanhas, no trajeto da Rota da Luz',
      autor: 'Antonino Visalli',
      origem: 'https://unsplash.com/photos/k_-rfDOVVkM',
    },
    dias: 4,
    etapas: [
      { dia: 1, titulo: 'Mogi das Cruzes a Santa Branca, por Sabaúna, Luiz Carlos e Guararema', distanciaKm: 45 },
      { dia: 2, titulo: 'Santa Branca a Redenção da Serra, por Paraibuna', distanciaKm: 71 },
      { dia: 3, titulo: 'Redenção da Serra a Pindamonhangaba, por Taubaté', distanciaKm: 53 },
      { dia: 4, titulo: 'Pindamonhangaba a Aparecida, por Roseira', distanciaKm: 32 },
    ],
    distanciaKm: 201,
    subidaTotalM: 3000,
    altitudes: [
      743, 743, 742, 742, 744, 748, 749, 748, 744, 737, 725, 712, 703, 703, 702, 704, 702, 702, 692, 685, 684, 685,
      682, 684, 681, 670, 663, 656, 650, 647, 644, 648, 646, 641, 639, 630, 616, 608, 600, 590, 588, 587, 584, 583,
      581, 580, 578, 576, 576, 575, 575, 579, 584, 588, 593, 592, 588, 584, 582, 578, 579, 579, 579, 579, 580, 581,
      582, 581, 580, 580, 589, 589, 589, 591, 595, 588, 589, 589, 591, 594, 595, 594, 594, 591, 588, 597, 606, 622,
      638, 652, 654, 659, 659, 660, 660, 668, 688, 703, 714, 717, 723, 709, 691, 674, 661, 646, 638, 639, 642, 646,
      649, 657, 663, 666, 677, 685, 687, 690, 695, 694, 697, 703, 699, 696, 690, 677, 661, 653, 647, 647, 649, 657,
      661, 666, 669, 673, 663, 658, 652, 648, 649, 660, 661, 664, 656, 646, 634, 631, 629, 633, 641, 650, 658, 661,
      670, 691, 699, 700, 700, 697, 671, 656, 648, 645, 634, 634, 636, 636, 640, 639, 636, 635, 639, 645, 666, 685,
      699, 702, 695, 678, 666, 664, 669, 684, 694, 698, 700, 698, 695, 709, 748, 790, 825, 835, 829, 798, 769, 745,
      748, 756, 766, 778, 792, 818, 841, 856, 875, 887, 879, 877, 881, 881, 891, 896, 905, 922, 928, 916, 904, 879,
      836, 801, 772, 755, 746, 747, 749, 752, 746, 742, 735, 728, 740, 755, 780, 812, 850, 875, 886, 885, 874, 854,
      841, 841, 848, 866, 889, 907, 915, 911, 896, 877, 858, 847, 841, 832, 830, 833, 838, 854, 876, 894, 904, 897,
      870, 834, 787, 738, 699, 670, 648, 638, 632, 632, 630, 630, 630, 633, 628, 629, 624, 617, 612, 607, 602, 600,
      601, 611, 619, 626, 629, 627, 620, 611, 602, 596, 592, 584, 581, 581, 579, 575, 570, 567, 564, 561, 560, 562,
      562, 563, 566, 568, 568, 567, 563, 557, 553, 553, 554, 557, 560, 564, 565, 564, 562, 560, 557, 553, 553, 554,
      555, 557, 557, 556, 556, 556, 552, 553, 553, 552, 549, 550, 547, 545, 543, 545, 544, 544, 544, 543, 541, 541,
      540, 541, 542, 542, 541, 540, 538, 537, 537, 538, 540, 542, 543, 543, 542, 542, 542, 542, 544, 546, 547, 548,
      547, 546, 545, 546, 545, 544, 542, 540, 545, 547, 548, 550, 550, 541, 538, 536, 534, 533, 534, 537, 540, 540,
      544,
    ],
    saidas: [
      { data: '2027-02-27', vagasRestantes: 8, precoReais: 2690 },
      { data: '2027-06-12', vagasRestantes: 12, precoReais: 2690 },
    ],
    precoReais: 2690,
  },
]
