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

    /**
     * Dibuja un círculo en el contexto del canvas.
     *
     *    1.-Inicia un nuevo camino de dibujo en el contexto.
     *    2.-Dibuja un arco (círculo) en las coordenadas especificadas con el radio dado.
     *    3.-Establece el color de relleno del círculo.
     *    4.-Rellena el círculo con el color especificado.
     *    5.-Cierra el camino de dibujo.
     * @param {CanvasRenderingContext2D} context El contexto del canvas donde se dibujará el círculo.
     * @example
     *   Ejemplo de uso:
     * const canvas = document.getElementById('myCanvas');
     * const context = canvas.getContext('2d');
     * const circle = new Circle(50, 50, 20);
     * circle.draw(context);
     */
    draw(context) {
        context.save(); // Guardar el estado actual del contexto

        // Crear un gradiente para el efecto de brillo
        let gradient = context.createRadialGradient(this.x, this.y, this.radius / 2, this.x, this.y, this.radius);
        gradient.addColorStop(0, "#41a4e6"); // Blanco para el brillo
        gradient.addColorStop(1, "#0095DD"); // Color de la pelota

        context.fillStyle = gradient;
        context.shadowColor = "rgba(0, 0, 0, 0.5)"; // Color de la sombra
        context.shadowBlur = 10; // Desenfoque de la sombra
        context.shadowOffsetX = 5; // Desplazamiento horizontal de la sombra
        context.shadowOffsetY = 5; // Desplazamiento vertical de la sombra

        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
        context.closePath();

        context.restore(); // Restaurar el estado del contexto
    }

    /**
     * Actualiza la posición de la pelota y maneja las colisiones en el área de juego.
     *
     *    1.- Si el juego está en pausa, no realiza ninguna actualización.
     *    2.- Actualiza la posición de la pelota sumando las velocidades dx y dy a las coordenadas x e y.
     *    3.- Detecta y maneja las colisiones con los bordes del área de juego, invirtiendo la dirección de la pelota y reproduciendo un sonido.
     *    4.- Si la pelota sale por la parte inferior del área de juego, llama a la función handleBallOutOfBounds.
     *    5.- Detecta y maneja las colisiones con los ladrillos, invirtiendo la dirección de la pelota, actualizando el estado del ladrillo y reproduciendo sonidos.
     *    6.- Detecta y maneja las colisiones con el paddle, ajustando la dirección de la pelota según la posición del impacto y reproduciendo un sonido.
     *
     * @param {Object} gameArea - El área de juego con propiedades x, y, width y height.
     * @param {Array} bricks - Array de objetos ladrillo, cada uno con propiedades x, y, width, height y hits.
     * @param {Object} paddle - El paddle con propiedades x, y y width.
     * @param {Function} handleBrickHit - Función a llamar cuando un ladrillo es destruido.
     * @param {Function} handleBallOutOfBounds - Función a llamar cuando la pelota sale del área de juego.
     * @throws {Error} Si alguno de los parámetros es inválido.
     * @example
     *   Ejemplo de uso:
     *   update(gameArea, bricks, paddle, handleBrickHit, handleBallOutOfBounds);
     */
    update(gameArea, bricks, paddle, handleBrickHit, handleBallOutOfBounds) {
        if (this.paused) return; // No actualizar si está en pausa

        this.x += this.dx;
        this.y += this.dy;

        // Rebotar en los bordes del área de juego
        if (this.x + this.radius > gameArea.x + gameArea.width || this.x - this.radius < gameArea.x) {
            this.dx = -this.dx;
            this.x = this.x + this.dx; // Evitar que la pelota se quede atascada en los bordes
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

    /**
     * Restablece la posición y velocidad de la pelota en relación a la paleta.
     *
     *    1.- Establece la posición horizontal de la pelota en el centro de la paleta.
     *    2.- Establece la posición vertical de la pelota justo encima de la paleta.
     *    3.- Inicializa la velocidad horizontal de la pelota.
     *    4.- Inicializa la velocidad vertical de la pelota en dirección hacia arriba.
     *    5.- Pausa el movimiento de la pelota.
     *
     * @param {Object} paddle La paleta con la que se reiniciará la posición de la pelota.
     * @param {number} paddle.x La posición horizontal de la paleta.
     * @param {number} paddle.y La posición vertical de la paleta.
     * @param {number} paddle.width El ancho de la paleta.
     * @returns {void} No retorna ningún valor.
     * @example
     *   Ejemplo de uso:
     * const paddle = { x: 100, y: 200, width: 50 };
     * ball.reset(paddle);
     */
    reset(paddle) {
        this.x = paddle.x + paddle.width / 2;
        this.y = paddle.y - this.radius;
        this.dx = this.speed;
        this.dy = -this.speed;
        this.paused = true;
    }

    /**
     * Inicia el proceso estableciendo el estado de pausa a falso.
     *
     *    1.- Cambia el estado de la propiedad `paused` del objeto a `false`.
     *
     * @returns {void} No retorna ningún valor.
     * @example
     *   Ejemplo de uso:
     *   objeto.start(); // Establece objeto.paused a false
     */
    start() {
        this.paused = false;
    }
}

export default Ball;