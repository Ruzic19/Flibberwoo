// src/entities/obstacles/Obstacle.js
import { ObstacleHitbox } from './components/ObstacleHitbox';
import { ObstaclePhysics } from './components/ObstaclePhysics';
import { ObstacleState } from './states/ObstacleState';
import { ObstacleAnimations } from './ObstacleAnimations';
import { OBSTACLE_CONFIG } from '../../config/obstacleConfig';

export class Obstacle {
    constructor(scene, type) {
        this.scene = scene;
        this.type = type;
        this.debug = true;
        
        if (this.debug) {
            console.log(`[Obstacle] Creating new obstacle of type: ${type}`);
        }

        // Initialize animations first
        this.animations = new ObstacleAnimations(scene);
        this.animations.create();

        // Then create sprite and other components
        this.sprite = this.createSprite();
        this.hitbox = new ObstacleHitbox(this.sprite, type);
        this.physics = new ObstaclePhysics(this.sprite, scene);
        this.state = new ObstacleState();

        this.startTime = 0;
        this.initialY = 0;
        this.verticalMovementEnabled = type === OBSTACLE_CONFIG.TYPES.BEE;
        
        this.initialize();
    }

    createSprite() {
        const sprite = this.scene.add.sprite(-1000, -1000, this.type)
            .setOrigin(0.5)
            .setDepth(10)
            .setScale(this.getScaleForType(this.type));
            
        // Enable physics on the sprite
        this.scene.physics.add.existing(sprite, false);
        sprite.body.setAllowGravity(false);
        sprite.body.setImmovable(true);
        
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
        
        if (this.verticalMovementEnabled) {
            this.initialY = y;
            this.startTime = this.scene.time.now;
            const speedConfig = OBSTACLE_CONFIG.ANIMATIONS.BEE.verticalMovement.speed;
            this.verticalSpeed = Phaser.Math.FloatBetween(speedConfig.min, speedConfig.max);
            
            // Play bee animation using animation manager
            this.animations.playAnimation(this.sprite, 'bee-fly');
        }
        
        this.sprite.setPosition(x, y);
        this.sprite.body.enable = true;
        this.sprite.body.setVelocityX(-velocity);
    }

    disable() {
        if (this.debug) {
            console.log(`[Obstacle] Disabling obstacle of type: ${this.type}`);
        }

        this.state.deactivate();
        this.sprite.setActive(false).setVisible(false);
        
        if (this.sprite.body) {
            this.sprite.body.enable = false;
            this.sprite.body.setVelocity(0, 0);
        }
    }

    update() {
        if (this.sprite.active) {
            if (this.verticalMovementEnabled) {
                this.updateVerticalPosition();
            }
            
            if (this.sprite.x < -100) {
                this.disable();
            }
        }
    }

    updateVerticalPosition() {
        const config = OBSTACLE_CONFIG.ANIMATIONS.BEE.verticalMovement;
        const screenHeight = this.scene.cameras.main.height;
        
        const minY = screenHeight * config.minY;
        const maxY = screenHeight * config.maxY;
        const amplitude = (maxY - minY) / 2;
        const centerY = minY + amplitude;
        
        const elapsedTime = this.scene.time.now - this.startTime;
        const newY = centerY + Math.sin(elapsedTime * this.verticalSpeed) * amplitude;
        
        this.sprite.setY(newY);
        
        if (this.debug) {
            console.log(`[Obstacle] Bee Y position updated:`, { 
                newY, 
                minY, 
                maxY 
            });
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