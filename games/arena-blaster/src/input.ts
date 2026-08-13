import type { InputState } from "./types";

const state: InputState = {
  left: false,
  right: false,
  jump: false,
};

function isMoveCode(code: string) {
  return (
    code === "ArrowLeft" ||
    code === "ArrowRight" ||
    code === "ArrowUp" ||
    code === "KeyA" ||
    code === "KeyD" ||
    code === "KeyW" ||
    code === "Space"
  );
}

function setKey(code: string, pressed: boolean) {
  if (code === "ArrowLeft" || code === "KeyA") {
    state.left = pressed;
  }
  if (code === "ArrowRight" || code === "KeyD") {
    state.right = pressed;
  }
  if (code === "ArrowUp" || code === "KeyW" || code === "Space") {
    state.jump = pressed;
  }
}

export function bindInput() {
  window.addEventListener("keydown", (event) => {
    if (isMoveCode(event.code)) {
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
  });
}

export function getInput(): InputState {
  return state;
}
