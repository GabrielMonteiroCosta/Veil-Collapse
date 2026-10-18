// ── Email ─────────────────────────────────────────────────────────────────────
const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/

export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'E-mail obrigatório'
  if (!EMAIL_RE.test(email.trim())) return 'E-mail inválido'
  return null
}

// ── Password ──────────────────────────────────────────────────────────────────
export interface PasswordStrengthResult {
  score: number       // 0–4
  label: 'fraca' | 'média' | 'boa' | 'forte'
  color: string
  error: string | null
}

// Cada requisito da senha separado, para a tela mostrar uma lista de conferência
export function passwordChecks(password: string) {
  return {
    length:   password.length >= 8,
    upper:    /[A-Z]/.test(password),
    number:   /[0-9]/.test(password),
    special:  /[!@#$%^&*()\-_=+\[\]{};:'",.<>/?\\|`~]/.test(password),
    long:     password.length >= 12,
  }
}

export function checkPasswordStrength(password: string): PasswordStrengthResult {
  const checks = passwordChecks(password)

  let error: string | null = null
  if (!checks.length)  error = 'Mínimo 8 caracteres'
  else if (!checks.upper)   error = 'Adicione uma letra maiúscula'
  else if (!checks.number)  error = 'Adicione um número'
  else if (!checks.special) error = 'Adicione um caractere especial (!@#$...)'

  const score = [checks.length, checks.upper, checks.number, checks.special, checks.long]
    .filter(Boolean).length

  const levels = [
    { label: 'fraca' as const,  color: '#f87171' },
    { label: 'fraca' as const,  color: '#f87171' },
    { label: 'média' as const,  color: '#fb923c' },
    { label: 'boa'   as const,  color: '#facc15' },
    { label: 'forte' as const,  color: '#4ade80' },
    { label: 'forte' as const,  color: '#4ade80' },
  ]

  return { score: Math.min(score, 4), ...levels[score], error }
}

export function validatePassword(password: string): string | null {
  return checkPasswordStrength(password).error
}

// ── Username (profanity + format) ─────────────────────────────────────────────
function normalize(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // remove accents
    .replace(/[^a-z0-9]/g, '')        // keep only alphanumeric
}

// Common PT/EN profanity + admin impersonation terms
const BLOCKED: string[] = [
  // PT
  'puta','puto','porra','caralho','merda','foda','fodase','buceta',
  'viado','cuzao','arrombado','filhadaputa','vagabunda','vagabundo',
  'imbecil','retardado','canalha','prostituta',
  // EN
  'fuck','shit','bitch','asshole','cunt','dick','cock','pussy',
  'nigger','nigga','faggot','fag','slut','whore','bastard','motherfucker',
  // Admin impersonation
  'admin','administrator','moderator','gamemaster','staff','owner','system',
  'suporte','support','oficial','official',
]

export function validateUsername(username: string): string | null {
  const trimmed = username.trim()
  if (!trimmed) return 'Nome obrigatório'
  if (trimmed.length < 3)  return 'Mínimo 3 caracteres'
  if (trimmed.length > 24) return 'Máximo 24 caracteres'
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) return 'Use só letras, números, _ ou - (sem espaços ou acentos)'

  const norm = normalize(trimmed)
  for (const word of BLOCKED) {
    if (norm.includes(normalize(word))) {
      return 'Nome de usuário não permitido'
    }
  }

  return null
}
