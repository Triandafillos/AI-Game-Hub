# AI Game Hub

A self-hosted browser game portal with Supabase Auth, Postgres saves, and independently deployable iframe games.

## Stack

- **Platform:** Next.js (App Router) + TypeScript
- **Auth:** Supabase Auth (cloud)
- **Database:** Postgres 16 (Docker on VPS)
- **Games:** Static bundles + `@ai-game-hub/game-sdk` postMessage bridge
- **Deploy:** Docker Compose + Caddy + Cloudflare CDN

## Repository structure

```
apps/platform/     Next.js shell (catalog, auth, play, admin, save API)
packages/game-sdk/ Shared SDK for games (save, load, getUser)
games/             Independent game source projects
infra/             Postgres init SQL, Caddy config
```

## Quick start (local)

1. Copy environment variables:

   ```bash
   cp .env.example apps/platform/.env.local
   ```

   Fill in Supabase URL, anon key, and your email in `ADMIN_EMAILS`.

2. Install dependencies:

   ```bash
   npm install
   npm run build --workspace=@ai-game-hub/game-sdk
   ```

3. Start Postgres:

   ```bash
   docker compose up postgres -d
   ```

4. Run the platform:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000). The reference **Click Counter** game is seeded when Postgres initializes via `infra/postgres/init.sql`.

## Production (VPS + Docker)

```bash
cp .env.example .env
# edit .env with production values
docker compose up -d --build
```

Put Cloudflare in front of the VPS (proxied DNS, cache `/games/*`).

Upload new game bundles to `apps/platform/public/games/<slug>/<version>/` (or mount a volume at `/srv/games` in Caddy), then register metadata in **Admin → Games**.

## Adding a game

1. Build a static bundle with `index.html` + assets.
2. Copy to `apps/platform/public/games/<slug>/<version>/`.
3. Use the SDK (`createPlatformSDK`) or match the postMessage protocol in `packages/game-sdk`.
4. Register the game in `/admin/games` (your email must be in `ADMIN_EMAILS`).

## GitHub

Remote: [https://github.com/Triandafillos/AI-Game-Hub](https://github.com/Triandafillos/AI-Game-Hub)

## License

MIT
