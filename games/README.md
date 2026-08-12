# Games

Independent browser game projects live here. Each game is a self-contained static bundle.

## Adding a game

1. Create a folder under `games/<slug>/` with your source and build output.
2. Build to a static `dist/` (or copy built files to `data/games/<slug>/<version>/` for deployment).
3. Include a `manifest.json` matching the platform schema.
4. Register the game in the platform admin UI or seed it in Postgres.

## SDK

Import `@ai-game-hub/game-sdk` in your game code:

```typescript
import { createPlatformSDK } from "@ai-game-hub/game-sdk";

const platform = createPlatformSDK();
const saved = await platform.load();
await platform.save({ score: 100 });
```

See `games/click-counter/` for a minimal reference implementation.
