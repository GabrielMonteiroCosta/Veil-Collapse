-- Migração v5: badges de usuário + avatar customizável
CREATE TABLE IF NOT EXISTS user_badges (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  badge_id   VARCHAR(50) NOT NULL,
  awarded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_badge (user_id, badge_id)
);

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS avatar VARCHAR(20) DEFAULT NULL;
