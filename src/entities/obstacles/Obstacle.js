// src/entities/obstacles/Obstacle.js
import { ObstacleHitbox } from './components/ObstacleHitbox';
import { ObstaclePhysics } from './components/ObstaclePhysics';
import { ObstacleState } from './states/ObstacleState';
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

        this.startTime = 0;
        this.initialY = 0;
        this.verticalMovementEnabled = type === OBSTACLE_CONFIG.TYPES.BEE;
        
        this.initialize();
    }

    createSprite() {
        // Initialize sprite off-screen
        const sprite = this.scene.add.sprite(-1000, -1000, this.type)
            .setOrigin(0.5)
            .setDepth(10)
            .setScale(this.getScaleForType(this.type));
            
        // Create animation for bee
        if (this.type === OBSTACLE_CONFIG.TYPES.BEE && !this.scene.anims.exists('bee-fly')) {
            this.scene.anims.create({
                key: 'bee-fly',
                frames: this.scene.anims.generateFrameNumbers(this.type, {
                    start: 0,
                    end: OBSTACLE_CONFIG.ANIMATIONS.BEE.frames - 1
                }),
                frameRate: OBSTACLE_CONFIG.ANIMATIONS.BEE.frameRate,
                repeat: -1
            });
        }
        
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
        
        // Store initial Y position, start time, and random speed for vertical movement
        if (this.verticalMovementEnabled) {
            this.initialY = y;
            this.startTime = this.scene.time.now;
            
            // Assign random vertical speed
            const speedConfig = OBSTACLE_CONFIG.ANIMATIONS.BEE.verticalMovement.speed;
            this.verticalSpeed = Phaser.Math.FloatBetween(speedConfig.min, speedConfig.max);
            
            if (this.debug) {
                console.log(`[Obstacle] Bee spawned with vertical speed:`, this.verticalSpeed);
            }
        }
        
        this.sprite.setPosition(x, y);
        this.sprite.body.enable = true;
        this.sprite.body.setVelocityX(-velocity);
        
        if (this.type === OBSTACLE_CONFIG.TYPES.BEE) {
            this.sprite.play('bee-fly');
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
        
        // Calculate min and max Y positions in pixels
        const minY = screenHeight * config.minY;
        const maxY = screenHeight * config.maxY;
        const amplitude = (maxY - minY) / 2;
        const centerY = minY + amplitude;
        
        // Calculate new Y position using sine wave
        const elapsedTime = this.scene.time.now - this.startTime;
        const newY = centerY + Math.sin(elapsedTime * this.verticalSpeed) * amplitude;
        
        // Update sprite position
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