-- Migração v3: threading de respostas no FAQ
ALTER TABLE faq_comments
  ADD COLUMN parent_id INT NULL DEFAULT NULL AFTER faq_id;
