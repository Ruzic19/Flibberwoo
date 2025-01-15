// src/entities/obstacles/Obstacle.js
import { ObstacleHitbox } from './components/ObstacleHitbox';
import { ObstaclePhysics } from './components/ObstaclePhysics';
import { ObstacleState } from './ObstacleState';
import { OBSTACLE_CONFIG } from '../../config/obstacleConfig';

export class Obstacle {
    constructor(scene, type) {
        this.scene = scene;
        this.type = type;
        this.debug = true;
        
        if (this.debug) {
            console.log(`[Obstacle] Creating new obstacle of type: ${type}`);
        }

        this.sprite = this.createSprite();
        this.hitbox = new ObstacleHitbox(this.sprite, type);
        this.physics = new ObstaclePhysics(this.sprite, scene);
        this.state = new ObstacleState();
        
        this.initialize();
    }

    createSprite() {
        const sprite = this.scene.add.sprite(0, 0, this.type)
            .setOrigin(0.5)
            .setDepth(10)
            .setScale(this.getScaleForType(this.type));
            
        // Enable physics on the sprite
        this.scene.physics.add.existing(sprite, false);
        
        // Configure physics body
        sprite.body.setAllowGravity(false);
        sprite.body.setImmovable(true);
        
        if (this.debug) {
            console.log(`[Obstacle] Sprite created with dimensions:`, {
                width: sprite.width,
                height: sprite.height,
                scale: sprite.scale,
                displayWidth: sprite.displayWidth,
                displayHeight: sprite.displayHeight,
                body: sprite.body ? 'exists' : 'missing'
            });
        }

        return sprite;
    }

    initialize() {
        this.physics.initialize();
        this.hitbox.configure();
        this.disable();
    }

    enable(x, y, velocity) {
        if (this.debug) {
            console.log(`[Obstacle] Enabling at position:`, { x, y, velocity });
        }

        this.state.activate(x, y, velocity);
        this.sprite.setActive(true).setVisible(true);
        this.sprite.setPosition(x, y);
        
        // Ensure physics body is enabled and properly configured
        this.sprite.body.enable = true;
        this.sprite.body.setVelocityX(-velocity);
        
        if (this.debug) {
            console.log(`[Obstacle] Physics body status:`, {
                enabled: this.sprite.body.enable,
                velocity: this.sprite.body.velocity.x,
                position: { x: this.sprite.x, y: this.sprite.y }
            });
        }
    }

    disable() {
        if (this.debug) {
            console.log(`[Obstacle] Disabling obstacle of type: ${this.type}`);
        }

        this.state.deactivate();
        this.sprite.setActive(false).setVisible(false);
        
        // Disable physics body when not in use
        if (this.sprite.body) {
            this.sprite.body.enable = false;
            this.sprite.body.setVelocity(0, 0);
        }
    }

    update() {
        if (this.sprite.active && this.sprite.x < -100) {
            this.disable();
        }
    }

    getSprite() {
        return this.sprite;
    }

    isActive() {
        return this.state.isActive();
    }

    getScaleForType(type) {
        const scale = OBSTACLE_CONFIG.SCALE[this.getTypeName(type)] || 1;
        if (this.debug) {
            console.log(`[Obstacle] Scale for ${type}: ${scale}`);
        }
        return scale;
    }

    getTypeName(type) {
        const entry = Object.entries(OBSTACLE_CONFIG.TYPES)
            .find(([key, value]) => value === type);
        return entry ? entry[0] : 'UNKNOWN';
    }
}