'use client'

import { useEffect, useState } from 'react'
import { tiers, type TierId } from '@/data/milestones'
import styles from './DonationModal.module.css'

interface Props {
  tierId: TierId | null
  lang: string
  onClose: () => void
}

type Status = { type: 'success' | 'error'; message: string } | null

// ── Replace with your real PIX key ──
const PIX_KEY = 'email@seupix.com.br'

export default function DonationModal({ tierId, lang, onClose }: Props) {
  const tier = tiers.find(t => t.id === tierId)
  const [name,             setName]             = useState('')
  const [email,            setEmail]            = useState('')
  const [amount,           setAmount]           = useState('')
  const [npcOrItem,        setNpcOrItem]        = useState('')
  const [npcName,          setNpcName]          = useState('')
  const [npcDesc,          setNpcDesc]          = useState('')
  const [itemName,         setItemName]         = useState('')
  const [itemDesc,         setItemDesc]         = useState('')
  const [questName,        setQuestName]        = useState('')
  const [questDesc,        setQuestDesc]        = useState('')
  const [message,          setMessage]          = useState('')
  const [status,           setStatus]           = useState<Status>(null)
  const [loading,          setLoading]          = useState(false)
  const [step,             setStep]             = useState<1 | 2>(1)
  const [pixCopied,        setPixCopied]        = useState(false)

  useEffect(() => {
    if (!tierId) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [tierId, onClose])

  if (!tier || !tierId) return null

  const pt = lang === 'pt'
  const ac = tier.accent
  const ag = tier.accentGlow

  function copyPix() {
    navigator.clipboard.writeText(PIX_KEY).then(() => {
      setPixCopied(true)
      setTimeout(() => setPixCopied(false), 2000)
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus(null)
    setLoading(true)
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, tier: tierId,
          amount: amount ? parseFloat(amount.replace(',', '.')) : undefined,
          npcOrItem,
          npcName:          tier.id !== 'apoiador' ? npcName        : undefined,
          npcDescription:   tier.id !== 'apoiador' ? npcDesc        : undefined,
          itemName:         tier.id !== 'apoiador' ? itemName       : undefined,
          itemDescription:  tier.id !== 'apoiador' ? itemDesc       : undefined,
          questName:        tier.id === 'lenda'    ? questName      : undefined,
          questDescription: tier.id === 'lenda'    ? questDesc      : undefined,
          message,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus({ type: 'error', message: data.error })
      } else {
        setStatus({
          type: 'success',
          message: pt
            ? '✦ Recebemos seu pedido! Entraremos em contato após a confirmação do pagamento.'
            : '✦ We received your request! We\'ll contact you after payment confirmation.',
        })
      }
    } catch {
      setStatus({ type: 'error', message: pt ? 'Erro de conexão' : 'Connection error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.modal}
        style={{ '--ac': ac, '--ag': ag, '--alt': ('accentAlt' in tier ? tier.accentAlt : ac) } as React.CSSProperties}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.accentBar} style={{ background: `linear-gradient(to right, ${ac}, ${'accentAlt' in tier ? tier.accentAlt : ac}, transparent)` }} />

        <button className={styles.closeBtn} onClick={onClose}>×</button>

        <div className={styles.header}>
          <span className={styles.headerIcon}>{tier.icon}</span>
          <div>
            <p className={styles.headerSub} style={{ color: tier.accent }}>
              {pt ? 'Apoie o desenvolvimento' : 'Support development'}
            </p>
            <h2 className={styles.headerTitle} style={{ color: tier.accent }}>
              {pt ? tier.namePt : tier.nameEn}
            </h2>
            <p className={styles.headerRange} style={{ color: tier.accent + 'aa' }}>
              {pt ? tier.rangePt : tier.rangeEn}
            </p>
          </div>
        </div>

        {/* Rewards summary */}
        <ul className={styles.rewardList}>
          {(pt ? tier.rewardsPt : tier.rewardsEn).map((r, i) => (
            <li key={i} className={styles.rewardItem} style={{ animationDelay: `${i * 0.06}s` }}>
              <span className={styles.rewardDot} style={{ background: ac, boxShadow: `0 0 6px ${ag}` }} />
              {r}
            </li>
          ))}
        </ul>

        {/* Step tabs */}
        {!status?.type.includes('success') && (
          <div className={styles.steps}>
            <button
              className={`${styles.stepBtn} ${step === 1 ? styles.stepActive : ''}`}
              style={step === 1 ? { color: ac, borderColor: ac } : {}}
              onClick={() => setStep(1)}
            >
              {pt ? '1. Seus dados' : '1. Your info'}
            </button>
            <div className={styles.stepLine} />
            <button
              className={`${styles.stepBtn} ${step === 2 ? styles.stepActive : ''}`}
              style={step === 2 ? { color: ac, borderColor: ac } : {}}
              onClick={() => setStep(2)}
            >
              {pt ? '2. Pagamento' : '2. Payment'}
            </button>
          </div>
        )}

        {status?.type === 'success' ? (
          <div className={styles.successBox} style={{ borderColor: ac + '60' }}>
            <span className={styles.successIcon} style={{ color: ac }}>✦</span>
            <p className={styles.successText}>{status.message}</p>
            <button className={styles.doneBtn} style={{ background: ac, color: '#05091a' }} onClick={onClose}>
              {pt ? 'Fechar' : 'Close'}
            </button>
          </div>
        ) : step === 1 ? (
          <form className={styles.form} onSubmit={e => { e.preventDefault(); setStep(2) }}>
            <div className={styles.row2}>
              <div className={styles.field}>
                <label className={styles.label}>{pt ? 'Seu nome' : 'Your name'} *</label>
                <input className={styles.input} value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{pt ? 'E-mail' : 'Email'} *</label>
                <input className={styles.input} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>{pt ? 'Valor que pretende doar (R$)' : 'Amount you intend to donate (R$)'}</label>
              <input className={styles.input} placeholder="Ex: 30" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>

            {/* Apoiador */}
            {tier.id === 'apoiador' && (
              <div className={styles.field}>
                <label className={styles.label}>{pt ? 'Nome do NPC ou item que deseja batizar' : 'NPC or item name you want to give'}</label>
                <input className={styles.input} placeholder={pt ? 'Ex: Velha Mira / Espada do Crepúsculo' : 'Ex: Old Mira / Twilight Sword'} value={npcOrItem} onChange={e => setNpcOrItem(e.target.value)} />
              </div>
            )}

            {/* Criador + Lenda */}
            {(tier.id === 'criador' || tier.id === 'lenda') && (<>
              <div className={styles.dividerLabel} style={{ color: ac }}>{pt ? '── Seu NPC ──' : '── Your NPC ──'}</div>
              <div className={styles.row2}>
                <div className={styles.field}>
                  <label className={styles.label}>{pt ? 'Nome do NPC' : 'NPC name'}</label>
                  <input className={styles.input} value={npcName} onChange={e => setNpcName(e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>{pt ? 'Nome do item' : 'Item name'}</label>
                  <input className={styles.input} value={itemName} onChange={e => setItemName(e.target.value)} />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{pt ? 'Backstory do NPC (até 300 caracteres)' : 'NPC backstory (up to 300 chars)'}</label>
                <textarea className={styles.textarea} maxLength={300} rows={3} value={npcDesc} onChange={e => setNpcDesc(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{pt ? 'Descrição do item' : 'Item description'}</label>
                <textarea className={styles.textarea} maxLength={200} rows={2} value={itemDesc} onChange={e => setItemDesc(e.target.value)} />
              </div>
            </>)}

            {/* Lenda */}
            {tier.id === 'lenda' && (<>
              <div className={styles.dividerLabel} style={{ color: ac }}>{pt ? '── Sua Quest ──' : '── Your Quest ──'}</div>
              <div className={styles.field}>
                <label className={styles.label}>{pt ? 'Nome da quest' : 'Quest name'}</label>
                <input className={styles.input} value={questName} onChange={e => setQuestName(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{pt ? 'Ideia geral da quest' : 'Quest general idea'}</label>
                <textarea className={styles.textarea} maxLength={500} rows={3} placeholder={pt ? 'Descreva a premissa, personagens envolvidos, objetivo...' : 'Describe the premise, involved characters, objective...'} value={questDesc} onChange={e => setQuestDesc(e.target.value)} />
              </div>
            </>)}

            <div className={styles.field}>
              <label className={styles.label}>{pt ? 'Mensagem para a equipe (opcional)' : 'Message to the team (optional)'}</label>
              <textarea className={styles.textarea} rows={2} value={message} onChange={e => setMessage(e.target.value)} />
            </div>

            {status?.type === 'error' && <p className={styles.msgError}>{status.message}</p>}
            <button type="submit" className={styles.nextBtn} style={{ background: ac, color: '#05091a' }}>
              {pt ? 'Continuar para pagamento →' : 'Continue to payment →'}
            </button>
          </form>
        ) : (
          <div className={styles.payStep}>
            <div className={styles.pixCard} style={{ borderColor: ac + '50' }}>
              <p className={styles.pixLabel}>{pt ? '✦ Chave PIX' : '✦ PIX Key'}</p>
              <div className={styles.pixKeyRow}>
                <span className={styles.pixKey}>{PIX_KEY}</span>
                <button className={styles.copyBtn} style={{ borderColor: ac, color: ac }} onClick={copyPix}>
                  {pixCopied ? (pt ? 'Copiado!' : 'Copied!') : (pt ? 'Copiar' : 'Copy')}
                </button>
              </div>
              <p className={styles.pixNote}>
                {pt
                  ? `Faça o PIX de ${tier.rangePt} e clique em "Já paguei" abaixo.`
                  : `Send a PIX of ${tier.rangeEn} and click "I paid" below.`}
              </p>
            </div>

            <p className={styles.payInfo}>
              {pt
                ? 'Após confirmar o pagamento entraremos em contato pelo e-mail fornecido para incluir seu conteúdo no jogo.'
                : 'After confirming payment we\'ll contact you at the provided email to include your content in the game.'}
            </p>

            {status?.type === 'error' && <p className={styles.msgError}>{status.message}</p>}

            <div className={styles.payBtns}>
              <button className={styles.backBtn} onClick={() => setStep(1)}>
                {pt ? '← Voltar' : '← Back'}
              </button>
              <button
                className={styles.paidBtn}
                style={{ background: ac, color: '#05091a' }}
                disabled={loading}
                onClick={handleSubmit as never}
              >
                {loading
                  ? (pt ? 'Enviando...' : 'Sending...')
                  : (pt ? '✦ Já paguei!' : '✦ I paid!')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
