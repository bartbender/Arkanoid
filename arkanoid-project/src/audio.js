class AudioManager {
    constructor() {
        this.sounds = {
            brickHit: new Audio('./assets/brick_hit.wav'),
            brickBreak: new Audio('./assets/brick_break.wav'),
            explosion: new Audio('./assets/explosion2.wav'),
            paddleHit: new Audio('./assets/paddle_hit.wav'),
            wallHit: new Audio('./assets/wall_hit.wav'),
            gameOver: new Audio('./assets/game_over.wav'),
            levelComplete: new Audio('./assets/level_complete.wav'),
        };
    }

    play(sound) {
        if (this.sounds[sound]) {
            this.sounds[sound].currentTime = 0; // Reiniciar el sonido si ya se está reproduciendo
            this.sounds[sound].play();
        }
    }
}

export default AudioManager;