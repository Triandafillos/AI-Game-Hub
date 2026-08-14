import { overlaps } from "./collision";
import {
  createEnemy,
  killEnemy,
  resetEnemy,
  tryHitEnemy,
  updateEnemy,
} from "./enemy";
import { bindInput, getInput } from "./input";
import { createPlayer, resetPlayer, updatePlayer } from "./player";
import { render } from "./render";
import type { Bullet, HudState } from "./types";
import { tryFirePistol, updateBullet } from "./weapon";
import { createWorld } from "./world";

const START_LIVES = 3;
const POINTS_PER_KILL = 100;

const canvas = document.getElementById("game");
if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error("Missing #game canvas");
}

const maybeCtx = canvas.getContext("2d");
if (!maybeCtx) {
  throw new Error("2D canvas context unavailable");
}
const ctx: CanvasRenderingContext2D = maybeCtx;

const world = createWorld();
const player = createPlayer(world);
const enemy = createEnemy(world);
let bullet: Bullet | null = null;
let fireWasDown = false;
let pauseWasDown = false;
let restartWasDown = false;

const hud: HudState = {
  score: 0,
  lives: START_LIVES,
  paused: false,
  gameOver: false,
};

bindInput();

function restartGame() {
  resetPlayer(player, world);
  player.invuln = 0;
  resetEnemy(enemy, world);
  bullet = null;
  hud.score = 0;
  hud.lives = START_LIVES;
  hud.paused = false;
  hud.gameOver = false;
}

function loseLife() {
  hud.lives -= 1;
  bullet = null;
  if (enemy.alive) {
    killEnemy(enemy);
  }
  if (hud.lives <= 0) {
    hud.lives = 0;
    hud.gameOver = true;
    return;
  }
  resetPlayer(player, world);
}

let lastTime = performance.now();

function frame(now: number) {
  const dt = Math.min(0.033, (now - lastTime) / 1000);
  lastTime = now;

  const input = getInput();

  const pausePressed = input.pause && !pauseWasDown;
  pauseWasDown = input.pause;
  if (pausePressed && !hud.gameOver) {
    hud.paused = !hud.paused;
  }

  const restartPressed = input.restart && !restartWasDown;
  restartWasDown = input.restart;
  if (restartPressed && hud.gameOver) {
    restartGame();
  }

  if (!hud.paused && !hud.gameOver) {
    updatePlayer(player, world, input, dt);
    updateEnemy(enemy, world, dt);

    const firePressed = input.fire && !fireWasDown;
    fireWasDown = input.fire;
    if (firePressed) {
      bullet = tryFirePistol(player, bullet);
    }

    if (bullet) {
      bullet = updateBullet(bullet, world, dt);
      if (bullet && tryHitEnemy(enemy, bullet)) {
        bullet = null;
        hud.score += POINTS_PER_KILL;
      }
    }

    if (
      enemy.alive &&
      player.invuln <= 0 &&
      overlaps(player, enemy)
    ) {
      loseLife();
    }
  } else {
    fireWasDown = input.fire;
  }

  render(ctx, world, player, bullet, enemy, hud);

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
