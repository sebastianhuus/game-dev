import {
  getBoard,
  tileTypes,
  getBombs,
  getFires,
  getPlayers,
} from "./game-state.js";

const canvas = document.getElementById("gameCanvas");
canvas.height = 1000;
canvas.width = 1000;

const tileSize = 1000 / 15;
const ctx = canvas.getContext("2d");

const grass = new Image();
grass.src = "img/tile_grass.png";

const wall = new Image();
wall.src = "img/tile_wall.png";

const wood = new Image();
wood.src = "img/tile_wood.png";

const bombImage = new Image();
bombImage.src = "img/bomb.png";

const fireImage = new Image();
fireImage.src = "img/fire.png";

function drawTile(pos, type) {
  const playerColors = {
    1: "#ff0000",
    2: "#0000ff",
    3: "#00ff00",
    4: "#ff00ff",
  };
  if (type < 5) {
    ctx.drawImage(
      grass,
      pos.x * tileSize,
      pos.y * tileSize,
      tileSize,
      tileSize
    );
  } else if (type === tileTypes.stone) {
    ctx.drawImage(wall, pos.x * tileSize, pos.y * tileSize, tileSize, tileSize);
  } else if (type === tileTypes.wood) {
    ctx.drawImage(wood, pos.x * tileSize, pos.y * tileSize, tileSize, tileSize);
  }
  if (type < 5 && type > 0) {
    const player = getPlayers().find((p) => p.id === type);
    if (player?.isAlive) {
      ctx.fillStyle = playerColors[type];
      ctx.fillRect(pos.x * tileSize, pos.y * tileSize, tileSize, tileSize);
    }
  }
}

export function draw(adjustment_factor) {
  // fill background with img/grass.jpg

  ctx.drawImage(grass, 0, 0, canvas.width, canvas.height);
  //ctx.fillStyle = "#000000";
  //ctx.fillRect(0, 0, canvas.width, canvas.height);
  const board = getBoard();
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      drawTile({ x: j, y: i }, board[i][j]);
    }
  }
  // draw bombs
  const bombs = getBombs();
  for (let i = 0; i < bombs.length; i++) {
    const bomb = bombs[i];
    ctx.drawImage(
      bombImage,
      bomb.x * tileSize,
      bomb.y * tileSize,
      tileSize,
      tileSize
    );
  }

  // draw fires
  const fire = getFires();
  for (let i = 0; i < fire.length; i++) {
    const f = fire[i];
    ctx.drawImage(
      fireImage,
      f.x * tileSize,
      f.y * tileSize,
      tileSize,
      tileSize
    );
  }
}
