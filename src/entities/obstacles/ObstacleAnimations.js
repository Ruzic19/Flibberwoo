// src/entities/obstacles/ObstacleAnimations.js
import { OBSTACLE_CONFIG } from '../../config/obstacleConfig';
import { logger } from '../../utils/LogManager';
import { debugOverlay } from '../../debug/DebugOverlay';

export class ObstacleAnimations {
    constructor(scene) {
        this.scene = scene;
        this.moduleName = 'ObstacleAnimations';
        
        // Enable debug for this module through DebugOverlay
        debugOverlay.setModuleDebug(this.moduleName, true);
        
        logger.info(this.moduleName, 'Initializing obstacle animations');
    }

    create() {
        try {
            this.createBeeAnimation();
            logger.info(this.moduleName, 'All obstacle animations created');
        } catch (error) {
            logger.error(this.moduleName, 'Failed to create animations', {
                error: error.message,
                stack: error.stack
            });
        }
    }

    createBeeAnimation() {
        try {
            const config = OBSTACLE_CONFIG.ANIMATIONS.BEE;
            const key = 'bee-fly';

            if (!this.scene.anims.exists(key)) {
                this.scene.anims.create({
                    key: key,
                    frames: this.scene.anims.generateFrameNumbers(OBSTACLE_CONFIG.TYPES.BEE, {
                        start: 0,
                        end: config.frames - 1
                    }),
                    frameRate: config.frameRate,
                    repeat: -1
                });

                if (debugOverlay.isDebugEnabled(this.moduleName)) {
                    logger.debug(this.moduleName, 'Created bee animation', {
                        frames: config.frames,
                        frameRate: config.frameRate,
                        type: OBSTACLE_CONFIG.TYPES.BEE,
                        config: config
                    });
                }
            } else {
                logger.info(this.moduleName, 'Bee animation already exists, skipping creation');
            }
        } catch (error) {
            logger.error(this.moduleName, 'Failed to create bee animation', {
                error: error.message,
                config: OBSTACLE_CONFIG.ANIMATIONS.BEE
            });
        }
    }

    createNewObstacleAnimation(type, config) {
        try {
            if (!this.scene.anims.exists(config.key)) {
                this.scene.anims.create({
                    key: config.key,
                    frames: this.scene.anims.generateFrameNumbers(type, {
                        start: config.startFrame,
                        end: config.endFrame
                    }),
                    frameRate: config.frameRate,
                    repeat: config.repeat || -1
                });

                if (debugOverlay.isDebugEnabled(this.moduleName)) {
                    logger.debug(this.moduleName, 'Created new obstacle animation', {
                        type,
                        config: {
                            key: config.key,
                            startFrame: config.startFrame,
                            endFrame: config.endFrame,
                            frameRate: config.frameRate,
                            repeat: config.repeat
                        }
                    });
                }
            } else {
                logger.info(this.moduleName, 'Animation already exists', {
                    type,
                    key: config.key
                });
            }
        } catch (error) {
            logger.error(this.moduleName, 'Failed to create new obstacle animation', {
                type,
                config,
                error: error.message
            });
        }
    }

    playAnimation(sprite, animKey) {
        try {
            if (!sprite) {
                throw new Error('Sprite is undefined');
            }

            if (this.scene.anims.exists(animKey)) {
                const previousAnim = sprite.anims.currentAnim?.key;
                sprite.play(animKey);
                
                if (debugOverlay.isDebugEnabled(this.moduleName)) {
                    logger.debug(this.moduleName, 'Playing animation', {
                        animKey,
                        previousAnim,
                        spriteActive: sprite.active,
                        spriteVisible: sprite.visible
                    });
                }
            } else {
                logger.warn(this.moduleName, 'Animation not found', {
                    animKey,
                    availableAnims: Object.keys(this.scene.anims.anims.entries)
                });
            }
        } catch (error) {
            logger.error(this.moduleName, 'Error playing animation', {
                animKey,
                error: error.message,
                spriteExists: !!sprite
            });
            throw error; // Re-throw to handle at a higher level if needed
        }
    }

    setupListeners(sprite, callbacks = {}) {
        try {
            if (!sprite) {
                throw new Error('Sprite is undefined');
            }

            if (callbacks.onComplete) {
                sprite.on('animationcomplete', (animation) => {
                    if (debugOverlay.isDebugEnabled(this.moduleName)) {
                        logger.debug(this.moduleName, 'Animation complete', {
                            animation: animation.key
                        });
                    }
                    callbacks.onComplete(animation.key);
                });
            }

            if (callbacks.onStart) {
                sprite.on('animationstart', (animation) => {
                    if (debugOverlay.isDebugEnabled(this.moduleName)) {
                        logger.debug(this.moduleName, 'Animation started', {
                            animation: animation.key
                        });
                    }
                    callbacks.onStart(animation.key);
                });
            }

            logger.info(this.moduleName, 'Animation listeners setup complete', {
                hasCompleteCallback: !!callbacks.onComplete,
                hasStartCallback: !!callbacks.onStart
            });
        } catch (error) {
            logger.error(this.moduleName, 'Failed to setup animation listeners', {
                error: error.message,
                spriteExists: !!sprite
            });
            throw error;
        }
    }
}