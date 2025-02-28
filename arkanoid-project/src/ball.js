class Ball {
    constructor(x, y, radius, dx, dy, audioManager, speed = 4) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx * speed;
        this.dy = dy * speed;
        this.audioManager = audioManager;
        this.paused = true; // Estado de pausa
        this.speed = speed; // Velocidad de la bola
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
            const hitPosition = (this.x - paddle.x) / paddle.width;
            if (hitPosition < 0.3) {
                this.dx = -Math.abs(this.dx); // Rebota a la izquierda
            } else if (hitPosition > 0.7) {
                this.dx = Math.abs(this.dx); // Rebota a la derecha
            }
            this.dy = -this.dy;
            this.audioManager.play('paddleHit');
        }
    }

    reset(paddle) {
        this.x = paddle.x + paddle.width / 2;
        this.y = paddle.y - this.radius;
        this.dx = this.speed;
        this.dy = -this.speed;
        this.paused = true;
    }

    start() {
        this.paused = false;
    }
}

export default Ball;