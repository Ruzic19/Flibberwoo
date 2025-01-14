// src/entities/player/PlayerSprite.js
import { GAME_CONFIG } from '../../config/gameConfig';

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
        
        this.configureHitbox();
        this.snapToPixel();
    }

    configureHitbox() {
        const body = this.sprite.body;
        this.updateHitboxForAnimation('run');
        
        if (this.debug) {
            console.log('[PlayerSprite] Hitbox configured:', {
                width: body.width,
                height: body.height,
                offsetX: body.offset.x,
                offsetY: body.offset.y
            });
        }
    }

    updateHitboxForAnimation(animKey) {
        const body = this.sprite.body;
        const width = this.sprite.width;
        const height = this.sprite.height;
        
        switch(animKey) {
            case 'crouch':
                body.setSize(width * 0.5, height * 0.4);
                body.setOffset(width * 0.25, height * 0.55);
                break;
                
            case 'jump':
                body.setSize(width * 0.5, height * 0.6);
                body.setOffset(width * 0.25, height * 0.2);
                break;
                
            default: // 'run'
                body.setSize(width * 0.35, height * 0.55);
                body.setOffset(width * 0.33, height * 0.36);
        }
        
        if (this.debug) {
            console.log(`[PlayerSprite] Updated hitbox for ${animKey}:`, {
                width: body.width,
                height: body.height,
                offsetX: body.offset.x,
                offsetY: body.offset.y
            });
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