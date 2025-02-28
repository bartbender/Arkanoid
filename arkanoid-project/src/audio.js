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

    /**
     * Reproduce un sonido específico.
     *
     *    1.- Verifica si el sonido especificado existe en el objeto `sounds`.
     *    2.- Si el sonido existe, reinicia el tiempo de reproducción a 0.
     *    3.- Reproduce el sonido.
     * 
     * @param {string} sound El nombre del sonido a reproducir.
     * @throws {Error} Si el sonido especificado no existe en el objeto `sounds`.
     * @example
     *   Ejemplo de uso:
     *   player.play('alerta'); // Reproduce el sonido 'alerta'
     */
    play(sound) {
        if (this.sounds[sound]) {
            this.sounds[sound].currentTime = 0; // Reiniciar el sonido si ya se está reproduciendo
            this.sounds[sound].play();
        }
    }
}

export default AudioManager;