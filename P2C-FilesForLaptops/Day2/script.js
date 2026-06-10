// Create references to things we will work with in the script
const scoreBoard = document.querySelector(".scoreBoard");
const startScreen = document.querySelector(".startScreen");
const roadArea = document.querySelector(".roadArea");
const playerCar = document.querySelector(".playerCar");

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

// Event listeners let the game hear about input events from the browser
// Always two parts - what is the event, and what do we do when it happens
startScreen.addEventListener("click", startNewGame);
document.addEventListener("keydown", setKeyPressed);
document.addEventListener("keyup", setKeyReleased);

// Now we define some functions, which are re-usable blocks of code
// Functions should always do exactly what their name says they will do!

function startNewGame() {
  // Remove the start screen by adding "hide" class
  startScreen.classList.add("hide");

  // Clear out any stuff left on the road
  roadArea.innerHTML = "";

  // Set player status to initial state
  playerStatus.gameActive = true;
  playerStatus.score = 0;

  // Loop (repeat) this block of code to make road lines
  const numberOfRoadLines = 10;
  for (let x = 0; x < numberOfRoadLines; x++) {
    let div = document.createElement("div");
    div.classList.add("line");
    div.y = x * 150;
    div.style.top = x * 150 + "px";
    roadArea.appendChild(div);
  }

  // Put the player car on the road
  roadArea.appendChild(playerCar);

  // Set player position
  playerStatus.x = playerCar.offsetLeft;
  playerStatus.y = playerCar.offsetTop;

  // Loop (repeat) this block of code to make enemies
  const numberOfEnemies = 3;
  for (let x = 0; x < numberOfEnemies; x++) {
    let enemy = document.createElement("div");
    enemy.classList.add("enemy");
    enemy.innerHTML = "<br>" + (x + 1);
    enemy.y = (x + 1) * 600 * -1;
    enemy.style.top = enemy.y + "px";
    enemy.style.left = Math.floor(Math.random() * 350) + "px";
    enemy.style.backgroundColor = getRandomColor();
    roadArea.appendChild(enemy);
  }

  // Start the main game loop
  window.requestAnimationFrame(mainGameLoop);
}

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

// This function runs once for every frame of the game
function mainGameLoop() {
  moveLines();
  moveEnemies();
  respondToMovementKeys();

  // If the game is still active, run the game loop again
  if (playerStatus.gameActive) {
    window.requestAnimationFrame(mainGameLoop);
  }
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

    playerStatus.score++;
    scoreBoard.innerText = "Score: " + playerStatus.score;
  }
}

function moveLines() {
  let lines = document.querySelectorAll(".line");
  lines.forEach(function (item) {
    if (item.y >= 1500) {
      item.y -= 1500;
    }
    item.y += playerStatus.speed;
    item.style.top = item.y + "px";
  });
}

function moveEnemies() {
  let car = document.querySelector(".playerCar");
  let ele = document.querySelectorAll(".enemy");
  ele.forEach(function (item) {
    if (checkCollision(car, item)) {
      console.log("HIT");
      endGame();
    }
    if (item.y >= 1500) {
      item.y = -600;
      item.style.left = Math.floor(Math.random() * 350) + "px";
      item.style.backgroundColor = getRandomColor();
    }
    item.y += playerStatus.speed;
    item.style.top = item.y + "px";
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
  scoreBoard.innerHTML = "Game Over<br>Score was " + playerStatus.score;
  startScreen.classList.remove("hide");
}
