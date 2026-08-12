-- AI Game Hub schema + seed reference game

CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  version TEXT NOT NULL,
  entry_path TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT false,
  save_schema_version INT NOT NULL DEFAULT 1,
  max_save_bytes INT NOT NULL DEFAULT 262144,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS saves (
  user_id UUID NOT NULL,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  save_schema_version INT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, game_id)
);

CREATE INDEX IF NOT EXISTS saves_user_id_idx ON saves (user_id);

INSERT INTO games (slug, name, description, version, entry_path, is_published)
VALUES (
  'click-counter',
  'Click Counter',
  'A minimal reference game that saves your click count.',
  '1.0.0',
  '/games/click-counter/1.0.0/index.html',
  true
)
ON CONFLICT (slug) DO NOTHING;
