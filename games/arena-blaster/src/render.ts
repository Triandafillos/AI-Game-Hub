import type { Bullet, Enemy, HudState, Player, World } from "./types";

export function render(
  ctx: CanvasRenderingContext2D,
  world: World,
  player: Player,
  bullet: Bullet | null,
  enemy: Enemy,
  hud: HudState,
) {
  ctx.clearRect(0, 0, world.width, world.height);

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

  ctx.fillStyle = "#27272a";
  ctx.fillRect(0, world.groundY, world.width, world.groundHeight);
  ctx.fillStyle = "#3f3f46";
  ctx.fillRect(0, world.groundY, world.width, 4);

  if (enemy.alive) {
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);
    ctx.fillStyle = "#7f1d1d";
    ctx.fillRect(enemy.x + 8, enemy.y + 10, 8, 8);
    ctx.fillRect(enemy.x + enemy.w - 16, enemy.y + 10, 8, 8);
  }

  const blink = player.invuln > 0 && Math.floor(player.invuln * 10) % 2 === 0;
  if (!blink) {
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(player.x, player.y, player.w, player.h);

    const eyeX = player.facing === 1 ? player.x + player.w - 10 : player.x + 4;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(eyeX, player.y + 14, 6, 6);

    const barrelY = player.y + player.h * 0.4;
    ctx.fillStyle = "#94a3b8";
    if (player.facing === 1) {
      ctx.fillRect(player.x + player.w - 2, barrelY, 14, 5);
    } else {
      ctx.fillRect(player.x - 12, barrelY, 14, 5);
    }
  }

  if (bullet) {
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h);
  }

  ctx.fillStyle = "#a1a1aa";
  ctx.font = "16px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("A/D turn · W/↑ jump · Space shoot · P pause", 16, 28);

  ctx.fillStyle = "#e4e4e7";
  ctx.font = "bold 22px system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(`Score ${hud.score}`, world.width - 16, 32);
  ctx.fillStyle = "#f87171";
  ctx.fillText(`Lives ${hud.lives}`, world.width - 16, 60);

  if (hud.paused && !hud.gameOver) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.fillRect(0, 0, world.width, world.height);
    ctx.fillStyle = "#f4f4f5";
    ctx.font = "bold 48px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Paused", world.width / 2, world.height / 2 - 8);
    ctx.font = "18px system-ui, sans-serif";
    ctx.fillStyle = "#a1a1aa";
    ctx.fillText("Press P to resume", world.width / 2, world.height / 2 + 28);
  }

  if (hud.gameOver) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
    ctx.fillRect(0, 0, world.width, world.height);
    ctx.fillStyle = "#f4f4f5";
    ctx.font = "bold 48px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", world.width / 2, world.height / 2 - 24);
    ctx.font = "22px system-ui, sans-serif";
    ctx.fillStyle = "#e4e4e7";
    ctx.fillText(`Score ${hud.score}`, world.width / 2, world.height / 2 + 16);
    ctx.font = "18px system-ui, sans-serif";
    ctx.fillStyle = "#a1a1aa";
    ctx.fillText("Press R to restart", world.width / 2, world.height / 2 + 52);
  }
}
