import { getActions, getBoard, getBombs, getFires } from "./game-state.js";

export function makeAi() {
  return {
    get_action: get_action,
  };
}

function get_action() {
  const board = getBoard();
  const actions = getActions();
  const bombs = getBombs();
  const fire = getFires();
  // return random action
  const r = Math.floor(Math.random() * 5);
  switch (r) {
    case 0:
      return actions.up;
    case 1:
      return actions.down;
    case 2:
      return actions.left;
    case 3:
      return actions.right;
    case 4:
      return actions.bomb;
  }
}
