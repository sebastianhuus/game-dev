import { makeAi } from "./my-ai.js";
import { initHumanControls, isGametime } from "./setup.js";

// matrix for a 10 by 10 grid
const board = [];
const size = 15;
const rows = size;
const cols = size;

export function getBoard() {
  return board;
}

export const tileTypes = {
  empty: 0,
  stone: 6,
  wood: 5,
  player1: 1,
  player2: 2,
  player3: 3,
  player4: 4,
};

export function getTileTypes() {
  return tileTypes;
}

export function initBoard() {
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < cols; j++) {
      if ((i + j) % 2 === 1) {
        board[i][j] = tileTypes.wood;
      } else if (i % 2 === 1 && j % 2 === 1) {
        board[i][j] = tileTypes.stone;
      } else {
        board[i][j] = tileTypes.empty;
      }
    }
  }
  for (let i = 1; i < 3; i++) {
    board[0][i] = tileTypes.empty;
    board[i][0] = tileTypes.empty;
    board[0][size - 1 - i] = tileTypes.empty;
    board[size - 1 - i][0] = tileTypes.empty;
    board[i][size - 1] = tileTypes.empty;
    board[size - 1][i] = tileTypes.empty;
    board[size - 1 - i][size - 1] = tileTypes.empty;
    board[size - 1][size - 1 - i] = tileTypes.empty;
  }
}

var players = [];
var humansCount = 0;
var aiCount = 0;

export function getPlayers() {
  return players;
}

export function resetAgents() {
  players = [];
  humansCount = 0;
  aiCount = 0;
}

const spawnPoints = [
  { nr: 1, x: 0, y: 0 },
  { nr: 2, x: size - 1, y: 0 },
  { nr: 3, x: 0, y: size - 1 },
  { nr: 4, x: size - 1, y: size - 1 },
];

export const actions = {
  up: 0,
  right: 1,
  down: 2,
  left: 3,
  bomb: 4,
};

export function getActions() {
  return actions;
}

function resolveAction(id, action) {
  const player = players.find((p) => p.id === id);
  if (player?.isAlive) {
    if (action === actions.up) {
      if (player.y > 0 && board[player.y - 1][player.x] === tileTypes.empty) {
        board[player.y][player.x] = tileTypes.empty;
        player.y--;
        board[player.y][player.x] = id;
      }
    } else if (action === actions.down) {
      if (
        player.y < size - 1 &&
        board[player.y + 1][player.x] === tileTypes.empty
      ) {
        board[player.y][player.x] = tileTypes.empty;
        player.y++;
        board[player.y][player.x] = id;
      }
    } else if (action === actions.left) {
      if (player.x > 0 && board[player.y][player.x - 1] === tileTypes.empty) {
        board[player.y][player.x] = tileTypes.empty;
        player.x--;
        board[player.y][player.x] = id;
      }
    } else if (action === actions.right) {
      if (
        player.x < size - 1 &&
        board[player.y][player.x + 1] === tileTypes.empty
      ) {
        board[player.y][player.x] = tileTypes.empty;
        player.x++;
        board[player.y][player.x] = id;
      }
    } else if (action === actions.bomb) {
        if (player.cd < Date.now()) {
            player.cd = Date.now() + 3000;
            dropBomb(player);
        }
    }
  }
}

var actionQueue = [];
export var playerActionQueued = false;

export function setPlayerActionQueued(value) {
  playerActionQueued = value;
}

export function queueAction(id, action) {
  actionQueue.push({ id, action });
}

export function resolveActions() {
  if (!isGametime) return;
  // randomize order of actions
  actionQueue.sort(() => Math.random() - 0.5);
  for (let action of actionQueue) {
    resolveAction(action.id, action.action);
  }
  actionQueue = [];
  playerActionQueued = false;
  resolveBombs();
  removeWalls();
  resolveDeath();
  removeFires();
}

function removeWalls() {
  for (let fire of fires) {
    if (board[fire.y][fire.x] === tileTypes.wood) {
      board[fire.y][fire.x] = tileTypes.empty;
    }
  }
}

function resolveDeath() {
  for (let player of players) {
    for (let fire of fires) {
      if (player.x === fire.x && player.y === fire.y) {
        player.isAlive = false;
        console.log("player " + player.id + " died");
      }
    }
  }
}

export function getAiActions() {
  const actions = [];
  for (let player of players) {
    if (!player.isHuman && player.isAlive) {
      queueAction(player.id, player.agent.get_action());
    }
  }
}

export function populatePlayers() {
  for (let i = 0; i < humansCount; i++) {
    const { x, y, nr } = spawnPoints[i];
    players.push({ x, y, isHuman: true, isAlive: true, id: nr, cd: Date.now()});
    board[y][x] = nr;
  }
  for (let i = 0; i < aiCount; i++) {
    const { x, y, nr } = spawnPoints[humansCount + i];
    players.push({
      x,
      y,
      isHuman: false,
      isAlive: true,
      id: nr,
      agent: makeAi(),
      cd: Date.now()
    });
    board[y][x] = nr;
  }
}

export const addPlayer = (isHuman) => {
  if (humansCount + aiCount > spawnPoints.length) {
    return;
  }
  if (isHuman) {
    humansCount++;
    initHumanControls();
  } else {
    aiCount++;
  }
};

var bombs = [];
var fires = [];

export function resetBnF() {
  bombs = [];
  fires = [];
  actionQueue = [];
}

export function getBombs() {
  return bombs;
}

export function getFires() {
  return fires;
}

export function removeFires() {
  const still = [];
  for (let fire of fires) {
    if (fire.duration > Date.now()) {
      still.push(fire);
    } else {
      console.log("fire removed");
    }
  }
  fires = still;
}

const resolveBombs = () => {
  const still = [];
  for (let bomb of bombs) {
    if (bomb.explosion < Date.now()) {
      explodeBomb(bomb);
    } else {
      still.push(bomb);
    }
  }
  bombs = still;
};

function dropBomb(player) {
  bombs.push({ x: player.x, y: player.y, explosion: Date.now() + 3000 });
}

export function explodeBomb(bomb) {
  fires.push({ x: bomb.x, y: bomb.y, duration: Date.now() + 1000 });
  for (let i = 1; i < 3; i++) {
    if (bomb.x + i < size) {
      if (board[bomb.y][bomb.x + i] < 6) {
        fires.push({ x: bomb.x + i, y: bomb.y, duration: Date.now() + 1000 });
      } else {
        break;
      }
    }
  }
  for (let i = 1; i < 3; i++) {
    if (bomb.x - i >= 0) {
      if (board[bomb.y][bomb.x - i] < 6) {
        fires.push({ x: bomb.x - i, y: bomb.y, duration: Date.now() + 1000 });
      } else {
        break;
      }
    }
  }
  for (let i = 1; i < 3; i++) {
    if (bomb.y + i < size) {
      if (board[bomb.y + i][bomb.x] < 6) {
        fires.push({ x: bomb.x, y: bomb.y + i, duration: Date.now() + 1000 });
      } else {
        break;
      }
    }
  }
  for (let i = 1; i < 3; i++) {
    if (bomb.y - i >= 0) {
      if (board[bomb.y - i][bomb.x] < 6) {
        fires.push({ x: bomb.x, y: bomb.y - i, duration: Date.now() + 1000 });
      } else {
        break;
      }
    }
  }
}
