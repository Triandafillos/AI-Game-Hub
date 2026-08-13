import type { InputState, Player, Rect, World } from "./types";

const MAX_FALL_SPEED = 900;

function overlapsX(a: Rect, b: Rect) {
  return a.x < b.x + b.w && a.x + a.w > b.x;
}

export function createPlayer(world: World): Player {
  const w = 36;
  const h = 48;
  return {
    x: world.width / 2 - w / 2,
    y: world.groundY - h,
    w,
    h,
    vx: 0,
    vy: 0,
    speed: 260,
    jumpSpeed: 680,
    gravity: 1600,
    onGround: true,
    facing: 1,
  };
}

export function updatePlayer(
  player: Player,
  world: World,
  input: InputState,
  dt: number,
) {
  let move = 0;
  if (input.left) move -= 1;
  if (input.right) move += 1;

  player.vx = move * player.speed;
  if (move !== 0) {
    player.facing = move > 0 ? 1 : -1;
  }

  if (input.jump && player.onGround) {
    player.vy = -player.jumpSpeed;
    player.onGround = false;
  }

  player.vy = Math.min(MAX_FALL_SPEED, player.vy + player.gravity * dt);

  player.x += player.vx * dt;
  player.x = Math.max(0, Math.min(world.width - player.w, player.x));

  const prevBottom = player.y + player.h;
  player.y += player.vy * dt;
  player.onGround = false;

  // Ground
  if (player.y + player.h >= world.groundY) {
    player.y = world.groundY - player.h;
    player.vy = 0;
    player.onGround = true;
  }

  // Solid platforms: land when falling onto the top surface
  if (player.vy >= 0) {
    for (const platform of world.platforms) {
      const feet = player.y + player.h;
      const wasAbove = prevBottom <= platform.y + 1;
      const nowOnOrBelow = feet >= platform.y;
      if (
        wasAbove &&
        nowOnOrBelow &&
        overlapsX(player, platform) &&
        prevBottom <= platform.y + Math.abs(player.vy * dt) + 4
      ) {
        player.y = platform.y - player.h;
        player.vy = 0;
        player.onGround = true;
        break;
      }
    }
  }

  // Keep inside the screen vertically
  if (player.y < 0) {
    player.y = 0;
    if (player.vy < 0) player.vy = 0;
  }
}
