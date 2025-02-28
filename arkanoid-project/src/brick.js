class Brick {
    constructor(x, y, width, height, hits) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.hits = hits; // Puntos de impacto
        this.isHit = false;
    }

    /**
     * Dibuja un rectángulo en el contexto del canvas si hay impactos.
     *
     *    1.- Verifica si el número de impactos (`hits`) es mayor que 0.
     *    2.- Si hay impactos, inicia un nuevo camino de dibujo en el contexto del canvas.
     *    3.- Dibuja un rectángulo en las coordenadas (`x`, `y`) con las dimensiones (`width`, `height`).
     *    4.- Establece el color de relleno del rectángulo usando el método `getColor()`.
     *    5.- Rellena el rectángulo con el color especificado.
     *    6.- Cierra el camino de dibujo.
     * 
     * @param {CanvasRenderingContext2D} context - El contexto del canvas donde se dibujará el rectángulo.
     * @throws {TypeError} Si el contexto no es una instancia de `CanvasRenderingContext2D`.
     * @example
     *   Ejemplo de uso:
     * const canvas = document.getElementById('myCanvas');
     * const context = canvas.getContext('2d');
     * objeto.draw(context);
     */
    draw(context) {
        if (this.hits > 0) {
            context.beginPath();
            context.rect(this.x, this.y, this.width, this.height);
            context.fillStyle = this.getColor();
            context.fill();
            context.closePath();
        }
    }

    /**
     * Obtiene el color correspondiente basado en el número de aciertos.
     *
     *    1.- Verifica el valor de `this.hits`.
     *    2.- Retorna un color en formato hexadecimal según el número de aciertos.
     *    3.- Si `this.hits` no coincide con ninguno de los casos, retorna blanco por defecto.
     * 
     * @returns {string} El color en formato hexadecimal correspondiente al número de aciertos.
     * @throws {Error} Si `this.hits` no es un número válido.
     * @example
     *   Ejemplo de uso:
     * const color = objeto.getColor(); // Dependiendo del valor de this.hits, color será un valor hexadecimal.
     */
    getColor() {
        switch (this.hits) {
            case 5: return "#FF0000"; // Rojo
            case 4: return "#FF7F00"; // Naranja
            case 3: return "#FFFF00"; // Amarillo
            case 2: return "#7FFF00"; // Verde
            case 1: return "#00FF00"; // Verde claro
            default: return "#FFFFFF"; // Blanco (no debería ocurrir)
        }
    }

    /**
     * Maneja el evento de golpeo en un objeto.
     *
     *    1.- Decrementa el contador de golpes (`hits`).
     *    2.- Verifica si el contador de golpes es menor o igual a cero.
     *    3.- Si el contador de golpes es menor o igual a cero, establece la propiedad `isHit` a `true`.
     * 
     * @throws {Error} Si el contador de golpes (`hits`) no es un número.
     * @example
     *   Ejemplo de uso:
     * objeto.hit();
     */
    hit() {
        this.hits--;
        if (this.hits <= 0) {
            this.isHit = true;
        }
    }
}

export default Brick;