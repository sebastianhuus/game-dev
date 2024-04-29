import { actions, addPlayer, initBoard, playerActionQueued, populatePlayers, queueAction, resetAgents, resetBnF, setPlayerActionQueued } from "./game-state.js";

export var isGametime = false;

function initStartStop() {
  document.querySelector("#startStop").innerHTML = "Start";
  document.querySelector("#startStop").addEventListener("click", (e) => {
    isGametime = !isGametime;
    if (isGametime) {
        initBoard();
        populatePlayers();
      e.target.innerHTML = "Stop";
    } else {
      e.target.innerHTML = "Start";
    }
    e.preventDefault();
  });
}

function initReset() {
  document.querySelector("#reset").innerHTML = "Reset";
  document.querySelector("#reset").addEventListener("click", () => {
    initBoard();
    resetAgents();
    document.querySelector("#startStop").innerHTML = "Start";
    isGametime=false;
    resetBnF();
  });
}

function initPlayerButton() {
  document.querySelector("#player").innerHTML = "Add player";
  document.querySelector("#player").addEventListener("click", () => {
    addPlayer(true);
  });
}

function initAiButton() {
  document.querySelector("#ai").innerHTML = "Add AI";
  document.querySelector("#ai").addEventListener("click", () => {
    addPlayer(false);
  });
}

export function initHumanControls() {
    document.onkeydown = ev => {
        console.log(ev);
        if (playerActionQueued) return;
        if (ev.key=='ArrowLeft'){
            queueAction(1, actions.left);
        } else if (ev.key=='ArrowRight'){
            queueAction(1, actions.right);
        } else if (ev.key=='ArrowUp'){
            queueAction(1, actions.up);
        } else if (ev.key=='ArrowDown'){
            queueAction(1, actions.down);
        } else if (ev.key==' '){
            queueAction(1, actions.bomb);
        }
        setPlayerActionQueued(true);
    };
}

export function setUp() {
  initBoard();
  initStartStop();
  initReset();
  initPlayerButton();
  initAiButton();
}
