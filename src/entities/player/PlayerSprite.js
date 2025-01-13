import { GAME_CONFIG } from '../../config/gameConfig';

export class PlayerSprite {
    constructor(scene, x, y, scale) {
        this.scene = scene;
        this.scale = scale;
        
        // Create the main sprite
        this.sprite = scene.add.sprite(x, y, 'run-1')
            .setDepth(12)
            .setScale(scale)
            .setOrigin(0.5, 0.5);
            
        this.sprite.texture.setFilter(Phaser.Textures.LINEAR);
        
        // Enable physics on the sprite
        scene.physics.add.existing(this.sprite);
        
        // Configure the hitbox
        this.configureHitbox();
        
        this.snapToPixel();
    }

    configureHitbox() {
        const body = this.sprite.body;
        body.setAllowGravity(false);
        this.updateHitboxForAnimation('run');
        body.setImmovable(true);
    }

    updateHitboxForAnimation(animKey) {
        const body = this.sprite.body;
        const width = this.sprite.width;
        const height = this.sprite.height;
        
        switch(animKey) {
            case 'crouch':
                // Lower and smaller hitbox for crouching
                body.setSize(
                    width * 0.5,
                    height * 0.4
                );
                body.setOffset(
                    width * 0.25,
                    height * 0.55
                );
                break;
                
            case 'jump':
                // Standard hitbox but higher position for jumping
                body.setSize(
                    width * 0.5,
                    height * 0.6
                );
                body.setOffset(
                    width * 0.25,
                    height * 0.2
                );
                break;
                
            default: // 'run'
                // Standard running hitbox
                body.setSize(
                    width * 0.4,
                    height * 0.6
                );
                body.setOffset(
                    width * 0.33,
                    height * 0.34
                );
        }
    }

    snapToPixel() {
        this.sprite.x = Math.round(this.sprite.x);
        this.sprite.y = Math.round(this.sprite.y);
    }

    playAnimation(key) {
        this.sprite.play(key);
        this.updateHitboxForAnimation(key);
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

    getSprite() {
        return this.sprite;
    }
}