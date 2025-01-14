// src/entities/player/PlayerSprite.js
import { GAME_CONFIG } from '../../config/gameConfig';
import { PlayerHitbox } from './components/PlayerHitbox';

export class PlayerSprite {
    constructor(scene, x, y, scale) {
        this.scene = scene;
        this.scale = scale;
        this.debug = true;
        
        // Create the main sprite
        this.sprite = scene.add.sprite(x, y, 'run-1')
            .setDepth(12)
            .setScale(scale)
            .setOrigin(0.5, 0.5);
            
        this.sprite.texture.setFilter(Phaser.Textures.LINEAR);
        
        // Enable physics
        scene.physics.add.existing(this.sprite);
        
        // Configure physics body
        const body = this.sprite.body;
        body.setCollideWorldBounds(false);
        body.setAllowGravity(false);
        body.setImmovable(false);
        body.setBounce(0, 0);
        body.setFriction(0, 0);
        
        if (this.debug) {
            console.log('[PlayerSprite] Physics body initialized:', {
                x: this.sprite.x,
                y: this.sprite.y,
                width: body.width,
                height: body.height,
                enabled: body.enable
            });
        }
        
        // Initialize hitbox manager
        this.hitbox = new PlayerHitbox(this.sprite);
        this.hitbox.configure();
        
        this.snapToPixel();
    }

    snapToPixel() {
        this.sprite.x = Math.round(this.sprite.x);
        this.sprite.y = Math.round(this.sprite.y);
    }

    playAnimation(key) {
        this.sprite.play(key);
        this.hitbox.updateForAnimation(key);
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