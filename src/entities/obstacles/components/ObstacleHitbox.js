import { OBSTACLE_CONFIG } from '../../../config/obstacleConfig';

export class ObstacleHitbox {
    constructor(sprite, type) {
        this.sprite = sprite;
        this.type = type;
        this.debug = false;
    }

    configure() {
        try {
            const spriteWidth = this.sprite.displayWidth;
            const spriteHeight = this.sprite.displayHeight;
            
            if (this.debug) {
                console.log(`[ObstacleHitbox] Configuring hitbox for ${this.type}:`, {
                    spriteWidth,
                    spriteHeight,
                    scale: this.sprite.scale
                });
            }
    
            const hitboxScale = this.getHitboxConfig();
            this.applyHitboxConfiguration(spriteWidth, spriteHeight, hitboxScale);
        } catch (error) {
            console.error(`[ObstacleHitbox] Error configuring hitbox for ${this.type}:`, error);
        }
    }

    getHitboxConfig() {
        switch(this.type) {
            case OBSTACLE_CONFIG.TYPES.SMALL:
                return {
                    width: 0.5,
                    height: 0.3,
                    offsetXFactor: 0,
                    offsetYFactor: 0.4
                };
            case OBSTACLE_CONFIG.TYPES.MEDIUM:
                return {
                    width: 0.38,
                    height: 0.38,
                    offsetXFactor: 0.1,
                    offsetYFactor: 0.1
                };
            case OBSTACLE_CONFIG.TYPES.LARGE:
                return {
                    width: 0.38,
                    height: 0.38,
                    offsetXFactor: 0.1,
                    offsetYFactor: 0.12
                };
            case OBSTACLE_CONFIG.TYPES.BEE:
                return {
                    width: 0.4,    // Adjust these values based on the bee sprite
                    height: 0.4,
                    offsetXFactor: 0.75,
                    offsetYFactor: 0.75
                };
            default:
                return {
                    width: 0.1,
                    height: 0.1,
                    offsetXFactor: 0,
                    offsetYFactor: 0
                };
        }
    }

    applyHitboxConfiguration(spriteWidth, spriteHeight, config) {
        const hitboxWidth = Math.round(spriteWidth * config.width);
        const hitboxHeight = Math.round(spriteHeight * config.height);
        
        const offsetX = Math.round((spriteWidth - hitboxWidth) * config.offsetXFactor);
        const offsetY = Math.round((spriteHeight - hitboxHeight) * config.offsetYFactor);
    
        this.sprite.body.setSize(hitboxWidth, hitboxHeight);
        this.sprite.body.setOffset(offsetX, offsetY);

        if (this.debug) {
            this.logHitboxConfig(spriteWidth, spriteHeight, hitboxWidth, hitboxHeight, offsetX, offsetY);
        }
    }

    logHitboxConfig(spriteWidth, spriteHeight, hitboxWidth, hitboxHeight, offsetX, offsetY) {
        console.log(`[ObstacleHitbox] Hitbox configured for ${this.type}:`, {
            originalSize: { width: spriteWidth, height: spriteHeight },
            hitboxSize: { width: hitboxWidth, height: hitboxHeight },
            offset: { x: offsetX, y: offsetY },
            finalBodyBounds: {
                width: this.sprite.body.width,
                height: this.sprite.body.height,
                top: this.sprite.body.top,
                bottom: this.sprite.body.bottom
            }
        });
    }
}