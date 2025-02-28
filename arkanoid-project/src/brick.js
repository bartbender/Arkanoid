class Brick {
    constructor(x, y, width, height, hits) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.hits = hits; // Puntos de impacto
        this.isHit = false;
    }

    draw(context) {
        if (this.hits > 0) {
            context.beginPath();
            context.rect(this.x, this.y, this.width, this.height);
            context.fillStyle = this.getColor();
            context.fill();
            context.closePath();
        }
    }

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

    hit() {
        this.hits--;
        if (this.hits <= 0) {
            this.isHit = true;
        }
    }
}

export default Brick;