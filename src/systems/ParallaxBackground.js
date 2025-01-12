// src/systems/ParallaxBackground.js
import { GAME_CONFIG } from '../config/gameConfig';

export default class ParallaxBackground {
    debug(message, data = null) {
        console.log(`[ParallaxBackground] ${message}`, data || '');
    }

    constructor(scene, layerInfo) {
        this.scene = scene;
        this.layers = [];
        this.createLayers(layerInfo);
    }

    createLayers(layerInfo) {
        this.debug('Starting layer creation');
        
        const scale = this.scene.cameras.main.width / GAME_CONFIG.ORIGINAL_WIDTH;
        this.debug('Calculated scale:', scale);

        [...layerInfo].reverse().forEach((layerData, index) => {
            if (this.scene.textures.exists(layerData.key)) {
                try {
                    for (let i = 0; i < 2; i++) {
                        const x = i * GAME_CONFIG.ORIGINAL_WIDTH * scale;
                        const sprite = this.scene.add.sprite(
                            Math.round(x), 
                            Math.round(-GAME_CONFIG.VERTICAL_OFFSET), 
                            layerData.key
                        )
                            .setOrigin(0, 0)
                            .setScale(scale)
                            .setDepth(index);
                        
                        // Apply pixel art optimizations
                        sprite.texture.setFilter(Phaser.Textures.LINEAR);
                        
                        const speed = (index / (layerInfo.length - 1)) * 0.5;
                        sprite.scrollSpeed = speed;
                        sprite.startX = x;
                        sprite.scrollX = 0; // Track fractional scroll amount
                        
                        this.layers.push(sprite);
                    }
                } catch (error) {
                    console.error(`Error creating ${layerData.key}:`, error);
                }
            } else {
                this.debug(`Texture does not exist for ${layerData.key}`);
            }
        });
    }

    update() {
        const baseSpeed = GAME_CONFIG.SCROLL_SPEED.BASE;
        
        for (let i = 0; i < this.layers.length; i += 2) {
            const sprite1 = this.layers[i];
            const sprite2 = this.layers[i + 1];
            
            // Update fractional scroll positions
            sprite1.scrollX += baseSpeed * sprite1.scrollSpeed;
            sprite2.scrollX += baseSpeed * sprite2.scrollSpeed;
            
            // Apply rounded positions for pixel-perfect rendering
            sprite1.x = Math.round(sprite1.startX - sprite1.scrollX);
            sprite2.x = Math.round(sprite2.startX - sprite2.scrollX);
            
            const width = sprite1.width * sprite1.scaleX;
            
            if (sprite1.x <= -width) {
                sprite1.scrollX = 0;
                sprite1.x = sprite2.x + width;
                sprite1.startX = sprite1.x;
            }
            if (sprite2.x <= -width) {
                sprite2.scrollX = 0;
                sprite2.x = sprite1.x + width;
                sprite2.startX = sprite2.x;
            }
        }
    }
}