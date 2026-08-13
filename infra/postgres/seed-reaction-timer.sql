-- Run this if your Postgres volume was created before reaction-timer was added.
-- Example: docker compose exec -T postgres psql -U postgres -d aigamehub -f - < infra/postgres/seed-reaction-timer.sql

INSERT INTO games (slug, name, description, version, entry_path, is_published)
VALUES (
  'reaction-timer',
  'Reaction Timer',
  'Wait for green, then click as fast as you can. Your best time is saved.',
  '1.0.0',
  '/games/reaction-timer/1.0.0/index.html',
  true
)
ON CONFLICT (slug) DO NOTHING;
