import type { World } from "./types";

export const WORLD_WIDTH = 960;
export const WORLD_HEIGHT = 540;

export function createWorld(): World {
  const groundHeight = 48;
  const groundY = WORLD_HEIGHT - groundHeight;

  return {
    width: WORLD_WIDTH,
    height: WORLD_HEIGHT,
    groundY,
    groundHeight,
    platforms: [
      { x: 120, y: 360, w: 180, h: 18, fill: "#3f3f46" },
      { x: 390, y: 280, w: 180, h: 18, fill: "#3f3f46" },
      { x: 660, y: 360, w: 180, h: 18, fill: "#3f3f46" },
    ],
  };
}
