-- ── Migração v2: is_admin + faq_comments ──────────────────────────────────

-- Adiciona coluna admin na tabela de usuários
ALTER TABLE users
  ADD COLUMN is_admin TINYINT(1) NOT NULL DEFAULT 0;

-- Promove o primeiro usuário a admin (ajuste o e-mail conforme necessário)
-- UPDATE users SET is_admin = 1 WHERE email = 'gabrielm.costa195@gmail.com';

-- Tabela de comentários do FAQ
CREATE TABLE IF NOT EXISTS faq_comments (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  faq_id      INT          NOT NULL,
  user_id     INT          NOT NULL,
  content     TEXT         NOT NULL,
  is_admin_reply TINYINT(1) NOT NULL DEFAULT 0,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
