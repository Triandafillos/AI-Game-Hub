import type { InputState } from "./types";

const state: InputState = {
  left: false,
  right: false,
  jump: false,
  fire: false,
  pause: false,
  restart: false,
};

function isGameCode(code: string) {
  return (
    code === "ArrowLeft" ||
    code === "ArrowRight" ||
    code === "ArrowUp" ||
    code === "KeyA" ||
    code === "KeyD" ||
    code === "KeyW" ||
    code === "Space" ||
    code === "KeyP" ||
    code === "KeyR"
  );
}

function setKey(code: string, pressed: boolean) {
  if (code === "ArrowLeft" || code === "KeyA") {
    state.left = pressed;
  }
  if (code === "ArrowRight" || code === "KeyD") {
    state.right = pressed;
  }
  if (code === "ArrowUp" || code === "KeyW") {
    state.jump = pressed;
  }
  if (code === "Space") {
    state.fire = pressed;
  }
  if (code === "KeyP") {
    state.pause = pressed;
  }
  if (code === "KeyR") {
    state.restart = pressed;
  }
}

export function bindInput() {
  window.addEventListener("keydown", (event) => {
    if (isGameCode(event.code)) {
      event.preventDefault();
    }
    setKey(event.code, true);
  });

  window.addEventListener("keyup", (event) => {
    setKey(event.code, false);
  });

  window.addEventListener("blur", () => {
    state.left = false;
    state.right = false;
    state.jump = false;
    state.fire = false;
    state.pause = false;
    state.restart = false;
  });
}

export function getInput(): InputState {
  return state;
}
