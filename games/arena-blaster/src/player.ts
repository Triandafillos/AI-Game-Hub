import type { InputState, Player, World } from "./types";
import { overlapsX } from "./collision";

const MAX_FALL_SPEED = 900;

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
    invuln: 0,
  };
}

export function resetPlayer(player: Player, world: World) {
  player.x = world.width / 2 - player.w / 2;
  player.y = world.groundY - player.h;
  player.vx = 0;
  player.vy = 0;
  player.onGround = true;
  player.facing = 1;
  player.invuln = 1.5;
}

export function updatePlayer(
  player: Player,
  world: World,
  input: InputState,
  dt: number,
) {
  if (player.invuln > 0) {
    player.invuln = Math.max(0, player.invuln - dt);
  }

  if (input.left && !input.right) {
    player.facing = -1;
  } else if (input.right && !input.left) {
    player.facing = 1;
  }

  player.vx = player.facing * player.speed;

  if (input.jump && player.onGround) {
    player.vy = -player.jumpSpeed;
    player.onGround = false;
  }

  player.vy = Math.min(MAX_FALL_SPEED, player.vy + player.gravity * dt);

  player.x += player.vx * dt;

  if (player.x <= 0) {
    player.x = 0;
    player.facing = 1;
    player.vx = player.speed;
  } else if (player.x + player.w >= world.width) {
    player.x = world.width - player.w;
    player.facing = -1;
    player.vx = -player.speed;
  }

  const prevBottom = player.y + player.h;
  player.y += player.vy * dt;
  player.onGround = false;

  if (player.y + player.h >= world.groundY) {
    player.y = world.groundY - player.h;
    player.vy = 0;
    player.onGround = true;
  }

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

  if (player.y < 0) {
    player.y = 0;
    if (player.vy < 0) player.vy = 0;
  }
}
