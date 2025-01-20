// src/entities/obstacles/ObstacleAnimations.js
import { OBSTACLE_CONFIG } from '../../config/obstacleConfig';

export class ObstacleAnimations {
    constructor(scene) {
        this.scene = scene;
        this.debug = false;
    }

    create() {
        this.createBeeAnimation();
        // Future animations would be added here
    }

    createBeeAnimation() {
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

            if (this.debug) {
                console.log(`[ObstacleAnimations] Created bee animation with ${config.frames} frames`);
            }
        }
    }

    // Example of how to add a new animation
    createNewObstacleAnimation(type, config) {
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

            if (this.debug) {
                console.log(`[ObstacleAnimations] Created animation for ${type}`);
            }
        }
    }

    // Utility method to play animations with error handling
    playAnimation(sprite, animKey) {
        try {
            if (this.scene.anims.exists(animKey)) {
                sprite.play(animKey);
                if (this.debug) {
                    console.log(`[ObstacleAnimations] Playing animation: ${animKey}`);
                }
            } else {
                console.warn(`[ObstacleAnimations] Animation not found: ${animKey}`);
            }
        } catch (error) {
            console.error(`[ObstacleAnimations] Error playing animation ${animKey}:`, error);
        }
    }

    setupListeners(sprite, callbacks = {}) {
        if (callbacks.onComplete) {
            sprite.on('animationcomplete', (animation) => {
                callbacks.onComplete(animation.key);
            });
        }

        if (callbacks.onStart) {
            sprite.on('animationstart', (animation) => {
                callbacks.onStart(animation.key);
            });
        }
    }
}