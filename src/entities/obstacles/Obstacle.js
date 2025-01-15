import { ObstacleHitbox } from './components/ObstacleHitbox';
import { ObstaclePhysics } from './components/ObstaclePhysics';
import { ObstacleState } from './ObstacleState';
import { OBSTACLE_CONFIG } from '../../config/obstacleConfig';

export class Obstacle {
    constructor(scene, type) {
        this.scene = scene;
        this.type = type;
        this.debug = true;
        
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
            console.log(`[Obstacle] Enabling ${this.type} at:`, { x, y, velocity });
        }

        this.state.activate(x, y, velocity);
        this.sprite.setActive(true).setVisible(true);
        this.sprite.setPosition(x, y);
        this.sprite.body.enable = true;
        this.sprite.body.setVelocityX(-velocity); // Ensure consistent negative velocity
    }

    disable() {
        this.state.deactivate();
        this.sprite.setActive(false).setVisible(false);
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
        return OBSTACLE_CONFIG.SCALE[this.getTypeName(type)] || 1;
    }

    getTypeName(type) {
        const entry = Object.entries(OBSTACLE_CONFIG.TYPES)
            .find(([key, value]) => value === type);
        return entry ? entry[0] : 'UNKNOWN';
    }
}