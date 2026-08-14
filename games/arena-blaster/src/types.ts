export type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type Platform = Rect & {
  fill: string;
};

export type World = {
  width: number;
  height: number;
  groundY: number;
  groundHeight: number;
  platforms: Platform[];
};

export type Player = {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  speed: number;
  jumpSpeed: number;
  gravity: number;
  onGround: boolean;
  facing: 1 | -1;
  invuln: number;
};

export type Bullet = {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
};

export type Enemy = {
  x: number;
  y: number;
  w: number;
  h: number;
  alive: boolean;
  respawnIn: number;
};

export type InputState = {
  left: boolean;
  right: boolean;
  jump: boolean;
  fire: boolean;
  pause: boolean;
  restart: boolean;
};

export type HudState = {
  score: number;
  lives: number;
  paused: boolean;
  gameOver: boolean;
};
