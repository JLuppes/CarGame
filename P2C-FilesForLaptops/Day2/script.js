///////////////////////////////
//// OBJECT REFERENCE SECTION
///////////////////////////////

// Create references to things we will work with in the script
const scoreBoard = document.querySelector(".scoreBoard");
const startScreen = document.querySelector(".startScreen");
const roadArea = document.querySelector(".roadArea");
const playerCar = document.querySelector(".playerCar");
const body = document.querySelector("body");

// Create "objects" which can hold information about things in our game
let playerStatus = {
  speed: 10,
  score: 0,
  gameActive: false,
};
let stateOfKeys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
};

///////////////////////////////
//// EVENT LISTENERS SECTION
///////////////////////////////

// Event listeners let the game hear about input events from the browser
// Always two parts - what is the event, and what do we do when it happens
startScreen.addEventListener("click", startNewGame);
document.addEventListener("keydown", setKeyPressed);
document.addEventListener("keyup", setKeyReleased);

///////////////////////////////
//// GAME LOOP SECTION
///////////////////////////////

// Now we define some functions, which are re-usable blocks of code
// Functions should always do exactly what their name says they will do!

function startNewGame() {
  // Remove the start screen by adding "hide" class
  startScreen.classList.add("hide");
  setUpRoad();
  setUpPlayer();
  mainGameLoop();
}

// This function runs once for every frame of the game
function mainGameLoop() {
  addScore();
  moveLines();
  moveEnemies();
  respondToMovementKeys();
  loopGame();
}

function loopGame() {
  // If the game is still active, run the game loop again
  if (playerStatus.gameActive) {
    window.requestAnimationFrame(mainGameLoop);
  }
}

///////////////////////////////
//// SETUP SECTION
///////////////////////////////

function setUpRoad() {
  // Clear out any stuff left on the road
  roadArea.innerHTML = "";

  // Create some road lines and enemies
  createRoadLines(10);
  createEnemies(3);
}

function setUpPlayer() {
  // Set player status to initial state
  playerStatus.gameActive = true;
  playerStatus.score = 0;

  // Set player position
  playerStatus.x = playerCar.offsetLeft;
  playerStatus.y = playerCar.offsetTop;

  // Put the player car on the road
  roadArea.appendChild(playerCar);
}

function createRoadLines(numberOfRoadLines) {
  const roadAreaBoundaries = roadArea.getBoundingClientRect();
  // Loop (repeat) this block of code to make road lines
  for (let x = 0; x < numberOfRoadLines; x++) {
    const newRoadLine = document.createElement("div");
    newRoadLine.classList.add("line");
    newRoadLineBoundaries = newRoadLine.getBoundingClientRect();
    newRoadLine.style.marginLeft =
      (roadAreaBoundaries.width - newRoadLineBoundaries.width) / 2;
    newRoadLine.y = x * 150;
    newRoadLine.style.top = x * 150 + "px";
    roadArea.appendChild(newRoadLine);
  }
}

function createEnemies(numberOfEnemies) {
  roadAreaBoundaries = roadArea.getBoundingClientRect();
  // Loop (repeat) this block of code to make enemies
  for (let x = 0; x < numberOfEnemies; x++) {
    let newEnemy = document.createElement("div");
    newEnemy.classList.add("enemy");
    newEnemyBoundaries = newEnemy.getBoundingClientRect();
    newEnemy.innerHTML = "<br>" + (x + 1);
    newEnemy.y = (x + 3) * 600 * -1;
    newEnemy.style.top = newEnemy.y + "px";
    newEnemy.style.left =
      Math.floor(
        Math.random() * (roadAreaBoundaries.width - newEnemyBoundaries.width),
      ) + "px";
    newEnemy.style.backgroundColor = getRandomColor();
    roadArea.appendChild(newEnemy);
  }
}

///////////////////////////////
//// PLAYER INPUT SECTION
///////////////////////////////

function setKeyPressed(e) {
  e.preventDefault();
  stateOfKeys[e.key] = true;
  console.log(stateOfKeys);
}

function setKeyReleased(e) {
  e.preventDefault();
  stateOfKeys[e.key] = false;
  console.log(stateOfKeys);
}

function respondToMovementKeys() {
  // Get a rectangle that represents the edges of the road
  let roadBoundaries = roadArea.getBoundingClientRect();

  // Check if the game has started
  if (playerStatus.gameActive) {
    // Check if the player is not at the top edge of the road boundaries
    const canMoveUp = playerStatus.y > roadBoundaries.top;

    // Only move the player if the key is pressed and they are allowed to move
    if (stateOfKeys.ArrowUp && canMoveUp) {
      // Since the player is pressing up and they are allowed to move, change their position!
      playerStatus.y -= playerStatus.speed;
    }

    // Do the same for each of the other keys
    const canMoveDown = playerStatus.y < roadBoundaries.bottom;
    if (stateOfKeys.ArrowDown && canMoveDown) {
      playerStatus.y += playerStatus.speed;
    }

    const canMoveLeft = playerStatus.x > 0;
    if (stateOfKeys.ArrowLeft && canMoveLeft) {
      playerStatus.x -= playerStatus.speed;
    }

    const canMoveRight = playerStatus.x < roadBoundaries.width - 50;
    if (stateOfKeys.ArrowRight && canMoveRight) {
      playerStatus.x += playerStatus.speed;
    }

    // Move the player's car graphic to their new position
    playerCar.style.left = playerStatus.x + "px";
    playerCar.style.top = playerStatus.y + "px";
  }
}

///////////////////////////////
//// GAME LOGIC SECTION
///////////////////////////////

function addScore() {
  playerStatus.score += playerStatus.speed / 10;
  playerStatus.score = roundNumber(playerStatus.score);
  scoreBoard.innerText =
    "Score: " + playerStatus.score + "\nSpeed: " + playerStatus.speed;
}

function roundNumber(num) {
  return Math.round(num * 10) / 10;
}

function moveLines() {
  let lines = document.querySelectorAll(".line");
  lines.forEach(function (line) {
    if (line.y >= 1500) {
      line.y -= 1500;
    }
    line.y += playerStatus.speed;
    line.style.top = line.y + "px";
  });
}

function moveEnemies() {
  let enemies = document.querySelectorAll(".enemy");
  enemies.forEach(function (enemyCar) {
    if (checkCollision(playerCar, enemyCar)) {
      console.log("PLAYER CRASHED");
      endGame();
    }
    if (enemyCar.y >= 1500) {
      roadAreaBoundaries = roadArea.getBoundingClientRect();
      enemyCarBoundaries = enemyCar.getBoundingClientRect();
      enemyCar.y = -1 * window.innerHeight;
      console.log(roadArea.style.width);
      enemyCar.style.left =
        Math.floor(
          Math.random() * (roadAreaBoundaries.width - enemyCarBoundaries.width),
        ) + "px";
      enemyCar.style.backgroundColor = getRandomColor();
    }
    enemyCar.y += playerStatus.speed;
    enemyCar.style.top = enemyCar.y + "px";
  });
}

function getRandomColor() {
  function c() {
    let hex = Math.floor(Math.random() * 256).toString(16);
    return ("0" + String(hex)).substr(-2);
  }
  return "#" + c() + c() + c();
}

function checkCollision(firstItem, secondItem) {
  let firstRect = firstItem.getBoundingClientRect();
  let secondRect = secondItem.getBoundingClientRect();
  return !(
    firstRect.bottom < secondRect.top ||
    firstRect.top > secondRect.bottom ||
    firstRect.right < secondRect.left ||
    firstRect.left > secondRect.right
  );
}

function endGame() {
  playerStatus.gameActive = false;
  scoreBoard.innerHTML =
    "Game Over<br>Final Score: " +
    playerStatus.score +
    "\nFinal Speed: " +
    playerStatus.speed;
  startScreen.classList.remove("hide");
}
