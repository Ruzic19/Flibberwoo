// src/entities/obstacles/components/ObstaclePhysics.js
import { logger } from '../../../utils/LogManager';
import { debugOverlay } from '../../../debug/DebugOverlay';

export class ObstaclePhysics {
    constructor(sprite, scene) {
        this.sprite = sprite;
        this.scene = scene;
        this.moduleName = 'ObstaclePhysics';
        this.lastUpdateTime = performance.now();
        this.desiredVelocity = 0;
        
        // Enable debug for this module through DebugOverlay
        debugOverlay.setModuleDebug(this.moduleName, true);
        
        logger.info(this.moduleName, 'Initializing obstacle physics component');
    }

    initialize() {
        try {
            this.scene.physics.add.existing(this.sprite, false);
            this.sprite.body.setAllowGravity(false);
            
            if (debugOverlay.isDebugEnabled(this.moduleName)) {
                logger.debug(this.moduleName, 'Physics initialized', {
                    bodyType: this.sprite.body.type,
                    position: {
                        x: this.sprite.x,
                        y: this.sprite.y
                    },
                    gravity: this.sprite.body.allowGravity
                });
            }
        } catch (error) {
            logger.error(this.moduleName, 'Failed to initialize physics', {
                error: error.message,
                stack: error.stack,
                sprite: {
                    exists: !!this.sprite,
                    active: this.sprite?.active
                }
            });
            throw error;
        }
    }

    setVelocity(velocity) {
        try {
            // Store the desired velocity
            this.desiredVelocity = velocity;
            
            // Calculate frame-rate independent velocity
            const currentTime = performance.now();
            const deltaTime = (currentTime - this.lastUpdateTime) / (1000 / 60);
            this.lastUpdateTime = currentTime;
            
            const adjustedVelocity = velocity * deltaTime;
            this.sprite.body.setVelocityX(adjustedVelocity);
            
            if (debugOverlay.isDebugEnabled(this.moduleName)) {
                logger.debug(this.moduleName, 'Velocity updated', {
                    desired: velocity,
                    adjusted: adjustedVelocity,
                    deltaTime,
                    fps: 1000 / (deltaTime * (1000 / 60))
                });
            }
        } catch (error) {
            logger.error(this.moduleName, 'Error setting velocity', {
                error: error.message,
                desiredVelocity: velocity,
                sprite: {
                    exists: !!this.sprite,
                    hasBody: !!this.sprite?.body
                }
            });
        }
    }

    enable() {
        try {
            if (!this.sprite?.body) {
                throw new Error('Sprite or physics body not found');
            }
            
            this.sprite.body.setEnable(true);
            this.lastUpdateTime = performance.now();
            
            if (debugOverlay.isDebugEnabled(this.moduleName)) {
                logger.debug(this.moduleName, 'Physics enabled', {
                    position: {
                        x: this.sprite.x,
                        y: this.sprite.y
                    },
                    velocity: this.sprite.body.velocity
                });
            }
        } catch (error) {
            logger.error(this.moduleName, 'Failed to enable physics', {
                error: error.message,
                sprite: {
                    exists: !!this.sprite,
                    hasBody: !!this.sprite?.body
                }
            });
        }
    }

    disable() {
        try {
            if (!this.sprite?.body) {
                throw new Error('Sprite or physics body not found');
            }
            
            const lastPosition = {
                x: this.sprite.x,
                y: this.sprite.y
            };
            const lastVelocity = { ...this.sprite.body.velocity };
            
            this.sprite.body.setEnable(false);
            
            if (debugOverlay.isDebugEnabled(this.moduleName)) {
                logger.debug(this.moduleName, 'Physics disabled', {
                    lastPosition,
                    lastVelocity
                });
            }
        } catch (error) {
            logger.error(this.moduleName, 'Failed to disable physics', {
                error: error.message,
                sprite: {
                    exists: !!this.sprite,
                    hasBody: !!this.sprite?.body
                }
            });
        }
    }

    getBody() {
        if (!this.sprite?.body) {
            logger.warn(this.moduleName, 'Attempted to get body but none exists');
            return null;
        }
        return this.sprite.body;
    }

    update() {
        if (!this.sprite?.body?.enable || !this.desiredVelocity) {
            return;
        }
        
        try {
            const currentTime = performance.now();
            const deltaTime = (currentTime - this.lastUpdateTime) / (1000 / 60);
            this.lastUpdateTime = currentTime;
            
            // Update velocity with new deltaTime
            const adjustedVelocity = this.desiredVelocity * deltaTime;
            this.sprite.body.setVelocityX(adjustedVelocity);
            
            if (debugOverlay.isDebugEnabled(this.moduleName)) {
                logger.debug(this.moduleName, 'Physics updated', {
                    deltaTime,
                    desiredVelocity: this.desiredVelocity,
                    adjustedVelocity,
                    position: {
                        x: this.sprite.x,
                        y: this.sprite.y
                    }
                });
            }
        } catch (error) {
            logger.error(this.moduleName, 'Error during physics update', {
                error: error.message,
                sprite: {
                    exists: !!this.sprite,
                    hasBody: !!this.sprite?.body,
                    enabled: this.sprite?.body?.enable
                }
            });
        }
    }
}