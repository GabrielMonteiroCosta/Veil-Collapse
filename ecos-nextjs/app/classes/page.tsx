'use client'

import { useState } from 'react'
import Nav from '@/components/Nav'
import { useLanguage } from '@/context/LanguageContext'
import { gameClasses } from '@/data/classes'
import styles from './Classes.module.css'

const ABILITIES: Record<string, { namePt: string; nameEn: string; descPt: string; descEn: string }[]> = {
  normal: [
    { namePt: 'Golpe Preciso', nameEn: 'Precise Strike', descPt: 'Ataque básico com dano aumentado quando o inimigo está com vida baixa.', descEn: 'Basic attack with increased damage when the enemy is at low health.' },
    { namePt: 'Instinto de Sobrevivência', nameEn: 'Survival Instinct', descPt: 'Aumenta temporariamente todas as estatísticas ao ficar abaixo de 30% de vida.', descEn: 'Temporarily increases all stats when dropping below 30% health.' },
    { namePt: 'Adaptação', nameEn: 'Adaptation', descPt: 'Reduz o dano recebido do mesmo tipo de ataque a cada golpe consecutivo.', descEn: 'Reduces damage taken from the same attack type with each consecutive hit.' },
  ],
  pugilista: [
    { namePt: 'Combo Implacável', nameEn: 'Relentless Combo', descPt: 'Sequência de 5 socos com velocidade crescente. O último golpe atordoa.', descEn: 'Sequence of 5 punches with increasing speed. The last hit stuns.' },
    { namePt: 'Passo do Vento', nameEn: 'Wind Step', descPt: 'Teleporte curto para trás do inimigo, habilitando um ataque crítico garantido.', descEn: 'Short teleport behind the enemy, enabling a guaranteed critical attack.' },
    { namePt: 'Luvas Encantadas', nameEn: 'Enchanted Gloves', descPt: 'Ativa o encantamento das luvas por 12 segundos, adicionando dano elemental.', descEn: 'Activates the glove enchantment for 12 seconds, adding elemental damage.' },
    { namePt: 'Contra-Ataque', nameEn: 'Counter', descPt: 'Janela de 0.3s para redirecionar o dano recebido de volta ao atacante.', descEn: '0.3s window to redirect received damage back to the attacker.' },
  ],
  espadachim: [
    { namePt: 'Slash Duplo', nameEn: 'Double Slash', descPt: 'Dois cortes rápidos em arco. Pode acertar múltiplos inimigos.', descEn: 'Two quick arc cuts. Can hit multiple enemies.' },
    { namePt: 'Postura do Lobo', nameEn: 'Wolf Stance', descPt: 'Modo defensivo que aumenta a deflexão e dano de contra-ataque por 8 segundos.', descEn: 'Defensive mode that increases deflection and counter-damage for 8 seconds.' },
    { namePt: 'Proteção da Alcateia', nameEn: 'Pack Protection', descPt: 'Aura passiva que reduz o dano recebido por aliados próximos.', descEn: 'Passive aura that reduces damage received by nearby allies.' },
    { namePt: 'Fúria do Espadachim', nameEn: 'Swordsman\'s Fury', descPt: 'Ultimate: dano massivo em cone frontal com push de todos os inimigos afetados.', descEn: 'Ultimate: massive damage in a frontal cone with push on all affected enemies.' },
  ],
  arcano: [
    { namePt: 'Selo Arcano', nameEn: 'Arcane Seal', descPt: 'Lança um selo de energia que explode após 2 segundos ou ao ser atingido por outro feitiço.', descEn: 'Launches an energy seal that explodes after 2 seconds or when hit by another spell.' },
    { namePt: 'Vínculo do Pacto', nameEn: 'Pact Bond', descPt: 'Invoca brevemente a entidade do pacto para um ataque devastador.', descEn: 'Briefly summons the pact entity for a devastating attack.' },
    { namePt: 'Véu Astral', nameEn: 'Astral Veil', descPt: 'Torna-se intangível por 2 segundos. Ataques físicos passam através do usuário.', descEn: 'Becomes intangible for 2 seconds. Physical attacks pass through the user.' },
    { namePt: 'Grimório Aberto', nameEn: 'Open Grimoire', descPt: 'Ultimate: lança todos os feitiços carregados simultaneamente ao redor do usuário.', descEn: 'Ultimate: releases all charged spells simultaneously around the user.' },
  ],
  mecha: [
    { namePt: 'Punho de Aço', nameEn: 'Steel Fist', descPt: 'Golpe com o Mecha-Arm que perfura armadura. Dano fixo ignorando defesa.', descEn: 'Strike with Mecha-Arm that pierces armor. Fixed damage ignoring defense.' },
    { namePt: 'Modo Overdrive', nameEn: 'Overdrive Mode', descPt: 'Aumenta velocidade e dano em 40% por 10 segundos. Causa superaquecimento ao fim.', descEn: 'Increases speed and damage by 40% for 10 seconds. Causes overheating at the end.' },
    { namePt: 'Escudo Cervical', nameEn: 'Cervical Shield', descPt: 'Ativa um campo de força ao redor da coluna. Bloqueia o próximo golpe massivo.', descEn: 'Activates a force field around the spine. Blocks the next massive hit.' },
    { namePt: 'Calibração Total', nameEn: 'Full Calibration', descPt: 'Ultimate: todos os módulos Mecha ativam simultaneamente por 5 segundos.', descEn: 'Ultimate: all Mecha modules activate simultaneously for 5 seconds.' },
  ],
  druida: [
    { namePt: 'Forma Selvagem', nameEn: 'Wild Form', descPt: 'Transforma-se em uma criatura da natureza por 15 segundos, com habilidades únicas.', descEn: 'Transforms into a nature creature for 15 seconds, with unique abilities.' },
    { namePt: 'Espinhos do Solo', nameEn: 'Ground Thorns', descPt: 'Invoca espinhos do solo que prendem inimigos por 3 segundos.', descEn: 'Summons thorns from the ground that trap enemies for 3 seconds.' },
    { namePt: 'Cura da Floresta', nameEn: 'Forest Healing', descPt: 'Regeneração de vida para si e aliados próximos ao longo de 8 segundos.', descEn: 'Health regeneration for self and nearby allies over 8 seconds.' },
    { namePt: 'Tempestade Elemental', nameEn: 'Elemental Storm', descPt: 'Ultimate: invoca uma tempestade que combina todos os elementos simultaneamente.', descEn: 'Ultimate: summons a storm that combines all elements simultaneously.' },
  ],
}

function StatBar({ value, color }: { value: number; color: string }) {
  return (
    <div className={styles.statBar}>
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className={styles.statSegment}
          style={{ background: i < value ? color : undefined }}
        />
      ))}
    </div>
  )
}

export default function ClassesPage() {
  const { lang } = useLanguage()
  const [active, setActive] = useState<string | null>(null)
  const pt = lang === 'pt'

  const statLabels = pt
    ? { forca: 'Força', defesa: 'Defesa', agilidade: 'Agilidade', magia: 'Magia', rift: 'Rift' }
    : { forca: 'Strength', defesa: 'Defense', agilidade: 'Agility', magia: 'Magic', rift: 'Rift' }

  return (
    <>
      <Nav />
      <div className={styles.page}>
        <div className={styles.bgGlow} />
        <div className={styles.scanlines} />

        <div className={styles.container}>
          <a href="/" className={styles.backLink}>← {pt ? 'Voltar' : 'Back'}</a>

          <div className={styles.heroSection}>
            <p className={styles.tag}>◈ {pt ? 'CLASSES' : 'CLASSES'}</p>
            <h1 className={styles.heroTitle}>{pt ? 'Classes do Jogo' : 'Game Classes'}</h1>
            <p className={styles.heroDesc}>
              {pt
                ? 'Escolha seu caminho no mundo quebrado. Cada classe carrega uma filosofia, uma forma de lutar — e uma relação diferente com o Rift.'
                : 'Choose your path in the broken world. Each class carries a philosophy, a way to fight — and a different relationship with the Rift.'}
            </p>
          </div>

          <div className={styles.grid}>
            {gameClasses.map(cls => {
              const isActive = active === cls.id
              const abilities = ABILITIES[cls.id] ?? []

              return (
                <div
                  key={cls.id}
                  className={`${styles.card} ${isActive ? styles.cardOpen : ''}`}
                  style={{ '--ca': cls.accent, '--cg': cls.accentGlow } as React.CSSProperties}
                >
                  {/* Header */}
                  <div className={styles.cardHeader} onClick={() => setActive(isActive ? null : cls.id)}>
                    <div className={styles.cardHeaderLeft}>
                      <span className={styles.cardIcon}>{cls.icon}</span>
                      <div>
                        <h2 className={styles.cardName} style={{ color: cls.accent }}>
                          {pt ? cls.namePt : cls.nameEn}
                        </h2>
                        <p className={styles.cardRole}>{pt ? cls.rolePt : cls.roleEn}</p>
                      </div>
                    </div>
                    <span className={styles.cardChevron}>{isActive ? '▲' : '▼'}</span>
                  </div>

                  {/* Body */}
                  <div className={styles.cardBody}>
                  <div className={styles.cardBodyInner}>
                    <p className={styles.cardDesc}>{pt ? cls.descPt : cls.descEn}</p>

                    {/* Stats */}
                    <div className={styles.stats}>
                      {Object.entries(cls.stats).map(([key, val]) => (
                        <div key={key} className={styles.statRow}>
                          <span className={styles.statLabel}>{statLabels[key as keyof typeof statLabels]}</span>
                          <StatBar value={val} color={cls.accent} />
                          <span className={styles.statVal} style={{ color: cls.accent }}>{val}</span>
                        </div>
                      ))}
                    </div>

                    {/* Weapons */}
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>{pt ? 'Armas' : 'Weapons'}</span>
                      <div className={styles.tags}>
                        {cls.weapons.map(w => (
                          <span key={w} className={styles.weaponTag} style={{ borderColor: cls.accent + '55', color: cls.accent }}>{w}</span>
                        ))}
                      </div>
                    </div>

                    {/* Upgrade */}
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>{pt ? 'Evolução' : 'Upgrade'}</span>
                      <span className={styles.upgradeVal} style={{ color: cls.accent }}>{pt ? cls.upPt : cls.upEn}</span>
                    </div>

                    {/* Traits */}
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>{pt ? 'Traços' : 'Traits'}</span>
                      <div className={styles.tags}>
                        {(pt ? cls.traitsPt : cls.traitsEn).map(t => (
                          <span key={t} className={styles.traitTag}>{t}</span>
                        ))}
                      </div>
                    </div>

                    {/* Abilities */}
                    {abilities.length > 0 && (
                      <div className={styles.abilities}>
                        <p className={styles.abilitiesTitle}>{pt ? '⚡ Habilidades' : '⚡ Abilities'}</p>
                        <div className={styles.abilitiesList}>
                          {abilities.map((a, i) => (
                            <div key={i} className={styles.abilityItem}>
                              <span className={styles.abilityName} style={{ color: cls.accent }}>{pt ? a.namePt : a.nameEn}</span>
                              <span className={styles.abilityDesc}>{pt ? a.descPt : a.descEn}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
