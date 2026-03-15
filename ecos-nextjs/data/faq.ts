export interface FaqItem {
  id: number
  questionPt: string
  questionEn: string
  answerPt: string
  answerEn: string
}

export const faqs: FaqItem[] = [
  {
    id: 1,
    questionPt: 'Quando o jogo será lançado?',
    questionEn: 'When will the game be released?',
    answerPt: 'O lançamento está previsto para 2030. Acompanhe a linha do tempo na seção de Apoio para ver o progresso atual — cada cidade concluída é um passo mais perto do fim.',
    answerEn: 'The launch is planned for 2028. Check the timeline in the Support section to see current progress — each completed city is one step closer to the end.',
  },
  {
    id: 2,
    questionPt: 'Em quais plataformas o jogo estará disponível?',
    questionEn: 'Which platforms will the game be available on?',
    answerPt: 'O foco inicial é PC (Windows e Mac). Versões para consoles serão avaliadas após o lançamento, dependendo da recepção do jogo.',
    answerEn: 'The initial focus is PC (Windows and Mac). Console versions will be evaluated after launch, depending on the game\'s reception.',
  },
  {
    id: 3,
    questionPt: 'O jogo terá multiplayer?',
    questionEn: 'Will the game have multiplayer?',
    answerPt: 'Não. Ecos de um Mundo Quebrado é uma experiência inteiramente solo focada em narrativa e imersão. A história é sobre a sua jornada — e só a sua.',
    answerEn: 'No. Echoes of a Broken World is an entirely solo experience focused on narrative and immersion. The story is about your journey — and yours alone.',
  },
  {
    id: 4,
    questionPt: 'O que é o anti-universo?',
    questionEn: 'What is the anti-universe?',
    answerPt: 'O anti-universo é uma camada paralela da realidade onde as leis da física são invertidas. Cada cidade possui uma versão sombria de si mesma. A sobreposição dos dois universos — o evento central da história — fez com que ambos coexistissem de forma instável.',
    answerEn: 'The anti-universe is a parallel layer of reality where the laws of physics are inverted. Each city has a dark version of itself. The overlap of both universes — the central event of the story — made both coexist in an unstable way.',
  },
  {
    id: 5,
    questionPt: 'Como funcionam as doações e recompensas?',
    questionEn: 'How do donations and rewards work?',
    answerPt: 'As doações são voluntárias e feitas via PIX. Após o pagamento, você preenche o formulário com sua recompensa escolhida (batizar um NPC, criar um personagem ou uma quest). Entraremos em contato pelo e-mail fornecido para incluir seu conteúdo no jogo.',
    answerEn: 'Donations are voluntary and made via PIX. After payment, you fill out a form with your chosen reward (naming an NPC, creating a character or a quest). We will contact you at the provided email to include your content in the game.',
  },
  {
    id: 6,
    questionPt: 'Posso contribuir com o projeto sem fazer doações?',
    questionEn: 'Can I contribute to the project without donating?',
    answerPt: 'Sim! Compartilhar o projeto com amigos, deixar feedback, participar da comunidade no Discord e reportar bugs durante o beta são contribuições imensamente valiosas. A comunidade é o que mantém um projeto independente vivo.',
    answerEn: 'Yes! Sharing the project with friends, leaving feedback, participating in the Discord community and reporting bugs during the beta are incredibly valuable contributions. The community is what keeps an independent project alive.',
  },
  {
    id: 7,
    questionPt: 'O jogo terá dublagem?',
    questionEn: 'Will the game have voice acting?',
    answerPt: 'Estamos avaliando. O foco atual é a narrativa escrita e a trilha sonora. Dublagem pode ser adicionada dependendo do crescimento e financiamento do projeto.',
    answerEn: 'We are evaluating this. The current focus is written narrative and soundtrack. Voice acting may be added depending on the project\'s growth and funding.',
  },
  {
    id: 8,
    questionPt: 'O jogo tem relação com algum outro universo ou franquia?',
    questionEn: 'Is the game related to any other universe or franchise?',
    answerPt: 'Não. Ecos de um Mundo Quebrado é um universo 100% original criado do zero. Toda a lore, personagens, cidades e mecânicas são propriedade intelectual exclusiva do projeto.',
    answerEn: 'No. Echoes of a Broken World is a 100% original universe created from scratch. All lore, characters, cities and mechanics are the project\'s exclusive intellectual property.',
  },
]
