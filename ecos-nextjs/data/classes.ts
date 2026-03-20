export interface ClassStats {
  forca: number       // 0–10
  defesa: number
  agilidade: number
  magia: number
  rift: number
}

export interface GameClass {
  id: string
  icon: string
  namePt: string
  nameEn: string
  rolePt: string
  roleEn: string
  descPt: string
  descEn: string
  stats: ClassStats
  weapons: string[]
  enchantment: boolean
  upPt: string
  upEn: string
  traitsPt: string[]
  traitsEn: string[]
  accent: string
  accentGlow: string
}

export const gameClasses: GameClass[] = [
  {
    id: 'normal',
    icon: '🗡️',
    namePt: 'Normal',
    nameEn: 'Normal',
    rolePt: 'Equilíbrio • Versatilidade',
    roleEn: 'Balance • Versatility',
    descPt: 'Você não escolheu nenhum caminho — e isso já é uma escolha. Perfeitamente equilibrado em tudo, sem ponto fraco e sem ponto forte. Armas comuns, sem magia, sem encantamento. A classe para quem confia apenas em si mesmo.',
    descEn: 'You chose no path — and that is already a choice. Perfectly balanced in everything, no weak point and no strong point. Common weapons, no magic, no enchantment. The class for those who trust only themselves.',
    stats: { forca: 5, defesa: 5, agilidade: 5, magia: 0, rift: 0 },
    weapons: ['Espada', 'Faca', 'Machado'],
    enchantment: false,
    upPt: 'Indefinido',
    upEn: 'Undefined',
    traitsPt: ['Equilíbrio', 'Independência', 'Versatilidade'],
    traitsEn: ['Balance', 'Independence', 'Versatility'],
    accent: '#a0a8c0',
    accentGlow: 'rgba(160,168,192,0.25)',
  },
  {
    id: 'pugilista',
    icon: '🥊',
    namePt: 'Pugilista',
    nameEn: 'Pugilist',
    rolePt: 'Força Física • Velocidade • Corpo a Corpo',
    roleEn: 'Physical Strength • Speed • Close Combat',
    descPt: 'Para aqueles que gostam de resolver tudo no soco, sem motivo nenhum. Foco total em armas corpo a corpo com luvas e faixas encantadas. Alta velocidade, golpes atordoantes — e uma árvore de habilidades que pode virar Boxeador, Monge ou Campeão.',
    descEn: 'For those who like to settle everything with fists, for no reason at all. Full focus on close combat with gloves and enchanted wraps. High speed, stunning blows — and a skill tree that can become Boxer, Monk, or Champion.',
    stats: { forca: 8, defesa: 5, agilidade: 9, magia: 0, rift: 2 },
    weapons: ['Luvas', 'Faixas'],
    enchantment: true,
    upPt: 'Boxeador / Monge / Campeão',
    upEn: 'Boxer / Monk / Champion',
    traitsPt: ['Velocidade', 'Força Física', 'Atordoamento'],
    traitsEn: ['Speed', 'Physical Strength', 'Stun'],
    accent: '#e04040',
    accentGlow: 'rgba(224,64,64,0.3)',
  },
  {
    id: 'espadachim',
    icon: '⚔️',
    namePt: 'Espadachim',
    nameEn: 'Swordsman',
    rolePt: 'Dano • Resistência • Liderança',
    roleEn: 'Damage • Resistance • Leadership',
    descPt: 'Uma das classes mais antigas do mundo. Combina a velocidade da esgrima com a força de vontade de um bárbaro. O Espadachim sempre carrega um fardo — mas nunca enfrenta sozinho. Proteja os mais fracos, lidere sua alcateia.',
    descEn: 'One of the oldest classes in the world. Combines the speed of fencing with the willpower of a barbarian. The Swordsman always carries a burden — but never faces it alone. Protect the weak, lead your pack.',
    stats: { forca: 8, defesa: 7, agilidade: 8, magia: 2, rift: 4 },
    weapons: ['Espadas', 'Esgrima'],
    enchantment: true,
    upPt: 'Cavaleiro',
    upEn: 'Knight',
    traitsPt: ['Velocidade', 'Força de Vontade', 'Resistência'],
    traitsEn: ['Speed', 'Willpower', 'Resistance'],
    accent: '#f0c040',
    accentGlow: 'rgba(240,192,64,0.3)',
  },
  {
    id: 'arcano',
    icon: '📖',
    namePt: 'Estudante da Magia',
    nameEn: 'Magic Student',
    rolePt: 'Magia • Pacto • Controle',
    roleEn: 'Magic • Pact • Control',
    descPt: 'Ousam atravessar o véu do mundo comum e negociar com forças além da compreensão mortal. O poder arcano não é estudado — é conquistado através de um pacto com entidades do plano astral. Demônios primordiais, anjos exilados, espíritos do conhecimento proibido.',
    descEn: 'They dare cross the veil of the common world and negotiate with forces beyond mortal comprehension. Arcane power is not studied — it is conquered through a pact with astral plane entities. Primordial demons, exiled angels, spirits of forbidden knowledge.',
    stats: { forca: 2, defesa: 2, agilidade: 4, magia: 10, rift: 7 },
    weapons: ['Cajados', 'Grimórios', 'Lança-Selo', 'Magia Arcana'],
    enchantment: true,
    upPt: 'Bruxo Arcano',
    upEn: 'Arcane Warlock',
    traitsPt: ['Dano Mágico', 'Controle Espiritual', 'Manipulação'],
    traitsEn: ['Magic Damage', 'Spiritual Control', 'Manipulation'],
    accent: '#9030ff',
    accentGlow: 'rgba(144,48,255,0.35)',
  },
  {
    id: 'mecha',
    icon: '⚙️',
    namePt: 'Mecha-C.E.R.V',
    nameEn: 'Mecha-C.E.R.V',
    rolePt: 'Fusão • Tecnologia • Corpo',
    roleEn: 'Fusion • Technology • Body',
    descPt: 'Ciência aplicada ao limite do humano. O Mecha se funde à coluna cervical do usuário de forma permanente — inseparável, implacável. Parte da alma do Mecha também passa a fazer parte do usuário. Não é uma ferramenta. É uma fusão.',
    descEn: 'Science applied to the limit of the human. The Mecha permanently fuses to the user\'s cervical spine — inseparable, relentless. Part of the Mecha\'s soul also becomes part of the user. Not a tool. A fusion.',
    stats: { forca: 9, defesa: 9, agilidade: 5, magia: 0, rift: 6 },
    weapons: ['Mecha-Arm', 'Mecha-Legg', 'Mecha-Body', 'Mecha-Tail', 'Mecha-Eye'],
    enchantment: false,
    upPt: 'Mecha-Gear',
    upEn: 'Mecha-Gear',
    traitsPt: ['Aprimoramento', 'Resistência Física', 'Tecnologia'],
    traitsEn: ['Enhancement', 'Physical Resistance', 'Technology'],
    accent: '#2090ff',
    accentGlow: 'rgba(32,144,255,0.3)',
  },
  {
    id: 'druida',
    icon: '🌿',
    namePt: 'Druida',
    nameEn: 'Druid',
    rolePt: 'Natureza • Suporte • Transformação',
    roleEn: 'Nature • Support • Transformation',
    descPt: 'Classe híbrida abençoada pela Grã-Sacerdotisa — ser que habita entre o físico e o espiritual. Canaliza elementos, comunica-se com animais e se transforma em criaturas naturais. Reza a lenda que a Sacerdotisa vive no fundo da floresta e é impossível chegar até ela.',
    descEn: 'Hybrid class blessed by the Grand Priestess — a being between the physical and the spiritual. Channels elements, communicates with animals, and transforms into natural creatures. Legend says the Priestess lives deep in the forest and no one can reach her.',
    stats: { forca: 5, defesa: 6, agilidade: 7, magia: 7, rift: 8 },
    weapons: ['Formas Selvagem', 'Magias Naturais', 'Espinhos do Solo', 'Tempestade Elemental'],
    enchantment: true,
    upPt: 'Mestre Druida',
    upEn: 'Master Druid',
    traitsPt: ['Equilíbrio', 'Transformação', 'Cura'],
    traitsEn: ['Balance', 'Transformation', 'Healing'],
    accent: '#40b870',
    accentGlow: 'rgba(64,184,112,0.3)',
  },
]
