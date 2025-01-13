import { ObstacleHitbox } from './components/ObstacleHitbox';
import { ObstaclePhysics } from './components/ObstaclePhysics';
import { ObstacleState } from './ObstacleState';
import { OBSTACLE_CONFIG } from '../../config/obstacleConfig';

export class Obstacle {
    constructor(scene, type) {
        this.scene = scene;
        this.type = type;
        this.debug = false;
        
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
            
        if (this.debug) {
            console.log(`[Obstacle] Sprite created with dimensions:`, {
                width: sprite.width,
                height: sprite.height,
                scale: sprite.scale,
                displayWidth: sprite.displayWidth,
                displayHeight: sprite.displayHeight
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
        this.sprite.setActive(true);
        this.sprite.setVisible(true);
        this.sprite.setPosition(x, y);
        this.physics.enable();
        this.physics.setVelocity(-velocity);
    }

    disable() {
        if (this.debug) {
            console.log(`[Obstacle] Disabling obstacle of type: ${this.type}`);
        }

        this.state.deactivate();
        this.sprite.setActive(false);
        this.sprite.setVisible(false);
        this.physics.disable();
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