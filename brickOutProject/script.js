import { getBricks } from './bricks.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 공 설정
const ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    dx: 2,
    dy: -2,
    radius: 10,
    speed: 3 // 공 속도 조절 변수
};

// 패들 설정
const paddle = {
    width: 100,
    height: 10,
    x: (canvas.width - 75) / 2
};

// 벽돌 설정
export const brickRowCount = 10;
export const brickColumnCount = 20;
export const brickWidth = 35;
export const brickHeight = 20;
export const brickPadding = 3;
export const brickOffsetTop = 30;
export const brickOffsetLeft = 30;

// 게임 상태
let score = 0;
let lives = 10; // 여벌의 목숨
var bricks = [];

// 키보드 이벤트 처리
let rightPressed = false;
let leftPressed = false;

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

export function startGame(modelNumber) {
    bricks = getBricks(modelNumber);
    // Set up the game
    canvas.width = 800;
    canvas.height = 600;

    ball.x = canvas.width / 2;
    ball.y = canvas.height - 30;
    ball.dx = 2;
    ball.dy = -2;
    ball.speed = 3; // 공 속도 설정

    // Set up the initial game state
    score = 0;
    lives = 10;
    stopGame();
    draw();
}

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

// 충돌 감지
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status > 0) {
                // Calculate the edges of the brick
                const brickLeft = b.x;
                const brickRight = b.x + brickWidth;
                const brickTop = b.y;
                const brickBottom = b.y + brickHeight;

                // Check if the ball is outside the brick
                if (ball.x + ball.radius < brickLeft || ball.x - ball.radius > brickRight || ball.y + ball.radius < brickTop || ball.y - ball.radius > brickBottom) {
                    continue;
                }

                // Handle collision
                ball.dy = -ball.dy;
                if (b.status === 1) {
                    b.status = 0;
                    score++;
                } else if (b.status === 2) {
                    b.status--;
                    score += 2;
                } else if (b.status === 3) {
                    b.status = 0;
                    score += 3;
                }

                // Check if all bricks are cleared
                if (score === brickRowCount * brickColumnCount * 6) {
                    alert('clear');
                    document.location.reload();
                }
            }
        }
    }
}
    
// 그리기 함수들
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.moveTo(paddle.x + paddle.height / 2, canvas.height - paddle.height);
    ctx.arcTo(paddle.x + paddle.width, canvas.height - paddle.height, paddle.x + paddle.width, canvas.height, paddle.height / 2);
    ctx.arcTo(paddle.x + paddle.width, canvas.height, paddle.x, canvas.height, paddle.height / 2);
    ctx.arcTo(paddle.x, canvas.height, paddle.x, canvas.height - paddle.height, paddle.height / 2);
    ctx.arcTo(paddle.x, canvas.height - paddle.height, paddle.x + paddle.height / 2, canvas.height - paddle.height, paddle.height / 2);
    ctx.closePath();
    ctx.fillStyle = '#329486';
    ctx.fill();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status > 0) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                if (bricks[c][r].status === 1) {
                    ctx.fillStyle = '#0095DD';
                } else if (bricks[c][r].status === 2) {
                    ctx.fillStyle = '#FF7F50';
                } else if (bricks[c][r].status === 3) {
                    ctx.fillStyle = '#FFD700';
                }
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText('점수: ' + score, 8, 20);
}

function drawLives() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText('목숨: ' + lives, canvas.width - 65, 20);
}

// 메인 그리기 함수
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    // 벽 충돌 감지
    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
    }
    if (ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
    } else if (ball.y + ball.dy > canvas.height - ball.radius) {
        if (ball.x + ball.radius > paddle.x && ball.x - ball.radius < paddle.x + paddle.width && ball.y + ball.radius > canvas.height - paddle.height) {
            // Calculate the collision point on the paddle
            const collisionPoint = ball.x - (paddle.x + paddle.width / 2);
            // Normalize the collision point to a value between -1 and 1
            const normalizedCollisionPoint = collisionPoint / (paddle.width / 2);
            // Calculate the new angle of the ball based on the collision point
            const angle = normalizedCollisionPoint * Math.PI / 3;
            // Update the ball's direction based on the new angle
            ball.dx = ball.speed * Math.sin(angle);
            ball.dy = -ball.speed * Math.cos(angle);
        } else {
            lives--;
            if (!lives) {
                alert('게임 오버');
                document.location.reload();
            } else {
                ball.x = canvas.width / 2;
                ball.y = canvas.height - 30;
                ball.dx = 2;
                ball.dy = -2;
                paddle.x = (canvas.width - paddle.width) / 2;
            }
        }
    }

    // 패들 이동
    if (rightPressed && paddle.x < canvas.width - paddle.width) {
        paddle.x += 7;
    } else if (leftPressed && paddle.x > 0) {
        paddle.x -= 7;
    }

    ball.x += ball.dx * ball.speed;
    ball.y += ball.dy * ball.speed;

    requestAnimationFrame(draw);
}

function stopGame() {
    cancelAnimationFrame(draw);
}