class Paddle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.moveRight = false;
        this.moveLeft = false;
    }

    /**
     * Dibuja un rectángulo en un contexto de canvas.
     *
     *    1.-Inicia un nuevo camino de dibujo en el contexto.
     *    2.-Dibuja un rectángulo en las coordenadas especificadas con las dimensiones dadas.
     *    3.-Establece el color de relleno del rectángulo.
     *    4.-Rellena el rectángulo con el color especificado.
     *    5.-Cierra el camino de dibujo.
     * 
     * @param {CanvasRenderingContext2D} context El contexto de canvas en el cual se dibujará el rectángulo.
     * @throws {TypeError} Si el contexto no es una instancia de CanvasRenderingContext2D.
     * @example
     *   Ejemplo de uso:
     * const canvas = document.getElementById('myCanvas');
     * const context = canvas.getContext('2d');
     * const rect = new Rectangle(10, 10, 100, 50);
     * rect.draw(context);
     */
    draw(context) {
        context.beginPath();
        context.rect(this.x, this.y, this.width, this.height);
        context.fillStyle = "#0095DD";
        context.fill();
        context.closePath();
    }

    /**
     * Actualiza la posición del objeto en el área de juego.
     *
     *    1.- Si la propiedad `moveRight` es verdadera y la posición actual en el eje x es menor que el límite derecho del área de juego, incrementa la posición en x en 7 unidades.
     *    2.- Si la propiedad `moveLeft` es verdadera y la posición actual en el eje x es mayor que el límite izquierdo del área de juego, decrementa la posición en x en 7 unidades.
     *
     * @param {Object} gameArea - El área de juego que contiene las dimensiones y posición del área de juego.
     * @param {number} gameArea.x - La posición en el eje x del área de juego.
     * @param {number} gameArea.width - El ancho del área de juego.
     * @throws {Error} Si el objeto se mueve fuera de los límites del área de juego.
     * @example
     *   Ejemplo de uso:
     *   const gameArea = { x: 0, width: 800 };
     *   objeto.moveRight = true;
     *   objeto.update(gameArea); // Mueve el objeto 7 unidades a la derecha si es posible.
     */
    update(gameArea) {
        if (this.moveRight && this.x < gameArea.x + gameArea.width - this.width) {
            this.x += 7;
        } else if (this.moveLeft && this.x > gameArea.x) {
            this.x -= 7;
        }
    }
}

export default Paddle;