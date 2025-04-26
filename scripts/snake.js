const game = document.getElementById('game');
const overlay = document.getElementById('overlay');
const cells = [];
let snake = [0];
let direction = 1;
let food = null;
let interval = null;
let running = false;
let justStarted = true;

for (let i = 0; i < 100; i++) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  game.appendChild(cell);
  cells.push(cell);
}

function placeFood() {
  do {
    food = Math.floor(Math.random() * 100);
  } while (snake.includes(food));
  cells[food].classList.add('food');
}

function drawSnake() {
  cells.forEach(c => c.classList.remove('snake'));
  snake.forEach(i => cells[i].classList.add('snake'));
}

function move() {
  const head = snake[snake.length - 1];
  let next = head + direction;

  if (direction === 1 && head % 10 === 9) next = head - 9;
  if (direction === -1 && head % 10 === 0) next = head + 9;
  if (direction === 10 && head >= 90) next = head - 90;
  if (direction === -10 && head < 10) next = head + 90;

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
  justStarted = false;
}

function changeDirection(e) {
  if (!running) return;
  if (e.key === 'ArrowUp' && direction !== 10) direction = -10;
  if (e.key === 'ArrowDown' && direction !== -10) direction = 10;
  if (e.key === 'ArrowLeft' && direction !== 1) direction = -1;
  if (e.key === 'ArrowRight' && direction !== -1) direction = 1;
}

function startGame() {
  snake = [0];
  direction = 1;
  running = true;
  justStarted = true;
  cells.forEach(c => c.classList.remove('snake', 'food'));
  placeFood();
  drawSnake();
  overlay.style.display = 'none';
  clearInterval(interval);
  interval = setInterval(move, 100);
}

function stopGame() {
  running = false;
  clearInterval(interval);
  overlay.style.display = 'block';
}

document.addEventListener('keydown', e => {
  if (!running) {
    startGame();
  } else if (!justStarted) {
    changeDirection(e);
  }
});
