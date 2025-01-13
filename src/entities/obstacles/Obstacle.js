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
        try {
            // Get the sprite's display dimensions (accounting for scale)
            const spriteWidth = this.sprite.displayWidth;
            const spriteHeight = this.sprite.displayHeight;
            
            console.log(`[Obstacle] Configuring hitbox for ${this.type}:`, {
                spriteWidth,
                spriteHeight,
                scale: this.sprite.scale
            });
    
            // Define hitbox dimensions based on obstacle type
            let hitboxScale;
            switch(this.type) {
                case OBSTACLE_CONFIG.TYPES.SMALL: // spikes
                    hitboxScale = {
                        width: 0.5,   // 50% of sprite width
                        height: 0.3,  // 30% of sprite height
                        offsetXFactor: 0,
                        offsetYFactor: 0.4  // Reduced from 0.6 for higher position
                    };
                    break;
                    
                case OBSTACLE_CONFIG.TYPES.MEDIUM: // box
                    hitboxScale = {
                        width: 0.38,   // 60% of sprite width
                        height: 0.38,  // 60% of sprite height
                        offsetXFactor: 0.1,
                        offsetYFactor: 0.1   // Reduced from 0.4 for higher position
                    };
                    break;
                    
                case OBSTACLE_CONFIG.TYPES.LARGE: // rock-head
                    hitboxScale = {
                        width: 0.38,  // 55% of sprite width
                        height: 0.38, // 55% of sprite height
                        offsetXFactor: 0.1,
                        offsetYFactor: 0.12   // Reduced from 0.4 for higher position
                    };
                    break;
                    
                default:
                    hitboxScale = {
                        width: 0.1,
                        height: 0.1,
                        offsetXFactor: 0,
                        offsetYFactor: 0
                    };
            }
    
            // Calculate hitbox dimensions
            const hitboxWidth = Math.round(spriteWidth * hitboxScale.width);
            const hitboxHeight = Math.round(spriteHeight * hitboxScale.height);
            
            // Adjust offset calculations:
            // For X: Use a larger divisor to move hitbox more to the left
            // For Y: Use the reduced offsetYFactor to move hitbox up
            const offsetX = Math.round((spriteWidth - hitboxWidth) * hitboxScale.offsetXFactor); // Changed from 2.2 to 2.5
            const offsetY = Math.round((spriteHeight - hitboxHeight) * hitboxScale.offsetYFactor);
    
            // Apply hitbox configuration
            this.sprite.body.setSize(hitboxWidth, hitboxHeight);
            this.sprite.body.setOffset(offsetX, offsetY);
    
            // Debug logging
            console.log(`[Obstacle] Hitbox configured for ${this.type}:`, {
                originalSize: {
                    width: spriteWidth,
                    height: spriteHeight
                },
                hitboxSize: {
                    width: hitboxWidth,
                    height: hitboxHeight
                },
                offset: {
                    x: offsetX,
                    y: offsetY
                },
                finalBodyBounds: {
                    width: this.sprite.body.width,
                    height: this.sprite.body.height,
                    top: this.sprite.body.top,
                    bottom: this.sprite.body.bottom
                }
            });
        } catch (error) {
            console.error(`[Obstacle] Error configuring hitbox for ${this.type}:`, error);
        }
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