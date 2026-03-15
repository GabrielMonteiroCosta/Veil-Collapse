export interface DevlogEntry {
  date: string
  titlePt: string
  titleEn: string
  textPt: string
  textEn: string
  tag: 'design' | 'lore' | 'art' | 'tech' | 'milestone'
}

export const devlog: DevlogEntry[] = [
  {
    date: '2025-03-13',
    titlePt: 'O site anúncio está no ar!',
    titleEn: 'Announcement site is live!',
    textPt: 'Primeiro passo dado: o site de anúncio do jogo está no ar. A história de Lumi, Aya e o anti-universo começa a tomar forma.',
    textEn: 'First step taken: the game announcement site is live. The story of Lumi, Aya, and the anti-universe begins to take shape.',
    tag: 'milestone',
  },
  {
    date: '2025-03-10',
    titlePt: 'O conceito de sobreposição',
    titleEn: 'The overlap concept',
    textPt: 'Definido o principal mechanic narrativo do jogo: cidades que existem em dois universos simultaneamente. Isso vai moldar tanto a história quanto o gameplay.',
    textEn: 'Defined the main narrative mechanic: cities that exist in two universes simultaneously. This will shape both the story and gameplay.',
    tag: 'lore',
  },
  {
    date: '2025-03-05',
    titlePt: 'Lumi e Aya ganham vida',
    titleEn: 'Lumi and Aya come to life',
    textPt: 'Os dois personagens principais foram conceitualizados. Lumi: guerreiro de espadas de Cidade Estrela. Aya: sua irmã, cujo papel na história é muito maior do que parece.',
    textEn: 'The two main characters were conceptualized. Lumi: sword fighter from Star City. Aya: his sister, whose role in the story is far greater than it seems.',
    tag: 'design',
  },
]

export const tagColors: Record<DevlogEntry['tag'], string> = {
  milestone: '#f0c040',
  lore:      '#8b3fff',
  art:       '#40c0ff',
  tech:      '#40ff90',
  design:    '#ff9040',
}
