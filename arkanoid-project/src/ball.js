class Ball {
    constructor(x, y, radius, dx, dy, audioManager) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx * 1.5;
        this.dy = dy * 1.5;
        this.audioManager = audioManager;
        this.paused = true; // Estado de pausa
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = "#0095DD";
        context.fill();
        context.closePath();
    }

    update(gameArea, bricks, paddle, handleBrickHit, handleBallOutOfBounds) {
        if (this.paused) return; // No actualizar si está en pausa

        this.x += this.dx;
        this.y += this.dy;

        // Rebotar en los bordes del área de juego
        if (this.x + this.radius > gameArea.x + gameArea.width || this.x - this.radius < gameArea.x) {
            this.dx = -this.dx;
            this.audioManager.play('wallHit');
        }
        if (this.y - this.radius < gameArea.y) {
            this.dy = -this.dy;
            this.audioManager.play('wallHit');
        } else if (this.y + this.radius > gameArea.y + gameArea.height) {
            handleBallOutOfBounds();
        }

        // Detectar colisiones con los ladrillos
        bricks.forEach(brick => {
            if (brick.hits > 0 && this.x > brick.x && this.x < brick.x + brick.width && this.y > brick.y && this.y < brick.y + brick.height) {
                this.dy = -this.dy;
                brick.hit();
                if (brick.hits > 0) {
                    this.audioManager.play('brickHit');
                } else {
                    this.audioManager.play('brickBreak');
                    handleBrickHit();
                }
            }
        });

        // Detectar colisiones con el paddle
        if (this.y + this.radius > paddle.y && this.x > paddle.x && this.x < paddle.x + paddle.width) {
            this.dy = -this.dy;
            this.audioManager.play('paddleHit');
        }
    }

    reset(paddle) {
        this.x = paddle.x + paddle.width / 2;
        this.y = paddle.y - this.radius;
        this.dx = 2;
        this.dy = -2;
        this.paused = true;
    }

    start() {
        this.paused = false;
    }
}

export default Ball;