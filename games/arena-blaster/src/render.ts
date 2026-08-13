import type { Player, World } from "./types";

export function render(
  ctx: CanvasRenderingContext2D,
  world: World,
  player: Player,
) {
  ctx.clearRect(0, 0, world.width, world.height);

  // Background
  const gradient = ctx.createLinearGradient(0, 0, 0, world.height);
  gradient.addColorStop(0, "#1e293b");
  gradient.addColorStop(1, "#0f172a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, world.width, world.height);

  for (const platform of world.platforms) {
    ctx.fillStyle = platform.fill;
    ctx.fillRect(platform.x, platform.y, platform.w, platform.h);
    ctx.fillStyle = "#52525b";
    ctx.fillRect(platform.x, platform.y, platform.w, 3);
  }

  // Ground
  ctx.fillStyle = "#27272a";
  ctx.fillRect(0, world.groundY, world.width, world.groundHeight);
  ctx.fillStyle = "#3f3f46";
  ctx.fillRect(0, world.groundY, world.width, 4);

  // Player
  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // Facing indicator
  const eyeX = player.facing === 1 ? player.x + player.w - 10 : player.x + 4;
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(eyeX, player.y + 14, 6, 6);

  // HUD hint
  ctx.fillStyle = "#a1a1aa";
  ctx.font = "16px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("A/D or arrows to move · W / ↑ / Space to jump", 16, 28);
  ctx.fillStyle = "#e4e4e7";
  ctx.font = "bold 20px system-ui, sans-serif";
  ctx.fillText("Arena Blaster", 16, 54);
}
