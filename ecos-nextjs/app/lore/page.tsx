'use client'

import Nav from '@/components/Nav'
import { useLanguage } from '@/context/LanguageContext'
import styles from './Lore.module.css'

const timeline = [
  {
    year: 'Ano 0',
    titlePt: 'A Fundação da Cidadela Âmbar',
    titleEn: 'The Founding of Amber Citadel',
    descPt: 'Cientistas do mundo inteiro se reúnem na Cidadela Âmbar para explorar uma anomalia energética detectada no centro do continente. Chamam o fenômeno de "Rift" — uma fissura entre planos de existência.',
    descEn: 'Scientists from around the world gather at Amber Citadel to explore an energy anomaly detected at the continent\'s center. They call the phenomenon a "Rift" — a fracture between planes of existence.',
  },
  {
    year: 'Ano 12',
    titlePt: 'Projeto Omega',
    titleEn: 'Project Omega',
    descPt: 'O Projeto Omega começa: uma tentativa de abrir um portal controlado para o outro lado do Rift. Os pais de Lumi e Aya fazem parte da equipe científica. A mãe está grávida de Aya durante os experimentos.',
    descEn: 'Project Omega begins: an attempt to open a controlled portal to the other side of the Rift. Lumi and Aya\'s parents are part of the science team. Their mother is pregnant with Aya during the experiments.',
  },
  {
    year: 'Ano 12 — Dia 347',
    titlePt: 'O Incidente',
    titleEn: 'The Incident',
    descPt: 'O portal é aberto. Por 11 segundos, os dois universos coexistem. Algo atravessa. A mãe de Lumi e Aya é diretamente afetada pela energia do anti-universo — e essa energia passa para Aya ainda no ventre. Os pais não sobrevivem.',
    descEn: 'The portal opens. For 11 seconds, both universes coexist. Something crosses over. Lumi and Aya\'s mother is directly struck by anti-universe energy — and that energy passes to Aya in the womb. The parents do not survive.',
  },
  {
    year: 'Ano 13',
    titlePt: 'A Sobreposição',
    titleEn: 'The Overlap',
    descPt: 'Cidades ao redor do epicentro começam a "sobrepor" com suas versões do anti-universo. Cálico, Neon, Ferralume e a própria Cidadela Âmbar ficam presas entre dois planos. A E.C.O é fundada para conter e investigar.',
    descEn: 'Cities around the epicenter begin to "overlap" with their anti-universe counterparts. Calico, Neon, Ferralume, and Amber Citadel itself become trapped between two planes. E.C.O is founded to contain and investigate.',
  },
  {
    year: 'Presente',
    titlePt: 'A Jornada de Lumi',
    titleEn: 'Lumi\'s Journey',
    descPt: 'Aya é raptada por uma organização que descobriu o que ela carrega dentro de si. Lumi parte para encontrá-la, cruzando cidades sobrepostas e adentrando o anti-universo pela primeira vez.',
    descEn: 'Aya is abducted by an organization that discovered what she carries within her. Lumi sets out to find her, crossing overlapped cities and entering the anti-universe for the first time.',
  },
]

const characters = [
  {
    name: 'Lumi',
    rolePt: 'Protagonista',
    roleEn: 'Protagonist',
    descPt: 'Irmão mais velho de Aya. Cresceu cuidando dela depois da morte dos pais no incidente da Cidadela Âmbar. Não tem poderes especiais — só determinação inabalável e a vontade de salvar a única família que lhe resta.',
    descEn: 'Aya\'s older brother. Raised her after their parents died in the Amber Citadel incident. He has no special powers — just unbreakable determination and the will to save the only family he has left.',
    accent: '#f0c040',
  },
  {
    name: 'Aya',
    rolePt: 'A Razão da Jornada',
    roleEn: 'The Reason for the Journey',
    descPt: 'Irmã mais nova de Lumi. Nasceu com algo do anti-universo dentro dela — consequência do incidente que matou seus pais. Não sabe exatamente o que isso significa, mas uma organização sabe. E quer isso de volta.',
    descEn: 'Lumi\'s younger sister. Born with something of the anti-universe inside her — a consequence of the incident that killed their parents. She doesn\'t fully understand what it means, but an organization does. And they want it back.',
    accent: '#b050e0',
  },
  {
    name: 'Kiara',
    rolePt: 'Companheira de Jornada',
    roleEn: 'Journey Companion',
    descPt: 'Encontra Lumi cedo na jornada. Sua mãe também foi afetada pelos efeitos do anti-universo — o que a conecta ao mesmo conflito central de forma diferente. Cabelo castanho curto, olhos âmbar, pele morena.',
    descEn: 'Meets Lumi early in the journey. Her mother was also affected by the anti-universe — connecting her to the same central conflict in a different way. Short brown hair, amber eyes, tanned skin.',
    accent: '#e07828',
  },
  {
    name: 'Ashira',
    rolePt: 'Capitão da E.C.O',
    roleEn: 'E.C.O Captain',
    descPt: 'Líder do Esquadrão de Contenção e Observação. Age no limite entre os dois universos há anos. Conhece os rifts melhor do que qualquer pessoa viva — e carrega segredos que ninguém mais conhece.',
    descEn: 'Leader of the Containment and Observation Squadron. Has operated on the boundary between both universes for years. Knows the rifts better than anyone alive — and carries secrets nobody else knows.',
    accent: '#2090ff',
  },
  {
    name: 'Asterus',
    rolePt: 'Soldado da E.C.O — Melhor do Ciclo',
    roleEn: 'E.C.O Soldier — Best of the Cycle',
    descPt: 'Parceiro de campo de Ashira. Reconhecido como o melhor soldado do ciclo atual da E.C.O. Leal, preciso e silencioso. Tem um código de honra rígido que às vezes colide com as ordens que recebe.',
    descEn: 'Ashira\'s field partner. Recognized as the best soldier of E.C.O\'s current cycle. Loyal, precise, and quiet. Has a strict code of honor that sometimes clashes with the orders he receives.',
    accent: '#40b870',
  },
]

const universes = [
  {
    namePt: 'Universo Normal',
    nameEn: 'Normal Universe',
    descPt: 'O mundo como conhecemos. Cidades com culturas distintas, tecnologias variadas e histórias próprias. Desde o incidente da Cidadela Âmbar, algumas áreas estão "sobrepostas" — existindo simultaneamente nos dois planos.',
    descEn: 'The world as we know it. Cities with distinct cultures, varied technologies, and their own histories. Since the Amber Citadel incident, some areas are "overlapped" — existing simultaneously in both planes.',
    accent: '#f0c040',
    icon: '◈',
  },
  {
    namePt: 'Anti-Universo',
    nameEn: 'Anti-Universe',
    descPt: 'O eco do mundo normal. Cada cidade tem uma versão invertida — os mesmos espaços físicos, mas com leis e habitantes diferentes. No anti-universo, o que era tecnologia pode ser magia, e o que era luz pode ser sombra. Não é possível salvar neste plano.',
    descEn: 'The echo of the normal world. Every city has an inverted version — the same physical spaces, but with different laws and inhabitants. In the anti-universe, what was technology may be magic, and what was light may be shadow. Saving is not possible in this plane.',
    accent: '#9030ff',
    icon: '⟷',
  },
]

export default function LorePage() {
  const { lang } = useLanguage()
  const pt = lang === 'pt'

  return (
    <>
      <Nav />
      <div className={styles.page}>
        <div className={styles.bgGlow} />
        <div className={styles.scanlines} />

        <div className={styles.container}>
          <a href="/" className={styles.backLink}>← {pt ? 'Voltar' : 'Back'}</a>

          <div className={styles.heroSection}>
            <p className={styles.tag}>✦ {pt ? 'UNIVERSO' : 'UNIVERSE'}</p>
            <h1 className={styles.heroTitle}>{pt ? 'Lore' : 'Lore'}</h1>
            <p className={styles.heroDesc}>
              {pt
                ? 'A história por trás de Veil: Collapse — o incidente que mudou tudo, os universos que colidiram e as pessoas que vivem entre eles.'
                : 'The story behind Veil: Collapse — the incident that changed everything, the universes that collided, and the people who live between them.'}
            </p>
          </div>

          {/* Os Dois Universos */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{pt ? '⟷ Os Dois Universos' : '⟷ The Two Universes'}</h2>
            <div className={styles.universesGrid}>
              {universes.map(u => (
                <div key={u.namePt} className={styles.universeCard} style={{ '--uc': u.accent } as React.CSSProperties}>
                  <span className={styles.universeIcon}>{u.icon}</span>
                  <h3 className={styles.universeName} style={{ color: u.accent }}>{pt ? u.namePt : u.nameEn}</h3>
                  <p className={styles.universeDesc}>{pt ? u.descPt : u.descEn}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Timeline */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{pt ? '◈ Linha do Tempo' : '◈ Timeline'}</h2>
            <div className={styles.timeline}>
              {timeline.map((e, i) => (
                <div key={i} className={styles.timelineItem}>
                  <div className={styles.timelineDot} />
                  <div className={styles.timelineContent}>
                    <span className={styles.timelineYear}>{e.year}</span>
                    <h3 className={styles.timelineTitle}>{pt ? e.titlePt : e.titleEn}</h3>
                    <p className={styles.timelineDesc}>{pt ? e.descPt : e.descEn}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Personagens */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{pt ? '✦ Personagens' : '✦ Characters'}</h2>
            <div className={styles.charactersGrid}>
              {characters.map(c => (
                <div key={c.name} className={styles.characterCard}>
                  <div className={styles.characterAvatar} style={{ color: c.accent, borderColor: c.accent + '55', textShadow: `0 0 20px ${c.accent}` }}>
                    {c.name[0]}
                  </div>
                  <div className={styles.characterInfo}>
                    <h3 className={styles.characterName} style={{ color: c.accent }}>{c.name}</h3>
                    <p className={styles.characterRole}>{pt ? c.rolePt : c.roleEn}</p>
                    <p className={styles.characterDesc}>{pt ? c.descPt : c.descEn}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Capítulos */}
          <section className={styles.section}>
            <div className={styles.chaptersCard}>
              <p className={styles.ecoTag}>✦ {pt ? 'NARRATIVA' : 'NARRATIVE'}</p>
              <h2 className={styles.ecoTitle}>{pt ? 'Capítulos' : 'Chapters'}</h2>
              <p className={styles.ecoDesc}>
                {pt
                  ? 'Os eventos narrados em prosa — do dia antes do ataque à Cidade Estrela até os subterrâneos de Cálico. Quatro capítulos que constroem o mundo antes do gameplay começar.'
                  : 'The events narrated in prose — from the day before the attack on Star City to the underground of Calico. Four chapters that build the world before gameplay begins.'}
              </p>
              <a href="/lore/capitulos" className={styles.chaptersLink}>
                {pt ? 'Ler os capítulos →' : 'Read the chapters →'}
              </a>
            </div>
          </section>

          {/* E.C.O */}
          <section className={styles.section}>
            <div className={styles.ecoCard}>
              <p className={styles.ecoTag}>✦ E.C.O</p>
              <h2 className={styles.ecoTitle}>{pt ? 'Esquadrão de Contenção e Observação' : 'Containment and Observation Squadron'}</h2>
              <p className={styles.ecoDesc}>
                {pt
                  ? 'Fundada após o incidente da Cidadela Âmbar para monitorar, conter e investigar os Rifts. Inspirada em organizações de elite, a E.C.O opera nos limites entre os dois universos. Seus agentes são os únicos treinados para sobreviver na sobreposição por longos períodos. No anti-universo, a E.C.O instalou dispositivos de estabilização temporários que funcionam como checkpoints — desaparecem quando o explorador sai da área.'
                  : 'Founded after the Amber Citadel incident to monitor, contain, and investigate Rifts. Inspired by elite organizations, E.C.O operates on the boundary between both universes. Its agents are the only ones trained to survive in the overlap for extended periods. In the anti-universe, E.C.O installed temporary stabilization devices that function as checkpoints — they disappear when the explorer leaves the area.'}
              </p>
            </div>
          </section>

        </div>
      </div>
    </>
  )
}
