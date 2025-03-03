import Ball from './ball.js';
import Paddle from './paddle.js';
import Brick from './brick.js';
import AudioManager from './audio.js';

document.addEventListener('DOMContentLoaded', () => {
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

    /**
     * Inicializa el juego configurando los elementos principales y los eventos necesarios.
     *
     *    1.- Crea el paddle y la bola con sus posiciones y tamaños iniciales.
     *    2.- Establece el tamaño inicial del canvas.
     *    3.- Crea los ladrillos del juego.
     *    4.- Ajusta la posición del paddle.
     *    5.- Establece la posición inicial de la bola.
     *    6.- Añade los manejadores de eventos para el ratón, teclado y touch.
     *    7.- Inicia el bucle del juego usando requestAnimationFrame.
     * 
     * @throws {Error} Si ocurre algún problema durante la inicialización de los elementos del juego.
     * @example
     *   Ejemplo de uso:
     * init();
     */
    function init() {
        paddle = new Paddle(gameArea.x + (gameArea.width - 75) / 2, gameArea.y + gameArea.height - 10, 75, 10);
        ball = new Ball(gameArea.x + gameArea.width / 2, gameArea.y + gameArea.height - 30, 10, 2, -2, audioManager);

        resizeCanvas(); // Establecer el tamaño inicial del canvas
        createBricks(); // Crear los ladrillos
        adjustPaddlePosition(); // Ajustar la posición del paddle
        ball.reset(paddle); // Establecer la posición inicial de la bola
        document.addEventListener('mousemove', mouseMoveHandler, false);
        document.addEventListener('click', mouseClickHandler, false);
        document.addEventListener('keydown', keyDownHandler, false);
        document.addEventListener('keyup', keyUpHandler, false);
        window.addEventListener('resize', resizeCanvas); // Ajustar el canvas cuando se redimensiona la ventana

        // Añadir eventos de touch
        canvas.addEventListener('touchstart', touchStartHandler, false);
        canvas.addEventListener('touchmove', touchMoveHandler, false);
        canvas.addEventListener('touchend', touchEndHandler, false);

        document.getElementById('toggle-sound').addEventListener('click', () => {
            audioManager.toggleSound();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 's' || e.key === 'S') {
                audioManager.toggleSound();
            }
        });

        // Usar requestAnimationFrame en lugar de setInterval
        function gameLoop() {        
            draw();
            requestAnimationFrame(gameLoop);
        }
        gameLoop();
    }

    /**
     * Redimensiona el canvas y ajusta los elementos del área de juego.
     *
     *    1.- Ajusta el ancho del canvas al ancho de la ventana.
     *    2.- Ajusta la altura del canvas a la altura de la ventana.
     *    3.- Ajusta el ancho del área de juego al 80% del ancho del canvas.
     *    4.- Ajusta la altura del área de juego al 80% de la altura del canvas.
     *    5.- Centra el área de juego dentro del canvas.
     *    6.- Reposiciona los ladrillos al redimensionar el canvas.
     *    7.- Ajusta la posición del paddle.
     * @throws {Error} Si ocurre un error al redimensionar el canvas o ajustar los elementos del área de juego.
     * @example
     *   Ejemplo de uso:
     * resizeCanvas();
     */
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gameArea.width = canvas.width * 0.8; // Ajustar el ancho del área de juego al 80% del ancho del canvas
        gameArea.height = canvas.height * 0.8; // Ajustar la altura del área de juego al 80% de la altura del canvas
        gameArea.x = (canvas.width - gameArea.width) / 2;
        gameArea.y = (canvas.height - gameArea.height) / 2;
        createBricks(); // Reposicionar los ladrillos al redimensionar el canvas
        adjustPaddlePosition(); // Ajustar la posición del paddle
    }

    /**
     * Crea una matriz de ladrillos para el juego.
     *
     *    1.- Inicializa la matriz de ladrillos vacía.
     *    2.- Define las constantes para el número de filas, columnas, padding, y offsets.
     *    3.- Calcula el ancho de los ladrillos basado en el área del juego y el padding.
     *    4.- Itera sobre cada fila y columna para posicionar los ladrillos.
     *    5.- Calcula las coordenadas x e y para cada ladrillo.
     *    6.- Asigna un número aleatorio de puntos de impacto a cada ladrillo.
     *    7.- Crea y agrega cada ladrillo a la matriz de ladrillos.
     *
     * @throws {Error} Si ocurre algún problema al crear los ladrillos.
     * @example
     *   Ejemplo de uso:
     * createBricks();
     */
    function createBricks() {
        bricks = []; // Limpiar los ladrillos existentes
        const rowCount = 5;
        const columnCount = 8;
        const padding = 10;
        const offsetTop = 30;
        const offsetLeft = 30;
        const brickWidth = (gameArea.width - (offsetLeft * 2) - (padding * (columnCount - 1))) / columnCount; // Ajustar el ancho de los ladrillos
        const brickHeight = 20;

        for (let row = 0; row < rowCount; row++) {
            for (let col = 0; col < columnCount; col++) {
                const x = gameArea.x + col * (brickWidth + padding) + offsetLeft;
                const y = gameArea.y + row * (brickHeight + padding) + offsetTop;
                const hits = Math.floor(Math.random() * 5) + 1; // Puntos de impacto aleatorios entre 1 y 5
                bricks.push(new Brick(x, y, brickWidth, brickHeight, hits));
            }
        }
    }

    /**
     * Ajusta la posición del paddle para mantenerlo dentro del área de juego.
     *
     *    1.- Calcula la nueva posición vertical del paddle.
     *    2.- Establece la posición del paddle a 5 píxeles por encima del borde inferior del área de juego.
     *
     * @throws {Error} Si las propiedades `y`, `height` de `gameArea` o `paddle` no están definidas.
     * @example
     *   Ejemplo de uso:
     * adjustPaddlePosition();
     */
    function adjustPaddlePosition() {
        // Ajustar la posición del paddle para que se mantenga dentro del área de juego
        paddle.y = gameArea.y + gameArea.height - paddle.height - 5; // 5 píxeles de margen inferior
    }

    /**
     * Dibuja y actualiza el estado del juego en el canvas.
     *
     *    1.- Limpia el área del canvas.
     *    2.- Dibuja el borde del área de juego.
     *    3.- Dibuja las vidas restantes del jugador.
     *    4.- Dibuja los puntos acumulados por el jugador.
     *    5.- Dibuja la pelota en su posición actual.
     *    6.- Dibuja la paleta en su posición actual.
     *    7.- Actualiza la posición de la paleta.
     *    8.- Dibuja cada ladrillo en su posición actual.
     *    9.- Actualiza la posición de la pelota y maneja las colisiones con los ladrillos, la paleta y los límites del área de juego.
     *
     * @throws {Error} Si ocurre algún problema al dibujar o actualizar los elementos del juego.
     * @example
     *   Ejemplo de uso:
     * draw();
     */
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

    /**
     * Dibuja el borde del área de juego.
     *
     *    1.-Establece el color del borde en azul eléctrico.
     *    2.-Configura el grosor de la línea del borde.
     *    3.-Dibuja un rectángulo alrededor del área de juego utilizando las coordenadas y dimensiones del objeto `gameArea`.
     * 
     * @throws {Error} Si el contexto de dibujo (`context`) o el área de juego (`gameArea`) no están definidos.
     * @example
     *   Ejemplo de uso:
     * drawGameAreaBorder();
     */
    function drawGameAreaBorder() {
        context.strokeStyle = '#0000FF'; // Color azul eléctrico
        context.lineWidth = 5;
        context.strokeRect(gameArea.x, gameArea.y, gameArea.width, gameArea.height);
    }

    /**
     * Dibuja el número de vidas restantes en el canvas.
     *
     *    1.-Configura la fuente del texto a "16px Arial".
     *    2.-Establece el color del texto a "#0095DD".
     *    3.-Dibuja el texto "Vidas: " seguido del número de vidas en la posición (8, 20) del canvas.
     * @param {CanvasRenderingContext2D} context El contexto del canvas donde se dibujará el texto.
     * @param {number} lives El número de vidas restantes que se mostrarán.
     * @example
     *   Ejemplo de uso:
     * drawLives(context, 3); // Dibuja "Vidas: 3" en el canvas.
     */
    function drawLives() {
        context.font = "16px Arial";
        context.fillStyle = "#0095DD";
        context.fillText("Vidas: " + lives, 8, 20);
    }

    /**
     * Dibuja los puntos en el canvas.
     *
     *    1.- Configura la fuente del texto a "16px Arial".
     *    2.- Establece el color de relleno del texto a "#0095DD".
     *    3.- Dibuja el texto de los puntos en la posición especificada del canvas.
     * @throws {Error} Si el contexto del canvas no está definido.
     * @example
     *   Ejemplo de uso:
     * drawPoints();
     */
    function drawPoints() {
        context.font = "16px Arial";
        context.fillStyle = "#0095DD";
        context.fillText("Puntos: " + points, canvas.width - 100, 20);
    }

    /**
     * Maneja el evento de impacto de un ladrillo.
     *
     *    1.- Incrementa los puntos en 25 por cada impacto.
     *    2.- Verifica si todos los ladrillos han sido destruidos (hits <= 0).
     *    3.- Si todos los ladrillos están destruidos, reproduce el sonido de nivel completado.
     *    4.- Después de 3 segundos, crea nuevos ladrillos y reinicia la posición de la pelota.
     * 
     * @throws {Error} Si ocurre un problema al reproducir el sonido o al reiniciar la pelota.
     * @example
     *   Ejemplo de uso:
     * handleBrickHit();
     */
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

    /**
     * Maneja el evento cuando la pelota sale de los límites del campo de juego.
     *
     *    1.- Decrementa el número de vidas.
     *    2.- Reproduce un sonido de explosión.
     *    3.- Si las vidas llegan a cero:
     *        a. Reproduce un sonido de fin de juego.
     *        b. Muestra una alerta con el mensaje "Game Over" y los puntos obtenidos.
     *        c. Recarga la página del documento.
     *    4.- Si aún quedan vidas:
     *        a. Resetea la posición de la pelota en relación al paddle.
     *        b. Añade un evento para iniciar la pelota al presionar una tecla, hacer clic o tocar la pantalla, solo una vez.
     *
     * @throws {Error} Si ocurre algún problema al reproducir los sonidos o al resetear la pelota.
     * @example
     *   Ejemplo de uso:
     * handleBallOutOfBounds();
     */
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

    /**
     * Inicia el movimiento de la pelota.
     *
     *    1.-Llama al método `start` del objeto `ball` para comenzar su movimiento.
     *
     * @throws {Error} Si el objeto `ball` no está definido o no tiene el método `start`.
     * @example
     *   Ejemplo de uso:
     * startBall();
     */
    function startBall() {
        ball.start();
    }

    /**
     * Maneja el evento de movimiento del ratón para actualizar la posición de la paleta.
     *
     *    1.- Calcula la posición relativa del ratón respecto al canvas.
     *    2.- Verifica si la posición relativa está dentro del área del juego.
     *    3.- Actualiza la posición de la paleta en función de la posición del ratón.
     *    4.- Si la pelota está en pausa, la resetea en la posición de la paleta.
     *
     * @param {MouseEvent} e El evento de movimiento del ratón.
     * @property {number} e.clientX La posición X del ratón en la ventana del navegador.
     * @throws {Error} Si el evento del ratón no contiene la propiedad clientX.
     * @example
     *   Ejemplo de uso:
     * document.addEventListener('mousemove', mouseMoveHandler);
     */
    function mouseMoveHandler(e) {
        let relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > gameArea.x && relativeX < gameArea.x + gameArea.width) {
            paddle.x = relativeX - paddle.width / 2;
            if (ball.paused) {
                ball.reset(paddle);
            }
        }
    }

    /**
     * Maneja el evento de clic del ratón.
     *
     *    1.- Verifica si la animación de la pelota está pausada.
     *    2.- Si la animación está pausada, llama a la función `startBall` para iniciar la animación.
     * 
     * @param {MouseEvent} e El evento de clic del ratón.
     * @throws {Error} Si ocurre algún problema al iniciar la animación de la pelota.
     * @example
     *   Ejemplo de uso:
     * document.addEventListener('click', mouseClickHandler);
     */
    function mouseClickHandler(e) {
        if (ball.paused) {
            startBall();
        }
    }

    /**
     * Maneja los eventos de pulsación de teclas para controlar el juego.
     *
     *    1.- Si la tecla presionada es 'Right' o 'ArrowRight', activa el movimiento hacia la derecha del paddle.
     *    2.- Si la tecla presionada es 'Left' o 'ArrowLeft', activa el movimiento hacia la izquierda del paddle.
     *    3.- Si la tecla presionada es la barra espaciadora y la bola está pausada, inicia el movimiento de la bola.
     *    4.- Si la tecla presionada es 'Enter' y no quedan vidas, recarga la página para reiniciar el juego.
     *
     * @param {KeyboardEvent} e El evento de teclado que contiene información sobre la tecla presionada.
     * @throws {Error} Si el objeto `paddle` o `ball` no está definido.
     * @example
     *   Ejemplo de uso:
     * document.addEventListener('keydown', keyDownHandler);
     */
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

    /**
     * Maneja el evento de liberación de una tecla.
     *
     *    1.- Verifica si la tecla liberada es 'Right' o 'ArrowRight'.
     *    2.- Si es así, establece la propiedad `moveRight` del objeto `paddle` a `false`.
     *    3.- Verifica si la tecla liberada es 'Left' o 'ArrowLeft'.
     *    4.- Si es así, establece la propiedad `moveLeft` del objeto `paddle` a `false`.
     * 
     * @param {KeyboardEvent} e El evento de teclado que contiene información sobre la tecla liberada.
     * @throws {TypeError} Si el objeto `paddle` no está definido.
     * @example
     *   Ejemplo de uso:
     * document.addEventListener('keyup', keyUpHandler);
     */
    function keyUpHandler(e) {
        if (e.key === 'Right' || e.key === 'ArrowRight') {
            paddle.moveRight = false;
        } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
            paddle.moveLeft = false;
        }
    }

    // Manejadores de eventos touch
    /**
     * Maneja el evento de inicio de toque en la pantalla táctil.
     *
     *    1.-Previene el comportamiento predeterminado del evento táctil.
     *    2.-Obtiene la primera posición de toque.
     *    3.-Calcula la posición relativa del toque en el eje X respecto al lienzo.
     *    4.-Si la posición relativa está dentro del área del juego, actualiza la posición de la paleta.
     *    5.-Si la bola está en pausa, la reinicia.
     *    6.-Si la bola está en pausa, inicia el movimiento de la bola.
     * 
     * @param {TouchEvent} e El evento de toque que se dispara al tocar la pantalla.
     * @throws {Error} Si el evento de toque no contiene información válida.
     * @example
     *   Ejemplo de uso:
     * document.addEventListener('touchstart', touchStartHandler);
     */
    function touchStartHandler(e) {
        e.preventDefault();
        let touch = e.touches[0];
        let relativeX = touch.clientX - canvas.offsetLeft;
        if (relativeX > gameArea.x && relativeX < gameArea.x + gameArea.width) {
            paddle.x = relativeX - paddle.width / 2;
            if (ball.paused) {
                ball.reset(paddle);
            }
        }
        if (ball.paused) {
            startBall();
        }
    }

    /**
     * Maneja el evento de movimiento táctil para controlar la posición de la paleta.
     *
     *    1.-Previene el comportamiento predeterminado del evento táctil.
     *    2.-Obtiene la posición del primer toque en la pantalla.
     *    3.-Calcula la posición relativa del toque respecto al lienzo.
     *    4.-Si la posición relativa está dentro del área del juego, actualiza la posición de la paleta.
     *    5.-Si la pelota está en pausa, la reinicia en la posición de la paleta.
     *
     * @param {TouchEvent} e El evento de toque que contiene la información del toque.
     * @throws {Error} Si el evento de toque no contiene información válida.
     * @example
     *   Ejemplo de uso:
     * document.addEventListener('touchmove', touchMoveHandler);
     */
    function touchMoveHandler(e) {
        e.preventDefault();
        let touch = e.touches[0];
        let relativeX = touch.clientX - canvas.offsetLeft;
        if (relativeX > gameArea.x && relativeX < gameArea.x + gameArea.width) {
            paddle.x = relativeX - paddle.width / 2;
            if (ball.paused) {
                ball.reset(paddle);
            }
        }
    }

    /**
     * Maneja el evento de finalización de un toque en una pantalla táctil.
     *
     *    1.-Previene el comportamiento predeterminado del evento de toque.
     *    2.-Ejecuta la lógica necesaria para manejar el final del toque.
     * 
     * @param {TouchEvent} e El evento de toque que se está manejando.
     * @throws {Error} Si ocurre algún problema durante el manejo del evento.
     * @example
     *   Ejemplo de uso:
     * element.addEventListener('touchend', touchEndHandler);
     */
    function touchEndHandler(e) {
        e.preventDefault();
        // Lógica para manejar el final del touch si es necesario
    }

    init();
});
