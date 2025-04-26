const game = document.getElementById('game');
const overlay = document.getElementById('overlay');
const cells = [];
const gridSize = 16;
let snake = [0];
let direction = 1;
let nextDirection = 1;
let food = null;
let interval = null;
let running = false;

for (let i = 0; i < gridSize * gridSize; i++) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  game.appendChild(cell);
  cells.push(cell);
}

function placeFood() {
  do {
    food = Math.floor(Math.random() * (gridSize * gridSize));
  } while (snake.includes(food));
  cells[food].classList.add('food');
}

function drawSnake() {
  cells.forEach(c => c.classList.remove('snake'));
  snake.forEach(i => cells[i].classList.add('snake'));
}

function move() {
  direction = nextDirection;

  const head = snake[snake.length - 1];
  let next = head + direction;

  if (direction === 1 && (head % gridSize) === gridSize - 1) next = head - (gridSize - 1);
  if (direction === -1 && (head % gridSize) === 0) next = head + (gridSize - 1);
  if (direction === gridSize && head >= (gridSize * (gridSize - 1))) next = head - (gridSize * (gridSize - 1));
  if (direction === -gridSize && head < gridSize) next = head + (gridSize * (gridSize - 1));

  if (snake.includes(next)) {
    stopGame();
    return;
  }

  snake.push(next);

  if (next === food) {
    cells[food].classList.remove('food');
    placeFood();
  } else {
    snake.shift();
  }

  drawSnake();
}

function changeDirection(e) {
  if (!running) return;
  const key = e.key;
  if ((key === 'ArrowUp' || key === 'w') && direction !== gridSize) nextDirection = -gridSize;
  if ((key === 'ArrowDown' || key === 's') && direction !== -gridSize) nextDirection = gridSize;
  if ((key === 'ArrowLeft' || key === 'a') && direction !== 1) nextDirection = -1;
  if ((key === 'ArrowRight' || key === 'd') && direction !== -1) nextDirection = 1;
}

function startGame() {
  snake = [0];
  direction = 1;
  nextDirection = 1;
  running = true;
  cells.forEach(c => c.classList.remove('snake', 'food'));
  placeFood();
  drawSnake();
  overlay.style.display = 'none';
  clearInterval(interval);
  interval = setInterval(move, 64);
}

function stopGame() {
  running = false;
  clearInterval(interval);
  overlay.style.display = 'block';
}

document.addEventListener('keydown', e => {
  if (!running) {
    startGame();
    changeDirection(e);
  } else {
    changeDirection(e);
  }
});