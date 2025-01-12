import { OBSTACLE_CONFIG } from '../../config/obstacleConfig';

export class Obstacle {
    constructor(scene, type) {
        this.scene = scene;
        this.type = type;
        
        console.log(`[Obstacle] Creating new obstacle of type: ${type}`);

        // Create sprite
        this.sprite = scene.add.sprite(0, 0, type)
            .setOrigin(0.5)
            .setDepth(10)
            .setScale(this.getScaleForType(type));
            
        console.log(`[Obstacle] Sprite created with dimensions:`, {
            width: this.sprite.width,
            height: this.sprite.height,
            scale: this.sprite.scale,
            displayWidth: this.sprite.displayWidth,
            displayHeight: this.sprite.displayHeight
        });

        // Enable physics
        scene.physics.add.existing(this.sprite, false); // false = not static
        this.sprite.body.setAllowGravity(false);
        
        // Configure hitbox
        this.configureHitbox();
        
        // Hide initially
        this.disable();

        // Log physics body state
        console.log(`[Obstacle] Physics body configured:`, {
            width: this.sprite.body.width,
            height: this.sprite.body.height,
            offset: this.sprite.body.offset,
            position: {
                x: this.sprite.body.x,
                y: this.sprite.body.y
            }
        });
    }

    configureHitbox() {
        // Use displayWidth/Height which takes scale into account
        const spriteWidth = this.sprite.displayWidth;
        const spriteHeight = this.sprite.displayHeight;
        
        console.log(`[Obstacle] Configuring hitbox for ${this.type}:`, {
            spriteWidth,
            spriteHeight
        });

        // Make hitbox 80% of the sprite size
        const hitboxWidth = spriteWidth * 0.8;
        const hitboxHeight = spriteHeight * 0.8;
        
        // Calculate offset to center the hitbox
        const offsetX = (spriteWidth - hitboxWidth) / 2;
        const offsetY = (spriteHeight - hitboxHeight) / 2;

        this.sprite.body.setSize(hitboxWidth, hitboxHeight);
        this.sprite.body.setOffset(offsetX, offsetY);

        console.log(`[Obstacle] Final hitbox configuration:`, {
            hitboxWidth,
            hitboxHeight,
            offsetX,
            offsetY,
            finalBodySize: {
                width: this.sprite.body.width,
                height: this.sprite.body.height
            }
        });
    }

    enable(x, y, velocity) {
        console.log(`[Obstacle] Enabling at position:`, { x, y, velocity });
        this.sprite.setActive(true);
        this.sprite.setVisible(true);
        this.sprite.setPosition(x, y);
        this.sprite.body.setEnable(true);
        this.sprite.body.setVelocityX(-velocity);
    }

    disable() {
        console.log(`[Obstacle] Disabling obstacle of type: ${this.type}`);
        this.sprite.setActive(false);
        this.sprite.setVisible(false);
        if (this.sprite.body) {
            this.sprite.body.setEnable(false);
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
        return this.sprite.active;
    }

    getScaleForType(type) {
        const scale = OBSTACLE_CONFIG.SCALE[this.getTypeName(type)] || 1;
        console.log(`[Obstacle] Scale for ${type}: ${scale}`);
        return scale;
    }

    getTypeName(type) {
        const entry = Object.entries(OBSTACLE_CONFIG.TYPES)
            .find(([key, value]) => value === type);
        return entry ? entry[0] : 'UNKNOWN';
    }
}