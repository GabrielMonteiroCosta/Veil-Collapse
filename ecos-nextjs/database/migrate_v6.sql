-- ════════════════════════════════════════════════════════════════════════════
--  Veil: Collapse — v6: lista de espera no banco (PostgreSQL / Neon)
--  Antes ficava em data/waitlist.json, que não persiste na Vercel.
--  Pode rodar mais de uma vez sem problema.
-- ════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS waitlist (
  id         SERIAL       PRIMARY KEY,
  email      VARCHAR(255) NOT NULL UNIQUE,
  prefs      JSONB        NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
