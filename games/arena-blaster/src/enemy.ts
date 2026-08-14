import { overlaps } from "./collision";
import type { Bullet, Enemy, Rect, World } from "./types";

const ENEMY_W = 40;
const ENEMY_H = 40;
const RESPAWN_MIN = 1.0;
const RESPAWN_MAX = 2.5;

function randomRespawnDelay() {
  return RESPAWN_MIN + Math.random() * (RESPAWN_MAX - RESPAWN_MIN);
}

function pickSpawnPose(world: World): Rect {
  type Surface = { x: number; top: number; w: number };
  const surfaces: Surface[] = [
    { x: 40, top: world.groundY, w: world.width - 80 },
    ...world.platforms.map((p) => ({ x: p.x, top: p.y, w: p.w })),
  ];
  const surface = surfaces[Math.floor(Math.random() * surfaces.length)]!;
  const span = Math.max(1, surface.w - ENEMY_W);
  const x = surface.x + Math.random() * span;
  return { x, y: surface.top - ENEMY_H, w: ENEMY_W, h: ENEMY_H };
}

export function createEnemy(world: World): Enemy {
  const pose = pickSpawnPose(world);
  return {
    ...pose,
    alive: true,
    respawnIn: 0,
  };
}

export function updateEnemy(enemy: Enemy, world: World, dt: number) {
  if (enemy.alive) {
    return;
  }

  enemy.respawnIn -= dt;
  if (enemy.respawnIn <= 0) {
    const pose = pickSpawnPose(world);
    enemy.x = pose.x;
    enemy.y = pose.y;
    enemy.w = pose.w;
    enemy.h = pose.h;
    enemy.alive = true;
    enemy.respawnIn = 0;
  }
}

/** Returns true if the bullet hit and was consumed. */
export function tryHitEnemy(enemy: Enemy, bullet: Bullet): boolean {
  if (!enemy.alive) {
    return false;
  }
  if (!overlaps(enemy, bullet)) {
    return false;
  }
  killEnemy(enemy);
  return true;
}

export function killEnemy(enemy: Enemy) {
  enemy.alive = false;
  enemy.respawnIn = randomRespawnDelay();
}

export function resetEnemy(enemy: Enemy, world: World) {
  const pose = pickSpawnPose(world);
  enemy.x = pose.x;
  enemy.y = pose.y;
  enemy.w = pose.w;
  enemy.h = pose.h;
  enemy.alive = true;
  enemy.respawnIn = 0;
}
