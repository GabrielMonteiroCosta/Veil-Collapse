-- ════════════════════════════════════════════════════════════════════════════
--  Veil: Collapse — Schema completo (PostgreSQL / Neon)
--  Execute este arquivo UMA VEZ em um banco vazio
-- ════════════════════════════════════════════════════════════════════════════

-- ── Tabela de usuários ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL       PRIMARY KEY,
  username      VARCHAR(50)  NOT NULL UNIQUE,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  is_admin      BOOLEAN      NOT NULL DEFAULT FALSE,
  avatar        VARCHAR(20)  DEFAULT NULL,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Tabela de doações ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS donations (
  id                SERIAL        PRIMARY KEY,
  name              VARCHAR(255)  NOT NULL,
  email             VARCHAR(255)  NOT NULL,
  tier              VARCHAR(50)   NOT NULL,
  amount            DECIMAL(10,2) DEFAULT NULL,
  npc_name          VARCHAR(255)  DEFAULT NULL,
  npc_description   TEXT          DEFAULT NULL,
  item_name         VARCHAR(255)  DEFAULT NULL,
  item_description  TEXT          DEFAULT NULL,
  quest_name        VARCHAR(255)  DEFAULT NULL,
  quest_description TEXT          DEFAULT NULL,
  message           TEXT          DEFAULT NULL,
  status            VARCHAR(20)   NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','confirmed','rejected')),
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── Comentários do FAQ ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS faq_comments (
  id             SERIAL      PRIMARY KEY,
  faq_id         INT         NOT NULL,
  parent_id      INT         DEFAULT NULL,
  user_id        INT         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content        TEXT        NOT NULL,
  is_admin_reply BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Notificações por usuário ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         SERIAL      PRIMARY KEY,
  user_id    INT         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message_pt TEXT        NOT NULL,
  message_en TEXT        NOT NULL,
  read_at    TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Badges/conquistas ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_badges (
  id         SERIAL      PRIMARY KEY,
  user_id    INT         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id   VARCHAR(50) NOT NULL,
  awarded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, badge_id)
);

-- ── Lista de espera ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS waitlist (
  id         SERIAL       PRIMARY KEY,
  email      VARCHAR(255) NOT NULL UNIQUE,
  prefs      JSONB        NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ════════════════════════════════════════════════════════════════════════════
--  APÓS executar este script:
--
--  1. Promover seu usuário a admin (substitua pelo seu e-mail):
--     UPDATE users SET is_admin = TRUE WHERE email = 'seu@email.com';
--
--  2. (Opcional) Inserir doações de teste:
--     Execute database/seed_supporters.sql (adapte se necessário)
-- ════════════════════════════════════════════════════════════════════════════
