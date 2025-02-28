class Paddle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.moveRight = false;
        this.moveLeft = false;
    }

    draw(context) {
        context.beginPath();
        context.rect(this.x, this.y, this.width, this.height);
        context.fillStyle = "#0095DD";
        context.fill();
        context.closePath();
    }

    update(gameArea) {
        if (this.moveRight && this.x < gameArea.x + gameArea.width - this.width) {
            this.x += 7;
        } else if (this.moveLeft && this.x > gameArea.x) {
            this.x -= 7;
        }
    }
}

export default Paddle;