const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const gridSize = 30;
const tileCount = 5;
canvas.width = canvas.height = gridSize * tileCount;

let snake = [
    {x: 1, y: 1},
];
let food = getRandomFood();
let dx = 0;
let dy = 0;
let score = 0;

function getRandomFood() {
    let food;
    do {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount),
        };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
    return food;
}

function drawGame() {
    clearCanvas();
    moveSnake();
    drawSnake();
    drawFood();
    checkCollision();
    updateScore();
}

function clearCanvas() {
    ctx.fillStyle = '#333333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // 격자무늬
    ctx.fillStyle = 'rgb(80, 80, 80)';
    for (let i = 0; i < tileCount; i++) {
        ctx.fillRect(i * gridSize, 0, 1, canvas.height);
        ctx.fillRect(0, i * gridSize, canvas.width, 1);
    }
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    console.log(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = getRandomFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize + 2, segment.y * gridSize + 2, gridSize - 3, gridSize - 3);
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize + 2, food.y * gridSize + 2, gridSize - 3, gridSize - 3);
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        resetGame();
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
    if (score === tileCount ** 2 - 1) {
        resetGame();
    }
}

function resetGame() {
    if (tileCount ** 2 - 1 === score) {
        alert('게임 클리어!');
    } else {
        alert(`게임오버! 점수: ${score}`);
    }
    snake = [{x: 1, y: 1}];
    food = getRandomFood();
    dx = 0;
    dy = 0;
    score = 0;
}

function updateScore() {
    scoreElement.textContent = `score: ${score}`;
}

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -1;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -1;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 1;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 1;
    }
}

function gameLoop() {
    drawGame();
    setTimeout(gameLoop, 200);
}

gameLoop();