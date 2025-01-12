import { OBSTACLE_CONFIG } from '../../config/obstacleConfig';

export class Obstacle {
    constructor(scene, type) {
        this.scene = scene;
        this.type = type;
        this.debug = true;
        
        this.debugLog(`Creating new obstacle of type: ${type}`);
        
        // Create sprite
        this.sprite = scene.add.sprite(0, 0, type)
            .setOrigin(0.5)
            .setDepth(10)
            .setScale(this.getScaleForType(type));
            
        this.debugLog('Sprite created');
            
        // Enable physics
        scene.physics.add.existing(this.sprite);
        this.sprite.body.setAllowGravity(false);
        
        // Adjust hitbox size based on sprite dimensions
        const width = this.sprite.width * this.sprite.scaleX;
        const height = this.sprite.height * this.sprite.scaleY;
        this.sprite.body.setSize(width * 0.8, height * 0.8);
        
        this.debugLog('Physics body created with dimensions:', {
            width: this.sprite.body.width,
            height: this.sprite.body.height
        });
        
        // Hide initially
        this.disable();
    }

    debugLog(message, data = null) {
        if (this.debug) {
            console.log(`[Obstacle:${this.type}] ${message}`, data || '');
        }
    }

    getScaleForType(type) {
        const scale = OBSTACLE_CONFIG.SCALE[this.getTypeName(type)] || 1;
        this.debugLog(`Scale for type ${type}: ${scale}`);
        return scale;
    }

    getTypeName(type) {
        const entry = Object.entries(OBSTACLE_CONFIG.TYPES)
            .find(([key, value]) => value === type);
        return entry ? entry[0] : 'UNKNOWN';
    }

    enable(x, y, velocity) {
        this.debugLog('Enabling obstacle', { x, y, velocity });
        this.sprite.setActive(true);
        this.sprite.setVisible(true);
        this.sprite.setPosition(x, y);
        this.sprite.body.setEnable(true);
        this.sprite.body.setVelocityX(-velocity);
    }

    disable() {
        this.debugLog('Disabling obstacle');
        this.sprite.setActive(false);
        this.sprite.setVisible(false);
        if (this.sprite.body) {
            this.sprite.body.setEnable(false);
        }
    }

    update() {
        if (this.sprite.active && this.sprite.x < -100) {
            this.debugLog('Obstacle moved off screen, disabling');
            this.disable();
        }
    }

    getSprite() {
        return this.sprite;
    }

    isActive() {
        return this.sprite.active;
    }
}