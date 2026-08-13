import { bindInput, getInput } from "./input";
import { createPlayer, updatePlayer } from "./player";
import { render } from "./render";
import { createWorld } from "./world";

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
bindInput();

let lastTime = performance.now();

function frame(now: number) {
  const dt = Math.min(0.033, (now - lastTime) / 1000);
  lastTime = now;

  updatePlayer(player, world, getInput(), dt);
  render(ctx, world, player);

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
