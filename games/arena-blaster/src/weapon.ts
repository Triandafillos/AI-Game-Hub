import type { Bullet, Player, World } from "./types";

const BULLET_SPEED = 720;
const BULLET_W = 12;
const BULLET_H = 4;

export function tryFirePistol(
  player: Player,
  existing: Bullet | null,
): Bullet | null {
  if (existing) {
    return existing;
  }

  const y = player.y + player.h * 0.4 - BULLET_H / 2;
  const x =
    player.facing === 1 ? player.x + player.w : player.x - BULLET_W;

  return {
    x,
    y,
    w: BULLET_W,
    h: BULLET_H,
    vx: player.facing * BULLET_SPEED,
  };
}

/** Returns null when the bullet leaves the screen. */
export function updateBullet(
  bullet: Bullet,
  world: World,
  dt: number,
): Bullet | null {
  bullet.x += bullet.vx * dt;
  if (bullet.x + bullet.w < 0 || bullet.x > world.width) {
    return null;
  }
  return bullet;
}
