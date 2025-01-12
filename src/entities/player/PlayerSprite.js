import { GAME_CONFIG } from '../../config/gameConfig';

export class PlayerSprite {
    constructor(scene, x, y, scale) {
        this.sprite = scene.add.sprite(x, y, 'run-1')
            .setDepth(12)
            .setScale(scale)
            .setOrigin(0.5, 0.5);
        
        this.sprite.texture.setFilter(Phaser.Textures.LINEAR);
        this.snapToPixel();
    }

    snapToPixel() {
        this.sprite.x = Math.round(this.sprite.x);
        this.sprite.y = Math.round(this.sprite.y);
    }

    playAnimation(key) {
        this.sprite.play(key);
    }

    setY(y) {
        this.sprite.y = y;
        this.snapToPixel();
    }

    getY() {
        return this.sprite.y;
    }

    on(event, callback) {
        this.sprite.on(event, callback);
    }
}