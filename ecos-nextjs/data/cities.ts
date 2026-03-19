export type CityStatus = 'intact' | 'overlapped' | 'unknown'
export type CityTheme =
  | 'normal'
  | 'western'
  | 'cyberpunk'
  | 'pirate'
  | 'witch'
  | 'mechanic'
  | 'science'
  | 'steampunk'

export interface City {
  theme: CityTheme
  namePt: string
  nameEn: string
  subtitlePt: string
  subtitleEn: string
  descPt: string
  descEn: string
  status: CityStatus
  accent: string
  accentDim: string
  accentGlow: string
  accentAlt: string        // second accent for dual-color cities
  accentAltGlow: string
  icon: string
  image?: string
  traits: string[]
  dangerLevel: 0 | 1 | 2 | 3
  notablePt: string
  notableEn: string
  populationPt: string
  populationEn: string
  echoDescPt?: string
  echoDescEn?: string
  antiNamePt?: string   // name shown in the anti-universe box
  antiNameEn?: string
  antiHidden?: boolean  // show box but conceal name with ??? (suspense)
}

export const cities: City[] = [
  {
    theme: 'normal',
    namePt: 'Cidade Estrela',
    nameEn: 'Star City',
    subtitlePt: 'O lar',
    subtitleEn: 'The home',
    descPt: 'Um vilarejo pacato banhado pela luz perpétua das estrelas. É aqui que a história de Lumi e Aya começa — e onde tudo que eles conheciam estava prestes a mudar para sempre.',
    descEn: 'A quiet village bathed in perpetual starlight. This is where Lumi and Aya\'s story begins — and where everything they knew was about to change forever.',
    status: 'intact',
    accent: '#f0c040',
    accentDim: '#8c6e20',
    accentGlow: 'rgba(240,192,64,0.3)',
    accentAlt: '#f0c040',
    accentAltGlow: 'rgba(240,192,64,0.2)',
    icon: '🌟',
    traits: ['ANCESTRAL', 'ESTELAR', 'LAR'],
    dangerLevel: 0,
    notablePt: 'O Observatório das Estrelas',
    notableEn: 'The Star Observatory',
    populationPt: 'Pequena e unida — guardiões das estrelas',
    populationEn: 'Small and tight-knit — keepers of the stars',
    // anti-universe: unaffected, no name shown
  },
  {
    theme: 'western',
    namePt: 'Cálico',
    nameEn: 'Calico',
    subtitlePt: 'O faroeste',
    subtitleEn: 'The west',
    descPt: 'Uma cidade de fronteira onde o sol nunca parece se pôr completamente. Xerifes corruptos, duelos ao meio-dia e segredos enterrados na areia vermelha. O código da honra aqui vale mais que qualquer lei.',
    descEn: 'A frontier town where the sun never seems to fully set. Corrupt sheriffs, noon duels, and secrets buried in red sand. The code of honor here is worth more than any law.',
    status: 'overlapped',
    accent: '#e07828',
    accentDim: '#7a3a10',
    accentGlow: 'rgba(224,120,40,0.3)',
    accentAlt: '#c85010',
    accentAltGlow: 'rgba(200,80,16,0.2)',
    icon: '🌅',
    traits: ['FAROESTE', 'DUELOS', 'FRONTEIRA'],
    dangerLevel: 2,
    notablePt: 'A Saloon do Meio-Dia',
    notableEn: 'The Noon Saloon',
    populationPt: 'Pistoleiros, xerifes e forasteiros buscando uma segunda chance',
    populationEn: 'Gunslingers, sheriffs, and drifters seeking a second chance',
    echoDescPt: 'No eco, o sol nunca nasce — apenas um crepúsculo eterno tingido de roxo e sombras sem dono',
    echoDescEn: 'In the echo, the sun never rises — only an eternal twilight of purple haze and ownerless shadows',
    antiNamePt: 'Desbotia',
    antiNameEn: 'Desbotia',
  },
  {
    theme: 'cyberpunk',
    namePt: 'Neon',
    nameEn: 'Neon',
    subtitlePt: 'O futuro',
    subtitleEn: 'The future',
    descPt: 'Uma metrópole de neon e concreto onde a tecnologia avançou rápido demais para a humanidade acompanhar. Megacorporações controlam cada esquina, e a linha entre o humano e a máquina é uma questão filosófica.',
    descEn: 'A metropolis of neon and concrete where technology advanced too fast for humanity to keep up. Megacorporations control every corner, and the line between human and machine is a philosophical question.',
    status: 'overlapped',
    accent: '#9030ff',
    accentDim: '#4818a0',
    accentGlow: 'rgba(144,48,255,0.35)',
    accentAlt: '#2080ff',
    accentAltGlow: 'rgba(32,128,255,0.3)',
    icon: '🌃',
    traits: ['NEON', 'CORPORAÇÕES', 'DIGITAL'],
    dangerLevel: 2,
    notablePt: 'A Torre Omega Corp',
    notableEn: 'Omega Corp Tower',
    populationPt: 'Corporativos, hackers e humanos aumentados vivem em estratos',
    populationEn: 'Corporate suits, hackers, and augmented humans live in strata',
    echoDescPt: 'O eco inverteu a hierarquia — as máquinas assumiram o controle das corporações e estão se expandindo',
    echoDescEn: 'The echo inverted the hierarchy — machines took control of the corporations and are expanding',
    antiNamePt: 'Umbreon',
    antiNameEn: 'Umbreon',
  },
  {
    theme: 'pirate',
    namePt: 'Libertalia',
    nameEn: 'Libertalia',
    subtitlePt: 'Os mares',
    subtitleEn: 'The seas',
    descPt: 'Um porto lendário que existe onde o mapa termina. Piratas, contrabandistas e caçadores de tesouros disputam cada cais. Dizem que os mares ao redor escondem rotas que levam a lugares que não constam em nenhum mapa.',
    descEn: 'A legendary port that exists where the map ends. Pirates, smugglers, and treasure hunters fight over every dock. They say the surrounding seas hide routes to places that don\'t appear on any map.',
    status: 'unknown',
    accent: '#1898c8',
    accentDim: '#0c5070',
    accentGlow: 'rgba(24,152,200,0.3)',
    accentAlt: '#10b080',
    accentAltGlow: 'rgba(16,176,128,0.2)',
    icon: '⚓',
    traits: ['PIRATAS', 'OCEANO', 'MISTÉRIO'],
    dangerLevel: 3,
    notablePt: 'O Farol do Fim do Mapa',
    notableEn: 'The Lighthouse at the End of the Map',
    populationPt: 'Piratas, contrabandistas e aqueles que desapareceram do mapa',
    populationEn: 'Pirates, smugglers, and those who vanished from the map',
    echoDescPt: 'Nenhuma expedição ao anti-universo retornou com informações sobre este local',
    echoDescEn: 'No expedition into the anti-universe has returned with information about this place',
    antiNamePt: 'Correntia',
    antiNameEn: 'Correntia',
  },
  {
    theme: 'witch',
    namePt: 'Bosque Wicca',
    nameEn: 'Wicca Grove',
    subtitlePt: 'A magia',
    subtitleEn: 'The magic',
    descPt: 'Uma cidade escondida dentro de uma floresta que não aparece em nenhum mapa convencional. Bruxas e feiticeiros governam sob uma lua permanente. A magia aqui não é feitiço — é lei da física.',
    descEn: 'A city hidden within a forest that appears on no conventional map. Witches and sorcerers rule under a permanent moon. Magic here isn\'t a spell — it\'s a law of physics.',
    status: 'unknown',
    accent: '#b050e0',
    accentDim: '#6020a0',
    accentGlow: 'rgba(176,80,224,0.35)',
    accentAlt: '#d4a030',
    accentAltGlow: 'rgba(212,160,48,0.3)',
    icon: '🌙',
    traits: ['WICCA', 'LUAR', 'MAGIA ANTIGA'],
    dangerLevel: 1,
    notablePt: 'O Grande Caldeirão de Luz',
    notableEn: 'The Great Cauldron of Light',
    populationPt: 'Bruxas, feiticeiros e criaturas que existem apenas sob a lua',
    populationEn: 'Witches, sorcerers, and creatures that exist only under moonlight',
    echoDescPt: 'Os rastros de magia do bosque são diferentes no anti-universo — mais escuros, mais antigos',
    echoDescEn: 'The magic traces of the grove differ in the anti-universe — darker, more ancient',
  },
  {
    theme: 'mechanic',
    namePt: 'Ferralume',
    nameEn: 'Ferralume',
    subtitlePt: 'As máquinas',
    subtitleEn: 'The machines',
    descPt: 'Uma cidade industrial onde tudo é consertável — inclusive as pessoas. Mecânicos são os médicos, os filósofos e os governantes daqui. O barulho de engrenagens nunca para, e ninguém sabe exatamente o que está sendo construído.',
    descEn: 'An industrial city where everything is fixable — including people. Mechanics are the doctors, philosophers, and rulers here. The sound of gears never stops, and nobody knows exactly what is being built.',
    status: 'overlapped',
    accent: '#8898b8',
    accentDim: '#485868',
    accentGlow: 'rgba(136,152,184,0.3)',
    accentAlt: '#607080',
    accentAltGlow: 'rgba(96,112,128,0.25)',
    icon: '🏭',
    traits: ['INDUSTRIAL', 'ENGRENAGENS', 'AÇO'],
    dangerLevel: 1,
    notablePt: 'A Grande Oficina Central',
    notableEn: 'The Great Central Workshop',
    populationPt: 'Mecânicos, engenheiros e os que se tornaram parte das máquinas',
    populationEn: 'Mechanics, engineers, and those who became part of the machines',
    echoDescPt: 'No eco, as máquinas já não precisam de operadores — elas construíram sua própria civilização',
    echoDescEn: 'In the echo, the machines no longer need operators — they built their own civilization',
    antiHidden: true,
  },
  {
    theme: 'science',
    namePt: 'Cidadela Âmbar',
    nameEn: 'Amber Citadel',
    subtitlePt: 'A ciência',
    subtitleEn: 'The science',
    descPt: 'O centro de pesquisa mais avançado do mundo conhecido. Foi aqui que os experimentos com o anti-universo começaram. Os cientistas que vivem aqui acreditam que toda resposta existe — é só uma questão de fazer a pergunta certa.',
    descEn: 'The most advanced research center in the known world. This is where the anti-universe experiments began. The scientists who live here believe every answer exists — it\'s just a matter of asking the right question.',
    status: 'overlapped',
    accent: '#2090ff',
    accentDim: '#0e4888',
    accentGlow: 'rgba(32,144,255,0.35)',
    accentAlt: '#10c8e0',
    accentAltGlow: 'rgba(16,200,224,0.25)',
    icon: '🔬',
    traits: ['CIÊNCIA', 'EXPERIMENTOS', 'RIFT'],
    dangerLevel: 2,
    notablePt: 'Laboratório Rift — Projeto Omega',
    notableEn: 'Rift Laboratory — Omega Project',
    populationPt: 'Cientistas obcecados com a sobreposição que eles mesmos causaram',
    populationEn: 'Scientists obsessed with the overlap they themselves caused',
    echoDescPt: 'O eco é a versão que "deu certo" — uma civilização de antimatéria fria e silenciosa',
    echoDescEn: 'The echo is the version that "succeeded" — a cold, silent antimatter civilization',
    antiHidden: true,
  },
  {
    theme: 'steampunk',
    namePt: 'Aeldaria',
    nameEn: 'Aeldaria',
    subtitlePt: 'A realeza',
    subtitleEn: 'The royalty',
    descPt: 'Uma cidade suspensa nas nuvens, sustentada por gigantescos motores a vapor e dirigíveis. A aristocracia do vapor controla tudo de seus castelos voadores, enquanto as classes trabalhadoras operam as máquinas que mantêm o mundo acima das nuvens.',
    descEn: 'A city suspended in the clouds, sustained by enormous steam engines and airships. The steam aristocracy controls everything from their flying castles, while the working classes operate the machines that keep the world above the clouds.',
    status: 'unknown',
    accent: '#d04040',
    accentDim: '#801818',
    accentGlow: 'rgba(208,64,64,0.35)',
    accentAlt: '#e0a020',
    accentAltGlow: 'rgba(224,160,32,0.3)',
    icon: '👑',
    traits: ['REALEZA', 'VAPOR', 'NOBREZA'],
    dangerLevel: 3,
    notablePt: 'Os Castelos Voadores da Alta Nobreza',
    notableEn: 'The High Nobility Flying Castles',
    populationPt: 'Aristocratas do vapor e trabalhadores que nunca pisam no chão',
    populationEn: 'Steam aristocrats and workers who never set foot on the ground',
    echoDescPt: 'Relatos de sobreviventes falam de castelos virados de cabeça para baixo nas nuvens roxas',
    echoDescEn: 'Survivor accounts speak of castles turned upside down in purple clouds',
    antiNamePt: 'Aeldrath',
    antiNameEn: 'Aeldrath',
  },
]

export const statusLabels = {
  intact:    { pt: 'Intacta',     en: 'Intact' },
  overlapped:{ pt: 'Sobreposta',  en: 'Overlapped' },
  unknown:   { pt: 'Desconhecida', en: 'Unknown' },
}

export const themeLabels: Record<CityTheme, { pt: string; en: string }> = {
  normal:    { pt: 'Vilarejo',   en: 'Village' },
  western:   { pt: 'Faroeste',   en: 'Western' },
  cyberpunk: { pt: 'Cyberpunk',  en: 'Cyberpunk' },
  pirate:    { pt: 'Pirata',     en: 'Pirate' },
  witch:     { pt: 'Arcano',     en: 'Arcane' },
  mechanic:  { pt: 'Mecânico',   en: 'Mechanic' },
  science:   { pt: 'Científico', en: 'Scientific' },
  steampunk: { pt: 'Steampunk',  en: 'Steampunk' },
}
