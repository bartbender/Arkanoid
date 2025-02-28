import Ball from './ball.js';
import Paddle from './paddle.js';
import Brick from './brick.js';
import AudioManager from './audio.js';

let canvas = document.getElementById('gameCanvas');
let context = canvas.getContext('2d');
let ball, paddle, bricks = [];
const audioManager = new AudioManager();
const gameArea = {
    width: 800,
    height: 600,
    x: 0,
    y: 0
};
let lives = 3;
let points = 0;

function init() {
    resizeCanvas(); // Establecer el tamaño inicial del canvas
    ball = new Ball(gameArea.x + gameArea.width / 2, gameArea.y + gameArea.height - 30, 10, 2, -2, audioManager);
    paddle = new Paddle(gameArea.x + (gameArea.width - 75) / 2, gameArea.y + gameArea.height - 10, 75, 10);
    createBricks(); // Crear los ladrillos
    document.addEventListener('mousemove', mouseMoveHandler, false);
    document.addEventListener('click', mouseClickHandler, false);
    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);
    window.addEventListener('resize', resizeCanvas); // Ajustar el canvas cuando se redimensiona la ventana

    // Añadir eventos de touch
    canvas.addEventListener('touchstart', touchStartHandler, false);
    canvas.addEventListener('touchmove', touchMoveHandler, false);
    canvas.addEventListener('touchend', touchEndHandler, false);

    // Usar requestAnimationFrame en lugar de setInterval
    function gameLoop() {
        draw();
        requestAnimationFrame(gameLoop);
    }
    gameLoop();
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gameArea.x = (canvas.width - gameArea.width) / 2;
    gameArea.y = (canvas.height - gameArea.height) / 2;
}

function createBricks() {
    const rowCount = 5;
    const columnCount = 8;
    const brickWidth = 75;
    const brickHeight = 20;
    const padding = 10;
    const offsetTop = 30;
    const offsetLeft = 30;

    for (let row = 0; row < rowCount; row++) {
        for (let col = 0; col < columnCount; col++) {
            const x = gameArea.x + col * (brickWidth + padding) + offsetLeft;
            const y = gameArea.y + row * (brickHeight + padding) + offsetTop;
            const hits = Math.floor(Math.random() * 5) + 1; // Puntos de impacto aleatorios entre 1 y 5
            bricks.push(new Brick(x, y, brickWidth, brickHeight, hits));
        }
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawGameAreaBorder();
    drawLives();
    drawPoints();
    ball.draw(context);
    paddle.draw(context);
    paddle.update(gameArea);
    bricks.forEach(brick => brick.draw(context));
    ball.update(gameArea, bricks, paddle, handleBrickHit, handleBallOutOfBounds);
}

function drawGameAreaBorder() {
    context.strokeStyle = '#0000FF'; // Color azul eléctrico
    context.lineWidth = 5;
    context.strokeRect(gameArea.x, gameArea.y, gameArea.width, gameArea.height);
}

function drawLives() {
    context.font = "16px Arial";
    context.fillStyle = "#0095DD";
    context.fillText("Vidas: " + lives, 8, 20);
}

function drawPoints() {
    context.font = "16px Arial";
    context.fillStyle = "#0095DD";
    context.fillText("Puntos: " + points, canvas.width - 100, 20);
}

function handleBrickHit() {
    points += 25;
    if (bricks.every(brick => brick.hits <= 0)) {
        audioManager.play('levelComplete');
        setTimeout(() => {
            createBricks();
            ball.reset(paddle);
        }, 3000);
    }
}

function handleBallOutOfBounds() {
    lives--;
    audioManager.play('explosion');
    if (lives <= 0) {
        audioManager.play('gameOver');
        alert("Game Over! Puntos: " + points);
        document.location.reload();
    } else {
        ball.reset(paddle);
        document.addEventListener('keydown', startBall, { once: true });
        document.addEventListener('click', startBall, { once: true });
        document.addEventListener('touchstart', startBall, { once: true });
    }
}

function startBall() {
    ball.start();
}

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > gameArea.x && relativeX < gameArea.x + gameArea.width) {
        paddle.x = relativeX - paddle.width / 2;
    }
}

function mouseClickHandler(e) {
    if (ball.paused) {
        startBall();
    }
}

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.moveRight = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.moveLeft = true;
    } else if (e.key === ' ' && ball.paused) {
        startBall();
    } else if (e.key === 'Enter' && lives <= 0) {
        document.location.reload();
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.moveRight = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.moveLeft = false;
    }
}

// Manejadores de eventos touch
function touchStartHandler(e) {
    e.preventDefault();
    let touch = e.touches[0];
    let relativeX = touch.clientX - canvas.offsetLeft;
    if (relativeX > gameArea.x && relativeX < gameArea.x + gameArea.width) {
        paddle.x = relativeX - paddle.width / 2;
    }
    if (ball.paused) {
        startBall();
    }
}

function touchMoveHandler(e) {
    e.preventDefault();
    let touch = e.touches[0];
    let relativeX = touch.clientX - canvas.offsetLeft;
    if (relativeX > gameArea.x && relativeX < gameArea.x + gameArea.width) {
        paddle.x = relativeX - paddle.width / 2;
    }
}

function touchEndHandler(e) {
    e.preventDefault();
    // Lógica para manejar el final del touch si es necesario
}

init();
