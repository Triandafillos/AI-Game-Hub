-- Run this if your Postgres volume was created before arena-blaster was added.
-- Example: docker compose exec -T postgres psql -U postgres -d aigamehub -f - < infra/postgres/seed-arena-blaster.sql

INSERT INTO games (slug, name, description, version, entry_path, is_published)
VALUES (
  'arena-blaster',
  'Arena Blaster',
  'Single-screen arena. Phase 1: walk the map. Combat coming later.',
  '1.0.0',
  '/games/arena-blaster/1.0.0/index.html',
  true
)
ON CONFLICT (slug) DO NOTHING;
