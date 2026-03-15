-- Seed: 10 apoiadores de teste (status confirmed)
-- Rodar APÓS migrate_v2.sql

INSERT INTO donations (name, email, tier, amount, status, created_at) VALUES
  ('Rafael Monteiro',   'rafael@example.com',   'lenda',    250.00, 'confirmed', '2025-11-03 09:14:00'),
  ('Isabela Carvalho',  'isabela@example.com',  'lenda',    180.00, 'confirmed', '2025-11-10 14:32:00'),
  ('Bruno Nakamura',    'bruno@example.com',    'lenda',    120.00, 'confirmed', '2025-11-22 11:05:00'),
  ('Letícia Duarte',    'leticia@example.com',  'criador',  100.00, 'confirmed', '2025-12-01 16:48:00'),
  ('Thiago Rezende',    'thiago@example.com',   'criador',   80.00, 'confirmed', '2025-12-08 10:20:00'),
  ('Mariana Fonseca',   'mariana@example.com',  'criador',   65.00, 'confirmed', '2025-12-15 19:03:00'),
  ('Eduardo Pires',     'eduardo@example.com',  'apoiador',  45.00, 'confirmed', '2026-01-04 08:55:00'),
  ('Camila Teixeira',   'camila@example.com',   'apoiador',  30.00, 'confirmed', '2026-01-11 21:17:00'),
  ('Lucas Barbosa',     'lucas@example.com',    'apoiador',  20.00, 'confirmed', '2026-01-18 13:42:00'),
  ('Fernanda Gomes',    'fernanda@example.com', 'apoiador',  10.00, 'confirmed', '2026-01-25 17:30:00');
