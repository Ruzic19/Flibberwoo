// src/systems/ParallaxBackground.js
import { GAME_CONFIG } from '../config/gameConfig';
import { logger } from '../utils/LogManager';

export default class ParallaxBackground {
    constructor(scene, layerInfo) {
        this.scene = scene;
        this.layers = [];
        this.lastUpdateTime = performance.now();
        this.baseSpeed = GAME_CONFIG.SCROLL_SPEED.BASE;
        this.moduleName = 'ParallaxBackground';
        this.debug = true; // Debug flag
        this.lastResetLog = 0; // For rate limiting logs
        
        logger.enableModule(this.moduleName);
        
        // Calculate and store layer1's speed
        const layer1Index = 1; // layer1 is the second layer
        this.layer1SpeedMultiplier = layer1Index / (layerInfo.length - 1);
        
        this.createLayers(layerInfo);
    }

    createLayers(layerInfo) {
        const scale = this.scene.cameras.main.width / GAME_CONFIG.ORIGINAL_WIDTH;
        
        if (this.debug) {
            logger.debug(this.moduleName, 'Calculating scale', { scale });
        }

        [...layerInfo].reverse().forEach((layerData, index) => {
            if (this.debug) {
                logger.debug(this.moduleName, 'Processing layer', {
                    key: layerData.key,
                    depth: index
                });
            }

            if (this.scene.textures.exists(layerData.key)) {
                try {
                    // Create two sprites for each layer with a slight overlap
                    for (let i = 0; i < 2; i++) {
                        const x = i * (GAME_CONFIG.ORIGINAL_WIDTH * scale - 1); // Subtract 1 for overlap
                        const y = Math.round(-GAME_CONFIG.VERTICAL_OFFSET);
                        
                        const sprite = this.scene.add.sprite(x, y, layerData.key)
                            .setOrigin(0, 0)
                            .setScale(scale)
                            .setDepth(index);
                        
                        // Use NEAREST filter for pixel-perfect rendering
                        sprite.texture.setFilter(Phaser.Textures.NEAREST);
                        
                        const speed = (index / (layerInfo.length - 1));
                        sprite.scrollSpeed = speed;
                        sprite.startX = x;
                        sprite.scrollX = 0;
                        
                        this.layers.push(sprite);

                        if (this.debug) {
                            logger.debug(this.moduleName, 'Created layer sprite', {
                                layerKey: layerData.key,
                                instance: i,
                                position: { x, y },
                                speed,
                                depth: index
                            });
                        }
                    }
                } catch (error) {
                    logger.error(this.moduleName, `Error creating layer: ${layerData.key}`, {
                        error: error.message,
                        stack: error.stack
                    });
                }
            } else {
                logger.warn(this.moduleName, 'Texture not found', {
                    key: layerData.key
                });
            }
        });
    }

    getLayer1PixelsPerFrame() {
        return this.baseSpeed * this.layer1SpeedMultiplier;
    }

    update() {
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastUpdateTime) / (1000 / 60);
        this.lastUpdateTime = currentTime;

        const baseSpeed = this.baseSpeed * deltaTime;
        
        for (let i = 0; i < this.layers.length; i += 2) {
            const sprite1 = this.layers[i];
            const sprite2 = this.layers[i + 1];
            
            sprite1.scrollX += baseSpeed * sprite1.scrollSpeed;
            sprite2.scrollX += baseSpeed * sprite2.scrollSpeed;
            
            // Use floor instead of round for consistent positioning
            sprite1.x = Math.floor(sprite1.startX - sprite1.scrollX);
            sprite2.x = Math.floor(sprite2.startX - sprite2.scrollX);
            
            const width = sprite1.width * sprite1.scaleX;
            
            if (sprite1.x <= -width) {
                sprite1.scrollX = 0;
                // Ensure precise positioning when resetting
                sprite1.x = Math.floor(sprite2.x + width - 1); // Subtract 1 for overlap
                sprite1.startX = sprite1.x;

                this.logLayerReset(i, 1, sprite1);
            }
            if (sprite2.x <= -width) {
                sprite2.scrollX = 0;
                // Ensure precise positioning when resetting
                sprite2.x = Math.floor(sprite1.x + width - 1); // Subtract 1 for overlap
                sprite2.startX = sprite2.x;

                this.logLayerReset(i, 2, sprite2);
            }
        }
    }

    logLayerReset(layerIndex, spriteNumber, sprite) {
        if (!this.debug) return;

        const currentTime = Date.now();
        if (currentTime - this.lastResetLog > 1000) {  // Only log once per second
            logger.debug(this.moduleName, 'Layer reset', {
                layerIndex: Math.floor(layerIndex/2),
                sprite: spriteNumber,
                layerKey: sprite.texture.key,
                speed: sprite.scrollSpeed,
                position: {
                    x: sprite.x,
                    startX: sprite.startX
                }
            });
            this.lastResetLog = currentTime;
        }
    }

    setDebug(enabled) {
        this.debug = enabled;
        logger.debug(this.moduleName, `Debug mode ${enabled ? 'enabled' : 'disabled'}`);
    }
}