// src/entities/player/PlayerSprite.js
import { GAME_CONFIG } from '../../config/gameConfig';
import { PlayerHitbox } from './components/PlayerHitbox';
import { logger } from '../../utils/LogManager';
import { debugOverlay } from '../../debug/DebugOverlay';

export class PlayerSprite {
    constructor(scene, x, y, scale) {
        this.scene = scene;
        this.scale = scale;
        this.moduleName = 'PlayerSprite';
        
        // Enable debug for this module through DebugOverlay
        debugOverlay.setModuleDebug(this.moduleName, true);
        
        logger.info(this.moduleName, 'Initializing player sprite', {
            position: { x, y },
            scale
        });

        try {
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
            
            if (debugOverlay.isDebugEnabled(this.moduleName)) {
                logger.debug(this.moduleName, 'Physics body initialized', {
                    x: this.sprite.x,
                    y: this.sprite.y,
                    width: body.width,
                    height: body.height,
                    enabled: body.enable
                });
            }
            
            // Initialize hitbox manager
            this.hitbox = new PlayerHitbox(this.sprite);
            this.hitbox.configure();
            
            this.snapToPixel();

            logger.info(this.moduleName, 'Player sprite initialization complete');
        } catch (error) {
            logger.error(this.moduleName, 'Failed to initialize player sprite', {
                error: error.message,
                stack: error.stack
            });
            throw error; // Re-throw to handle at a higher level
        }
    }

    snapToPixel() {
        try {
            const oldX = this.sprite.x;
            const oldY = this.sprite.y;
            
            this.sprite.x = Math.round(this.sprite.x);
            this.sprite.y = Math.round(this.sprite.y);
            
            if (debugOverlay.isDebugEnabled(this.moduleName)) {
                logger.debug(this.moduleName, 'Snapped position to pixel', {
                    from: { x: oldX, y: oldY },
                    to: { x: this.sprite.x, y: this.sprite.y }
                });
            }
        } catch (error) {
            logger.error(this.moduleName, 'Error in snapToPixel', {
                error: error.message,
                position: { x: this.sprite.x, y: this.sprite.y }
            });
        }
    }

    playAnimation(key) {
        try {
            if (debugOverlay.isDebugEnabled(this.moduleName)) {
                logger.debug(this.moduleName, 'Playing animation', { 
                    key,
                    currentAnimation: this.sprite.anims.currentAnim?.key
                });
            }
            
            this.sprite.play(key);
            this.hitbox.updateForAnimation(key);
        } catch (error) {
            logger.error(this.moduleName, 'Failed to play animation', {
                key,
                error: error.message
            });
        }
    }

    setY(y) {
        try {
            const oldY = this.sprite.y;
            this.sprite.y = y;
            this.snapToPixel();
            
            if (debugOverlay.isDebugEnabled(this.moduleName)) {
                logger.debug(this.moduleName, 'Updated Y position', {
                    from: oldY,
                    to: this.sprite.y
                });
            }
        } catch (error) {
            logger.error(this.moduleName, 'Error setting Y position', {
                error: error.message,
                oldY: this.sprite.y,
                attemptedY: y
            });
        }
    }

    getY() {
        return this.sprite.y;
    }

    on(event, callback) {
        try {
            this.sprite.on(event, callback);
            
            if (debugOverlay.isDebugEnabled(this.moduleName)) {
                logger.debug(this.moduleName, 'Event listener added', { event });
            }
        } catch (error) {
            logger.error(this.moduleName, 'Failed to add event listener', {
                event,
                error: error.message
            });
        }
    }

    getSprite() {
        return this.sprite;
    }
}